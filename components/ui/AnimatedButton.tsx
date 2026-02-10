import React, { useState } from 'react';
interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}
const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon,
  disabled = false,
  className = '',
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const baseStyles = `
    relative overflow-hidden font-bold rounded-2xl
    transition-all duration-300 ease-out
    flex items-center justify-center gap-3
    disabled:opacity-50 disabled:cursor-not-allowed
    transform hover:scale-105 active:scale-95
  `;
  const variants = {
    primary: `
      bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500
      hover:from-blue-500 hover:via-blue-400 hover:to-cyan-400
      text-white shadow-lg shadow-blue-500/30
      hover:shadow-xl hover:shadow-blue-500/40
    `,
    secondary: `
      bg-gradient-to-r from-slate-700 to-slate-600
      hover:from-slate-600 hover:to-slate-500
      text-white shadow-lg shadow-slate-700/30
      border border-slate-500/50
    `,
    danger: `
      bg-gradient-to-r from-red-600 via-red-500 to-orange-500
      hover:from-red-500 hover:via-red-400 hover:to-orange-400
      text-white shadow-lg shadow-red-500/30
    `,
    ghost: `
      bg-white/10 hover:bg-white/20
      text-white border border-white/20
      backdrop-blur-sm
    `,
  };
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-xl',
  };
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples([...ripples, { x, y, id }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 600);
    onClick();
  };
  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      style={{
        animation: isPressed ? 'none' : undefined,
      }}
    >
      {}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700" />
      </div>
      {}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 animate-ping"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
          }}
        />
      ))}
      {}
      {icon && <span className="text-xl">{icon}</span>}
      {}
      <span className="relative z-10">{children}</span>
      {}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{
          boxShadow: variant === 'primary' 
            ? '0 0 30px rgba(59, 130, 246, 0.5)' 
            : variant === 'danger'
            ? '0 0 30px rgba(239, 68, 68, 0.5)'
            : 'none'
        }}
      />
    </button>
  );
};
export default AnimatedButton;
