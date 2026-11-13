import React, { useState } from 'react';
import { Sparkles, X, Brain, Wand2, Loader2 } from 'lucide-react';
import { generateCustomQuestion } from '../services/geminiService';

export default function QuestionGeneratorModal({
  isOpen,
  onClose,
  onSelectGeneratedQuestion,
  apiKey
}) {
  const [topic, setTopic] = useState('Binary Trees & DFS/BFS');
  const [difficulty, setDifficulty] = useState('Medium');
  const [companyTarget, setCompanyTarget] = useState('Google / Tier-1 Big Tech');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const q = await generateCustomQuestion({
        apiKey,
        topic,
        difficulty,
        companyTarget
      });
      onSelectGeneratedQuestion(q);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Wand2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Generate Interview Problem</h3>
              <p className="text-xs text-slate-400">Creates an authentic problem using Google Gemini</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleGenerate} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Algorithmic Topic</label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="Binary Trees & DFS/BFS">Binary Trees & Tree Traversals</option>
              <option value="Dynamic Programming (1D/2D)">Dynamic Programming (1D / 2D)</option>
              <option value="Graphs & Shortest Path">Graphs & BFS/DFS</option>
              <option value="Sliding Window & Two Pointers">Sliding Window & Pointers</option>
              <option value="Trie & Prefix Trees">Trie & String Search</option>
              <option value="System Design & Low-Level Architecture">System Design & OOP</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="Easy">Easy (Campus Standard)</option>
                <option value="Medium">Medium (Big Tech Standard)</option>
                <option value="Hard">Hard (Senior Bar Raiser)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Target Style</label>
              <select
                value={companyTarget}
                onChange={(e) => setCompanyTarget(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="Google / Tier-1 Big Tech">Google / Big Tech</option>
                <option value="Amazon SDE-1">Amazon SDE-1</option>
                <option value="TCS / Infosys (Mass Recruiter)">TCS / Mass Recruiter</option>
                <option value="High-Growth FinTech Startup">FinTech Startup</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Synthesizing Problem with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Generate Problem Now</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
