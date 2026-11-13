import React, { useState } from 'react';
import { Target, User, ShieldCheck, ArrowRight, Sun, Moon, CheckCircle2 } from 'lucide-react';

export default function LoginPage({ onLogin, theme, onToggleTheme }) {
  const [role, setRole] = useState('student'); // 'student' | 'officer'
  const [name, setName] = useState('Shagun Mehta');
  const [email, setEmail] = useState('shagun12mehta@gmail.com');
  const [college, setCollege] = useState('Engineering Institute of Technology');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({
      name: name.trim() || 'Shagun Mehta',
      email: email.trim(),
      role,
      college: college.trim()
    });
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex flex-col justify-between ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} transition-colors duration-200`}>
      
      {/* Top Header */}
      <header className={`px-6 py-4 flex items-center justify-between border-b ${isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-white/80'} backdrop-blur-sm`}>
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <Target className="h-4 w-4" />
          </div>
          <span className="font-bold text-sm tracking-tight font-sans">
            PlacementPilot <span className="text-blue-500 font-extrabold">AI</span>
          </span>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
            Google AI Buildathon
          </span>
        </div>

        <button
          onClick={onToggleTheme}
          className={`p-2 rounded-lg border transition ${isDark ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm'}`}
          title="Toggle Theme"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className={`w-full max-w-md rounded-2xl border p-6 shadow-xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold font-sans">Sign in to PlacementPilot</h2>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Real-time multimodal mock interview platform for campus drives
            </p>
          </div>

          {/* Role Selection Tabs */}
          <div className={`grid grid-cols-2 p-1 rounded-xl mb-5 text-xs font-medium border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
                role === 'student'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="h-3.5 w-3.5" />
              <span>Student Aspirant</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('officer')}
              className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
                role === 'officer'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Placement Cell</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            <div>
              <label className={`block font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {role === 'student' ? 'Student Full Name' : 'Officer Name'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Shagun Mehta"
                required
                className={`w-full rounded-lg px-3.5 py-2 text-xs border focus:outline-none focus:border-blue-500 transition ${
                  isDark ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className={`block font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. shagun12mehta@gmail.com"
                required
                className={`w-full rounded-lg px-3.5 py-2 text-xs border focus:outline-none focus:border-blue-500 transition ${
                  isDark ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className={`block font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                University / College Name
              </label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="e.g. Engineering Institute of Technology"
                required
                className={`w-full rounded-lg px-3.5 py-2 text-xs border focus:outline-none focus:border-blue-500 transition ${
                  isDark ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            {/* Quick Demo Info Pill */}
            <div className={`p-3 rounded-lg border flex items-start gap-2 text-[11px] ${
              isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-blue-50/50 border-blue-100 text-blue-900'
            }`}>
              <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
              <span>
                <strong>1-Click Instant Access:</strong> Pre-filled for testing. Click Enter Studio to launch the live interview room immediately.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition"
            >
              <span>Enter Interview Studio</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>

          </form>

        </div>
      </main>

      {/* Footer */}
      <footer className={`px-6 py-3 text-center text-[11px] border-t ${isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'}`}>
        Built with Google AI (Gemini Live & Multimodal) and Google Cloud
      </footer>

    </div>
  );
}
