// components/Navbar.tsx
'use client';
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  async function onClick() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login');
  }

  const navLinks = [
    { name: 'Inicio', href: '#' },
    { name: 'Mi Historia', href: '#' },
    { name: 'Corte de Honor', href: '#' },
    { name: 'Ubicación', href: '#' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cerrar con Escape y al hacer click fuera
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (open && menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  }, [open]);

  return (
    <header
      className={[
        'sticky top-0 z-50 w-full transition-shadow',
        scrolled ? 'shadow-md shadow-rose-gold-100/70' : 'shadow-none',
      ].join(' ')}
    >
      <nav
        className="w-full px-6 md:px-8 py-4 backdrop-blur-sm bg-white/10 border-b border-rose-gold-100"
        aria-label="Principal"
      >
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          {/* Marca */}
          <Link href="#" className="font-extrabold text-xl tracking-wide text-rose-gold-800">
            Nahomy <span className="font-light">XV</span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {/* {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="uppercase tracking-wider font-medium text-sm text-rose-gold-800 hover:text-rose-gold-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-gold-300 rounded"
              >
                {link.name}
              </Link>
            ))} */}
            <span className="h-5 w-px bg-rose-gold-200" aria-hidden />
            <button
              type="button"
              className="uppercase tracking-wider font-medium text-sm text-rose-gold-800 hover:text-rose-gold-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-gold-300 rounded"
              onClick={onClick}
            >
              Cerrar Sesión
            </button>
          </div>

          {/* Botón móvil */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-xl p-2 border border-rose-gold-200/70 text-rose-gold-800 hover:bg-rose-gold-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-gold-300 transition"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-controls="mobile-menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg
              className={`h-6 w-6 transition duration-200 ${open ? 'scale-90 opacity-0 absolute' : 'opacity-100'}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg
              className={`h-6 w-6 transition duration-200 ${open ? 'opacity-100' : 'opacity-0 absolute scale-90'}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 6l12 12M18 6l-12 12" />
            </svg>
          </button>
        </div>

        {/* Overlay móvil */}
        <div
          className={`md:hidden fixed inset-0 z-40 bg-black/20 transition-opacity ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        />
        <div
          id="mobile-menu"
          ref={menuRef}
          className={[
            'md:hidden fixed top-0 right-0 z-50 h-screen w-80 max-w-[85vw]',
            'bg-white/90 backdrop-blur-xl border-l border-rose-gold-100',
            'transition-transform duration-300',
            open ? 'translate-x-0' : 'translate-x-full',
          ].join(' ')}
          role="dialog"
          aria-modal="true"
        >
          <div className="px-6 py-5 flex items-center justify-between border-b border-rose-gold-100">
            {/* <span className="font-extrabold text-lg text-rose-gold-800">Nahomy XV</span> */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-rose-gold-800 hover:bg-rose-gold-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-gold-300"
              aria-label="Cerrar menú"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6l-12 12" />
              </svg>
            </button>
          </div>

          <div className="px-6 py-4">
            <ul className="space-y-2">
              {/* {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-4 py-3 text-rose-gold-800 hover:text-rose-gold-600 hover:bg-rose-gold-50/70 active:bg-rose-gold-100 uppercase tracking-wide text-sm font-medium"
                  >
                    {link.name}
                  </Link>
                </li>
              ))} */}
              <li className="pt-2">
                <Link
                  href="#"
                  onClick={onClick}
                  className="block rounded-xl px-4 py-3 text-rose-gold-800 hover:text-rose-gold-600 hover:bg-rose-gold-50/70 uppercase tracking-wide text-sm font-medium border-t border-rose-gold-100"
                >
                  Cerrar Sesión
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
