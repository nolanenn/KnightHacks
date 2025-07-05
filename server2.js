import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { GoogleGenAI, Modality, createUserContent, createImageFromBase64 } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const fantasyMonsters = [
  "dragon",
  "orcs",
  "goblins",
  "trolls",
  "lich",
  "vampires",
  "werewolfs",
  "skeletons",
  "zombies",
  "beholder",
  "minotaur",
  "hydra",
  "griffin",
  "basilisk",
  "mimic",
  "giant spiders",
  "wraiths",
  "demons",
  "kraken",
  "chimera"
];

app.post("/generate-image", async (req, res) => {
  try {
    const randomIndex = Math.floor(Math.random() * fantasyMonsters.length);
    const randomMonster = fantasyMonsters[randomIndex];

    const prompt = req.body.prompt || "First-Person perspective adventurer's " 
    + "encounter with one or more " + randomMonster + " in a dungeon with design " 
    + "inspired by Dungeons and Dragons";
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: prompt,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      }, //call the response and then reprompt the ai with the image
    });
    // const textResponse = await ai.models.generateContent({
    //     model: "gemini-2.5-flash",
    //     contents: "Please describe what is happening in this image as if you were "
    //     + "narrating a combat encounter in a text-based video game",
    //     config: {
    //     thinkingConfig: {
    //         thinkingBudget: 0, // Disables thinking
    //     },
    //     }
    // });
    // console.log(response.text);

    // Find the image part
    const parts = response.candidates[0].content.parts;
    const imagePart = parts.find((part) => part.inlineData && part.inlineData.data);

    if (imagePart) {
    // Create the image part for the next prompt
    const imageInput = createImageFromBase64(imagePart.inlineData.data, "image/png");

    // Your text prompt
    const promptText = "Please describe what is happening in this image as if you were narrating a combat encounter in a text-based video game.";

    // Generate text using the image and prompt
    const textResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
        createUserContent([
            imageInput,
            promptText
        ])
        ]
    });

    // Get the generated text
    const generatedText = textResponse.candidates[0].content.parts[0].text;
    console.log(generatedText);
    if (!generatedText) {
        console.error("No text generated:", textResponse);
    }

    // Respond with both image and text
    res.json({ image: imagePart.inlineData.data, description: generatedText });
    } else {
    res.status(500).json({ error: "No image generated." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));