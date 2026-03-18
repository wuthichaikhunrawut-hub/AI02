require('dotenv').config();
const { getDb } = require('./_db');
const { generateReply } = require('./_ai');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message } = req.body;

  if (!message || message.trim().length < 10) {
    return res.status(400).json({ error: 'Message must be at least 10 characters long' });
  }

  const submitTime = new Date();

  try {
    const aiReply = await generateReply(message);
    const responseTime = new Date() - submitTime;

    const sql = getDb();
    const result = await sql`
      INSERT INTO email_replies (customer_message, ai_reply, submit_time, response_time, status)
      VALUES (${message}, ${aiReply}, ${submitTime}, ${responseTime}, 'generated')
      RETURNING id, ai_reply, response_time
    `;

    res.status(200).json({
      id: result[0].id,
      reply: result[0].ai_reply,
      response_time: result[0].response_time,
    });
  } catch (error) {
    console.error('Error generating reply:', error);
    res.status(500).json({ error: 'Failed to generate reply. Please try again.' });
  }
};
