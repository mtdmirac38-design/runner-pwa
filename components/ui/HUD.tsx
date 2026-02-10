import React, { useEffect, useState, useRef } from 'react';
interface HUDProps {
  score: number;
  highScore: number;
  combo?: number;
  lives?: number;
  isPaused?: boolean;
  isOnline?: boolean;
  onPause?: () => void;
}
const HUD: React.FC<HUDProps> = ({
  score,
  highScore,
  combo = 0,
  lives = 3,
  isPaused = false,
  isOnline = true,
  onPause,
}) => {
  const [displayScore, setDisplayScore] = useState(score);
  const [scoreChanged, setScoreChanged] = useState(false);
  const [showComboEffect, setShowComboEffect] = useState(false);
  const prevScoreRef = useRef(score);
  useEffect(() => {
    if (score !== prevScoreRef.current) {
      setScoreChanged(true);
      setTimeout(() => setScoreChanged(false), 200);
      const diff = score - prevScoreRef.current;
      const steps = 10;
      const increment = diff / steps;
      let current = prevScoreRef.current;
      const timer = setInterval(() => {
        current += increment;
        if (current >= score) {
          setDisplayScore(score);
          clearInterval(timer);
        } else {
          setDisplayScore(Math.floor(current));
        }
      }, 20);
      prevScoreRef.current = score;
      return () => clearInterval(timer);
    }
  }, [score]);
  useEffect(() => {
    if (combo > 0) {
      setShowComboEffect(true);
      setTimeout(() => setShowComboEffect(false), 500);
    }
  }, [combo]);
  return (
    <div className="absolute inset-x-0 top-0 p-4 pointer-events-none z-10">
      <div className="flex items-start justify-between">
        {}
        <div className="flex flex-col gap-2">
          {}
          <div 
            className="px-5 py-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10
                      shadow-lg shadow-black/20"
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 
                          flex items-center justify-center text-xl shadow-lg shadow-blue-500/30"
              >
                ⭐
              </div>
              <div>
                <p className="text-blue-300/70 text-xs uppercase tracking-wider font-medium">Score</p>
                <p 
                  className={`text-2xl font-black text-white transition-transform duration-200 ${
                    scoreChanged ? 'scale-125 text-yellow-400' : ''
                  }`}
                >
                  {displayScore.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          {}
          <div 
            className="px-4 py-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/5
                      flex items-center gap-2"
          >
            <span className="text-amber-400">🏆</span>
            <span className="text-slate-400 text-sm">{highScore.toLocaleString()}</span>
          </div>
          {}
          {combo > 1 && (
            <div 
              className={`px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/30 to-pink-500/30 
                        backdrop-blur-sm border border-purple-400/30 
                        transform transition-all duration-300 ${
                          showComboEffect ? 'scale-110' : 'scale-100'
                        }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">🔥</span>
                <div>
                  <p className="text-purple-300 text-xs">COMBO</p>
                  <p className="text-white font-bold text-lg">x{combo}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        {}
        <div className="flex flex-col items-end gap-3 pointer-events-auto">
          {}
          <button
            onClick={onPause}
            className="w-12 h-12 rounded-xl bg-black/40 backdrop-blur-md border border-white/10
                     flex items-center justify-center text-2xl text-white/70 hover:text-white
                     hover:bg-white/10 transition-all duration-300 shadow-lg"
          >
            {isPaused ? '▶️' : '⏸️'}
          </button>
          {}
          <div 
            className="px-4 py-2 rounded-xl bg-black/40 backdrop-blur-md border border-white/10
                      flex items-center gap-1"
          >
            {Array.from({ length: 3 }).map((_, i) => (
              <span 
                key={i}
                className={`text-xl transition-all duration-300 ${
                  i < lives ? 'opacity-100 scale-100' : 'opacity-30 scale-75'
                }`}
              >
                ❤️
              </span>
            ))}
          </div>
        </div>
      </div>
      {}
      <div className="absolute top-4 left-1/2 -translate-x-1/2">
        <div 
          className="px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10
                    flex items-center gap-2"
        >
          <span className="text-slate-400 text-sm">📍</span>
          <span className="text-white font-mono text-sm">{Math.floor(score / 10)}m</span>
        </div>
      </div>
      {}
      {!isOnline && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2">
          <div 
            className="px-4 py-2 rounded-full bg-red-500/20 backdrop-blur-md border border-red-400/30
                      flex items-center gap-2 animate-pulse"
          >
            <span className="text-red-400 text-sm">📶</span>
            <span className="text-red-300 font-medium text-sm">
              Offline Mode
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
export default HUD;
