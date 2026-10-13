import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BedDouble, Lock, Mail, ArrowRight } from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(email, password)) {
      if (email.toLowerCase().includes('admin')) {
        navigate('/admin/bookings');
      } else {
        navigate('/');
      }
    } else {
      alert("Invalid Credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="bg-[#162236] p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-700/80 max-w-md w-full relative overflow-hidden text-slate-100">
        {/* Top Gold Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600" />

        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-2xl mb-3">
            <BedDouble size={28} />
          </div>
          <h2 className="text-2xl font-serif font-bold text-white tracking-wide">BlueBird Portal</h2>
          <p className="text-xs text-slate-400 mt-1">Sign in to manage your bookings and portal access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Mail size={13} className="text-amber-400" /> Email Address
            </label>
            <input 
              type="email" 
              placeholder="Enter your email"
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e1626] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs transition-colors" 
              required 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Lock size={13} className="text-amber-400" /> Password
            </label>
            <input 
              type="password" 
              placeholder="Enter your password"
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e1626] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs transition-colors" 
              required 
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 rounded-xl font-bold text-xs tracking-wider uppercase transition-all shadow-lg hover:shadow-amber-500/20 inline-flex items-center justify-center gap-2 mt-4 cursor-pointer"
          >
            Authenticate <ArrowRight size={14} />
          </button>
        </form>
      </div>
    </div>
  );
};


