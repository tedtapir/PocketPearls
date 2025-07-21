import { useEffect } from 'react';
import { usePearl } from '../state/pearlStore';

export function usePearlTicker() {
  const tick = usePearl(s => s.tick);
  useEffect(() => {
    const id = setInterval(() => tick(), 15000); // check every 15s
    return () => clearInterval(id);
  }, [tick]);
}