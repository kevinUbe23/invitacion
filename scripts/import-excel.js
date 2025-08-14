// scripts/import-excel.js
const xlsx = require('xlsx');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run(path) {
  const wb = xlsx.readFile(path);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(ws, { defval: '' });

  for (const r of rows) {
    const familyName = String(r.nombre ?? '').trim();
    const maxGuests  = Number(r.admision ?? 0);
    const phone      = String(r.celular ?? '').trim(); // ← sin normalizar; hasta 20 caracteres

    if (!familyName || !phone || phone.length > 20 || !Number.isInteger(maxGuests) || maxGuests < 1) {
      console.warn('Fila inválida, se omite:', { familyName, phone, maxGuests });
      continue;
    }

    const plainPassword = String(r.password ?? '').trim() || phone.slice(-4) || '0000';
    const passwordHash = await bcrypt.hash(plainPassword, 10);

    await prisma.household.upsert({
      where:  { phone },
      update: { familyName, maxGuests },
      create: { phone, familyName, maxGuests, passwordHash },
    });
  }
  await prisma.$disconnect();
  console.log('Importación completa.');
}

run(process.argv[2] || './invitados.xlsx')
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
