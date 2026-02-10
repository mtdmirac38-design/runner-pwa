import { useState, useEffect } from 'react';
interface IBeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}
export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<IBeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  useEffect(() => {
    const checkStandalone = () => {
      const isSta = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
      setIsStandalone(!!isSta);
    };
    checkStandalone();
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as IBeforeInstallPromptEvent);
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);
  const install = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === 'accepted') {
        setIsInstallable(false);
        setDeferredPrompt(null);
      }
      return 'prompted';
    } else {
      return 'instructions';
    }
  };
  return { isInstallable, isStandalone, install, deferredPrompt };
};
