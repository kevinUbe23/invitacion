// components/LoginForm.tsx
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr(null);
    const res = await fetch('/api/auth/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: phone.trim(), password }),
    });
    setLoading(false);
    if (res.ok) router.replace('/'); else setErr('Credenciales inválidas.');
  }

  return (
    <div className="mx-auto w-full max-w-md">
      {/* Tarjeta vidrio con borde sutil */}
      <form
        onSubmit={onSubmit}
        className="relative overflow-hidden rounded-3xl border border-rose-gold-100/70 bg-white/60 backdrop-blur-md shadow-xl"
      >
        {/* Encabezado */}
        <div className="px-7 pt-6 pb-4 text-center">
          <span className="inline-block rounded-full bg-rose-gold-50 text-rose-gold-700 px-3 py-1 text-xs tracking-wide">
            Acceso a Invitados
          </span>
          <h1 className="mt-3 text-rose-gold-800 text-xl font-extrabold tracking-wide">
            Nahomy <span className="font-light">XV</span>
          </h1>
          <p className="mt-1 text-rose-gold-700/90 text-sm">
            Ingrese su teléfono y contraseña.
          </p>
        </div>

        {/* Campos */}
        <div className="px-7 pb-6 space-y-4">
          {/* Teléfono */}
          <div className="relative">
            <label className="block text-rose-gold-700 text-xs mb-1">Celular / Teléfono</label>
            <span className="pointer-events-none absolute left-3 top-[38px] text-rose-gold-600/80" aria-hidden="true">
              {/* ícono teléfono */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.78 19.78 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.78 19.78 0 0 1 2.09 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.3 1.77.54 2.61a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.47-1.08a2 2 0 0 1 2.11-.45c.84.24 1.71.42 2.61.54A2 2 0 0 1 22 16.92z"/>
              </svg>
            </span>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={20}
              required
              className="w-full rounded-2xl border border-rose-gold-200/70 bg-white/80 pl-10 pr-3 py-3 text-rose-gold-900 placeholder:text-rose-gold-400
                         focus:outline-none focus:ring-2 focus:ring-rose-gold-300"
              placeholder="Ej: 0993311131, +14155550123"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-rose-gold-700 text-xs mb-1">Contraseña</label>
            <span className="pointer-events-none absolute left-3 top-[38px] text-rose-gold-600/80" aria-hidden="true">
              {/* ícono candado */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </span>
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-2xl border border-rose-gold-200/70 bg-white/80 pl-10 pr-12 py-3 text-rose-gold-900
                         focus:outline-none focus:ring-2 focus:ring-rose-gold-300"
              placeholder="Su contraseña"
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="absolute right-2 top-[34px] rounded-xl p-2 text-rose-gold-700 hover:bg-rose-gold-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-gold-300"
              aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              title={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {/* ojo / ojo tachado */}
              {showPass ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.11 1 12a21.78 21.78 0 0 1 5.06-6.94M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.89 11 8- .64 1.64-1.64 3.11-2.9 4.29M14.12 14.12a3 3 0 1 1-4.24-4.24M1 1l22 22"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>

          {/* Error */}
          {err && (
            <div className="rounded-2xl border border-rose-gold-200 bg-rose-gold-50/70 px-4 py-3 text-rose-gold-800 text-sm">
              {err}
            </div>
          )}

          {/* Botón */}
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full overflow-hidden rounded-full bg-rose-gold-800 text-white font-semibold py-3 shadow
                       hover:bg-rose-gold-700 transition disabled:opacity-60"
          >
            <span className="inline-flex items-center justify-center gap-2">
              {loading && (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
                  <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" />
                </svg>
              )}
              {loading ? 'Ingresando…' : 'Ingresar'}
            </span>
          </button>
        </div>
      </form>

      {/* Pie — ayuda opcional */}
      <p className="text-center mt-3 text-xs text-rose-gold-700/80">
        ¿Problemas para ingresar? Contacte al organizador.
      </p>
    </div>
  );
}
