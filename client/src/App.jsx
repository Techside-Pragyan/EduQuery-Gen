import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import QuizSetup from './pages/QuizSetup';
import QuizInterface from './pages/QuizInterface';
import Results from './pages/Results';
import Navbar from './components/Navbar';

function App() {
  const [quizData, setQuizData] = useState(null);
  const [config, setConfig] = useState(null);
  const [pdfContent, setPdfContent] = useState('');

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home setPdfContent={setPdfContent} />} />
          <Route path="/setup" element={<QuizSetup pdfContent={pdfContent} setQuizData={setQuizData} setConfig={setConfig} />} />
          <Route path="/quiz" element={<QuizInterface quizData={quizData} config={config} />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
