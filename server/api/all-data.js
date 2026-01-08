import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});

export default defineEventHandler(async (event) => {
  try {
    const result = await pool.query("SELECT * FROM shipments");
    return result.rows;
  } catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: err.message
    });
  }
});
