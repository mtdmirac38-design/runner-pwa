import React, { useState, useEffect } from 'react';
import AnimatedButton from './AnimatedButton';
import ParticleBackground from '../effects/ParticleBackground';
import Sparkles from '../effects/Sparkles';
import SettingsModal from './SettingsModal';
interface MainMenuProps {
  onStart: () => void;
  highScore: number;
}
const MainMenu: React.FC<MainMenuProps> = ({ onStart, highScore }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);
  return (
    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center z-20 overflow-hidden px-4">
      {}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(-45deg, #0f172a, #1e1b4b, #0c4a6e, #134e4a)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 15s ease infinite',
        }}
      />
      {}
      <ParticleBackground />
      {}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      {}
      <div 
        className={`relative z-10 flex flex-col items-center transition-all duration-1000 w-full max-w-lg mx-auto ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {}
        <div className="relative mb-8 text-center">
          <Sparkles count={15} />
          {}
          <h1 
            className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter select-none"
            style={{
              background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #f472b6 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              textShadow: '0 0 80px rgba(96, 165, 250, 0.5)',
              animation: 'float 3s ease-in-out infinite',
            }}
          >
            SKY
          </h1>
          <h1 
            className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter select-none -mt-2 md:-mt-4"
            style={{
              background: 'linear-gradient(135deg, #f472b6 0%, #60a5fa 50%, #34d399 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              textShadow: '0 0 80px rgba(244, 114, 182, 0.5)',
              animation: 'float 3s ease-in-out infinite',
              animationDelay: '0.5s',
            }}
          >
            RUNNER
          </h1>
          {}
          <p 
            className="text-center text-sm sm:text-lg font-medium mt-4"
            style={{
              background: 'linear-gradient(90deg, #64748b, #94a3b8, #64748b)',
              backgroundSize: '200% auto',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              animation: 'shimmer 3s linear infinite',
            }}
          >
            An Endless Adventure Awaits
          </p>
        </div>
        {}
        {highScore > 0 && (
          <div 
            className="mb-6 md:mb-8 px-4 py-2 md:px-6 md:py-3 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 
                       border border-amber-500/30 backdrop-blur-sm"
            style={{ animation: 'slideDown 0.5s ease-out 0.3s both' }}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl md:text-2xl">🏆</span>
              <div>
                <p className="text-amber-400/70 text-[10px] md:text-xs uppercase tracking-wider">Best Score</p>
                <p className="text-amber-300 font-bold text-lg md:text-xl">{highScore.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
        {}
        <div 
          className="flex flex-col gap-3 md:gap-4 w-64 md:w-72"
          style={{ animation: 'slideUp 0.5s ease-out 0.5s both' }}
        >
          <AnimatedButton 
            onClick={onStart} 
            variant="primary" 
            size="lg"
            icon="🚀"
          >
            START GAME
          </AnimatedButton>
          <AnimatedButton 
            onClick={() => setShowSettings(true)} 
            variant="ghost" 
            size="md"
            icon="⚙️"
          >
            Settings
          </AnimatedButton>
        </div>
        {}
        <div 
          className="mt-8 md:mt-12 hidden sm:grid grid-cols-3 gap-6 text-center"
          style={{ animation: 'slideUp 0.5s ease-out 0.7s both' }}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 
                          flex items-center justify-center text-xl md:text-2xl shadow-lg">
              ⬅️
            </div>
            <span className="text-slate-400 text-xs md:text-sm">Move Left</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 
                          flex items-center justify-center text-xl md:text-2xl shadow-lg">
              ⬆️
            </div>
            <span className="text-slate-400 text-xs md:text-sm">Jump</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 
                          flex items-center justify-center text-xl md:text-2xl shadow-lg">
              ➡️
            </div>
            <span className="text-slate-400 text-xs md:text-sm">Move Right</span>
          </div>
        </div>
      </div>
      {}
      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
};
export default MainMenu;
