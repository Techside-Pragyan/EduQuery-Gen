import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Upload, FileText, CheckCircle, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = ({ setPdfContent }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please upload a valid PDF file.');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setPdfContent(response.data.fullContent);
      setSuccess(true);
      setTimeout(() => {
        navigate('/setup');
      }, 1500);
    } catch (err) {
      setError('Failed to process PDF. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 h-[calc(100vh-120px)] flex flex-col justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
          Transform PDFs into Smart Quizzes
        </h1>
        <p className="text-gray-400 text-xl max-w-2xl mx-auto">
          Upload your books, notes, or research papers and let our AI generate high-quality assessments in seconds.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-12 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Sparkles size={80} className="text-purple-500" />
        </div>

        <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-3xl p-12 hover:border-indigo-500/50 transition-colors cursor-pointer"
             onClick={() => document.getElementById('fileInput').click()}>
          <input 
            type="file" 
            id="fileInput" 
            className="hidden" 
            accept=".pdf" 
            onChange={handleFileChange}
          />
          
          {success ? (
            <motion.div 
              initial={{ scale: 0.8 }} 
              animate={{ scale: 1 }}
              className="flex flex-col items-center"
            >
              <CheckCircle className="text-emerald-400 w-20 h-20 mb-4" />
              <p className="text-2xl font-bold">PDF Processed!</p>
              <p className="text-gray-400">Redirecting to setup...</p>
            </motion.div>
          ) : (
            <>
              <div className="bg-indigo-500/10 p-6 rounded-full mb-6">
                <Upload className="text-indigo-400 w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold mb-2">
                {file ? file.name : 'Click to upload or drag & drop'}
              </h3>
              <p className="text-gray-400 mb-8">PDF files only (max 10MB)</p>
              
              {file && (
                <button 
                  className="btn-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpload();
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Analyzing Content...
                    </>
                  ) : (
                    'Generate Quiz Now'
                  )}
                </button>
              )}
            </>
          )}
        </div>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mt-6 text-center"
          >
            {error}
          </motion.div>
        )}
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-center">
        {[
          { title: "AI-Powered", desc: "Powered by Gemini 1.5 Pro for deep understanding" },
          { title: "Smart Chunking", desc: "Handles large documents with ease" },
          { title: "Instant Feedback", desc: "Get detailed explanations for every answer" }
        ].map((feature, i) => (
          <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5">
            <h4 className="font-bold mb-2">{feature.title}</h4>
            <p className="text-sm text-gray-400">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
