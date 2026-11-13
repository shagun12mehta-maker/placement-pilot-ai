import React from 'react';
import { Target, Play, Calendar, CheckCircle2, TrendingUp, Clock, BookOpen, Building2, Award, ChevronRight } from 'lucide-react';
import { TRACKS } from '../data/questionBank';

export default function StudentHub({
  user,
  onLaunchInterview,
  theme
}) {
  const isDark = theme === 'dark';

  const pastInterviews = [
    {
      id: 1,
      title: 'Two Sum & Array Optimization',
      track: 'TCS / Infosys (Mass Recruiter)',
      date: 'Yesterday',
      score: 84,
      decision: 'Hire',
      clarity: 82,
      accuracy: 88
    },
    {
      id: 2,
      title: 'Longest Substring Without Repeating Characters',
      track: 'Amazon / Big Tech (Product)',
      date: '3 days ago',
      score: 72,
      decision: 'Leaning Hire',
      clarity: 70,
      accuracy: 75
    },
    {
      id: 3,
      title: 'Reverse String In-Place',
      track: 'TCS / Infosys (Mass Recruiter)',
      date: '5 days ago',
      score: 91,
      decision: 'Strong Hire',
      clarity: 89,
      accuracy: 94
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-6xl mx-auto w-full space-y-6">
      
      {/* Welcome Banner */}
      <div className={`rounded-2xl border p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-blue-500 uppercase tracking-wider font-mono">
              Placement Readiness Hub
            </span>
            <span className="text-slate-400">·</span>
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{user.college}</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight font-sans">
            Welcome back, {user.name}! 🎯
          </h2>
          <p className={`text-xs mt-1 max-w-xl ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            You are on a <strong>4-day practice streak</strong>. Your current technical interview readiness score is <strong className="text-emerald-500">82%</strong>. Practice your next company track below.
          </p>
        </div>

        <button
          onClick={() => onLaunchInterview(TRACKS[0], TRACKS[0].questions[0])}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-blue-500/25 shrink-0 transition"
        >
          <Play className="h-4 w-4 fill-white" />
          <span>Start Instant Mock Interview</span>
        </button>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Overall Readiness</span>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-500 font-sans">82%</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Top 15% of your batch</p>
        </div>

        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Completed Mocks</span>
            <CheckCircle2 className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold font-sans">3 Sessions</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Avg duration: 18 mins</p>
        </div>

        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Avg Speech Pacing</span>
            <Clock className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold font-sans">132 WPM</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Optimal recruiter range</p>
        </div>

        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Filler Word Density</span>
            <Award className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-500 font-sans">2.4 / min</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Down 40% from week 1</p>
        </div>

      </div>

      {/* Company Hiring Tracks Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-bold font-sans">Company-Specific Interview Tracks</h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Curated technical rubrics mapped to mass recruiters and product startups
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TRACKS.map((track) => (
            <div
              key={track.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between transition hover:-translate-y-0.5 ${
                isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 shadow-sm hover:border-blue-300'
              }`}
            >
              <div>
                <div className="h-9 w-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mb-3">
                  <Building2 className="h-4 w-4" />
                </div>
                <h4 className="font-bold text-sm font-sans">{track.name}</h4>
                <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {track.description}
                </p>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="font-mono bg-slate-800/80 px-2 py-0.5 rounded text-slate-300">
                    {track.questions.length} Questions Ready
                  </span>
                  <span>· {track.defaultRole}</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-500">Practice Track</span>
                <button
                  onClick={() => onLaunchInterview(track, track.questions[0])}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center gap-1 shadow-sm transition"
                >
                  <span>Launch</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past Mock History & Active 7-Day Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Past History Table (7 cols) */}
        <div className={`lg:col-span-7 rounded-2xl border p-5 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm font-sans">Recent Interview History</h3>
            <span className="text-xs text-slate-400">{pastInterviews.length} Recorded</span>
          </div>

          <div className="space-y-2.5">
            {pastInterviews.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
                  isDark ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <div className="font-semibold text-slate-200">{item.title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{item.track} · {item.date}</div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-bold text-blue-400 font-sans text-sm">{item.score}/100</div>
                    <div className="text-[10px] text-slate-400">{item.decision}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7-Day Remediation Plan (5 cols) */}
        <div className={`lg:col-span-5 rounded-2xl border p-5 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <h3 className="font-bold text-sm font-sans">Active 7-Day Plan</h3>
            </div>
            <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Day 4 of 7
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-2.5 text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Day 1: Complexity Articulation</strong>
                <p className="text-[11px] text-slate-400">Practice orally stating Big-O before coding.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Day 2: Edge-Case Handling</strong>
                <p className="text-[11px] text-slate-400">Verbal boundary check for null/empty arrays.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Day 3: Filler-Word Reduction</strong>
                <p className="text-[11px] text-slate-400">Replaced verbal fillers with silent 2-sec breaths.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-blue-400 bg-blue-500/10 p-2.5 rounded-xl border border-blue-500/20">
              <div className="h-4 w-4 rounded-full border-2 border-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              </div>
              <div>
                <strong className="text-blue-300">Today (Day 4): Two-Pointer & Sliding Window</strong>
                <p className="text-[11px] text-blue-400/80">Complete and defend 1 sliding window question.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
