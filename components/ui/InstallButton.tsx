import React from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
interface InstallButtonProps {
  className?: string;
}
const InstallButton: React.FC<InstallButtonProps> = ({ className }) => {
  const { isStandalone, install, deferredPrompt } = usePWAInstall();
  if (isStandalone) return null;
  const handleClick = async () => {
    await install();
  };
  return (
    <button
      onClick={handleClick}
      className={`z-[100] bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 animate-bounce-slow ${className || 'fixed top-4 right-4'}`}
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      <span className="font-semibold">{deferredPrompt ? 'Install App' : 'Add to Home'}</span>
    </button>
  );
};
export default InstallButton;
