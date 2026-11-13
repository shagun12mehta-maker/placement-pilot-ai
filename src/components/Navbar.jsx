import React from 'react';
import { Target, Settings, Award, Sparkles, Clock, Mic, MicOff } from 'lucide-react';

export default function Navbar({
  apiKey,
  onOpenSettings,
  onFinishInterview,
  isInterviewActive,
  durationSeconds,
  isRecording,
  onToggleRecording
}) {
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-google-blue via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-google-blue/20">
          <Target className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg text-white font-['Google_Sans',sans-serif] tracking-tight">
              PlacementPilot <span className="text-google-blue">AI</span>
            </h1>
            <span className="text-[10px] font-semibold bg-google-blue/15 text-blue-300 border border-google-blue/30 px-2 py-0.5 rounded-full">
              Google AI Buildathon
            </span>
          </div>
          <p className="text-xs text-slate-400">Multimodal Real-Time Campus Placement Coach</p>
        </div>
      </div>

      {/* Center Status / Timer */}
      {isInterviewActive && (
        <div className="flex items-center gap-4 bg-slate-950/70 border border-slate-800 px-4 py-1.5 rounded-full text-xs">
          <div className="flex items-center gap-1.5 text-slate-300 font-mono">
            <Clock className="h-3.5 w-3.5 text-google-blue animate-pulse" />
            <span>{formatTime(durationSeconds)}</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-google-green animate-ping" />
            <span className="text-slate-300 font-medium">Live Interview Session</span>
          </div>
        </div>
      )}

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {isInterviewActive && (
          <>
            <button
              onClick={onToggleRecording}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isRecording
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30'
                  : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
              }`}
            >
              {isRecording ? <Mic className="h-3.5 w-3.5 animate-pulse" /> : <MicOff className="h-3.5 w-3.5" />}
              <span>{isRecording ? 'Mic Active' : 'Mic Muted'}</span>
            </button>

            <button
              onClick={onFinishInterview}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-google-green to-emerald-600 text-white shadow-md shadow-emerald-500/20 hover:brightness-110 transition-all"
            >
              <Award className="h-3.5 w-3.5" />
              <span>Finish & Get Scorecard</span>
            </button>
          </>
        )}

        <button
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 border border-slate-700 text-slate-200 hover:bg-slate-700 transition-all"
        >
          <Settings className="h-3.5 w-3.5 text-slate-400" />
          <span>{apiKey ? 'API Configured' : 'Configure Gemini'}</span>
          {apiKey ? (
            <span className="h-1.5 w-1.5 rounded-full bg-google-green" />
          ) : (
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          )}
        </button>
      </div>
    </header>
  );
}
