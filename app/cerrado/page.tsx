// app/cerrado/page.tsx
export default function CerradoPage() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4">
      <section className="max-w-2xl text-center rounded-3xl border border-rose-gold-100/70 bg-white/60 backdrop-blur-md p-10 shadow-xl">
        <span className="inline-block rounded-full bg-rose-gold-50 text-rose-gold-700 px-3 py-1 text-xs tracking-wide">
          Confirmaciones cerradas
        </span>

        <h1 className="mt-4 font-extrabold text-2xl md:text-3xl text-rose-gold-800 tracking-wide">
          ¡Muchas gracias!
        </h1>

        <p className="mt-3 text-rose-gold-700">
          La espera pronto llegará a su fin. Hemos cerrado las confirmaciones para ultimar detalles del evento.
        </p>

        <p className="mt-2 text-rose-gold-700/90 text-sm">
          Si ya registró su asistencia, nos vemos en la celebración. Gracias por ser parte de este momento especial.
        </p>

        {/* Opcional: botón a ubicación o info */}
        {/* <a href="#ubicacion" className="mt-6 inline-block rounded-full border border-rose-gold-200 bg-rose-gold-50/60 px-5 py-3 text-sm font-semibold text-rose-gold-800 hover:bg-rose-gold-100">Ver ubicación</a> */}
      </section>
    </main>
  );
}
