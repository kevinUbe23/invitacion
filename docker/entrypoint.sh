#!/usr/bin/env sh
set -e

echo ">> Prisma generate..."
npx prisma generate --schema=./prisma/schema.prisma

echo ">> Prisma migrate deploy..."
npx prisma migrate deploy

echo ">> Starting app..."
exec "$@"
