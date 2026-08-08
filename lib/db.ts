import { neon } from "@neondatabase/serverless";

/* lazy init so `next build` survives before env vars exist */
let _sql: ReturnType<typeof neon> | null = null;

export function getSql() {
  if (!_sql) _sql = neon(process.env.DATABASE_URL!);
  return _sql;
}
