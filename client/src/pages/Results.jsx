import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Trophy, CheckCircle2, XCircle, ChevronDown, ChevronUp, RefreshCw, BarChart, Clock, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Results = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const data = localStorage.getItem('quizResults');
    if (!data) {
      navigate('/');
      return;
    }
    const parsed = JSON.parse(data);
    setResults(parsed);
    evaluateQuiz(parsed);
  }, [navigate]);

  const evaluateQuiz = async (data) => {
    const { quizData, answers } = data;
    const evals = [];
    
    // In production, send all at once. For this demo, we'll iterate with a slight delay to mock "analysis"
    for (let i = 0; i < quizData.length; i++) {
        try {
            const response = await axios.post('http://localhost:5000/api/quiz/evaluate', {
                question: quizData[i],
                userAnswer: answers[i] || 'No answer provided'
            });
            evals.push({ ...response.data, questionIdx: i });
        } catch (err) {
            console.error(err);
            // Fallback for demo
            const isCorrect = answers[i] === quizData[i].correctAnswer;
            evals.push({
                isCorrect,
                score: isCorrect ? 1 : 0,
                feedback: 'Evaluation failed, using basic comparison.',
                suggestions: 'Refer to original text.',
                questionIdx: i
            });
        }
    }
    setEvaluations(evals);
    setLoading(false);
  };

  const calculateScore = () => {
    if (evaluations.length === 0) return 0;
    const totalScore = evaluations.reduce((acc, curr) => acc + curr.score, 0);
    return Math.round((totalScore / evaluations.length) * 100);
  };

  const toggleExpand = (idx) => {
    setExpanded(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="mb-8"
        >
            <RefreshCw className="text-indigo-500 w-16 h-16" />
        </motion.div>
        <h2 className="text-3xl font-bold mb-2">Analyzing Performance</h2>
        <p className="text-gray-400">Our AI is reviewing your answers for depth and accuracy...</p>
      </div>
    );
  }

  const score = calculateScore();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* Score Header */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-12 text-center mb-12 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 pointer-events-none" />
        <Trophy className="mx-auto text-amber-500 w-20 h-20 mb-6" />
        <h1 className="text-5xl font-black mb-2">Your Result: {score}%</h1>
        <p className="text-xl text-gray-400">
          {score >= 80 ? 'Exceptional Work!' : score >= 50 ? 'Good Effort!' : 'Keep Learning!'}
        </p>

        <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-white/5">
            <div className="flex flex-col items-center">
                <Target className="text-indigo-400 mb-2" size={24} />
                <span className="text-2xl font-bold">{evaluations.filter(e => e.isCorrect).length}/{evaluations.length}</span>
                <span className="text-xs text-gray-500 uppercase">Correct</span>
            </div>
            <div className="flex flex-col items-center">
                <Clock className="text-purple-400 mb-2" size={24} />
                <span className="text-2xl font-bold">{Math.floor(results.timeTaken / 60)}m {results.timeTaken % 60}s</span>
                <span className="text-xs text-gray-500 uppercase">Time Spent</span>
            </div>
            <div className="flex flex-col items-center">
                <BarChart className="text-emerald-400 mb-2" size={24} />
                <span className="text-2xl font-bold">{results.config.difficulty}</span>
                <span className="text-xs text-gray-500 uppercase">Difficulty</span>
            </div>
        </div>
      </motion.div>

      {/* Detailed Feedback */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
          Review & Insights
        </h3>
        
        {results.quizData.map((question, idx) => {
          const evalItem = evaluations.find(e => e.questionIdx === idx);
          const isUserCorrect = evalItem?.isCorrect;
          
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`glass-card overflow-hidden border-l-4 ${isUserCorrect ? 'border-l-emerald-500' : 'border-l-red-500'}`}
            >
              <div 
                className="p-6 cursor-pointer hover:bg-white/[0.02] flex items-center justify-between"
                onClick={() => toggleExpand(idx)}
              >
                <div className="flex items-center gap-4 flex-1">
                  {isUserCorrect ? 
                    <div className="bg-emerald-500/10 p-2 rounded-full"><CheckCircle2 className="text-emerald-500" /></div> : 
                    <div className="bg-red-500/10 p-2 rounded-full"><XCircle className="text-red-500" /></div>
                  }
                  <span className="flex-1 font-semibold text-lg line-clamp-1">{question.question}</span>
                </div>
                {expanded[idx] ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
              </div>

              <AnimatePresence>
                {expanded[idx] && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-8 pt-2"
                  >
                    <div className="space-y-4 text-sm">
                      <div className="bg-white/5 p-4 rounded-xl">
                        <span className="text-gray-500 block mb-1">Your Answer:</span>
                        <span className={isUserCorrect ? 'text-emerald-400' : 'text-red-400'}>
                          {results.answers[idx] || 'Not answered'}
                        </span>
                      </div>
                      {!isUserCorrect && (
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                            <span className="text-gray-500 block mb-1">Correct Answer:</span>
                            <span className="text-white font-medium">{question.correctAnswer}</span>
                        </div>
                      )}
                      <div className="bg-indigo-500/10 p-4 rounded-xl border border-indigo-500/20">
                        <span className="text-indigo-400 font-bold block mb-1 uppercase text-xs">AI Feedback:</span>
                        <p className="text-indigo-100">{evalItem?.feedback}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
                        <span className="text-purple-400 font-bold block mb-1 uppercase text-xs">Quick Revision:</span>
                        <p className="text-purple-100 italic">"{question.explanation}"</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <div className="flex gap-4 mt-12 justify-center">
        <button onClick={() => navigate('/')} className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all">
            Try Another PDF
        </button>
        <button onClick={() => window.print()} className="px-8 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl transition-all">
            Download Results
        </button>
      </div>
    </div>
  );
};

export default Results;
