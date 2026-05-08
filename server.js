require('dotenv').config();
const express = require('express');
const { OpenAI } = require('openai');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, 
});

app.post('/generate-review', async (req, res) => {
    try {
        const { branch, course, teaching, syllabus, satisfaction } = req.body;

        // Debugging: See what the backend received
        console.log("Received data:", req.body);

        if (!process.env.OPENAI_API_KEY) {
            throw new Error("Missing OpenAI API Key in .env file");
        }

        const prompt = `Write a short, natural, humanized Google review for an IT Training Institute. 
        Institute Details: Branch is ${branch}, Student took the ${course} course. 
        Ratings (out of 5): Teaching: ${teaching}, Syllabus: ${syllabus}, Overall Satisfaction: ${satisfaction}.
        Write it in a first-person tone (like a student). Do not mention the numerical ratings. Keep it to 2 sentences.`;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 100,
        });

        const generatedText = response.choices[0]?.message?.content || "Could not generate review at this time.";
        
        console.log("AI Response:", generatedText);
        res.json({ review: generatedText.trim() });

    } catch (error) {
        console.error("OPENAI ERROR:", error.message);
        res.status(500).json({ review: "Error: " + error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

module.exports = app;