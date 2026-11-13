import React, { useState } from 'react';
import { Users, TrendingUp, AlertTriangle, ShieldCheck, Download, Search, CheckCircle2, ChevronRight, BarChart3, GraduationCap } from 'lucide-react';

export default function OfficerDashboard({
  user,
  theme
}) {
  const isDark = theme === 'dark';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');

  const students = [
    { id: 'ST-101', name: 'Shagun Mehta', branch: 'CSE', roll: '21CS042', sessions: 3, avgScore: 84, status: 'Interview Ready', communication: 'High', logic: 'High' },
    { id: 'ST-102', name: 'Aarav Sharma', branch: 'IT', roll: '21IT018', sessions: 4, avgScore: 89, status: 'Interview Ready', communication: 'High', logic: 'High' },
    { id: 'ST-103', name: 'Pooja Verma', branch: 'CSE', roll: '21CS089', sessions: 2, avgScore: 68, status: 'Review Needed', communication: 'Moderate', logic: 'Moderate' },
    { id: 'ST-104', name: 'Rohan Gupta', branch: 'ECE', roll: '21EC034', sessions: 1, avgScore: 54, status: 'At Risk', communication: 'Low', logic: 'Moderate' },
    { id: 'ST-105', name: 'Ananya Iyer', branch: 'CSE', roll: '21CS012', sessions: 5, avgScore: 94, status: 'Interview Ready', communication: 'High', logic: 'High' },
    { id: 'ST-106', name: 'Vikram Patel', branch: 'IT', roll: '21IT055', sessions: 2, avgScore: 62, status: 'Review Needed', communication: 'Low', logic: 'Moderate' }
  ];

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.roll.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = selectedBranch === 'all' || s.branch === selectedBranch;
    return matchesSearch && matchesBranch;
  });

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-6xl mx-auto w-full space-y-6">
      
      {/* College Header */}
      <div className={`rounded-2xl border p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wider font-mono">
              Institutional Admin Portal
            </span>
            <span className="text-slate-400">·</span>
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>NIRF / NAAC Placement Readiness</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight font-sans">
            {user.college || 'Engineering Institute of Technology'}
          </h2>
          <p className={`text-xs mt-1 max-w-xl ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Graduating Batch of 2026 · Monitoring 1,420 undergraduate students across 5 engineering disciplines.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-2 border border-slate-700 transition"
        >
          <Download className="h-4 w-4" />
          <span>Export Institutional NAAC Report</span>
        </button>
      </div>

      {/* Top 4 Macro Institutional Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Enrolled Batch</span>
            <Users className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold font-sans">1,420</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Final & Pre-Final Year</p>
        </div>

        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Campus Hiring Readiness</span>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-500 font-sans">78.4%</div>
          <p className="text-[11px] text-emerald-400 mt-0.5">+14% vs last semester</p>
        </div>

        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Total Mock Drives</span>
            <ShieldCheck className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold font-sans">3,892</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Automated AI interviews</p>
        </div>

        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Needs Coaching</span>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-500 font-sans">142</div>
          <p className="text-[11px] text-amber-400 mt-0.5">Flagged for T&P mentoring</p>
        </div>

      </div>

      {/* Cohort Skill Gaps & Readiness Analytics */}
      <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-sm font-sans">Batch-Wide Skill Gap Diagnostics</h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Aggregated across 3,892 Gemini multimodal interview evaluations
            </p>
          </div>
          <span className="text-xs text-blue-500 font-mono">Updated Real-Time</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-slate-300">Data Structures & Algorithmic Logic</span>
              <span className="font-bold text-emerald-400">84% Proficient</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '84%' }} />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Strong performance in Arrays, Hash Maps, and Two Pointers.</p>
          </div>

          <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-slate-300">Spoken English & Communication Clarity</span>
              <span className="font-bold text-amber-400">62% Proficient</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: '62%' }} />
            </div>
            <p className="text-[11px] text-amber-400 mt-2">Critical Bottleneck: High filler words and difficulty explaining logic orally.</p>
          </div>

          <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-slate-300">System Design & Space-Time Trade-offs</span>
              <span className="font-bold text-blue-400">58% Proficient</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: '58%' }} />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Students struggle to articulate O(1) auxiliary cache eviction strategies.</p>
          </div>

          <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-slate-300">Behavioral HR & STAR Method</span>
              <span className="font-bold text-purple-400">76% Proficient</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full rounded-full" style={{ width: '76%' }} />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Good situational teamwork answers, needs improvement on conflict resolution.</p>
          </div>

        </div>
      </div>

      {/* Student Cohort Table */}
      <div className={`rounded-2xl border p-5 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-bold text-sm font-sans">Student Cohort Performance</h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Track individual readiness and review diagnostic scores</p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-48">
              <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search name or roll..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border focus:outline-none focus:border-blue-500 ${
                  isDark ? 'bg-slate-950 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className={`px-3 py-1.5 text-xs rounded-lg border focus:outline-none focus:border-blue-500 ${
                isDark ? 'bg-slate-950 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            >
              <option value="all">All Branches</option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="ECE">ECE</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Roll No</th>
                <th className="py-2.5 px-3">Branch</th>
                <th className="py-2.5 px-3">Mocks</th>
                <th className="py-2.5 px-3">Readiness Score</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredStudents.map((s) => (
                <tr key={s.id} className={isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}>
                  <td className="py-3 px-3 font-semibold text-slate-200">{s.name}</td>
                  <td className="py-3 px-3 font-mono text-slate-400">{s.roll}</td>
                  <td className="py-3 px-3 text-slate-400">{s.branch}</td>
                  <td className="py-3 px-3 text-slate-400">{s.sessions} sessions</td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-blue-400">{s.avgScore}%</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      s.status === 'Interview Ready'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : s.status === 'Review Needed'
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        : 'bg-red-500/15 text-red-400 border border-red-500/30'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
