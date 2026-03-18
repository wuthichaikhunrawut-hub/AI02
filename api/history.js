require('dotenv').config();
const { getDb } = require('./_db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const sql = getDb();
    const result = await sql`
      SELECT id, customer_message, ai_reply, edited_reply, status, feedback, response_time, created_at
      FROM email_replies
      ORDER BY created_at DESC
    `;

    res.status(200).json({ history: result });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};
