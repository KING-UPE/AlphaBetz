import { GoogleGenerativeAI } from '@google/generative-ai';

// --- UPDATED QUESTION SCHEMA ---
// Added 'sentence' for multiple-choice to match UI expectations
const questionSchema = {
    type: "array",
    items: {
        type: "object",
        properties: {
            id: { type: "integer", description: "A unique question ID." },
            type: { type: "string", enum: ["conversion", "fill-in-the-blank", "multiple-choice"], description: "The type of practice question." },
            sourceSentence: { type: "string", description: "The source sentence for 'conversion' type." },
            targetTense: { type: "string", description: "Target tense name (e.g., 'Past Continuous') for 'conversion' type." },
            targetVoice: { type: "string", description: "Target voice name ('Active' or 'Passive') for 'conversion' type." },
            sentenceTemplate: { type: "string", description: "The sentence with verb in parenthesis, e.g., 'They ___ (live)' for 'fill-in-the-blank' type." },
            sentence: { type: "string", description: "The sentence to identify the tense for 'multiple-choice' type." },
            options: { type: "array", items: { type: "string" }, description: "Exactly 4 multiple choice options for 'multiple-choice' type." },
            correctAnswer: { type: "string", description: "The exact correct answer (converted sentence, conjugated verb, or correct option text)." },
            explanation: { type: "string", description: "A detailed explanation for the correct answer, used for feedback." }
        },
        required: ["id", "type", "correctAnswer", "explanation"]
    }
};

// --- API HANDLER ---
export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("Missing GEMINI_API_KEY");
        return res.status(500).json({ error: "Configuration Error: Missing GEMINI_API_KEY" });
    }

    const { settings } = req.body;
    if (!settings || !settings.tenseCategories || !settings.forms || !settings.voices || !settings.questionTypes || !settings.questionCount) {
        return res.status(400).json({ error: "Missing required settings fields (tenseCategories, forms, voices, questionTypes, questionCount)." });
    }

    let { tenseCategories, forms, voices, questionTypes, questionCount } = settings;
    tenseCategories = tenseCategories || [];
    forms = forms || [];
    voices = voices || [];
    questionTypes = questionTypes || [];
    questionCount = questionCount || 5;

    // Initialize the client
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    // UPDATED PROMPT: More explicit per-type guidance for better schema adherence
    const userPrompt = `
        You are a professional English grammar instructor. Generate exactly ${questionCount} unique practice questions as a JSON array matching the provided schema.
        Strictly adhere to the schema—no extra fields. Distribute question types evenly across the selected ones.
        Constraints:
        - Tense Categories: ${tenseCategories.join(", ")}
        - Sentence Forms: ${forms.join(", ")}
        - Voices: ${voices.join(", ")}
        - Question Types: ${questionTypes.join(", ")}
        - Difficulty: Intermediate.
        - IDs: Sequential integers starting from 1.
        For each type:
        - 'conversion': Provide sourceSentence, targetTense, targetVoice, correctAnswer (full converted sentence), explanation.
        - 'fill-in-the-blank': Provide sentenceTemplate with verb in parentheses (e.g., 'She ___ (go) to school.'), correctAnswer (conjugated verb only), explanation.
        - 'multiple-choice': Provide sentence (the full sentence to analyze), options (exactly 4 tense names), correctAnswer (exact matching option text), explanation.
        Ensure questions are varied, grammatically correct, and educational.
    `;

    try {
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
            generationConfig: {
                responseMimeType: 'application/json',
                responseSchema: questionSchema
            }
        });

        const jsonText = result.response.text();
        console.log("Raw Gemini Response:", jsonText); // DEBUG: Log raw output for inspection in Vercel/terminal

        if (!jsonText) {
            throw new Error("API returned an empty response.");
        }
        
        const questions = JSON.parse(jsonText);

        return res.status(200).json(questions);

    } catch (err) {
        console.error("SERVERLESS ERROR:", err.message || err);
        return res.status(500).json({
            error: "Generation failed",
            detail: err.message || "Unknown error - check server logs for details."
        });
    }
}