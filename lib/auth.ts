// lib/auth.ts
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secret = new TextEncoder().encode(process.env.SESSION_SECRET!);
const cookieName = 'nahomy_session';
const isProd = process.env.NODE_ENV === 'production';


export async function setSession(payload: { id: number; familyName: string; maxGuests: number }) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('7d').sign(secret);
  (await cookies()).set(cookieName, token, { httpOnly: true, path: '/', secure: isProd, sameSite: 'lax', maxAge: 60*60*24*7 });
}

export async function getSession()
: Promise<{ id: number; familyName: string; maxGuests: number } | null> {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) return null;
  try { const { payload } = await jwtVerify(token, secret); return payload as any; }
  catch { return null; }
}

export async function clearSession() { (await cookies()).delete(cookieName); }
