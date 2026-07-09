import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const config = {
  user: process.env.DB_USER || "sa",
  password: process.env.DB_PASSWORD,

  server: process.env.DB_SERVER || "localhost",
  port: 1433,

  database: "LocalFixDB",

  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
  },

  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },

  connectionTimeout: 15000,
  requestTimeout: 15000,
};

let pool;

export const connectDB = async () => {
  try {
    console.log("Database configuration:", {
      user: config.user,
      server: config.server,
      port: config.port,
      database: config.database,
    });

    pool = await sql.connect(config);

    console.log("✅ SQL Server Connected Successfully");

    return pool;
  } catch (err) {
    console.error("❌ SQL Server Error:");
    console.error(err);

    throw err;
  }
};

export const getPool = () => {
  if (!pool) {
    throw new Error("Database pool is not initialized.");
  }
  return pool;
};

export { sql };