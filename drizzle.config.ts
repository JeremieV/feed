import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

// Load .env.local file
dotenv.config({ path: '.env.local' });

export default defineConfig({
  out: './drizzle',
  schema: './src/lib/db.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});