// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { setSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  const { phone, password } = await req.json();
  const p = String(phone ?? '').trim(); // ← solo trim; no cambiamos contenido
  if (!p || p.length > 20 || !password) {
    return NextResponse.json({ error:'Credenciales inválidas' }, { status:400 });
  }

  const hh = await prisma.household.findUnique({ where: { phone: p } });
  if (!hh || !(await bcrypt.compare(password, hh.passwordHash))) {
    return NextResponse.json({ error:'Usuario o clave incorrectos' }, { status:401 });
  }

  await setSession({ id: hh.id, familyName: hh.familyName, maxGuests: hh.maxGuests });
  return NextResponse.json({ ok: true });
}
