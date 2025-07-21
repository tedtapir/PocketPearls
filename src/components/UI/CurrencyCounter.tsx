import React from 'react';
import { usePearl } from '../../state/pearlStore';

export const CurrencyCounter: React.FC = () => {
  const { currency } = usePearl();

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full shadow-lg">
      <div className="flex items-center gap-2">
        <span className="text-lg">💎</span>
        <span className="font-bold">{currency}</span>
      </div>
    </div>
  );
};