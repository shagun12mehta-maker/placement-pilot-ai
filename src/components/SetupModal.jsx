import React, { useState } from 'react';
import { Target, Key, Sparkles, Building2, User, Play, ExternalLink } from 'lucide-react';
import { TRACKS } from '../data/questionBank';

export default function SetupModal({
  isOpen,
  onClose,
  onStartInterview,
  apiKey,
  setApiKey
}) {
  const [candidateName, setCandidateName] = useState('Shagun Mehta');
  const [selectedTrackId, setSelectedTrackId] = useState(TRACKS[0].id);
  const [selectedQuestionId, setSelectedQuestionId] = useState(TRACKS[0].questions[0].id);
  const [role, setRole] = useState(TRACKS[0].defaultRole);

  if (!isOpen) return null;

  const currentTrack = TRACKS.find(t => t.id === selectedTrackId) || TRACKS[0];
  const currentQuestion = currentTrack.questions.find(q => q.id === selectedQuestionId) || currentTrack.questions[0];

  const handleTrackChange = (trackId) => {
    setSelectedTrackId(trackId);
    const newTrack = TRACKS.find(t => t.id === trackId);
    if (newTrack) {
      setSelectedQuestionId(newTrack.questions[0].id);
      setRole(newTrack.defaultRole);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onStartInterview({
      candidateName: candidateName.trim() || 'Shagun Mehta',
      track: currentTrack,
      question: currentQuestion,
      role
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-google-blue to-purple-600 flex items-center justify-center text-white shadow-lg shadow-google-blue/30">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-['Google_Sans',sans-serif]">
                Setup Your Campus Mock Interview
              </h2>
              <p className="text-xs text-slate-400">
                Choose your hiring track and calibrate the Gemini AI recruiter.
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Candidate Name */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-google-blue" />
              <span>Candidate Name</span>
            </label>
            <input
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              placeholder="e.g. Shagun Mehta"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-google-blue transition"
              required
            />
          </div>

          {/* Hiring Track */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-purple-400" />
              <span>Target Hiring Track</span>
            </label>
            <div className="grid grid-cols-1 gap-2">
              {TRACKS.map((track) => (
                <div
                  key={track.id}
                  onClick={() => handleTrackChange(track.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                    selectedTrackId === track.id
                      ? 'bg-google-blue/10 border-google-blue text-white shadow-sm'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className={`h-4 w-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                    selectedTrackId === track.id ? 'border-google-blue bg-google-blue' : 'border-slate-600'
                  }`}>
                    {selectedTrackId === track.id && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200">{track.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">{track.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Target Role & Selected Question */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Target Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-google-blue"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Interview Problem</label>
              <select
                value={selectedQuestionId}
                onChange={(e) => setSelectedQuestionId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-google-blue"
              >
                {currentTrack.questions.map((q) => (
                  <option key={q.id} value={q.id}>{q.title} ({q.difficulty})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Gemini API Key */}
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Key className="h-3.5 w-3.5 text-google-yellow" />
                <span>Google Gemini API Key (Optional)</span>
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-google-blue hover:underline flex items-center gap-1"
              >
                Get Free Key in AI Studio <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </div>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Paste your Gemini API key (or leave empty for Demo Simulation Mode)"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100 font-mono text-xs focus:outline-none focus:border-google-blue"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              ✨ If empty, the app runs in <strong>Smart Simulation Mode</strong> with full voice and code review for instant testing.
            </p>
          </div>

          {/* Start CTA */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-google-blue via-indigo-600 to-purple-600 hover:brightness-110 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition"
            >
              <Play className="h-4 w-4 fill-white" />
              <span>Launch Live Interview Room</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
