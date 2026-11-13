import React from 'react';
import { Target, Settings, Clock, Mic, MicOff, PhoneOff, Sun, Moon, LogOut, LayoutDashboard, Code2, ShieldCheck } from 'lucide-react';

export default function Navbar({
  apiKey,
  onOpenSettings,
  onFinishInterview,
  isInterviewActive,
  durationSeconds,
  isRecording,
  onToggleRecording,
  interviewStage = 'Implementation & Logic',
  theme,
  onToggleTheme,
  user,
  onLogout,
  currentView,
  onChangeView
}) {
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isDark = theme === 'dark';

  return (
    <header className={`h-14 border-b px-5 flex items-center justify-between sticky top-0 z-30 transition-colors duration-200 ${
      isDark ? 'border-slate-800 bg-slate-900/90 text-slate-100' : 'border-slate-200 bg-white/95 text-slate-900 shadow-sm'
    }`}>
      
      {/* Brand & Left Navigation Links */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onChangeView('student-hub')}>
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <Target className="h-4 w-4" />
          </div>
          <div>
            <h1 className="font-semibold text-sm tracking-tight font-sans">
              PlacementPilot <span className="text-blue-500 font-bold">AI</span>
            </h1>
          </div>
        </div>

        {/* Multi-Page Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 text-xs">
          <button
            onClick={() => onChangeView('student-hub')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              currentView === 'student-hub'
                ? 'bg-blue-600 text-white shadow-sm'
                : isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span>Practice Hub</span>
          </button>

          <button
            onClick={() => onChangeView('interview-studio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              currentView === 'interview-studio'
                ? 'bg-blue-600 text-white shadow-sm'
                : isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>Live Studio</span>
          </button>

          <button
            onClick={() => onChangeView('officer-dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              currentView === 'officer-dashboard'
                ? 'bg-blue-600 text-white shadow-sm'
                : isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>College Admin</span>
          </button>
        </nav>
      </div>

      {/* Center Stage & Timer (Only in Interview Studio) */}
      {currentView === 'interview-studio' && isInterviewActive && (
        <div className={`hidden lg:flex items-center gap-3 px-3.5 py-1 rounded-full text-xs border ${
          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}>
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <Clock className="h-3 w-3 text-blue-500" />
            <span>{formatTime(durationSeconds)}</span>
          </div>
          <span className={isDark ? 'text-slate-700' : 'text-slate-300'}>|</span>
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Stage: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{interviewStage}</strong></span>
          </div>
        </div>
      )}

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {currentView === 'interview-studio' && isInterviewActive && (
          <>
            <button
              onClick={onToggleRecording}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                isRecording
                  ? 'bg-red-500/20 text-red-500 border border-red-500/30'
                  : isDark ? 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
              }`}
            >
              {isRecording ? <Mic className="h-3.5 w-3.5 animate-pulse text-red-500" /> : <MicOff className="h-3.5 w-3.5" />}
              <span>{isRecording ? 'Mute' : 'Unmute'}</span>
            </button>

            <button
              onClick={onFinishInterview}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-500 text-white transition shadow-sm"
              title="End Interview and View Report"
            >
              <PhoneOff className="h-3.5 w-3.5" />
              <span>End Interview</span>
            </button>
          </>
        )}

        {/* Theme Switcher Button */}
        <button
          onClick={onToggleTheme}
          className={`p-2 rounded-lg border transition ${
            isDark ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
          }`}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className={`p-2 rounded-lg border transition ${
            isDark ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
          }`}
          title="Interview Settings & Track"
        >
          <Settings className="h-3.5 w-3.5" />
        </button>

        {/* User Profile & Logout */}
        {user && (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-700/40">
            <div className="text-right hidden sm:block">
              <div className="text-[11px] font-semibold leading-tight">{user.name}</div>
              <div className={`text-[9px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{user.college?.slice(0, 16)}...</div>
            </div>
            <button
              onClick={onLogout}
              className={`p-1.5 rounded-lg transition ${
                isDark ? 'text-slate-400 hover:text-red-400 hover:bg-slate-800' : 'text-slate-500 hover:text-red-600 hover:bg-slate-100'
              }`}
              title="Sign Out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

    </header>
  );
}
