import "dotenv/config";
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { Prisma, PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5
});
const prisma = new PrismaClient({ adapter });

type FilterType = "string" | "number";

function buildPrismaFilter(
  type: "string",
  value: unknown
): Prisma.StringFilter | undefined;

function buildPrismaFilter(
  type: "number",
  value: unknown
): Prisma.IntNullableFilter<"books"> | undefined;

function buildPrismaFilter(
  type: FilterType,
  value: unknown
): Prisma.StringFilter | Prisma.IntNullableFilter<"books"> | undefined {
  if (!value?.toString().trim()) return undefined;

  if (type === "number") {
    const num = Number(value);
    if (Number.isNaN(num)) return undefined;
    return { equals: num };
  }

  return {
    contains: String(value),
  };
}

export { prisma, buildPrismaFilter }