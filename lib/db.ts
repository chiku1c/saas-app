import { Pool } from "pg";
export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "saas",
  password: "0220",
  port: 5432,
});
