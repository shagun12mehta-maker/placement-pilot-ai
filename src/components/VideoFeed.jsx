import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, Mic, MicOff, Volume2, User, Bot, Activity } from 'lucide-react';

export default function VideoFeed({
  candidateName,
  isAiSpeaking,
  isCandidateSpeaking,
  telemetry,
  isRecording
}) {
  const videoRef = useRef(null);
  const [hasCamera, setHasCamera] = useState(false);

  useEffect(() => {
    let stream = null;
    async function setupCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 360 } },
          audio: false
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasCamera(true);
        }
      } catch (err) {
        setHasCamera(false);
      }
    }
    setupCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="flex flex-col gap-3 h-full">
      
      {/* Tile 1: AI Interviewer (Google Meet style) */}
      <div className={`bg-slate-900 border rounded-xl p-3 flex flex-col justify-between relative overflow-hidden flex-1 transition-all ${
        isAiSpeaking ? 'border-blue-500 shadow-md shadow-blue-500/10' : 'border-slate-800'
      }`}>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${isAiSpeaking ? 'bg-blue-400 animate-ping' : 'bg-slate-500'}`} />
            <span className="font-semibold text-slate-200 text-[11px]">Google Technical Evaluator</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-1.5 py-0.5 rounded">
            Interviewer
          </span>
        </div>

        {/* Center Recruiter Presence */}
        <div className="flex flex-col items-center justify-center my-auto py-2">
          <div className={`h-14 w-14 rounded-full flex items-center justify-center transition-all ${
            isAiSpeaking ? 'bg-blue-600 text-white ring-4 ring-blue-500/30' : 'bg-slate-800 text-slate-400'
          }`}>
            <Bot className="h-7 w-7" />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {isAiSpeaking ? 'Speaking feedback...' : 'Listening...'}
          </p>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800/80 pt-1.5">
          <span className="flex items-center gap-1">
            <Volume2 className="h-3 w-3" /> Voice Stream
          </span>
          <span className="text-emerald-400">Gemini Live</span>
        </div>
      </div>

      {/* Tile 2: Candidate Video (Google Meet style) */}
      <div className={`bg-slate-900 border rounded-xl p-3 flex flex-col justify-between relative overflow-hidden flex-1 transition-all ${
        isCandidateSpeaking ? 'border-emerald-500 shadow-md shadow-emerald-500/10' : 'border-slate-800'
      }`}>
        <div className="flex items-center justify-between text-xs mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${isRecording ? 'bg-red-500' : 'bg-slate-500'}`} />
            <span className="font-semibold text-slate-200 text-[11px]">{candidateName} (You)</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400 text-[10px]">
            {isRecording ? <Mic className="h-3 w-3 text-red-400" /> : <MicOff className="h-3 w-3 text-slate-500" />}
            {hasCamera ? <Camera className="h-3 w-3 text-emerald-400" /> : <CameraOff className="h-3 w-3 text-slate-500" />}
          </div>
        </div>

        {/* Video Canvas */}
        <div className="relative flex-1 bg-slate-950 rounded-lg overflow-hidden flex items-center justify-center border border-slate-800/60">
          {hasCamera ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform -scale-x-100"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-500 gap-1.5 p-2">
              <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
                <User className="h-6 w-6" />
              </div>
              <p className="text-[11px] text-slate-400">{candidateName}</p>
            </div>
          )}
        </div>

        {/* Real Speech Telemetry Footer */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5 mt-1 font-mono">
          <span className="flex items-center gap-1">
            <Activity className="h-3 w-3 text-blue-400" />
            <span>Pacing: <strong>{telemetry.wpm || 130} WPM</strong></span>
          </span>
          <span>
            Fillers: <strong className={telemetry.fillerWords > 4 ? 'text-amber-400' : 'text-emerald-400'}>{telemetry.fillerWords}</strong>
          </span>
        </div>

      </div>

    </div>
  );
}
