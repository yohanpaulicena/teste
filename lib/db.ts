import type { QueryResult } from "mysql2";
import mysql, { type FieldPacket, type Pool } from "mysql2/promise";

let mysqlPool: Pool | null = null;

function getPool() {
  if (mysqlPool) return mysqlPool;

  const {
    MYSQL_HOST,
    MYSQL_PORT,
    MYSQL_USER,
    MYSQL_PASSWORD,
    MYSQL_DATABASE,
  } = process.env;

  if (!MYSQL_HOST || !MYSQL_USER || !MYSQL_DATABASE) {
    throw new Error("Missing MySQL environment variables.");
  }

  mysqlPool = mysql.createPool({
    host: MYSQL_HOST,
    port: Number(MYSQL_PORT ?? 3306),
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
  });

  return mysqlPool;
}

const pool = {
  query<T extends QueryResult>(sql: string, values?: unknown[]): Promise<[T, FieldPacket[]]> {
    return getPool().query<T>(sql, values);
  },
};

export default pool;
