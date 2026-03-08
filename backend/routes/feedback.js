const express = require('express');
const router = express.Router();
const { pool } = require('../db');

/**
 * PUT /api/feedback/:id
 * Update reply with human edits or feedback
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { edited_reply, status, feedback } = req.body;

  try {
    // Check if record exists
    const checkQuery = 'SELECT id FROM email_replies WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Reply not found',
      });
    }

    // Build update query dynamically
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (edited_reply !== undefined) {
      updates.push(`edited_reply = $${paramIndex++}`);
      values.push(edited_reply);
    }

    if (status !== undefined) {
      updates.push(`status = $${paramIndex++}`);
      values.push(status);
    }

    if (feedback !== undefined) {
      updates.push(`feedback = $${paramIndex++}`);
      values.push(feedback);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        error: 'No fields to update',
      });
    }

    values.push(id);

    const query = `
      UPDATE email_replies
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, customer_message, ai_reply, edited_reply, status, feedback, created_at;
    `;

    const result = await pool.query(query, values);

    res.json({
      message: 'Feedback updated successfully',
      reply: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).json({
      error: 'Failed to update feedback',
    });
  }
});

module.exports = router;
