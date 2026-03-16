import React, { useState, useEffect } from 'react';

function SessionTimer({ isRunning, startTime, onTimeUpdate }) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (!isRunning || !startTime) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setTime(elapsed);
      onTimeUpdate && onTimeUpdate(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, startTime, onTimeUpdate]);

  const formatTime = (seconds) => {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${secs}`;
  };

  return (
    <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
      <p className="text-xs font-bold text-blue-900 uppercase tracking-wide mb-2">⏱️ Active Session Timer</p>
      <div className="text-3xl font-bold text-blue-600 font-mono">{formatTime(time)}</div>
    </div>
  );
}

export default SessionTimer;
