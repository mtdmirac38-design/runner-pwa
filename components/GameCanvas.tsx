import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  CANVAS_HEIGHT, 
  CANVAS_WIDTH, 
  GRAVITY, 
  PLAYER_SIZE, 
  COLOR_PLAYER, 
  COLOR_PLATFORM, 
  COLOR_OBSTACLE,
  JUMP_FORCE,
  MOVE_SPEED,
  WORLD_SPEED_BASE
} from '../constants';
import { Player, Platform, Obstacle, GameState } from '../types';
import { inputManager } from '../services/inputService';
import MainMenu from './ui/MainMenu';
import GameOverScreen from './ui/GameOverScreen';
import HUD from './ui/HUD';
import PauseMenu from './ui/PauseMenu';
import Controls from './ui/Controls';
import SettingsModal from './ui/SettingsModal';
import { useOffline } from '../hooks/useOffline';
import InstallButton from './ui/InstallButton'; 

const GameCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const isOnline = useOffline();
  const [dimensions, setDimensions] = useState({ 
    width: window.innerWidth, 
    height: window.innerHeight 
  });
  const playerRef = useRef<Player>({
    id: 'player',
    pos: { x: 100, y: 300 },
    size: PLAYER_SIZE,
    color: COLOR_PLAYER,
    velocity: { x: 0, y: 0 },
    isGrounded: false,
    canDoubleJump: false,
    invincibilityTime: 0,
  });
  const platformsRef = useRef<Platform[]>([]);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const cameraXRef = useRef(0);
  const scoreRef = useRef(0);
  const difficultyMultiplierRef = useRef(1);
  const lastTimeRef = useRef(0);
  const fpsRef = useRef(60);
  const livesRef = useRef(3);
  const saveGameState = useCallback(() => {
    const gameData = {
      score: scoreRef.current,
      highScore,
      lives: livesRef.current,
      playerPos: playerRef.current.pos,
      cameraX: cameraXRef.current,
      timestamp: Date.now()
    };
    localStorage.setItem('pwa-runner-game-state', JSON.stringify(gameData));
  }, [highScore]);
  const loadGameState = useCallback(() => {
    try {
      const saved = localStorage.getItem('pwa-runner-game-state');
      if (saved) {
        const gameData = JSON.parse(saved);
        if (Date.now() - gameData.timestamp < 24 * 66 * 60 * 60 * 1000) {
          scoreRef.current = gameData.score || 0;
          setScore(gameData.score || 0);
          livesRef.current = gameData.lives || 3;
          setLives(gameData.lives || 3);
          cameraXRef.current = gameData.cameraX || 0;
          platformsRef.current = gameData.platforms || platformsRef.current;
          obstaclesRef.current = gameData.obstacles || obstaclesRef.current;
          if (gameData.playerPos) {
            playerRef.current.pos = gameData.playerPos;
          }
          return true;
        }
      }
    } catch (e) {
      console.log('Failed to load game state:', e);
    }
    return false;
  }, []);
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const initGame = useCallback(() => {
    const loaded = loadGameState();
    if (!loaded) {
      playerRef.current = {
        id: 'player',
        pos: { x: 100, y: dimensions.height / 2 },
        size: PLAYER_SIZE,
        color: COLOR_PLAYER,
        velocity: { x: 0, y: 0 },
        isGrounded: false,
        canDoubleJump: false,
        invincibilityTime: 0,
      };
      platformsRef.current = [
        { id: 'ground', pos: { x: 0, y: dimensions.height - 40 }, size: { width: dimensions.width * 2, height: 40 }, color: COLOR_PLATFORM, type: 'normal' }
      ];
      obstaclesRef.current = [];
      cameraXRef.current = 0;
      scoreRef.current = 0;
      difficultyMultiplierRef.current = 1;
      setScore(0);
      setCombo(0);
      setLives(3);
      livesRef.current = 3;
      setIsNewHighScore(false);
      setIsPaused(false);
      generateLevel(dimensions.width);
    }
  }, [dimensions, loadGameState]);
  const generateLevel = (startX: number) => {
    let currentX = startX;
    const generateCount = 5;
          const height = dimensions.height - (100 + Math.random() * 300); 
    for (let i = 0; i < generateCount; i++) {
      const gap = 100 + Math.random() * 100;
      const width = 150 + Math.random() * 200;
      platformsRef.current.push({
        id: `plat-${Date.now()}-${i}`,
        pos: { x: currentX, y: height },
        size: { width, height: 20 },
        color: COLOR_PLATFORM,
        type: 'normal'
      });
      if (Math.random() > 0.6) {
        obstaclesRef.current.push({
          id: `obs-${Date.now()}-${i}`,
          pos: { x: currentX + width / 2 - 15, y: height - 30 },
          size: { width: 30, height: 30 },
          color: COLOR_OBSTACLE,
          damage: 1
        });
      }
      currentX += width + gap;
    }
  };
  const checkCollision = (rect1: any, rect2: any) => {
    return (
      rect1.pos.x < rect2.pos.x + rect2.size.width &&
      rect1.pos.x + rect1.size.width > rect2.pos.x &&
      rect1.pos.y < rect2.pos.y + rect2.size.height &&
      rect1.pos.y + rect1.size.height > rect2.pos.y
    );
  };
  const update = useCallback((deltaTime: number) => {
    if (gameState !== GameState.PLAYING || isPaused) return;
    const player = playerRef.current;
    const input = inputManager.getState();
    if (player.invincibilityTime > 0) {
      player.invincibilityTime -= deltaTime;
    }
    if (input.left) player.velocity.x = -MOVE_SPEED;
    else if (input.right) player.velocity.x = MOVE_SPEED;
    else player.velocity.x = 0;
    player.pos.x += player.velocity.x * deltaTime * 60;
    if (player.pos.x < cameraXRef.current) {
      player.pos.x = cameraXRef.current;
    }
    player.velocity.y += GRAVITY * deltaTime * 60;
    player.pos.y += player.velocity.y * deltaTime * 60;
    player.isGrounded = false;
    if (player.pos.y > dimensions.height + 100) {
      endGame();
      return;
    }
    for (const plat of platformsRef.current) {
      if (
        player.pos.y + player.size.height <= plat.pos.y + plat.size.height &&
        player.pos.y + player.size.height + player.velocity.y >= plat.pos.y &&
        player.pos.x + player.size.width > plat.pos.x &&
        player.pos.x < plat.pos.x + plat.size.width &&
        player.velocity.y >= 0
      ) {
        player.isGrounded = true;
        player.velocity.y = 0;
        player.pos.y = plat.pos.y - player.size.height;
        player.canDoubleJump = true;
      }
    }
    for (const obs of obstaclesRef.current) {
      if (checkCollision(player, obs) && player.invincibilityTime <= 0) {
        livesRef.current -= obs.damage;
        setLives(livesRef.current);
        if (livesRef.current <= 0) {
          endGame();
        } else {
          player.velocity.y = JUMP_FORCE * 0.3;
          player.pos.x -= 20;
        }
        return;
      }
    }
    const targetCameraX = player.pos.x - dimensions.width / 3;
    if (targetCameraX > cameraXRef.current) {
      cameraXRef.current = targetCameraX;
    }
    const newScore = Math.floor((player.pos.x - 100) / 10); 
    if (newScore > scoreRef.current) {
      scoreRef.current = newScore;
      setScore(newScore);
    }
    const lastPlatform = platformsRef.current[platformsRef.current.length - 1];
    if (lastPlatform.pos.x < cameraXRef.current + dimensions.width + 200) {
      generateLevel(lastPlatform.pos.x + lastPlatform.size.width + 150);
      difficultyMultiplierRef.current += 0.05;
    }
    platformsRef.current = platformsRef.current.filter(p => p.pos.x + p.size.width > cameraXRef.current - 100);
    obstaclesRef.current = obstaclesRef.current.filter(o => o.pos.x + o.size.width > cameraXRef.current - 100);
    if (Math.floor(Date.now() / 1000) % 5 === 0) {
      saveGameState();
    }
  }, [gameState, isPaused, dimensions, saveGameState]);
  const endGame = () => {
    setGameState(GameState.GAME_OVER);
    if (scoreRef.current > highScore) {
      setHighScore(Math.floor(scoreRef.current));
      setIsNewHighScore(true);
      localStorage.setItem('pwa-runner-highscore', Math.floor(scoreRef.current).toString());
    }
  };
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const gradient = ctx.createLinearGradient(0, 0, 0, dimensions.height);
    gradient.addColorStop(0, '#0f172a');
    gradient.addColorStop(0.5, '#1e293b');
    gradient.addColorStop(1, '#334155');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);
    ctx.fillStyle = 'white';
    for (let i = 0; i < 50; i++) {
      const x = (i * 97 + cameraXRef.current * 0.1) % dimensions.width;
      const y = (i * 53) % (dimensions.height / 2);
      const size = (i % 3) + 1;
      ctx.globalAlpha = 0.3 + (i % 5) * 0.1;
      ctx.fillRect(x, y, size, size);
    }
    ctx.globalAlpha = 1;
    ctx.save();
    ctx.translate(-cameraXRef.current, 0);
    platformsRef.current.forEach(p => {
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(p.pos.x + 5, p.pos.y + 5, p.size.width, p.size.height);
      const platGradient = ctx.createLinearGradient(p.pos.x, p.pos.y, p.pos.x, p.pos.y + p.size.height);
      platGradient.addColorStop(0, '#475569');
      platGradient.addColorStop(1, '#334155');
      ctx.fillStyle = platGradient;
      ctx.fillRect(p.pos.x, p.pos.y, p.size.width, p.size.height);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(p.pos.x, p.pos.y, p.size.width, 4);
      ctx.fillStyle = '#22c55e';
      for (let gx = p.pos.x; gx < p.pos.x + p.size.width; gx += 8) {
        const grassHeight = 4 + Math.sin(gx * 0.5) * 2;
        ctx.fillRect(gx, p.pos.y - grassHeight, 3, grassHeight);
      }
    });
    obstaclesRef.current.forEach(o => {
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 15;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(o.pos.x, o.pos.y + o.size.height);
      ctx.lineTo(o.pos.x + o.size.width / 2, o.pos.y);
      ctx.lineTo(o.pos.x + o.size.width, o.pos.y + o.size.height);
      ctx.fill();
      ctx.fillStyle = '#fca5a5';
      ctx.beginPath();
      ctx.moveTo(o.pos.x + 5, o.pos.y + o.size.height);
      ctx.lineTo(o.pos.x + o.size.width / 2, o.pos.y + 5);
      ctx.lineTo(o.pos.x + o.size.width / 2, o.pos.y + o.size.height);
      ctx.fill();
      ctx.shadowBlur = 0;
    });
    const p = playerRef.current;
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(
      p.pos.x + p.size.width / 2, 
      p.pos.y + p.size.height + 5, 
      p.size.width / 2 - 5, 
      8, 
      0, 0, Math.PI * 2
    );
    ctx.fill();
    ctx.shadowColor = '#3b82f6';
    ctx.shadowBlur = 20;
    const playerGradient = ctx.createLinearGradient(p.pos.x, p.pos.y, p.pos.x + p.size.width, p.pos.y + p.size.height);
    playerGradient.addColorStop(0, '#60a5fa');
    playerGradient.addColorStop(1, '#3b82f6');
    ctx.fillStyle = playerGradient;
    if (p.invincibilityTime > 0) {
      ctx.globalAlpha = 0.5;
    }
    ctx.beginPath();
    ctx.roundRect(p.pos.x, p.pos.y, p.size.width, p.size.height, 8);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'white';
    ctx.fillRect(p.pos.x + 25, p.pos.y + 12, 10, 10);
    ctx.fillRect(p.pos.x + 25, p.pos.y + 12, 10, 10);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(p.pos.x + 28, p.pos.y + 15, 4, 4);
    ctx.fillStyle = 'white';
    ctx.fillRect(p.pos.x + 22, p.pos.y + 28, 12, 4);
    ctx.globalAlpha = 1;
    ctx.restore();
      }, [dimensions]); 

  const tick = useCallback((timestamp: number) => {
    const deltaTime = lastTimeRef.current ? (timestamp - lastTimeRef.current) / 1000 : 0.016;
    lastTimeRef.current = timestamp;
    fpsRef.current = 1 / deltaTime;
    draw();
    requestRef.current = requestAnimationFrame(tick);
  }, [update, draw]);
  useEffect(() => {
    const saved = localStorage.getItem('pwa-runner-highscore');
    if (saved) setHighScore(parseInt(saved));
  }, []);
  useEffect(() => {
    requestRef.current = requestAnimationFrame(tick);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [tick]);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== GameState.PLAYING) return;
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        handleJump();
      }
      if (e.code === 'Escape') {
        setIsPaused(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, isPaused]); 
  const handleJump = () => {
    if (gameState !== GameState.PLAYING || isPaused) return;
    const p = playerRef.current;
    if (p.isGrounded) {
      p.velocity.y = JUMP_FORCE;
      p.isGrounded = false;
    } else if (p.canDoubleJump) {
      p.velocity.y = JUMP_FORCE * 0.8;
      p.canDoubleJump = false;
    }
  };
  const startGame = (restart = false) => {
    if (restart) {
      localStorage.removeItem('pwa-runner-game-state');
    }
    initGame();
    setGameState(GameState.PLAYING);
  };
  const goToMenu = () => {
    setGameState(GameState.MENU);
    setIsPaused(false);
  };
  const togglePause = () => {
    setIsPaused(prev => !prev);
  };
  return (
    <div className="relative w-full h-screen bg-slate-900 overflow-hidden">
      {}
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full block"
      />
      {}
      {gameState === GameState.PLAYING && !isPaused && (
        <HUD 
          score={score}
          highScore={highScore}
          combo={combo}
          lives={lives}
          isOnline={isOnline}
          onPause={togglePause}
        />
      )}
      {}
      {gameState === GameState.MENU && (
        <MainMenu onStart={() => startGame(true)} highScore={highScore} />
      )}
      {}
      {gameState === GameState.GAME_OVER && (
        <GameOverScreen 
          score={score}
          highScore={highScore}
          isNewHighScore={isNewHighScore}
          onRestart={() => startGame(true)}
          onMenu={goToMenu}
        />
      )}
      {}
      {gameState === GameState.PLAYING && isPaused && (
        <PauseMenu 
          onResume={togglePause}
          onRestart={() => startGame(true)}
          onMenu={goToMenu}
          onSettings={() => setShowSettings(true)}
        />
      )}
      {}
      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}
      {}
      {gameState === GameState.PLAYING && !isPaused && (
        <>
          <Controls onJumpPress={handleJump} />
          {}
          <div className="hidden md:block absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 text-sm font-mono pointer-events-none">
             WASD / ARROWS to Move & Jump - ESC to Pause
          </div>
        </>
      )}
      {}
      {dimensions.height > dimensions.width && (
        <div className="absolute inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center p-8 text-center">
          <svg className="w-24 h-24 text-white mb-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          <div className="text-3xl font-bold text-white mb-4">Please Rotate Device</div>
          <p className="text-slate-400">SkyRunner works best in landscape mode.</p>
          <div className="mt-8 hidden md:block">
            <InstallButton className="static transform-none" />
          </div>
        </div>
      )}
    </div>
  );
};
export default GameCanvas;
