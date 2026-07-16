import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// 🔍 DEBUG LINE: This will print out in your terminal on boot
console.log('🔌 [PLAKA DB] Environment check:', process.env.DATABASE_URL ? '✅ DATABASE_URL LOADED SUCCESSFULLY' : '❌ DATABASE_URL IS UNDEFINED');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('⚠️ Critical: DATABASE_URL is missing from the environment environment variables. Fallback to localhost avoided.');
}

const adapter = new PrismaPg({ connectionString });
export const prisma = new PrismaClient({ adapter });