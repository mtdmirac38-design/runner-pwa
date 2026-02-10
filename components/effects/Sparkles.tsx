import React, { useEffect, useState } from 'react';
interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}
interface SparklesProps {
  count?: number;
  colors?: string[];
}
const Sparkles: React.FC<SparklesProps> = ({ 
  count = 20,
  colors = ['#fbbf24', '#60a5fa', '#f472b6', '#34d399']
}) => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  useEffect(() => {
    const generateSparkle = (): Sparkle => ({
      id: Math.random(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 10 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
    });
    setSparkles(Array.from({ length: count }, generateSparkle));
    const interval = setInterval(() => {
      setSparkles(prev => {
        const newSparkles = [...prev];
        const randomIndex = Math.floor(Math.random() * newSparkles.length);
        newSparkles[randomIndex] = generateSparkle();
        return newSparkles;
      });
    }, 300);
    return () => clearInterval(interval);
  }, [count ]);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {sparkles.map(sparkle => (
        <svg
          key={sparkle.id}
          className="absolute"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: sparkle.size,
            height: sparkle.size,
            animation: 'sparkle 1.5s ease-in-out infinite',
            animationDelay: `${Math.random() * 2}s`,
          }}
          viewBox="0 0 24 24"
          fill={sparkle.color}
        >
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      ))}
    </div>
  );
};
export default Sparkles;
