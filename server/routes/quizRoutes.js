const express = require('express');
const router = express.Router();
const { generateQuiz, evaluateAnswer } = require('../services/aiService');

router.post('/generate', async (req, res) => {
    try {
        const { text, options } = req.body;
        if (!text) {
            return res.status(400).json({ message: 'Text content is required' });
        }

        const quiz = await generateQuiz(text, options);
        res.json({ quiz });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error generating quiz' });
    }
});

router.post('/evaluate', async (req, res) => {
    try {
        const { question, userAnswer } = req.body;
        const evaluation = await evaluateAnswer(question, userAnswer);
        res.json(evaluation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error evaluating answer' });
    }
});

module.exports = router;
