import React from 'react';
import { Award, CheckCircle, AlertTriangle, Calendar, Download, RefreshCw, X, TrendingUp, Mic } from 'lucide-react';

export default function ScorecardModal({
  scorecard,
  candidateName,
  targetCompany,
  role,
  onClose,
  onRestart
}) {
  if (!scorecard) return null;

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-google-green border-google-green/40 bg-green-500/10';
    if (score >= 70) return 'text-google-blue border-google-blue/40 bg-blue-500/10';
    return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
  };

  const getHiringBadge = (decision) => {
    switch (decision) {
      case 'Strong Hire':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Hire':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'Leaning Hire':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-red-500/20 text-red-300 border-red-500/40';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col my-8">
        
        {/* Top Header Banner */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-google-blue to-purple-600 flex items-center justify-center text-white shadow-lg shadow-google-blue/30">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white font-['Google_Sans',sans-serif]">
                  360° Placement Diagnostic Scorecard
                </h2>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getHiringBadge(scorecard.hiringDecision)}`}>
                  {scorecard.hiringDecision}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Candidate: <strong className="text-slate-200">{candidateName}</strong> · Track: {targetCompany} · Role: {role}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          
          {/* Main Score & Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            
            {/* Overall Score Circle Card */}
            <div className="md:col-span-2 glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Overall Interview Score</div>
              <div className={`h-28 w-28 rounded-full border-4 flex flex-col items-center justify-center shadow-inner ${getScoreColor(scorecard.overallScore)}`}>
                <span className="text-4xl font-extrabold font-['Google_Sans',sans-serif]">{scorecard.overallScore}</span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">out of 100</span>
              </div>
              <div className="mt-3 text-xs text-slate-300 font-medium">
                Recommendation: <span className="text-google-blue font-bold">{scorecard.hiringDecision}</span>
              </div>
            </div>

            {/* 4 Pillars Grid */}
            <div className="md:col-span-3 grid grid-cols-2 gap-3">
              <div className="bg-slate-950/70 border border-slate-800/80 p-3.5 rounded-xl">
                <div className="text-[11px] text-slate-400 font-medium">Conceptual Accuracy</div>
                <div className="text-2xl font-bold text-white mt-1">{scorecard.breakdown.conceptualAccuracy}%</div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-google-blue h-full rounded-full" style={{ width: `${scorecard.breakdown.conceptualAccuracy}%` }} />
                </div>
              </div>

              <div className="bg-slate-950/70 border border-slate-800/80 p-3.5 rounded-xl">
                <div className="text-[11px] text-slate-400 font-medium">Code Optimization</div>
                <div className="text-2xl font-bold text-white mt-1">{scorecard.breakdown.codeOptimization}%</div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: `${scorecard.breakdown.codeOptimization}%` }} />
                </div>
              </div>

              <div className="bg-slate-950/70 border border-slate-800/80 p-3.5 rounded-xl">
                <div className="text-[11px] text-slate-400 font-medium">Spoken Communication</div>
                <div className="text-2xl font-bold text-white mt-1">{scorecard.breakdown.communicationClarity}%</div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-google-green h-full rounded-full" style={{ width: `${scorecard.breakdown.communicationClarity}%` }} />
                </div>
              </div>

              <div className="bg-slate-950/70 border border-slate-800/80 p-3.5 rounded-xl">
                <div className="text-[11px] text-slate-400 font-medium">Stress & Composure</div>
                <div className="text-2xl font-bold text-white mt-1">{scorecard.breakdown.stressComposure}%</div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-pink-500 h-full rounded-full" style={{ width: `${scorecard.breakdown.stressComposure}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950/60 border border-emerald-500/20 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-3">
                <CheckCircle className="h-4 w-4" />
                <span>Observed Strengths</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {scorecard.strengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 shrink-0 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-950/60 border border-amber-500/20 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs mb-3">
                <AlertTriangle className="h-4 w-4" />
                <span>Critical Weaknesses to Address</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {scorecard.criticalWeaknesses.map((weak, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 shrink-0 font-bold">•</span>
                    <span>{weak}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Filler Word Telemetry Banner */}
          {scorecard.fillerWordAnalysis && (
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-start gap-3">
              <div className="p-2 rounded-lg bg-google-blue/15 text-google-blue shrink-0">
                <Mic className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Acoustic & Speech Pacing Telemetry</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{scorecard.fillerWordAnalysis}</p>
              </div>
            </div>
          )}

          {/* 7-Day Targeted Remediation Plan */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4 text-google-blue" />
              <h3 className="text-sm font-bold text-white font-['Google_Sans',sans-serif]">
                Personalized 7-Day Placement Remediation Plan
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {scorecard.sevenDayPlan.map((dayPlan) => (
                <div key={dayPlan.day} className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-google-blue bg-google-blue/10 px-2 py-0.5 rounded border border-google-blue/20">
                      Day {dayPlan.day}
                    </span>
                    <span className="text-xs font-semibold text-slate-200">{dayPlan.focus}</span>
                  </div>
                  <ul className="space-y-1 text-slate-400 text-xs">
                    {dayPlan.tasks.map((task, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-slate-600 font-mono">›</span>
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <p className="text-[11px] text-slate-400">
            Powered by Google Gemini 1.5 & Google Cloud Run Infrastructure
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onRestart}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-google-blue hover:bg-blue-600 text-white shadow-md shadow-blue-500/20 transition"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Practice Another Question</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
