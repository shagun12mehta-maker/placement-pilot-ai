import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import VideoFeed from './components/VideoFeed';
import CodeCanvas from './components/CodeCanvas';
import TranscriptPanel from './components/TranscriptPanel';
import SetupModal from './components/SetupModal';
import ScorecardModal from './components/ScorecardModal';
import QuestionGeneratorModal from './components/QuestionGeneratorModal';
import { TRACKS } from './data/questionBank';
import { conductInterviewTurn, generateDiagnosticScorecard } from './services/geminiService';

export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('GEMINI_API_KEY') || '');
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isScorecardOpen, setIsScorecardOpen] = useState(false);
  const [scorecardData, setScorecardData] = useState(null);

  // Active Session State
  const [candidateName, setCandidateName] = useState('Shagun Mehta');
  const [currentTrack, setCurrentTrack] = useState(TRACKS[0]);
  const [currentQuestion, setCurrentQuestion] = useState(TRACKS[0].questions[0]);
  const [role, setRole] = useState(TRACKS[0].defaultRole);
  const [code, setCode] = useState(TRACKS[0].questions[0].starterCode);
  const [interviewStage, setInterviewStage] = useState('Implementation & Logic');

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
      text: `Hello Shagun Mehta, welcome to your technical interview for the ${TRACKS[0].defaultRole} role. We are evaluating: ${TRACKS[0].questions[0].title}. Please review the problem constraints on the left, and explain your intuition out loud before typing your code.`,
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
        setDurationSeconds(prev => {
          const next = prev + 1;
          // Dynamically adjust interview stage based on elapsed time & turns
          if (next > 300) setInterviewStage('Optimization & Complexity');
          else if (next > 120) setInterviewStage('Live Implementation');
          return next;
        });
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

      recognition.onerror = () => {
        setIsRecording(false);
        setIsCandidateSpeaking(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
        setIsCandidateSpeaking(false);
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('SpeechRecognition error:', err);
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

  // Text-To-Speech function
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

    const userMsg = {
      sender: 'Candidate',
      text: candidateSpeech,
      timestamp: formatTime(durationSeconds)
    };
    const updatedTranscript = [...transcript, userMsg];
    setTranscript(updatedTranscript);

    setIsAiThinking(true);
    try {
      const response = await conductInterviewTurn({
        apiKey,
        transcript: updatedTranscript,
        candidateSpeech,
        candidateCode: code,
        currentQuestion,
        companyTrack: currentTrack.name,
        role,
        interviewStage
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

  const handleAskCodeReview = async () => {
    setIsReviewingCode(true);
    await handleCandidateTurn("I've finished my code implementation on the canvas. Could you review my logic, time complexity, and any edge-case vulnerabilities?");
    setIsReviewingCode(false);
  };

  const handleAskHint = () => {
    handleCandidateTurn("Could you provide a subtle hint regarding the optimal space-time trade-off?");
  };

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

  const handleStartInterview = (config) => {
    setCandidateName(config.candidateName);
    setCurrentTrack(config.track);
    setCurrentQuestion(config.question);
    setRole(config.role);
    setCode(config.question.starterCode);
    setDurationSeconds(0);
    setTelemetry({ fillerWords: 0, totalTurns: 0, totalWords: 0, wpm: 125 });
    setInterviewStage('Problem Exploration');

    const initialGreeting = `Hello ${config.candidateName}, welcome to your technical interview for the ${config.role} position. Today's problem is ${config.question.title}. Take a moment to read the requirements and explain your proposed approach out loud.`;

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

  const handleSelectGeneratedQuestion = (generatedQ) => {
    setCurrentQuestion(generatedQ);
    setCode(generatedQ.starterCode);
    setDurationSeconds(0);
    setInterviewStage('Problem Exploration');

    const promptText = `New Problem Loaded: ${generatedQ.title} (${generatedQ.difficulty}). Take a look at the requirements on your canvas, and walk me through your initial algorithmic approach out loud.`;
    setTranscript(prev => [
      ...prev,
      {
        sender: 'AI',
        text: promptText,
        timestamp: formatTime(durationSeconds)
      }
    ]);
    speakAiResponse(promptText);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100">
      
      {/* Top Navbar */}
      <Navbar
        apiKey={apiKey}
        onOpenSettings={() => setIsSetupOpen(true)}
        onFinishInterview={handleFinishInterview}
        isInterviewActive={isInterviewActive}
        durationSeconds={durationSeconds}
        isRecording={isRecording}
        onToggleRecording={toggleRecording}
        interviewStage={interviewStage}
      />

      {/* Main Studio: 3 Columns */}
      <main className="flex-1 p-3 grid grid-cols-1 lg:grid-cols-12 gap-3 h-[calc(100vh-3.5rem)] overflow-hidden">
        
        {/* Left: Video Presence & Telemetry (3 cols) */}
        <div className="lg:col-span-3 h-full overflow-hidden">
          <VideoFeed
            candidateName={candidateName}
            isAiSpeaking={isAiSpeaking}
            isCandidateSpeaking={isCandidateSpeaking}
            telemetry={telemetry}
            isRecording={isRecording}
          />
        </div>

        {/* Center: LeetCode-grade Code Canvas & Real Runner (5 cols) */}
        <div className="lg:col-span-5 h-full overflow-hidden">
          <CodeCanvas
            question={currentQuestion}
            code={code}
            onChangeCode={setCode}
            onSubmitCodeReview={handleAskCodeReview}
            isReviewingCode={isReviewingCode}
            onOpenQuestionGenerator={() => setIsGeneratorOpen(true)}
          />
        </div>

        {/* Right: Live Interview Dialogue (4 cols) */}
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

      {/* Dynamic AI Question Generator Modal */}
      <QuestionGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onSelectGeneratedQuestion={handleSelectGeneratedQuestion}
        apiKey={apiKey}
      />

      {/* Track & Recruiter Setup Modal */}
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
