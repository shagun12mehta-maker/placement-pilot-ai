import React from 'react';
import { Target, Settings, Award, Clock, Mic, MicOff, PhoneOff } from 'lucide-react';

export default function Navbar({
  apiKey,
  onOpenSettings,
  onFinishInterview,
  isInterviewActive,
  durationSeconds,
  isRecording,
  onToggleRecording,
  interviewStage = 'Implementation & Logic'
}) {
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-900/90 px-5 flex items-center justify-between sticky top-0 z-30">
      
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
          <Target className="h-4 w-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-semibold text-sm text-white font-sans tracking-tight">
              PlacementPilot <span className="text-blue-400 font-bold">AI</span>
            </h1>
            <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              Technical Interview Room
            </span>
          </div>
        </div>
      </div>

      {/* Center Stage & Timer */}
      {isInterviewActive && (
        <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 px-3.5 py-1 rounded-full text-xs">
          <div className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px]">
            <Clock className="h-3 w-3 text-blue-400" />
            <span>{formatTime(durationSeconds)}</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5 text-slate-300 text-[11px]">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Stage: <strong className="text-white">{interviewStage}</strong></span>
          </div>
        </div>
      )}

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {isInterviewActive && (
          <>
            <button
              onClick={onToggleRecording}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                isRecording
                  ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                  : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
              }`}
            >
              {isRecording ? <Mic className="h-3.5 w-3.5 animate-pulse text-red-400" /> : <MicOff className="h-3.5 w-3.5" />}
              <span>{isRecording ? 'Mute' : 'Unmute'}</span>
            </button>

            <button
              onClick={onFinishInterview}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-500 text-white transition shadow-sm"
              title="End Interview and View Report"
            >
              <PhoneOff className="h-3.5 w-3.5" />
              <span>End & Scorecard</span>
            </button>
          </>
        )}

        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          title="Interview Settings & Track"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>

    </header>
  );
}
