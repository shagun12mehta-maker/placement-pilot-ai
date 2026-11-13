import React from 'react';

export default function AudioWaveform({ isActive, isSpeaking }) {
  const bars = [16, 28, 42, 65, 34, 80, 52, 95, 40, 70, 30, 85, 45, 60, 25];

  return (
    <div className="flex items-center gap-1 h-8 px-2">
      {bars.map((height, i) => (
        <span
          key={i}
          className={`w-1 rounded-full transition-all duration-150 ${
            isActive
              ? isSpeaking
                ? 'bg-gradient-to-t from-google-blue to-purple-400'
                : 'bg-google-green'
              : 'bg-slate-700'
          }`}
          style={{
            height: isActive ? `${Math.max(6, (height * (Math.sin(Date.now() / 200 + i) + 1.2) * 0.4))}px` : '4px',
          }}
        />
      ))}
    </div>
  );
}
