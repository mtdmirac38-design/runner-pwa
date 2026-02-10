import React from 'react';
import AnimatedButton from './AnimatedButton';
interface PauseMenuProps {
  onResume: () => void;
  onRestart: () => void;
  onMenu: () => void;
  onSettings: () => void;
}
const PauseMenu: React.FC<PauseMenuProps> = ({
  onResume,
  onRestart,
  onMenu,
  onSettings,
}) => {
  return (
    <div 
      className="absolute inset-0 flex items-center justify-center z-30"
      style={{ animation: 'scaleIn 0.3s ease-out' }}
    >
      {}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
      {}
      <div 
        className="relative z-10 w-80 p-8 rounded-3xl bg-gradient-to-b from-slate-800 to-slate-900
                  border border-slate-700/50 shadow-2xl"
      >
        {}
        <div className="text-center mb-8">
          <div 
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl 
                      bg-gradient-to-br from-blue-500 to-cyan-400 mb-4
                      shadow-lg shadow-blue-500/30"
          >
            <span className="text-3xl">⏸️</span>
          </div>
          <h3 className="text-2xl font-bold text-white">PAUSED</h3>
          <p className="text-slate-400 text-sm mt-1">Take a breather!</p>
        </div>
        {}
        <div className="flex flex-col gap-3">
          <AnimatedButton onClick={onResume} variant="primary" size="md" icon="▶️">
            Resume
          </AnimatedButton>
          <AnimatedButton onClick={onRestart} variant="secondary" size="md" icon="🔄">
            Restart
          </AnimatedButton>
          <AnimatedButton onClick={onSettings} variant="ghost" size="md" icon="⚙️">
            Settings
          </AnimatedButton>
          <div className="h-px bg-slate-700 my-2" />
          <AnimatedButton onClick={onMenu} variant="ghost" size="md" icon="🏠">
            Main Menu
          </AnimatedButton>
        </div>
        {}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl" />
        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl" />
      </div>
    </div>
  );
};
export default PauseMenu;
