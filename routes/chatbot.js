import express from 'express';
import axios from 'axios';
const router = express.Router();

router.post('/chatbot', async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const payload = {
      contents: [
        {
          parts: [
            { text: userMessage }
          ]
        }
      ]
    };
    const response = await axios.post(url, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
    const botReply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a reply.';
    res.json({ reply: botReply });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get response from Gemini API.' });
  }
});

export default router;
