import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, History, LayoutDashboard, User } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="border-b border-white/10 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl group-hover:scale-110 transition-transform">
            <BrainCircuit className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            EduQuery Gen
          </span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link to="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
            <LayoutDashboard size={18} />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <Link to="/history" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
            <History size={18} />
            <span className="hidden sm:inline">History</span>
          </Link>
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center cursor-pointer hover:bg-indigo-500/30 transition-colors">
            <User size={18} className="text-indigo-400" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
