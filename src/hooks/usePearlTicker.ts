import { useEffect } from 'react';
import { usePearl } from '../state/pearlStore';

export function usePearlTicker() {
  const tick = usePearl(s => s.tick);
  useEffect(() => {
    const id = setInterval(() => tick(), 5000); // check every 5s for more responsive decay
    return () => clearInterval(id);
  }, [tick]);
}