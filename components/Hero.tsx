// components/Hero.tsx
'use client';
import React, { useMemo, useState } from 'react';

type HeroProps = {
  familyName: string;
  maxGuests: number;
  confirmedGuests?: number; // ← nuevo
  eventTitle?: string;
  eventDateISO?: string;
  venue?: string;
  mapsUrl?: string;
};

const Hero: React.FC<HeroProps> = ({
  familyName,
  maxGuests,
  confirmedGuests = 0,
  eventTitle = 'Nahomy XV',
  eventDateISO = '2025-09-06T19:00:00-05:00',
  venue = 'Centro de Eventos La Ramada, Portoviejo',
  mapsUrl = 'https://maps.app.goo.gl/2mLVKkZxc73QXoEo9',
}) => {
  const [selected, setSelected] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // Estado derivado: ya confirmado (por DB) o en esta sesión tras confirmar
  const [isConfirmed, setIsConfirmed] = useState(confirmedGuests > 0);
  const [confirmedCount, setConfirmedCount] = useState<number>(confirmedGuests);

  const eventDate = useMemo(() => new Date(eventDateISO), [eventDateISO]);
  const day = useMemo(() => eventDate.toLocaleDateString('es-EC', { day: '2-digit', timeZone: 'America/Guayaquil' }), [eventDate]);
  const month = useMemo(() => eventDate.toLocaleDateString('es-EC', { month: 'long', timeZone: 'America/Guayaquil' }).toUpperCase(), [eventDate]);
  const timeStr = useMemo(() => eventDate.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Guayaquil' }), [eventDate]);

  function toICSDateUTC(d: Date) {
    const pad = (n: number) => String(n).padStart(2,'0');
    return d.getUTCFullYear()+pad(d.getUTCMonth()+1)+pad(d.getUTCDate())+'T'+pad(d.getUTCHours())+pad(d.getUTCMinutes())+pad(d.getUTCSeconds())+'Z';
  }
  function downloadICS() {
    const start = eventDate, end = new Date(start.getTime() + 3*60*60*1000);
    const now = new Date();
    const ics = [
      'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//NahomyXV//RSVP//ES','CALSCALE:GREGORIAN','METHOD:PUBLISH','BEGIN:VEVENT',
      `UID:${crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)}@nahomyxv`,
      `DTSTAMP:${toICSDateUTC(now)}`,
      `DTSTART:${toICSDateUTC(start)}`, `DTEND:${toICSDateUTC(end)}`,
      `SUMMARY:${eventTitle}`, `LOCATION:${venue}`,
      `DESCRIPTION:Bienvenidos ${familyName}. Confirmado(s): ${confirmedCount || selected}.`,
      'BEGIN:VALARM','TRIGGER:-P1D','ACTION:DISPLAY','DESCRIPTION:Recordatorio','END:VALARM',
      'END:VEVENT','END:VCALENDAR',
    ].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    a.download = `${eventTitle}-${day}-${familyName}.ics`; a.click(); URL.revokeObjectURL(a.href);
  }

  async function handleConfirm() {
    setSubmitting(true); setMsg(null);
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedGuests: selected }),
      });
      let data: any = null; try { data = await res.json(); } catch {}

      if (!res.ok) {
        setMsg(data?.message || 'No se pudo registrar la confirmación.');
        return;
      }

      // Éxito: fijar estado “confirmado” y ocultar controles
      setIsConfirmed(true);
      setConfirmedCount(Number(data?.count ?? selected));
      downloadICS();
      setMsg('¡Gracias! Su confirmación fue registrada.');
    } catch {
      setMsg('No se pudo conectar con el servidor. Intente nuevamente.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex flex-col items-center justify-center text-center py-20 px-4">
      {/* Encabezados */}
      <p className="uppercase tracking-[0.2em] text-xs md:text-sm font-semibold text-rose-gold-700 mb-2">
        {isConfirmed ? `¡Gracias, ${familyName}!` : `Bienvenidos ${familyName}`}
      </p>

      {isConfirmed ? (
        <p className="text-rose-gold-700 text-sm md:text-base mb-4">
          Usted registró <span className="font-bold">{confirmedCount}</span> invitado(s). Nos vemos pronto.
        </p>
      ) : (
        <p className="text-rose-gold-700 text-sm md:text-base mb-4">
          Tienen reservados <span className="font-bold">{maxGuests}</span> cupo(s). Seleccione cuántos asistirán.
        </p>
      )}

      <p className="uppercase tracking-[0.2em] text-sm font-semibold text-rose-gold-700 mb-3">Save the Date</p>
      <h1 className="font-script text-6xl md:text-8xl text-rose-gold-800 mb-4">Nahomy</h1>

      {/* Fecha/horario */}
      <div className="flex items-center space-x-6 bg-white/60 backdrop-blur-sm p-4 rounded-lg shadow-md mb-6">
        <span className="font-bold text-base md:text-lg text-rose-gold-700">{month}</span>
        <span className="text-4xl md:text-5xl font-bold text-rose-gold-800 border-l border-r border-rose-gold-200 px-6">{day}</span>
        <span className="font-bold text-base md:text-lg text-rose-gold-700">{timeStr.replace(':','h')}</span>
      </div>

      {/* Lugar */}
      <div className="mb-8 text-rose-gold-800">
        <p className="font-medium">{venue}</p>
        <a href={mapsUrl} target="_blank" rel="noreferrer"
           className="text-rose-gold-700 underline decoration-rose-gold-300 hover:text-rose-gold-600">
          Ver ubicación (GPS)
        </a>
      </div>

      {/* Controles: solo si NO está confirmado */}
      {!isConfirmed && (
        <>
          <div className="flex items-center gap-3 mb-6 bg-white/60 backdrop-blur-sm rounded-full px-3 py-2 shadow">
            <button onClick={()=>setSelected(Math.max(1, selected-1))}
                    className="w-9 h-9 rounded-full border border-rose-gold-200 text-rose-gold-800 hover:bg-rose-gold-50">−</button>
            <div className="min-w-[5ch] text-center font-semibold text-rose-gold-800">{selected}</div>
            <button onClick={()=>setSelected(Math.min(maxGuests, selected+1))}
                    disabled={selected>=maxGuests}
                    className="w-9 h-9 rounded-full border border-rose-gold-200 text-rose-gold-800 hover:bg-rose-gold-50">+</button>
          </div>

          <button onClick={handleConfirm} disabled={submitting}
                  className="bg-rose-gold-800 text-white font-bold uppercase tracking-widest py-3 px-8 rounded-full hover:bg-rose-gold-700 transition-all shadow-lg disabled:opacity-60">
            {submitting ? 'Confirmando…' : 'Confirmar Asistencia'}
          </button>
        </>
      )}

      {/* En estado confirmado puedes ofrecer el .ics opcionalmente */}
      {isConfirmed && (
        <button onClick={downloadICS}
                className="mt-2 text-rose-gold-800 underline decoration-rose-gold-300 hover:text-rose-gold-600">
          Descargar evento de calendario
        </button>
      )}

      {msg && <p className="mt-4 text-rose-gold-700">{msg}</p>}
    </main>
  );
};

export default Hero;
