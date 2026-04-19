const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateQuiz = async (text, options) => {
    const { numQuestions, difficulty, quizType } = options;
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
        You are an expert educator. Generate a high-quality quiz from the following text:
        "${text}"

        Requirements:
        1. Number of questions: ${numQuestions}
        2. Difficulty: ${difficulty}
        3. Question Types: ${quizType.join(', ')}
        
        For each question, include:
        - The question text
        - Options (if MCQ)
        - Correct answer
        - Explanation
        - Specific difficulty level for that question
        - Topic/Concept it covers

        Return the response as a valid JSON array of objects with the following structure:
        [
            {
                "id": "unique_id",
                "type": "mcq | true_false | fill_blank | short_answer",
                "question": "...",
                "options": ["...", "...", ...], // only for mcq
                "correctAnswer": "...",
                "explanation": "...",
                "difficulty": "easy | medium | hard",
                "topic": "..."
            }
        ]
        Only return the JSON array, no other text.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let textResponse = response.text();
        
        // Clean the response if it contains markdown code blocks
        textResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        
        return JSON.parse(textResponse);
    } catch (error) {
        console.error("Error generating quiz:", error);
        throw error;
    }
};

const evaluateAnswer = async (question, userAnswer) => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
        Evaluate the following user answer for the given question.
        Question: "${question.question}"
        Correct Answer Reference: "${question.correctAnswer}"
        User's Answer: "${userAnswer}"

        Provide:
        1. Whether it is correct (boolean) or a score percentage (0-100) for subjective answers.
        2. A brief explanation/feedback.
        3. Simple improvement suggestions if incorrect.

        Return as JSON:
        {
            "isCorrect": boolean,
            "score": number, // 0 to 1
            "feedback": "...",
            "suggestions": "..."
        }
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let textResponse = response.text();
        textResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(textResponse);
    } catch (error) {
        console.error("Error evaluating answer:", error);
        throw error;
    }
};

module.exports = {
    generateQuiz,
    evaluateAnswer
};
