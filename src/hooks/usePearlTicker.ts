import { useEffect } from 'react';
import { usePearl } from '../state/pearlStore';

export function usePearlTicker() {
  const tick = usePearl(s => s.tick);
  useEffect(() => {
    const id = setInterval(() => tick(), 10000); // check every 10s for more responsive decay
    return () => clearInterval(id);
  }, [tick]);
}