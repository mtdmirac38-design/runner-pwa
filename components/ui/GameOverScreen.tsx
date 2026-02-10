import React, { useEffect, useState } from 'react';
import AnimatedButton from './AnimatedButton';
interface GameOverScreenProps {
  score: number;
  highScore: number;
  isNewHighScore: boolean;
  onRestart: () => void;
  onMenu: () => void;
}
const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score,
  highScore,
  isNewHighScore,
  onRestart,
  onMenu,
}) => {
  const [showContent, setShowContent] = useState(false);
  const [countedScore, setCountedScore] = useState(0);
  useEffect(() => {
    document.body.style.animation = 'shake 0.5s ease-out';
    setTimeout(() => {
      document.body.style.animation = '';
    }, 500);
    setTimeout(() => setShowContent(true), 300);
    const duration = 1500;
    const steps = 60;
    const increment = score / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setCountedScore(score);
        clearInterval(timer);
      } else {
        setCountedScore(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [score]);
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 overflow-hidden">
      {}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(-45deg, #450a0a, #7f1d1d, #991b1b, #b91c1c)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 10s ease infinite',
        }}
      />
      {}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polygon points="0,0 30,0 20,50 0,40" fill="rgba(255,255,255,0.1)" />
          <polygon points="30,0 60,0 55,30 20,50" fill="rgba(255,255,255,0.05)" />
          <polygon points="60,0 100,0 100,25 70,40 55,30" fill="rgba(255,255,255,0.08)" />
          <polygon points="0,40 20,50 30,100 0,100" fill="rgba(255,255,255,0.06)" />
          <polygon points="70,40 100,25 100,100 50,100 55,60" fill="rgba(255,255,255,0.04)" />
        </svg>
      </div>
      {}
      <div 
        className={`relative z-10 flex flex-col items-center transition-all duration-700 ${
          showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}
      >
        {}
        <div className="relative">
          <h2 
            className="text-5xl md:text-7xl font-black text-white mb-2 tracking-tight"
            style={{
              textShadow: '0 0 40px rgba(255,0,0,0.5), 0 4px 0 #7f1d1d',
            }}
          >
            GAME OVER
          </h2>
          {}
          <div 
            className="absolute -top-8 -right-8 text-6xl"
            style={{ animation: 'float 2s ease-in-out infinite' }}
          >
            💀
          </div>
        </div>
        {}
        <div 
          className="mt-8 p-8 rounded-3xl bg-black/30 backdrop-blur-md border border-white/10"
          style={{ animation: 'bounceIn 0.6s ease-out 0.3s both' }}
        >
          <div className="text-center">
            <p className="text-red-300/70 text-sm uppercase tracking-widest mb-2">Your Score</p>
            <p 
              className="text-6xl md:text-7xl font-black text-white"
              style={{
                textShadow: '0 0 30px rgba(255,255,255,0.3)',
              }}
            >
              {countedScore.toLocaleString()}
            </p>
          </div>
          {}
          {isNewHighScore && (
            <div 
              className="mt-4 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 
                        text-black font-bold text-sm flex items-center justify-center gap-2"
              style={{ animation: 'bounceIn 0.5s ease-out 1s both' }}
            >
              <span className="text-lg">🎉</span>
              NEW HIGH SCORE!
              <span className="text-lg">🎉</span>
            </div>
          )}
          {}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-xl bg-white/5">
              <p className="text-red-300/50 text-xs uppercase">High Score</p>
              <p className="text-white font-bold text-lg">{highScore.toLocaleString()}</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/5">
              <p className="text-red-300/50 text-xs uppercase">Rank</p>
              <p className="text-white font-bold text-lg">
                {score > 5000 ? '🥇' : score > 2000 ? '🥈' : score > 500 ? '🥉' : '🎮'}
              </p>
            </div>
          </div>
        </div>
        {}
        <div 
          className="mt-8 flex flex-col sm:flex-row gap-4"
          style={{ animation: 'slideUp 0.5s ease-out 0.5s both' }}
        >
          <AnimatedButton 
            onClick={onRestart}
            variant="primary"
            size="lg"
            icon="🔄"
          >
            TRY AGAIN
          </AnimatedButton>
          <AnimatedButton 
            onClick={onMenu}
            variant="ghost"
            size="lg"
            icon="🏠"
          >
            MAIN MENU
          </AnimatedButton>
        </div>
        {}
        <button 
          className="mt-6 px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 
                   text-white/70 hover:text-white text-sm flex items-center gap-2
                   transition-all duration-300 border border-white/10"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'Sky Runner',
                text: `I scored ${score} points in Sky Runner! Can you beat me?`,
              });
            }
          }}
        >
          <span>📤</span> Share Score
        </button>
      </div>
    </div>
  );
};
export default GameOverScreen;
