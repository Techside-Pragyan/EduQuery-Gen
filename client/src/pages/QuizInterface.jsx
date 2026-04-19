import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Timer, ArrowRight, ArrowLeft, CheckCircle2, ChevronRight, Loader2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QuizInterface = ({ quizData, config }) => {
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [evaluations, setEvaluations] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!quizData) {
      navigate('/');
      return;
    }
    // Set timer based on number of questions (2 mins per question)
    setTimeLeft(quizData.length * 120);
  }, [quizData, navigate]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (ans) => {
    setAnswers({ ...answers, [currentIdx]: ans });
  };

  const currentQuestion = quizData ? quizData[currentIdx] : null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // In a real app, you'd evaluate all at once. For this demo, we'll store everything and navigate.
    localStorage.setItem('quizResults', JSON.stringify({
      quizData,
      answers,
      config,
      timeTaken: (quizData.length * 120) - timeLeft
    }));
    
    // Simulate AI evaluation for all questions
    // In a production app, the backend would handle this in one pass
    navigate('/results');
  };

  if (!currentQuestion) return null;

  const progress = ((currentIdx + 1) / quizData.length) * 100;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Quiz Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">
            Question {currentIdx + 1} of {quizData.length}
          </span>
          <div className="h-2 w-48 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_10px_#6366f1]"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
          <Timer className={timeLeft < 60 ? 'text-red-400 animate-pulse' : 'text-gray-400'} size={20} />
          <span className={`font-mono text-xl ${timeLeft < 60 ? 'text-red-400' : 'text-white'}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="glass-card p-10 min-h-[400px] flex flex-col"
        >
          <div className="flex items-center gap-2 mb-6">
            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-bold rounded-full border border-indigo-500/20 uppercase">
              {currentQuestion.type.replace('_', ' ')}
            </span>
            <span className="px-3 py-1 bg-white/5 text-gray-400 text-xs font-bold rounded-full border border-white/5 uppercase">
              {currentQuestion.difficulty}
            </span>
          </div>

          <h3 className="text-2xl font-bold mb-10 leading-relaxed text-slate-100">
            {currentQuestion.question}
          </h3>

          <div className="flex-grow space-y-4">
            {currentQuestion.type === 'mcq' || currentQuestion.type === 'true_false' ? (
              currentQuestion.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectAnswer(opt)}
                  className={`w-full p-5 rounded-2xl text-left border transition-all flex items-center gap-4 group ${
                    answers[currentIdx] === opt
                    ? 'bg-indigo-500/20 border-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.1)]'
                    : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/[0.08] hover:border-white/20'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    answers[currentIdx] === opt ? 'border-indigo-400 bg-indigo-500' : 'border-gray-600'
                  }`}>
                    {answers[currentIdx] === opt && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <span className="text-lg">{opt}</span>
                </button>
              ))
            ) : (
              <div className="space-y-2">
                <textarea
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white min-h-[200px] focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-gray-600"
                  placeholder="Type your answer here..."
                  value={answers[currentIdx] || ''}
                  onChange={(e) => handleSelectAnswer(e.target.value)}
                />
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Info size={14} /> AI will evaluate your subjective response
                </p>
              </div>
            )}
          </div>

          <div className="mt-12 flex justify-between gap-4">
            <button
              onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ArrowLeft size={20} />
              Previous
            </button>
            
            {currentIdx === quizData.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn-primary px-10"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Complete Quiz'}
              </button>
            ) : (
              <button
                onClick={() => setCurrentIdx(prev => Math.min(quizData.length - 1, prev + 1))}
                className="btn-primary px-10"
              >
                Next
                <ArrowRight size={20} />
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default QuizInterface;
