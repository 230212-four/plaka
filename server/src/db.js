import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg'; // <-- Import the native driver companion package!

console.log('🔌 [PLAKA DB] Environment check:', process.env.DATABASE_URL ? '✅ DATABASE_URL LOADED SUCCESSFULLY' : '❌ DATABASE_URL IS UNDEFINED');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('⚠️ Critical: DATABASE_URL is missing from environment variables.');
}

// 1. Initialize a true native PostgreSQL network socket connection pool
//    - connectionTimeoutMillis: fail fast (5s) if the remote DB is unreachable
//    - ssl.rejectUnauthorized: false is required for Supabase/cloud Postgres over TLS
const pool = new pg.Pool({
    connectionString,
    connectionTimeoutMillis: 5000,
    ssl: { rejectUnauthorized: false },
});

// 2. Surface pool-level connection failures immediately in the terminal
//    Without this, Supabase TLS rejections cause a silent hang with zero output
pool.on('error', (err) => console.error('💀 [PLAKA DB] Idle pool client error:', err));

// 3. Pass that active socket pool safely into the Prisma v7 adapter channel
const adapter = new PrismaPg(pool);

// 4. Export your type-safe, active single client instance context
export const prisma = new PrismaClient({ adapter });