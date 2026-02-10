import React, { useState, useEffect } from 'react';
interface SettingsModalProps {
  onClose: () => void;
}
interface Settings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  vibrationEnabled: boolean;
  showFPS: boolean;
}
const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const [settings, setSettings] = useState<Settings>({
    soundEnabled: true,
    musicEnabled: true,
    vibrationEnabled: true,
    showFPS: false,
  });
  useEffect(() => {
    const saved = localStorage.getItem('skyrunner-settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);
  const updateSetting = (key: keyof Settings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('skyrunner-settings', JSON.stringify(newSettings));
  };
  const ToggleSwitch = ({ 
    enabled, 
    onChange 
  }: { 
    enabled: boolean; 
    onChange: (val: boolean) => void;
  }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
        enabled 
          ? 'bg-gradient-to-r from-blue-500 to-cyan-400' 
          : 'bg-slate-700'
      }`}
    >
      <div
        className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-lg 
                   transition-transform duration-300 ${
                     enabled ? 'translate-x-6' : 'translate-x-0'
                   }`}
      />
    </button>
  );
  return (
    <div 
      className="absolute inset-0 flex items-center justify-center z-40"
      style={{ animation: 'scaleIn 0.3s ease-out' }}
    >
      {}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      {}
      <div 
        className="relative z-10 w-96 max-w-[90vw] rounded-3xl bg-gradient-to-b from-slate-800 to-slate-900
                  border border-slate-700/50 shadow-2xl overflow-hidden"
      >
        {}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500
                          flex items-center justify-center text-2xl shadow-lg"
              >
                ⚙️
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Settings</h3>
                <p className="text-slate-400 text-sm">Customize your experience</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 
                       flex items-center justify-center text-white/70 hover:text-white
                       transition-all duration-300"
            >
              ✕
            </button>
          </div>
        </div>
        {}
        <div className="p-6 space-y-4">
          {}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-4">
              <span className="text-2xl">🔊</span>
              <div>
                <p className="text-white font-medium">Sound Effects</p>
                <p className="text-slate-400 text-sm">Game sounds and effects</p>
              </div>
            </div>
            <ToggleSwitch 
              enabled={settings.soundEnabled} 
              onChange={(val) => updateSetting('soundEnabled', val)} 
            />
          </div>
          {}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-4">
              <span className="text-2xl">🎵</span>
              <div>
                <p className="text-white font-medium">Background Music</p>
                <p className="text-slate-400 text-sm">Ambient game music</p>
              </div>
            </div>
            <ToggleSwitch 
              enabled={settings.musicEnabled} 
              onChange={(val) => updateSetting('musicEnabled', val)} 
            />
          </div>
          {}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-4">
              <span className="text-2xl">📳</span>
              <div>
                <p className="text-white font-medium">Vibration</p>
                <p className="text-slate-400 text-sm">Haptic feedback</p>
              </div>
            </div>
            <ToggleSwitch 
              enabled={settings.vibrationEnabled} 
              onChange={(val) => updateSetting('vibrationEnabled', val)} 
            />
          </div>
          {}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-4">
              <span className="text-2xl">📊</span>
              <div>
                <p className="text-white font-medium">Show FPS</p>
                <p className="text-slate-400 text-sm">Display performance stats</p>
              </div>
            </div>
            <ToggleSwitch 
              enabled={settings.showFPS} 
              onChange={(val) => updateSetting('showFPS', val)} 
            />
          </div>
        </div>
        {}
        <div className="p-6 border-t border-slate-700/50 text-center">
          <p className="text-slate-500 text-sm">
            Sky Runner v1.0.0
          </p>
        </div>
        {}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>
    </div>
  );
};
export default SettingsModal;
