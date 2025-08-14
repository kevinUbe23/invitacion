// app/api/rsvp/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok:false, message:'No autorizado' }, { status: 401 });
  }

  // ¿Ya está confirmado?
  const hh = await prisma.household.findUnique({
    where: { id: session.id },
    select: { confirmedGuests: true },
  });
  if ((hh?.confirmedGuests ?? 0) > 0) {
    return NextResponse.json(
      { ok:false, code:'ALREADY_CONFIRMED', message:`Gracias. Ya registró ${hh!.confirmedGuests} invitado(s).` },
      { status: 409 }
    );
  }

  // Validación
  let body: any; try { body = await req.json(); } catch {}
  const selectedGuests = parseInt(body?.selectedGuests, 10);
  if (!Number.isFinite(selectedGuests) || selectedGuests < 1 || selectedGuests > session.maxGuests) {
    return NextResponse.json(
      { ok:false, message:`Cantidad inválida. Máximo ${session.maxGuests}.` },
      { status: 400 }
    );
  }

  // Primera confirmación: crear/actualizar ambos registros
  await prisma.$transaction([
    prisma.rSVP.upsert({
      where:  { householdId: session.id },     // requiere @unique en householdId
      update: { count: selectedGuests },
      create: { householdId: session.id, count: selectedGuests },
    }),
    prisma.household.update({
      where: { id: session.id },
      data:  { confirmedGuests: selectedGuests },
    }),
  ]);

  return NextResponse.json({ ok: true, count: selectedGuests });
}
