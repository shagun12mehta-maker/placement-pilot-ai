import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, Volume2, Mic, Bot, User, AlertCircle } from 'lucide-react';
import AudioWaveform from './AudioWaveform';

export default function VideoFeed({
  candidateName,
  isAiSpeaking,
  isCandidateSpeaking,
  telemetry,
  isRecording
}) {
  const videoRef = useRef(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [cameraError, setCameraError] = useState(null);

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
        console.log('Webcam access not granted or unavailable:', err);
        setCameraError('Camera preview disabled (using student avatar)');
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
      {/* AI Interviewer Avatar Card */}
      <div className="glass-panel rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden flex-1 border border-slate-800">
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-google-blue via-purple-500 to-pink-500" />
        
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-google-green animate-pulse" />
            <span className="text-xs font-semibold text-slate-200">Google Gemini Live Interviewer</span>
          </div>
          <span className="text-[11px] font-mono text-google-blue bg-google-blue/10 px-2 py-0.5 rounded border border-google-blue/20">
            SDE Bar Raiser
          </span>
        </div>

        {/* Center AI Avatar */}
        <div className="flex flex-col items-center justify-center my-auto py-4 z-10">
          <div className="relative">
            {isAiSpeaking && (
              <div className="absolute -inset-3 rounded-full bg-google-blue/20 animate-voice-ripple" />
            )}
            <div className={`h-20 w-20 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl ${
              isAiSpeaking
                ? 'bg-gradient-to-tr from-google-blue to-purple-600 scale-105 shadow-google-blue/40 ring-4 ring-google-blue/30'
                : 'bg-slate-800 border border-slate-700 shadow-black/40'
            }`}>
              <Bot className={`h-10 w-10 ${isAiSpeaking ? 'text-white' : 'text-slate-400'}`} />
            </div>
          </div>
          
          <div className="mt-3 text-center">
            <h4 className="text-sm font-semibold text-white">AI Technical Evaluator</h4>
            <p className="text-xs text-slate-400">
              {isAiSpeaking ? 'Speaking feedback...' : 'Listening to your explanation...'}
            </p>
          </div>

          <div className="mt-2">
            <AudioWaveform isActive={isAiSpeaking} isSpeaking={isAiSpeaking} />
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 z-10">
          <span className="flex items-center gap-1">
            <Volume2 className="h-3 w-3 text-google-blue" /> Adaptive Socratic Mode
          </span>
          <span className="text-emerald-400">Low-Latency Voice</span>
        </div>
      </div>

      {/* Student Webcam Video Preview Card */}
      <div className="glass-panel rounded-2xl p-4 flex flex-col relative overflow-hidden flex-1 border border-slate-800">
        <div className="flex items-center justify-between mb-2 z-10">
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-slate-600'}`} />
            <span className="text-xs font-semibold text-slate-200">Candidate: {candidateName}</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            {hasCamera ? <Camera className="h-3 w-3 text-google-green" /> : <CameraOff className="h-3 w-3 text-slate-500" />}
            {hasCamera ? 'Webcam Live' : 'Avatar Mode'}
          </span>
        </div>

        {/* Video Area */}
        <div className="relative flex-1 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800/80">
          {hasCamera ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform -scale-x-100"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-500 gap-2 p-4 text-center">
              <div className="h-16 w-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-700">
                <User className="h-8 w-8" />
              </div>
              <p className="text-xs text-slate-400 font-medium">{candidateName}</p>
              {cameraError && <p className="text-[10px] text-slate-500">{cameraError}</p>}
            </div>
          )}

          {/* Telemetry Badge Overlay */}
          <div className="absolute bottom-2 left-2 right-2 bg-slate-950/80 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-lg flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Mic className={`h-3 w-3 ${isCandidateSpeaking ? 'text-google-green animate-pulse' : 'text-slate-500'}`} />
              <span>{isCandidateSpeaking ? 'Speaking...' : 'Listening...'}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400 font-mono">
              <span>WPM: <strong className="text-slate-200">{telemetry.wpm || 130}</strong></span>
              <span>Fillers: <strong className={telemetry.fillerWords > 4 ? 'text-amber-400' : 'text-google-green'}>{telemetry.fillerWords}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
