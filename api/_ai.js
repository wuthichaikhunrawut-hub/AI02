require('dotenv').config();
const { Client } = require('@gradio/client');

const generateReply = async (customerMessage) => {
  const prompt = customerMessage;

  const colabUrl = process.env.COLAB_AI_URL;
  if (!colabUrl) {
    throw new Error('COLAB_AI_URL environment variable is not set');
  }

  const app = await Client.connect(colabUrl);
  const result = await app.predict('/predict', [prompt]);

  if (result && result.data && result.data.length > 0) {
    return String(result.data[0]);
  } else {
    throw new Error('Unexpected response format from Gradio API');
  }
};

module.exports = { generateReply };
