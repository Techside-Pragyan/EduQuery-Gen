# EduQuery Gen: AI-Powered Quiz Generator from PDF

EduQuery Gen is a sophisticated, full-stack application that leverages advanced NLP (Gemini 1.5 Flash) to transform static PDF documents into interactive, high-quality quizzes.

## 🚀 Features

- **Deep PDF Extraction**: Handles paragraphs, headings, and clean text extraction.
- **AI Question Generation**: Generates MCQs, True/False, Fill-in-the-blanks, and Short Answer questions.
- **Smart Customization**: Control difficulty, number of questions, and quiz types.
- **Intelligent Evaluation**: AI-driven analysis of subjective and objective answers with detailed feedback.
- **Premium UI**: Dark-themed, glassmorphic design with smooth motion and responsive layout.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Framer Motion, Lucide Icons, Axios.
- **Backend**: Node.js, Express, Multer, PDF-parse.
- **AI Engine**: Google Gemini 1.5 Flash.
- **Database**: MongoDB (Mongoose).

## 📥 Setup Instructions

### 1. Backend Setup
1. Navigate to the `server` directory.
2. Install dependencies: `npm install`.
3. Create a `.env` file from the template provided.
4. **Important**: Add your `GEMINI_API_KEY` to the `.env` file. You can get one from the [Google AI Studio](https://aistudio.google.com/).
5. Start the server: `node index.js`.

### 2. Frontend Setup
1. Navigate to the `client` directory.
2. Install dependencies: `npm install`.
3. Start the development server: `npm run dev`.

### 3. Usage
1. Open the app in your browser (usually `http://localhost:5173`).
2. Upload a PDF document.
3. Configure your quiz settings.
4. Take the quiz and get instant AI feedback!

## 🏗️ Architecture

- `/client`: Frontend React application.
- `/server`: Express API handling file uploads, PDF processing, and AI integrations.
- `/uploads`: Temporary storage for uploaded PDF files.

## 📜 License
MIT