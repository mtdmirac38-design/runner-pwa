import React, { useState, useCallback, useRef, useEffect } from 'react';
import { inputManager } from '../../services/inputService';
interface ControlsProps {
  onJumpPress: () => void;
}
const Controls: React.FC<ControlsProps> = ({ onJumpPress }) => {
  const [leftPressed, setLeftPressed] = useState(false);
  const [rightPressed, setRightPressed] = useState(false);
  const [jumpPressed, setJumpPressed] = useState(false);
  const [ripple, setRipple] = useState<{ x: number; y: number; show: boolean }>({ x: 0, y: 0, show: false });
  const jumpButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const preventContext = (e: Event) => e.preventDefault();
    document.addEventListener('contextmenu', preventContext);
    return () => document.removeEventListener('contextmenu', preventContext);
  }, []);
  useEffect(() => {
    return () => {
      inputManager.setLeft(false);
      inputManager.setRight(false);
      inputManager.setJump(false);
    };
  }, []);
  const handleLeftStart = useCallback(() => {
    setLeftPressed(true);
    inputManager.setLeft(true);
    if (navigator.vibrate) navigator.vibrate(10);
  }, []);
  const handleLeftEnd = useCallback(() => {
    setLeftPressed(false);
    inputManager.setLeft(false);
  }, []);
  const handleRightStart = useCallback(() => {
    setRightPressed(true);
    inputManager.setRight(true);
    if (navigator.vibrate) navigator.vibrate(10);
  }, []);
  const handleRightEnd = useCallback(() => {
    setRightPressed(false);
    inputManager.setRight(false);
  }, []);
  const handleJump = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    setJumpPressed(true);
    if (jumpButtonRef.current) {
      const rect = jumpButtonRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      setRipple({
        x: clientX - rect.left,
        y: clientY - rect.top,
        show: true,
      });
      setTimeout(() => setRipple(prev => ({ ...prev, show: false })), 400);
    }
    onJumpPress();
    if (navigator.vibrate) navigator.vibrate(25);
    setTimeout(() => setJumpPressed(false), 150);
  }, [onJumpPress]);
  const DirectionButton = ({ 
    direction, 
    isPressed, 
    onStart, 
    onEnd 
  }: { 
    direction: 'left' | 'right';
    isPressed: boolean;
    onStart: () => void;
    onEnd: () => void;
  }) => (
    <button
      onTouchStart={(e) => { e.preventDefault(); onStart(); }}
      onTouchEnd={(e) => { e.preventDefault(); onEnd(); }}
      onTouchCancel={(e) => { e.preventDefault(); onEnd(); }}
      onMouseDown={onStart}
      onMouseUp={onEnd}
      onMouseLeave={onEnd}
      className={`
        relative w-20 h-20 md:w-24 md:h-24 rounded-2xl
        flex items-center justify-center
        transition-all duration-150 select-none
        ${isPressed 
          ? 'bg-white/30 scale-95 shadow-inner' 
          : 'bg-white/10 hover:bg-white/15 shadow-lg'
        }
        backdrop-blur-md border-2
        ${isPressed ? 'border-white/40' : 'border-white/20'}
        active:scale-90
      `}
      style={{
        touchAction: 'none',
      }}
    >
      {}
      <div 
        className={`text-4xl md:text-5xl transition-transform duration-150 ${
          isPressed ? 'scale-90' : ''
        }`}
      >
        {direction === 'left' ? (
          <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        ) : (
          <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
          </svg>
        )}
      </div>
      {}
      {isPressed && (
        <div className="absolute inset-0 rounded-2xl bg-white/20 animate-ping" />
      )}
    </button>
  );
  return (
    <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 pointer-events-none select-none md:hidden">
      <div className="flex items-end justify-between max-w-2xl mx-auto">
        {}
        <div className="pointer-events-auto flex gap-2">
          <DirectionButton 
            direction="left"
            isPressed={leftPressed}
            onStart={handleLeftStart}
            onEnd={handleLeftEnd}
          />
          <DirectionButton 
            direction="right"
            isPressed={rightPressed}
            onStart={handleRightStart}
            onEnd={handleRightEnd}
          />
        </div>
        {}
        <div className="pointer-events-auto">
          <button
            ref={jumpButtonRef}
            onTouchStart={(e) => { e.preventDefault(); handleJump(e); }}
            onMouseDown={handleJump}
            className={`
              relative w-28 h-28 md:w-32 md:h-32 rounded-full
              flex items-center justify-center overflow-hidden
              transition-all duration-150 select-none
              ${jumpPressed 
                ? 'scale-90' 
                : 'hover:scale-105'
              }
              shadow-2xl
            `}
            style={{
              background: jumpPressed 
                ? 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)'
                : 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
              boxShadow: jumpPressed
                ? '0 0 30px rgba(59, 130, 246, 0.3), inset 0 4px 10px rgba(0,0,0,0.3)'
                : '0 0 40px rgba(59, 130, 246, 0.4), 0 10px 40px rgba(0,0,0,0.3)',
              touchAction: 'manipulation',
            }}
          >
            {}
            {ripple.show && (
              <span
                className="absolute rounded-full bg-white/40 animate-ping"
                style={{
                  left: ripple.x - 20,
                  top: ripple.y - 20,
                  width: 40,
                  height: 40,
                }}
              />
            )}
            {}
            <div 
              className={`
                absolute inset-2 rounded-full border-4 
                ${jumpPressed ? 'border-white/10' : 'border-white/20'}
                transition-all duration-150
              `}
            />
            {}
            <div className={`relative z-10 transition-transform duration-150 ${
              jumpPressed ? 'translate-y-1' : '-translate-y-1'
            }`}>
              <svg 
                className="w-12 h-12 md:w-14 md:h-14 text-white drop-shadow-lg" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
              </svg>
            </div>
            {}
            <div 
              className="absolute inset-0 rounded-full opacity-50"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%)',
              }}
            />
            {}
            <span 
              className={`
                absolute bottom-4 text-white/70 text-xs font-bold uppercase tracking-wider
                transition-opacity duration-150
                ${jumpPressed ? 'opacity-0' : 'opacity-100'}
              `}
            >
              JUMP
            </span>
          </button>
        </div>
      </div>
      {}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 pointer-events-none">
        <p className="text-white/30 text-xs text-center animate-pulse">
          Use buttons to move and jump
        </p>
      </div>
    </div>
  );
};
export default Controls;
