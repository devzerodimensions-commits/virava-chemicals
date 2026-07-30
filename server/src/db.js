import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

// On Render (and most cloud hosts) a single DATABASE_URL is provided.
// Locally we fall back to individual PG* vars (portable Postgres).
export const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 10,
    })
  : new Pool({
      host: process.env.PGHOST || '127.0.0.1',
      port: Number(process.env.PGPORT) || 5433,
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || 'virava',
      database: process.env.PGDATABASE || 'virava',
      max: 10,
    });

export const query = (text, params) => pool.query(text, params);
