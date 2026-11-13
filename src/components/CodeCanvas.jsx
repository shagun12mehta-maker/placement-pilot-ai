import React, { useState } from 'react';
import { Code2, Play, CheckCircle2, RotateCcw, Sparkles, AlertTriangle } from 'lucide-react';

export default function CodeCanvas({
  question,
  code,
  onChangeCode,
  onSubmitCodeReview,
  isReviewingCode
}) {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [executionOutput, setExecutionOutput] = useState(null);

  const handleSimulateRun = () => {
    setExecutionOutput({
      status: 'success',
      output: 'Test Case 1 Passed: Input nums = [2,7,11,15], target = 9 -> Output: [0,1]\nTest Case 2 Passed: Input nums = [3,2,4], target = 6 -> Output: [1,2]\nExecution Time: 42ms (Beats 87% of submissions)'
    });
  };

  return (
    <div className="glass-panel rounded-2xl flex flex-col h-full border border-slate-800 overflow-hidden">
      {/* Question Details Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/60">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="h-6 px-2.5 rounded-full text-xs font-semibold bg-google-blue/15 text-google-blue border border-google-blue/30 flex items-center">
              {question.topic}
            </span>
            <span className={`h-6 px-2.5 rounded-full text-xs font-semibold flex items-center ${
              question.difficulty === 'Easy'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
            }`}>
              {question.difficulty}
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Target Complexity: <span className="text-slate-200 font-semibold">{question.expectedComplexity}</span>
          </span>
        </div>

        <h3 className="text-base font-bold text-white font-['Google_Sans',sans-serif]">{question.title}</h3>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">{question.prompt}</p>
      </div>

      {/* Editor Toolbar */}
      <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-google-blue" />
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-slate-900 text-slate-200 border border-slate-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-google-blue"
          >
            <option value="javascript">JavaScript (ES6)</option>
            <option value="python">Python 3</option>
            <option value="cpp">C++ (std::vector)</option>
            <option value="java">Java (OpenJDK)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onChangeCode(question.starterCode)}
            className="flex items-center gap-1 px-2.5 py-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            title="Reset to starter template"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleSimulateRun}
            className="flex items-center gap-1 px-3 py-1 rounded bg-slate-800 text-slate-200 hover:bg-slate-700 transition font-medium"
          >
            <Play className="h-3 w-3 text-google-green" />
            <span>Dry Run</span>
          </button>

          <button
            onClick={onSubmitCodeReview}
            disabled={isReviewingCode}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-google-blue hover:bg-blue-600 text-white font-semibold shadow-md shadow-blue-500/20 transition disabled:opacity-50"
          >
            <Sparkles className="h-3 w-3" />
            <span>{isReviewingCode ? 'Gemini Reviewing...' : 'Ask AI Code Review'}</span>
          </button>
        </div>
      </div>

      {/* Code Editor Body */}
      <div className="flex-1 relative flex bg-slate-950 font-mono text-xs overflow-hidden">
        {/* Line Numbers Simulation */}
        <div className="w-10 py-3 select-none text-right pr-2 text-slate-600 border-r border-slate-800/80 bg-slate-950/90 font-mono leading-5">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          value={code}
          onChange={(e) => onChangeCode(e.target.value)}
          spellCheck="false"
          className="flex-1 p-3 bg-transparent text-slate-100 font-mono text-xs leading-5 resize-none focus:outline-none focus:ring-0 selection:bg-google-blue/30 overflow-y-auto"
          placeholder="// Type your code here. Explain your thought process verbally as you write..."
        />
      </div>

      {/* Execution Output Drawer */}
      {executionOutput && (
        <div className="p-3 bg-slate-900 border-t border-slate-800 text-xs font-mono">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="flex items-center gap-1 text-google-green font-semibold">
              <CheckCircle2 className="h-3.5 w-3.5" /> Test Cases Verified
            </span>
            <button
              onClick={() => setExecutionOutput(null)}
              className="text-slate-500 hover:text-slate-300"
            >
              Dismiss
            </button>
          </div>
          <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed">{executionOutput.output}</pre>
        </div>
      )}
    </div>
  );
}
