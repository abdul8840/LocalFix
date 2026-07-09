import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcryptjs";
import { connectDB, getPool, sql } from "../src/config/db.js";

const run = async () => {
  await connectDB();
  const pool = getPool();

  const email = "admin@localfix.com";
  const password = "Admin@12345";
  const password_hash = await bcrypt.hash(password, 10);

  const existing = await pool
    .request()
    .input("email", sql.NVarChar(150), email)
    .query("SELECT id FROM Users WHERE email = @email");

  if (existing.recordset.length) {
    console.log("⚠️  Admin already exists");
    process.exit(0);
  }

  await pool
    .request()
    .input("name", sql.NVarChar(150), "Super Admin")
    .input("email", sql.NVarChar(150), email)
    .input("password_hash", sql.NVarChar(255), password_hash)
    .input("role", sql.NVarChar(20), "admin")
    .query(
      `INSERT INTO Users (name, email, password_hash, role)
       VALUES (@name, @email, @password_hash, @role)`
    );

  console.log("✅ Admin created");
  console.log("   Email:   ", email);
  console.log("   Password:", password);
  process.exit(0);
};

run().catch((err) => {
  console.error("❌", err);
  process.exit(1);
});