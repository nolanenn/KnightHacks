const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/generate-image', async (req, res) => {
  const prompt = req.body.prompt || "First-Person perspective adventurer's encounter with [# of monsters] [monster] in a [place] with design inspired by [series]";
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-preview-image-generation" });
  const result = await model.generateContent(prompt, { responseMimeType: "image/png" });
  const imageBase64 = result.response.candidates[0].content.parts[0].inlineData.data;
  res.json({ image: imageBase64 });
});

app.listen(3000, () => console.log('Server running on port 3000'));