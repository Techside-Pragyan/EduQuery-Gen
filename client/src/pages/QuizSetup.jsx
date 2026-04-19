import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Settings2, BookOpen, Layers, BarChart3, ChevronRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const QuizSetup = ({ pdfContent, setQuizData, setConfig }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({
    numQuestions: 5,
    difficulty: 'medium',
    quizType: ['mcq']
  });

  if (!pdfContent) {
    navigate('/');
    return null;
  }

  const handleToggleType = (type) => {
    setOptions(prev => ({
      ...prev,
      quizType: prev.quizType.includes(type)
        ? prev.quizType.filter(t => t !== type)
        : [...prev.quizType, type]
    }));
  };

  const handleStart = async () => {
    if (options.quizType.length === 0) return alert('Select at least one question type');
    
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/quiz/generate', {
        text: pdfContent,
        options
      });
      setQuizData(response.data.quiz);
      setConfig(options);
      navigate('/quiz');
    } catch (err) {
      console.error(err);
      alert('Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Settings2 className="text-indigo-400" />
          Quiz Configuration
        </h2>
        <p className="text-gray-400">Customize your learning experience</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-8 space-y-8"
      >
        {/* Number of Questions */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold mb-3 text-gray-300">
            <Layers size={18} className="text-purple-400" />
            Number of Questions
          </label>
          <div className="flex gap-4">
            {[5, 10, 15, 20].map(num => (
              <button
                key={num}
                onClick={() => setOptions({ ...options, numQuestions: num })}
                className={`flex-1 py-3 rounded-xl border transition-all ${
                  options.numQuestions === num 
                  ? 'bg-indigo-500/20 border-indigo-500 text-white' 
                  : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/20'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold mb-3 text-gray-300">
            <BarChart3 size={18} className="text-emerald-400" />
            Difficulty Level
          </label>
          <div className="flex gap-4">
            {['easy', 'medium', 'hard'].map(level => (
              <button
                key={level}
                onClick={() => setOptions({ ...options, difficulty: level })}
                className={`flex-1 py-3 rounded-xl border capitalize transition-all ${
                  options.difficulty === level 
                  ? 'bg-emerald-500/20 border-emerald-500 text-white' 
                  : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/20'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Question Types */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold mb-3 text-gray-300">
            <BookOpen size={18} className="text-amber-400" />
            Question Types
          </label>
          <div className="grid grid-cols-2 gap-4">
            {[
              { id: 'mcq', label: 'Multiple Choice' },
              { id: 'true_false', label: 'True / False' },
              { id: 'fill_blank', label: 'Fill in Blanks' },
              { id: 'short_answer', label: 'Short Answer' }
            ].map(type => (
              <button
                key={type.id}
                onClick={() => handleToggleType(type.id)}
                className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                  options.quizType.includes(type.id)
                  ? 'bg-amber-500/20 border-amber-500 text-white' 
                  : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/20'
                }`}
              >
                <span>{type.label}</span>
                {options.quizType.includes(type.id) && <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_#f59e0b]" />}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleStart}
          disabled={loading}
          className="w-full btn-primary py-4 text-lg mt-8"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" />
              Generating Quiz...
            </>
          ) : (
            <>
              Generate Quiz
              <ChevronRight />
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
};

export default QuizSetup;
