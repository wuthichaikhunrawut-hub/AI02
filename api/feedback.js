require('dotenv').config();
const { getDb } = require('./_db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { id, feedback } = req.body;

  if (!id || !feedback) {
    return res.status(400).json({ error: 'ID and feedback are required' });
  }

  try {
    const sql = getDb();
    await sql`
      UPDATE email_replies 
      SET feedback = ${feedback}, status = 'used'
      WHERE id = ${id}
    `;
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ error: 'Failed to save feedback' });
  }
};
