const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Replace this with your actual Groq API key
const GROQ_API_KEY = "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";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

app.use(express.static('public'));
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: "llama3-70b-8192",
        messages,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error("Error from Groq:", err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch response from Groq' });
  }
});

app.listen(PORT, () => {
  console.log(`Anime Chat server running on http://localhost:${PORT}`);
});