const { Client } = require("@gradio/client");

/**
 * Generate an email reply based on customer message
 * @param {string} customerMessage - The customer's message
 * @returns {Promise<string>} - The AI generated reply
 */
const generateReply = async (customerMessage) => {
  const prompt = `You are a professional customer support agent.

Write a polite email reply to the customer based on the following message.

Customer message:
${customerMessage}

Include greeting and apology if appropriate. Keep the reply professional and concise.`;

  try {
    const colabUrl = process.env.COLAB_AI_URL;
    if (!colabUrl) {
        throw new Error('COLAB_AI_URL environment variable is not set');
    }

    // Connect to the Gradio API using the official client
    const app = await Client.connect(colabUrl);
    
    // Based on gr.Interface, input is passed as an array of positional arguments
    console.log('Sending prompt to Gradio:', prompt);
    const result = await app.predict("/predict", [prompt]);

    console.log('Gradio raw result:', JSON.stringify(result.data));

    // The result from @gradio/client usually has the response inside `data` array
    if (result && result.data && result.data.length > 0) {
        return String(result.data[0]);
    } else {
        throw new Error('Unexpected response format from Gradio API');
    }

  } catch (error) {
    console.error('Error generating reply with Gradio Client:', error.message);
    throw new Error(`Failed to generate AI reply: ${error.message}`);
  }
};

module.exports = {
  generateReply,
};
