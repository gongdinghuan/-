
import React from 'react';

interface StatusBarProps {
  name: string;
  level: number;
  currentHp: number;
  maxHp: number;
}

const StatusBar: React.FC<StatusBarProps> = ({ name, level, currentHp, maxHp }) => {
  const hpPercentage = Math.max(0, (currentHp / maxHp) * 100);
  const barColor = hpPercentage > 50 ? 'bg-green-400' : hpPercentage > 20 ? 'bg-yellow-400' : 'bg-red-500';

  return (
    <div className="bg-white/90 p-3 rounded-xl border-4 border-black text-black w-64 shadow-lg">
      <div className="flex justify-between items-center mb-1">
        <span className="font-bold text-sm uppercase">{name}</span>
        <span className="text-xs">Lv{level}</span>
      </div>
      <div className="relative h-4 bg-gray-300 rounded-full border-2 border-black overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ${barColor}`} 
          style={{ width: `${hpPercentage}%` }}
        />
      </div>
      <div className="text-right text-[10px] mt-1">
        HP {currentHp}/{maxHp}
      </div>
    </div>
  );
};

export default StatusBar;
