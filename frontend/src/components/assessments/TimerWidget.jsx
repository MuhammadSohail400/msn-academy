import React, { useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

export default function TimerWidget({ secondsLeft, setSecondsLeft }) {
  useEffect(() => {
    if (secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, setSecondsLeft]);

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  const isWarning = secondsLeft < 900; // < 15 mins
  const isCritical = secondsLeft < 300; // < 5 mins

  const formatNumber = (num) => String(num).padStart(2, '0');

  return (
    <div 
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono font-bold text-xs transition-all ${
        isCritical
          ? 'bg-rose-100 border-rose-300 text-rose-700 animate-pulse'
          : isWarning
          ? 'bg-amber-100 border-amber-300 text-amber-800'
          : 'bg-gray-100 border-gray-200 text-gray-800'
      }`}
    >
      {isCritical ? (
        <AlertTriangle className="h-4 w-4 text-rose-600 animate-bounce" />
      ) : (
        <Clock className="h-4 w-4 text-gray-600" />
      )}
      <span className="text-[11px] font-sans font-medium text-gray-500 uppercase hidden md:inline">Time:</span>
      <span className="text-sm">
        {formatNumber(hours)}:{formatNumber(minutes)}:{formatNumber(seconds)}
      </span>
    </div>
  );
}
