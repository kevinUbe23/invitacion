// app/page.tsx
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

const CUTOFF_ISO = process.env.RSVP_CUTOFF_ISO || '';


export default async function Home() {
  const isClosed = CUTOFF_ISO ? Date.now() >= new Date(CUTOFF_ISO).getTime() : false;
  const session = await getSession();
  
  
  if (isClosed) {
    // Renderizar directamente la página de cierre
    const CerradoPage = (await import('./cerrado/page')).default;
    return <CerradoPage />;
  }

  if (!session) redirect('/login');
  const hh = await prisma.household.findUnique({
    where: { id: session.id },
    select: { confirmedGuests: true },
  });
  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{
        backgroundImage: "url('/bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Navbar />
      <Hero
        familyName={session.familyName}
        maxGuests={session.maxGuests}
        confirmedGuests={hh?.confirmedGuests ?? 0}
      />
    </div>
  );
}