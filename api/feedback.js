require('dotenv').config();
const { getDb } = require('./_db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });

  // Extract id from URL: /api/feedback/[id]
  const urlParts = req.url.split('/');
  const id = urlParts[urlParts.length - 1];

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  const { edited_reply, status, feedback } = req.body;

  try {
    const sql = getDb();
    const checkResult = await sql`SELECT id FROM email_replies WHERE id = ${id}`;

    if (checkResult.length === 0) {
      return res.status(404).json({ error: 'Reply not found' });
    }

    const updateObj = {};
    if (edited_reply !== undefined) updateObj.edited_reply = edited_reply;
    if (status !== undefined) updateObj.status = status;
    if (feedback !== undefined) updateObj.feedback = feedback;

    if (Object.keys(updateObj).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const result = await sql`
      UPDATE email_replies
      SET ${sql(updateObj)}
      WHERE id = ${id}
      RETURNING id, customer_message, ai_reply, edited_reply, status, feedback, created_at
    `;

    res.status(200).json({ message: 'Feedback updated successfully', reply: result[0] });
  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).json({ error: 'Failed to update feedback' });
  }
};
