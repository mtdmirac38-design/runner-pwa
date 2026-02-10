import React, { useState } from 'react';
import GameCanvas from './components/GameCanvas';
import InstallButton from './components/ui/InstallButton';
const App: React.FC = () => {
  const [isInstalled, setIsInstalled] = useState(false);
  React.useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    setIsInstalled(isStandalone);
  }, []);
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-900 overflow-hidden">
      <InstallButton />
      <GameCanvas />
    </div>
  );
};
export default App;
