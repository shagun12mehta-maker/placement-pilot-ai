import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import VideoFeed from './components/VideoFeed';
import CodeCanvas from './components/CodeCanvas';
import TranscriptPanel from './components/TranscriptPanel';
import SetupModal from './components/SetupModal';
import ScorecardModal from './components/ScorecardModal';
import { TRACKS } from './data/questionBank';
import { conductInterviewTurn, generateDiagnosticScorecard } from './services/geminiService';

export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('GEMINI_API_KEY') || '');
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isScorecardOpen, setIsScorecardOpen] = useState(false);
  const [scorecardData, setScorecardData] = useState(null);

  // Active Session State
  const [candidateName, setCandidateName] = useState('Shagun Mehta');
  const [currentTrack, setCurrentTrack] = useState(TRACKS[0]);
  const [currentQuestion, setCurrentQuestion] = useState(TRACKS[0].questions[0]);
  const [role, setRole] = useState(TRACKS[0].defaultRole);
  const [code, setCode] = useState(TRACKS[0].questions[0].starterCode);

  // Live Interview State
  const [isInterviewActive, setIsInterviewActive] = useState(true);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isCandidateSpeaking, setIsCandidateSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isReviewingCode, setIsReviewingCode] = useState(false);

  // Telemetry & Duration
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [telemetry, setTelemetry] = useState({
    fillerWords: 0,
    totalTurns: 0,
    totalWords: 0,
    wpm: 128
  });

  // Conversation Transcript
  const [transcript, setTranscript] = useState([
    {
      sender: 'AI',
      text: `Hello Shagun Mehta! Welcome to your technical interview for the ${TRACKS[0].defaultRole} position. Today we're going to work on ${TRACKS[0].questions[0].title}. Please take a moment to read the problem on the code canvas, and when you're ready, walk me through your initial high-level approach out loud.`,
      timestamp: '00:00'
    }
  ]);

  const recognitionRef = useRef(null);

  // Save API key
  useEffect(() => {
    if (apiKey) localStorage.setItem('GEMINI_API_KEY', apiKey);
  }, [apiKey]);

  // Session Timer
  useEffect(() => {
    let timer = null;
    if (isInterviewActive && !isScorecardOpen) {
      timer = setInterval(() => {
        setDurationSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isInterviewActive, isScorecardOpen]);

  // Speech Recognition (Web Speech API)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
        setIsCandidateSpeaking(true);
      };

      recognition.onresult = (event) => {
        const lastResult = event.results[event.results.length - 1];
        if (lastResult.isFinal) {
          const spokenText = lastResult[0].transcript.trim();
          if (spokenText) {
            handleCandidateTurn(spokenText);
          }
        }
      };

      recognition.onerror = (e) => {
        console.log('Speech recognition error:', e);
      };

      recognition.onend = () => {
        setIsRecording(false);
        setIsCandidateSpeaking(false);
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('SpeechRecognition initialization error:', err);
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      setIsRecording(!isRecording);
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (e) {
        recognitionRef.current.stop();
      }
    }
  };

  // Text-To-Speech function for AI response
  const speakAiResponse = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsAiSpeaking(true);
      utterance.onend = () => setIsAiSpeaking(false);
      utterance.onerror = () => setIsAiSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Handle a candidate speaking/typing turn
  const handleCandidateTurn = async (candidateSpeech) => {
    // 1. Analyze filler words
    const fillerRegex = /\b(um|uh|like|you know|basically|actually|sort of|kind of)\b/gi;
    const matches = candidateSpeech.match(fillerRegex);
    const newFillers = matches ? matches.length : 0;
    const words = candidateSpeech.split(/\s+/).length;

    setTelemetry(prev => ({
      ...prev,
      fillerWords: prev.fillerWords + newFillers,
      totalTurns: prev.totalTurns + 1,
      totalWords: prev.totalWords + words,
      wpm: Math.round(((prev.totalWords + words) / Math.max(1, durationSeconds)) * 60)
    }));

    // 2. Add to transcript
    const userMsg = {
      sender: 'Candidate',
      text: candidateSpeech,
      timestamp: formatTime(durationSeconds)
    };
    const updatedTranscript = [...transcript, userMsg];
    setTranscript(updatedTranscript);

    // 3. Trigger Gemini
    setIsAiThinking(true);
    try {
      const response = await conductInterviewTurn({
        apiKey,
        transcript: updatedTranscript,
        candidateSpeech,
        candidateCode: code,
        currentQuestion,
        companyTrack: currentTrack.name,
        role
      });

      const aiMsg = {
        sender: 'AI',
        text: response.interviewerSpeech,
        timestamp: formatTime(durationSeconds)
      };
      setTranscript(prev => [...prev, aiMsg]);
      speakAiResponse(response.interviewerSpeech);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiThinking(false);
    }
  };

  // Ask AI for Code Review specifically
  const handleAskCodeReview = async () => {
    setIsReviewingCode(true);
    await handleCandidateTurn("I've made some progress on my code implementation on the canvas. Could you review my logic and verify if my time and space complexity are optimal?");
    setIsReviewingCode(false);
  };

  // Ask for a Hint
  const handleAskHint = () => {
    handleCandidateTurn("Could you give me a slight hint or guide me in the right direction regarding the optimal data structure?");
  };

  // Finish Interview & Generate Scorecard
  const handleFinishInterview = async () => {
    setIsInterviewActive(false);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (recognitionRef.current && isRecording) recognitionRef.current.stop();

    setIsAiThinking(true);
    const result = await generateDiagnosticScorecard({
      apiKey,
      transcript,
      candidateCode: code,
      currentQuestion,
      companyTrack: currentTrack.name,
      role,
      telemetry: {
        ...telemetry,
        durationSeconds
      }
    });

    setScorecardData(result);
    setIsAiThinking(false);
    setIsScorecardOpen(true);
  };

  // Start / Restart Interview
  const handleStartInterview = (config) => {
    setCandidateName(config.candidateName);
    setCurrentTrack(config.track);
    setCurrentQuestion(config.question);
    setRole(config.role);
    setCode(config.question.starterCode);
    setDurationSeconds(0);
    setTelemetry({ fillerWords: 0, totalTurns: 0, totalWords: 0, wpm: 125 });

    const initialGreeting = `Hello ${config.candidateName}! Welcome to your technical interview for the ${config.role} role at a ${config.track.name} firm. We will focus on: ${config.question.title}. Take a look at the problem on your code canvas, and begin by walking me through your intuition verbally.`;

    setTranscript([
      {
        sender: 'AI',
        text: initialGreeting,
        timestamp: '00:00'
      }
    ]);

    setIsInterviewActive(true);
    setIsSetupOpen(false);
    setIsScorecardOpen(false);
    speakAiResponse(initialGreeting);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100">
      
      {/* Top Navigation */}
      <Navbar
        apiKey={apiKey}
        onOpenSettings={() => setIsSetupOpen(true)}
        onFinishInterview={handleFinishInterview}
        isInterviewActive={isInterviewActive}
        durationSeconds={durationSeconds}
        isRecording={isRecording}
        onToggleRecording={toggleRecording}
      />

      {/* Main 3-Column Studio Workspace */}
      <main className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-4rem)] overflow-hidden">
        
        {/* Left Column: AI Recruiter + Student Webcam & Telemetry (3 cols) */}
        <div className="lg:col-span-3 h-full overflow-hidden">
          <VideoFeed
            candidateName={candidateName}
            isAiSpeaking={isAiSpeaking}
            isCandidateSpeaking={isCandidateSpeaking}
            telemetry={telemetry}
            isRecording={isRecording}
          />
        </div>

        {/* Center Column: Interactive Code & Whiteboard Canvas (5 cols) */}
        <div className="lg:col-span-5 h-full overflow-hidden">
          <CodeCanvas
            question={currentQuestion}
            code={code}
            onChangeCode={setCode}
            onSubmitCodeReview={handleAskCodeReview}
            isReviewingCode={isReviewingCode}
          />
        </div>

        {/* Right Column: Live Socratic Transcript & Voice Controls (4 cols) */}
        <div className="lg:col-span-4 h-full overflow-hidden">
          <TranscriptPanel
            transcript={transcript}
            onSendCandidateTurn={handleCandidateTurn}
            isAiThinking={isAiThinking}
            isRecording={isRecording}
            onToggleRecording={toggleRecording}
            onAskHint={handleAskHint}
          />
        </div>

      </main>

      {/* Setup / Configuration Modal */}
      <SetupModal
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
        onStartInterview={handleStartInterview}
        apiKey={apiKey}
        setApiKey={setApiKey}
      />

      {/* 360° Diagnostic Scorecard Modal */}
      {isScorecardOpen && (
        <ScorecardModal
          scorecard={scorecardData}
          candidateName={candidateName}
          targetCompany={currentTrack.name}
          role={role}
          onClose={() => setIsScorecardOpen(false)}
          onRestart={() => {
            setIsScorecardOpen(false);
            setIsSetupOpen(true);
          }}
        />
      )}

    </div>
  );
}
