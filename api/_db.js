require('dotenv').config();
const postgres = require('postgres');

let sql;

const getDb = () => {
  if (!sql) {
    sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });
  }
  return sql;
};

const initializeDatabase = async () => {
  const db = getDb();
  await db`
    CREATE TABLE IF NOT EXISTS email_replies (
      id SERIAL PRIMARY KEY,
      customer_message TEXT NOT NULL,
      ai_reply TEXT NOT NULL,
      edited_reply TEXT,
      status VARCHAR(50) DEFAULT 'generated',
      feedback TEXT,
      submit_time TIMESTAMP,
      response_time INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
};

module.exports = { getDb, initializeDatabase };
