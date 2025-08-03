require('dotenv').config();
const express = require('express');
const axios = require('axios');
const fs = require('fs');
const app = express();
app.use(express.json());

const API_KEY = process.env.ELEVEN_API_KEY;
const VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; // Puedes cambiarla por otra voz de ElevenLabs

app.post('/voz', async (req, res) => {
  const texto = req.body.texto;

  try {
    const response = await axios({
      method: 'post',
      url: `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      headers: {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json'
      },
      responseType: 'stream',
      data: {
        text: texto,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.3,
          similarity_boost: 0.75
        }
      }
    });

    res.setHeader('Content-Type', 'audio/mpeg');
    response.data.pipe(res);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error generando voz' });
  }
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
