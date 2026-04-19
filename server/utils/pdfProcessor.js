const fs = require('fs');
const pdf = require('pdf-parse');

const extractTextFromPDF = async (filePath) => {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdf(dataBuffer);
        
        // Clean text: remove excessive whitespaces, preserve basic structure
        let text = data.text;
        text = text.replace(/\s+/g, ' ').trim();
        
        return {
            content: text,
            metadata: data.info,
            numPages: data.numpages
        };
    } catch (error) {
        console.error("Error extracting PDF text:", error);
        throw error;
    }
};

const chunkText = (text, maxLength = 5000) => {
    const chunks = [];
    let currentChunk = "";
    
    // Split by sentences (very simple approach)
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    
    for (const sentence of sentences) {
        if ((currentChunk + sentence).length > maxLength) {
            chunks.push(currentChunk.trim());
            currentChunk = sentence;
        } else {
            currentChunk += sentence;
        }
    }
    
    if (currentChunk) {
        chunks.push(currentChunk.trim());
    }
    
    return chunks;
};

module.exports = {
    extractTextFromPDF,
    chunkText
};
