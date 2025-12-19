
import React, { useState } from 'react';
import { Monster, GameState } from './types';
import { INITIAL_MONSTERS, WILD_MONSTERS } from './constants';
import BattleScene from './components/BattleScene';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [party, setParty] = useState<Monster[]>([]);
  const [currentWildEnemy, setCurrentWildEnemy] = useState<Monster | null>(null);

  const startNewGame = (starter: Monster) => {
    setParty([starter]);
    setGameState('OVERWORLD');
  };

  const encounterWildMonster = () => {
    const randomEnemy = { ...WILD_MONSTERS[Math.floor(Math.random() * WILD_MONSTERS.length)] };
    // Reset enemy stats for new battle
    randomEnemy.currentHp = randomEnemy.maxHp;
    setCurrentWildEnemy(randomEnemy);
    setGameState('BATTLE');
  };

  const handleBattleFinish = ({ victory, captured, updatedPlayerMonster }: { victory: boolean; captured?: boolean; updatedPlayerMonster: Monster }) => {
    // Update party member health/status
    const newParty = [...party];
    newParty[0] = updatedPlayerMonster;
    
    if (captured && currentWildEnemy) {
      newParty.push({ ...currentWildEnemy, currentHp: currentWildEnemy.maxHp });
    }
    
    setParty(newParty);
    setCurrentWildEnemy(null);
    setGameState('OVERWORLD');
  };

  if (gameState === 'MENU') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl text-blue-400 mb-2 drop-shadow-lg text-center">GEMIMON</h1>
        <p className="text-sm text-blue-200 mb-12">The AI-Powered Adventure</p>
        
        <div className="bg-slate-800 p-8 rounded-2xl pixel-border w-full max-w-lg">
          <p className="mb-6 text-center text-xs text-gray-300">CHOOSE YOUR STARTER</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {INITIAL_MONSTERS.map((monster) => (
              <div 
                key={monster.id}
                onClick={() => startNewGame(monster)}
                className="group cursor-pointer bg-slate-700 p-4 rounded-xl border-4 border-transparent hover:border-yellow-400 transition-all flex flex-col items-center"
              >
                <img src={monster.imageUrl} alt={monster.name} className="w-20 h-20 mb-3 pixelated group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold">{monster.name}</span>
                <span className="text-[8px] text-gray-400">{monster.type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'OVERWORLD') {
    return (
      <div className="min-h-screen bg-emerald-800 flex flex-col">
        {/* Top Navbar */}
        <header className="bg-slate-900 p-4 border-b-4 border-black flex justify-between items-center">
          <div className="text-xs">Location: Emerald Forest</div>
          <div className="text-xs">Party Size: {party.length}</div>
        </header>

        {/* Main View Area */}
        <div className="flex-grow relative flex flex-col items-center justify-center space-y-12">
          {/* Party Display */}
          <div className="flex gap-4 p-6 bg-black/30 rounded-3xl overflow-x-auto max-w-full">
            {party.map((m, i) => (
              <div key={i} className="flex flex-col items-center bg-slate-800/80 p-4 rounded-xl border-2 border-white/20 min-w-[120px]">
                <img src={m.imageUrl} alt={m.name} className="w-16 h-16 mb-2 pixelated" />
                <span className="text-[10px]">{m.name}</span>
                <div className="w-full bg-gray-700 h-1 mt-1 rounded">
                  <div className="bg-green-500 h-full rounded" style={{ width: `${(m.currentHp/m.maxHp)*100}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="relative group">
             <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
             <button 
              onClick={encounterWildMonster}
              className="relative px-8 py-6 bg-slate-900 rounded-lg pixel-border text-white text-lg hover:bg-slate-800 active:scale-95 transition-all"
            >
              EXPLORE TALL GRASS
            </button>
          </div>
        </div>

        {/* Bottom Menu */}
        <footer className="bg-slate-900 p-6 border-t-4 border-black grid grid-cols-2 gap-4">
          <button className="bg-blue-600 p-3 rounded-lg text-[10px] border-b-4 border-blue-800 opacity-50 cursor-not-allowed">GEMIDEX (Soon)</button>
          <button onClick={() => setGameState('MENU')} className="bg-red-600 p-3 rounded-lg text-[10px] border-b-4 border-red-800">EXIT GAME</button>
        </footer>
      </div>
    );
  }

  if (gameState === 'BATTLE' && currentWildEnemy && party.length > 0) {
    return (
      <BattleScene 
        playerMonster={party[0]} 
        enemyMonster={currentWildEnemy} 
        onFinish={handleBattleFinish}
      />
    );
  }

  return <div>Loading Game...</div>;
};

export default App;
