import { useEffect, useRef, useCallback } from 'react';
export const useGameLoop = (callback: () => void) => {
  const requestRef = useRef<number | undefined>(undefined);
  const previousTimeRef = useRef<number | undefined>(undefined);
  const animate = useCallback((time: number) => {
    if (previousTimeRef.current !== undefined) {
    }
    previousTimeRef.current = time;
    callback();
    requestRef.current = requestAnimationFrame(animate);
  }, [callback]);
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animate]);
};
