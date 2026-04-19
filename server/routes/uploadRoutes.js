const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { extractTextFromPDF } = require('../utils/pdfProcessor');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('pdf'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const filePath = req.file.path;
        const result = await extractTextFromPDF(filePath);

        res.json({
            message: 'File uploaded and processed successfully',
            filename: req.file.originalname,
            path: filePath,
            content: result.content.substring(0, 1000) + '...', // send a preview
            fullContent: result.content,
            numPages: result.numPages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error processing PDF' });
    }
});

module.exports = router;
