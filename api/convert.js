import { GoogleGenerativeAI } from '@google/generative-ai';

// --- SCHEMA DEFINITION ---
// Schema for Single Tense Conversion Output
const singleConversionSchema = {
    type: "object",
    description: "The result of a single tense conversion, including the converted sentence and a detailed explanation of the grammatical changes made.",
    properties: {
        convertedSentence: { 
            type: "string", 
            description: "The complete sentence, converted from the source sentence into the specific target tense, voice, and form." 
        },
        structure: { 
            type: "string", 
            description: "The grammatical structure/formula used for this conversion, e.g., 'Subject + had + Past Participle'. The model must generate this." 
        },
        explanation: { 
            type: "string", 
            description: "A detailed, step-by-step explanation (2-4 sentences) of how the conversion was performed, including why the auxiliary verbs and main verb forms were chosen." 
        }
    },
    required: ["convertedSentence", "explanation", "structure"]
};

// --- API HANDLER ---
export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    // The API key is provided at runtime in the Canvas environment
    const apiKey = process.env.GEMINI_API_KEY;

    const { sourceSentence, targetTenseTitle, targetVoice, targetForm } = req.body;
    
    // Input validation
    if (!sourceSentence || !targetTenseTitle || !targetVoice || !targetForm) {
        return res.status(400).json({ error: "Missing required parameters for single conversion." });
    }

    // Initialize the client
    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-2.5-flash for fast, structured text generation
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    try {
        const conversionPrompt = `
            You are a world-class English linguist and grammar specialist. Convert the provided source sentence into the specific target tense, voice, and form.
            
            Source Sentence: "${sourceSentence}"
            
            Target Tense: ${targetTenseTitle}
            Target Voice: ${targetVoice}
            Target Form: ${targetForm}
            
            Your response MUST be a JSON object that strictly adheres to the singleConversionSchema.
            
            1. Provide the complete converted sentence.
            2. Generate the grammatical structure/formula (e.g., 'Subject + had + Past Participle') and include it in the 'structure' field.
            3. Write a clear, concise (2-4 sentences) explanation in the 'explanation' field detailing the grammatical rules applied (e.g., changing the main verb, adding auxiliaries, subject/object inversion) to achieve the conversion.
        `;
        
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: conversionPrompt }] }],
            generationConfig: {
                responseMimeType: 'application/json',
                responseSchema: singleConversionSchema
            }
        });
        
        const jsonText = result.response.text();
        if (!jsonText) {
            throw new Error("API returned an empty conversion response.");
        }
        
        const conversionResult = JSON.parse(jsonText);
        
        // Ensure the generated fields are not empty before sending
        if (!conversionResult.convertedSentence || !conversionResult.explanation || !conversionResult.structure) {
            throw new Error("AI generated incomplete data structure.");
        }
        
        return res.status(200).json(conversionResult);

    } catch (err) {
        console.error("CONVERSION SERVERLESS ERROR:", err.message || err);
        return res.status(500).json({
            error: "Conversion Generation failed",
            detail: err.message || "Unknown error - check server logs for details."
        });
    }
}