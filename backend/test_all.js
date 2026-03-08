require('dotenv').config();
const { pool } = require('./db');
const { Client } = require("@gradio/client");

async function testDB() {
  console.log('--- Testing Database ---');
  try {
    const result = await pool.query('SELECT COUNT(*) FROM email_replies');
    console.log('Database Connected Successfully');
    console.log('Row count in email_replies:', result.rows[0].count);
    
    const rows = await pool.query('SELECT * FROM email_replies LIMIT 5');
    console.log('Sample data:', JSON.stringify(rows.rows, null, 2));
  } catch (err) {
    console.error('Database Connection Error:', err.message);
  }
}

async function testGradio() {
  console.log('\n--- Testing Gradio API ---');
  const colabUrl = process.env.COLAB_AI_URL;
  console.log('URL:', colabUrl);
  try {
    const app = await Client.connect(colabUrl);
    console.log('Connected to Gradio');
    
    // Testing with positional arguments which is standard for gr.Interface
    const result = await app.predict("/predict", ["Hello, this is a test message from backend."]);
    console.log('Gradio Prediction Result:', JSON.stringify(result.data, null, 2));
  } catch (err) {
    console.error('Gradio Connection Error:', err.message);
  }
}

async function run() {
  await testDB();
  await testGradio();
  process.exit(0);
}

run();
