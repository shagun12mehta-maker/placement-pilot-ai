import React, { useState } from 'react';
import { Play, Sparkles, Wand2, Terminal, CheckCircle2, XCircle, RotateCcw, Clock } from 'lucide-react';
import { executeCode } from '../services/codeRunner';

export default function CodeCanvas({
  question,
  code,
  onChangeCode,
  onSubmitCodeReview,
  isReviewingCode,
  onOpenQuestionGenerator
}) {
  const [activeTab, setActiveTab] = useState('problem'); // 'problem' | 'testcases' | 'console'
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [isRunning, setIsRunning] = useState(false);
  const [runResult, setRunResult] = useState(null);

  const handleRunRealCode = async () => {
    setIsRunning(true);
    setActiveTab('testcases');
    const result = await executeCode(code, question.testCases || []);
    setRunResult(result);
    setIsRunning(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-full overflow-hidden shadow-sm">
      
      {/* Top Problem Switcher & Action Toolbar */}
      <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">{question.title}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
              question.difficulty === 'Easy'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}>
              {question.difficulty}
            </span>
          </div>

          <button
            onClick={onOpenQuestionGenerator}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 text-[11px] transition"
          >
            <Wand2 className="h-3 w-3" />
            <span>Generate New with AI</span>
          </button>
        </div>

        {/* Right Runner Controls */}
        <div className="flex items-center gap-2">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-slate-900 text-slate-300 border border-slate-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500"
          >
            <option value="javascript">JavaScript (Node.js)</option>
            <option value="python">Python 3</option>
            <option value="cpp">C++ (GCC)</option>
            <option value="java">Java 17</option>
          </select>

          <button
            onClick={() => onChangeCode(question.starterCode)}
            className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            title="Reset code"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={handleRunRealCode}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium border border-slate-700 transition"
          >
            <Play className="h-3 w-3 text-emerald-400 fill-emerald-400" />
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>

          <button
            onClick={onSubmitCodeReview}
            disabled={isReviewingCode}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-sm transition disabled:opacity-50"
          >
            <Sparkles className="h-3 w-3" />
            <span>{isReviewingCode ? 'Reviewing...' : 'Ask AI Review'}</span>
          </button>
        </div>
      </div>

      {/* Main Split Body: Left Description / Right Code Editor */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        
        {/* Left Sub-Pane: Problem Details (5 cols) */}
        <div className="md:col-span-5 border-r border-slate-800 bg-slate-950/40 p-4 overflow-y-auto flex flex-col justify-between text-xs">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2 font-mono text-[11px]">
              <span>Topic: {question.topic}</span>
              <span>{question.expectedComplexity}</span>
            </div>
            <div className="text-slate-300 leading-relaxed whitespace-pre-wrap font-sans text-xs">
              {question.prompt}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <div className="text-[11px] text-slate-400 font-medium mb-1">HR & Behavioral Follow-up:</div>
            <p className="text-slate-400 italic text-[11px] bg-slate-900/60 p-2.5 rounded border border-slate-800/80">
              "{question.hrFollowUp || 'Explain how you communicate technical tradeoffs to non-technical stakeholders.'}"
            </p>
          </div>
        </div>

        {/* Right Sub-Pane: Editor + Terminal Output (7 cols) */}
        <div className="md:col-span-7 flex flex-col h-full bg-slate-950 overflow-hidden">
          
          {/* Editor Textarea */}
          <div className="flex-1 relative flex font-mono text-xs overflow-hidden">
            <div className="w-9 py-3 select-none text-right pr-2 text-slate-600 border-r border-slate-800/80 bg-slate-950 font-mono leading-5">
              {Array.from({ length: 28 }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <textarea
              value={code}
              onChange={(e) => onChangeCode(e.target.value)}
              spellCheck="false"
              className="flex-1 p-3 bg-transparent text-slate-200 font-mono text-xs leading-5 resize-none focus:outline-none focus:ring-0 selection:bg-blue-600/30 overflow-y-auto"
              placeholder="// Implement your algorithm here..."
            />
          </div>

          {/* Bottom Execution Drawer / Tabs */}
          <div className="border-t border-slate-800 bg-slate-900/90 flex flex-col text-xs">
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-4 text-xs font-medium">
                <button
                  onClick={() => setActiveTab('testcases')}
                  className={`flex items-center gap-1.5 pb-0.5 ${activeTab === 'testcases' ? 'text-blue-400 border-b border-blue-400' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Test Cases</span>
                </button>
                <button
                  onClick={() => setActiveTab('console')}
                  className={`flex items-center gap-1.5 pb-0.5 ${activeTab === 'console' ? 'text-blue-400 border-b border-blue-400' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  <Terminal className="h-3 w-3" />
                  <span>Console Logs ({runResult?.logs?.length || 0})</span>
                </button>
              </div>

              {runResult && (
                <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                  <Clock className="h-2.5 w-2.5" />
                  <span>{runResult.executionTimeMs}ms runtime</span>
                </span>
              )}
            </div>

            {/* Test Results Output */}
            <div className="p-3 max-h-36 overflow-y-auto font-mono text-xs">
              {activeTab === 'testcases' && (
                <>
                  {!runResult ? (
                    <p className="text-slate-500 italic">Click "Run Code" above to execute tests against your solution.</p>
                  ) : runResult.error ? (
                    <div className="text-red-400 bg-red-500/10 p-2.5 rounded border border-red-500/20">
                      Error: {runResult.error}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {runResult.testResults.map((tc) => (
                        <div
                          key={tc.index}
                          className={`p-2 rounded border flex items-center justify-between ${
                            tc.passed ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-red-500/10 border-red-500/20 text-red-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {tc.passed ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <XCircle className="h-3.5 w-3.5 text-red-400" />}
                            <span>Case {tc.index}: Input: {tc.input}</span>
                          </div>
                          <span className="font-semibold text-[11px]">{tc.passed ? 'Passed' : 'Failed'}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {activeTab === 'console' && (
                <div>
                  {runResult?.logs && runResult.logs.length > 0 ? (
                    <div className="space-y-1 text-slate-300">
                      {runResult.logs.map((log, idx) => (
                        <div key={idx} className="font-mono text-[11px] text-slate-300">› {log}</div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 italic">No console output. Use console.log(...) in your code.</p>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
