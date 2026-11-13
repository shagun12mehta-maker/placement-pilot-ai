import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Bot, User, Sparkles, HelpCircle } from 'lucide-react';

export default function TranscriptPanel({
  transcript,
  onSendCandidateTurn,
  isAiThinking,
  isRecording,
  onToggleRecording,
  onAskHint
}) {
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, isAiThinking]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendCandidateTurn(inputText.trim());
    setInputText('');
  };

  return (
    <div className="glass-panel rounded-2xl flex flex-col h-full border border-slate-800 overflow-hidden">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-google-blue" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Live Interview Dialogue</h3>
        </div>
        <button
          onClick={onAskHint}
          className="flex items-center gap-1 text-[11px] text-google-yellow bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded hover:bg-yellow-500/20 transition"
        >
          <HelpCircle className="h-3 w-3" />
          <span>Ask for Hint</span>
        </button>
      </div>

      {/* Transcript Messages List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs">
        {transcript.map((msg, index) => {
          const isAi = msg.sender === 'AI' || msg.sender === 'Interviewer';
          return (
            <div
              key={index}
              className={`flex gap-2.5 ${isAi ? 'justify-start' : 'justify-end'}`}
            >
              {isAi && (
                <div className="h-7 w-7 rounded-lg bg-google-blue/20 border border-google-blue/30 flex items-center justify-center text-google-blue shrink-0 mt-0.5">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-xl px-3.5 py-2.5 leading-relaxed shadow-sm ${
                  isAi
                    ? 'bg-slate-900 border border-slate-800 text-slate-200'
                    : 'bg-google-blue text-white font-medium ml-auto'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1 text-[10px] opacity-70">
                  <span className="font-semibold">{isAi ? 'AI Interviewer' : 'You (Candidate)'}</span>
                  <span>{msg.timestamp || 'Just now'}</span>
                </div>
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>

              {!isAi && (
                <div className="h-7 w-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}

        {isAiThinking && (
          <div className="flex gap-2.5 items-center text-slate-400 text-xs italic">
            <div className="h-7 w-7 rounded-lg bg-google-blue/20 border border-google-blue/30 flex items-center justify-center text-google-blue shrink-0">
              <Bot className="h-4 w-4 animate-spin" />
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl">
              <span className="h-1.5 w-1.5 rounded-full bg-google-blue animate-bounce" />
              <span className="h-1.5 w-1.5 rounded-full bg-google-blue animate-bounce [animation-delay:0.2s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-google-blue animate-bounce [animation-delay:0.4s]" />
              <span className="text-slate-400 text-[11px] ml-1">Gemini evaluating reasoning...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Spoken Quick Prompt Suggestions */}
      <div className="px-3 py-1.5 bg-slate-900/80 border-t border-slate-800 flex gap-2 overflow-x-auto text-[11px]">
        <button
          onClick={() => onSendCandidateTurn("I'd start with a brute-force approach, which checks every pair in O(N^2) time.")}
          className="shrink-0 bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700 transition"
        >
          💡 "Explain Brute Force"
        </button>
        <button
          onClick={() => onSendCandidateTurn("I can optimize this to O(N) using a Hash Map to store complement lookups.")}
          className="shrink-0 bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700 transition"
        >
          ⚡ "Explain O(N) Optimization"
        </button>
        <button
          onClick={() => onSendCandidateTurn("What edge cases should I consider regarding duplicate elements in the array?")}
          className="shrink-0 bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700 transition"
        >
          ❓ "Discuss Edge Cases"
        </button>
      </div>

      {/* Input Box & Mic Controls */}
      <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleRecording}
          className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${
            isRecording
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
          }`}
          title={isRecording ? 'Mute Speech' : 'Speak via Microphone'}
        >
          {isRecording ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isRecording ? "Listening to your voice... (or type here)" : "Speak or type your explanation to the interviewer..."}
          className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-google-blue transition"
        />

        <button
          type="submit"
          disabled={!inputText.trim()}
          className="h-9 w-9 rounded-xl bg-google-blue hover:bg-blue-600 disabled:opacity-40 disabled:hover:bg-google-blue text-white flex items-center justify-center shrink-0 transition shadow-md shadow-blue-500/20"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
