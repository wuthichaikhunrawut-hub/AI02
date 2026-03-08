const express = require('express');
const router = express.Router();
const { pool } = require('../db');

/**
 * GET /api/history
 * Fetch all generated email replies ordered by most recent first
 */
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT id, customer_message, ai_reply, edited_reply, status, feedback, response_time, created_at
      FROM email_replies
      ORDER BY created_at DESC;
    `;
    const result = await pool.query(query);
    console.log(`Fetched ${result.rows.length} rows from history`);

    res.json({
      history: result.rows,
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({
      error: 'Failed to fetch history',
    });
  }
});

module.exports = router;
