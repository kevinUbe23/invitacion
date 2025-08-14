// app/layout.tsx
import type { Metadata } from 'next'
import { Montserrat, Dancing_Script } from 'next/font/google'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
})

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing-script',
  weight: '700',
})

export const metadata: Metadata = {
  title: 'Mis XV Años - Nahomy',
  description: '¡Estás invitado a celebrar mis XV años!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${montserrat.variable} ${dancingScript.variable}`}>
      <body className="font-sans bg-background text-rose-gold-800" >
        {children}
      </body>
    </html>
  )
}