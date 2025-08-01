const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Replace this with your actual Groq API key
const GROQ_API_KEY = "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";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { message, persona } = req.body;

  if (!message || !persona) {
    return res.status(400).json({ error: 'Message or persona missing' });
  }

  const messages = [
    { role: "system", content: persona },
    { role: "user", content: message }
  ];

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

    const reply = response?.data?.choices?.[0]?.message?.content;

    if (!reply) {
      throw new Error("No reply returned from Groq");
    }

    res.json({ reply });

  } catch (err) {
    console.error("Groq error:", err.response?.data || err.message);
    res.status(500).json({ reply: "Aizen is displeased. The realm of Groq has failed us." });
  }
});

// Auto Ping Logic (Keep-Alive)
setInterval(() => {
  axios.get(`https://bleach-ai.onrender.com`)
    .then(() => console.log('🔁 Auto-ping sent to keep server alive'))
    .catch(err => console.error('❌ Auto-ping failed:', err.message));
}, 1000 * 60 * 5);
app.listen(PORT, () => {
  console.log(`Anime Chat server running on http://localhost:${PORT}`);
});