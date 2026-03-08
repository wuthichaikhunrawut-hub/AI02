const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const initializeDatabase = async () => {
  const client = await pool.connect();
  try {
    // Ensure table exists with all columns
    await client.query(`
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
    `);
    
    // Check if created_at column exists, if not add it (for backward compatibility)
    await client.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='email_replies' AND column_name='created_at') THEN
          ALTER TABLE email_replies ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
        END IF;
      END $$;
    `);
    
    console.log('Database table initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    client.release();
  }
};

module.exports = {
  pool,
  initializeDatabase,
};
