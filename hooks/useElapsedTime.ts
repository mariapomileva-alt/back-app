import { useEffect, useState } from 'react';

export function formatElapsed(seconds: number): string {
  const safe = Math.max(0, seconds);
  const minutes = Math.floor(safe / 60);
  const rest = safe % 60;
  return `${minutes}:${rest.toString().padStart(2, '0')}`;
}

export function useElapsedTime(running: boolean): number {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!running) {
      return;
    }
    const id = setInterval(() => {
      setSeconds((value) => value + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  return seconds;
}
