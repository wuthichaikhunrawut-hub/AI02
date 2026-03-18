const { generateReply } = require('../api/_ai');
const { getDb } = require('../api/_db');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const { message } = JSON.parse(event.body);

  if (!message || message.trim().length < 10) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Message must be at least 10 characters long' }) };
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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        id: result[0].id,
        reply: result[0].ai_reply,
        response_time: result[0].response_time,
      }),
    };
  } catch (error) {
    console.error('Error generating reply:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to generate reply. Please try again.' }),
    };
  }
};
