
import React, { useState, useEffect, useCallback } from 'react';
import { Monster, Move, BattleState } from '../types';
import StatusBar from './StatusBar';
import { getBattleCommentary, getVictoryText } from '../services/geminiService';

interface BattleSceneProps {
  playerMonster: Monster;
  enemyMonster: Monster;
  onFinish: (result: { victory: boolean; captured?: boolean; updatedPlayerMonster: Monster }) => void;
}

const BattleScene: React.FC<BattleSceneProps> = ({ playerMonster, enemyMonster, onFinish }) => {
  const [battle, setBattle] = useState<BattleState>({
    playerMonster: { ...playerMonster },
    enemyMonster: { ...enemyMonster },
    turn: playerMonster.speed >= enemyMonster.speed ? 'PLAYER' : 'ENEMY',
    isVictory: false,
    isDefeat: false,
    isCaptured: false,
    logs: [`A wild ${enemyMonster.name} appeared!`],
  });

  const [isAnimating, setIsAnimating] = useState(false);

  const addLog = (msg: string) => {
    setBattle(prev => ({ ...prev, logs: [msg, ...prev.logs].slice(0, 5) }));
  };

  const calculateDamage = (attacker: Monster, defender: Monster, move: Move) => {
    // Basic Pokémon damage formula simplified
    const baseDamage = (((2 * attacker.level / 5 + 2) * move.power * attacker.attack / defender.defense) / 50 + 2);
    // Type modifiers (Hardcoded for simplicity)
    let modifier = 1;
    if (move.type === 'FIRE' && defender.type === 'GRASS') modifier = 2;
    if (move.type === 'FIRE' && defender.type === 'WATER') modifier = 0.5;
    if (move.type === 'WATER' && defender.type === 'FIRE') modifier = 2;
    if (move.type === 'WATER' && defender.type === 'GRASS') modifier = 0.5;
    if (move.type === 'GRASS' && defender.type === 'WATER') modifier = 2;
    if (move.type === 'GRASS' && defender.type === 'FIRE') modifier = 0.5;
    
    const random = Math.random() * (1 - 0.85) + 0.85;
    return Math.floor(baseDamage * modifier * random);
  };

  const executeMove = useCallback(async (move: Move, isPlayer: boolean) => {
    if (isAnimating) return;
    setIsAnimating(true);

    const attacker = isPlayer ? battle.playerMonster : battle.enemyMonster;
    const defender = isPlayer ? battle.enemyMonster : battle.playerMonster;

    const damage = calculateDamage(attacker, defender, move);
    const newDefenderHp = Math.max(0, defender.currentHp - damage);

    // AI Flavor text
    const commentary = await getBattleCommentary(
      attacker.name,
      defender.name,
      move.name,
      false,
      'NORMAL'
    );
    addLog(commentary);

    if (isPlayer) {
      setBattle(prev => ({
        ...prev,
        enemyMonster: { ...prev.enemyMonster, currentHp: newDefenderHp },
        turn: 'ENEMY'
      }));
    } else {
      setBattle(prev => ({
        ...prev,
        playerMonster: { ...prev.playerMonster, currentHp: newDefenderHp },
        turn: 'PLAYER'
      }));
    }

    if (newDefenderHp === 0) {
      if (isPlayer) {
        const victoryMsg = await getVictoryText(attacker.name, defender.name);
        addLog(victoryMsg);
        setBattle(prev => ({ ...prev, isVictory: true }));
      } else {
        addLog(`${attacker.name} defeated ${defender.name}!`);
        setBattle(prev => ({ ...prev, isDefeat: true }));
      }
    }

    setIsAnimating(false);
  }, [battle, isAnimating]);

  const handleCapture = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    addLog("You threw a Gemiball!");
    
    // Catch rate based on HP remaining
    const hpRatio = battle.enemyMonster.currentHp / battle.enemyMonster.maxHp;
    const success = Math.random() > hpRatio;

    setTimeout(() => {
      if (success) {
        addLog(`Gotcha! ${battle.enemyMonster.name} was caught!`);
        setBattle(prev => ({ ...prev, isCaptured: true }));
      } else {
        addLog("Oh no! The wild Gemimon broke free!");
        setBattle(prev => ({ ...prev, turn: 'ENEMY' }));
      }
      setIsAnimating(false);
    }, 1000);
  };

  // Enemy AI Turn
  useEffect(() => {
    if (battle.turn === 'ENEMY' && !battle.isVictory && !battle.isDefeat && !battle.isCaptured && !isAnimating) {
      const timer = setTimeout(() => {
        const randomMove = battle.enemyMonster.moves[Math.floor(Math.random() * battle.enemyMonster.moves.length)];
        executeMove(randomMove, false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [battle.turn, battle.isVictory, battle.isDefeat, battle.isCaptured, isAnimating, executeMove, battle.enemyMonster.moves]);

  if (battle.isVictory || battle.isDefeat || battle.isCaptured) {
    return (
      <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center p-4 z-50">
        <div className="bg-white p-8 rounded-2xl pixel-border text-black text-center max-w-sm">
          <h2 className="text-2xl mb-4 font-bold">{battle.isVictory ? 'VICTORY!' : battle.isCaptured ? 'CAUGHT!' : 'DEFEATED...'}</h2>
          <p className="mb-6">{battle.isVictory ? 'You gained 50 EXP!' : battle.isCaptured ? 'A new friend joins your party.' : 'Hurry back to the center.'}</p>
          <button 
            onClick={() => onFinish({ 
              victory: battle.isVictory, 
              captured: battle.isCaptured,
              updatedPlayerMonster: battle.playerMonster 
            })}
            className="w-full bg-blue-600 text-white p-4 rounded-xl hover:bg-blue-700 active:transform active:scale-95 transition-all"
          >
            CONTINUE
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen flex flex-col bg-gradient-to-b from-blue-300 to-green-300 overflow-hidden">
      {/* Field View */}
      <div className="flex-grow relative overflow-hidden">
        {/* Enemy Side */}
        <div className="absolute top-10 right-10">
          <StatusBar 
            name={battle.enemyMonster.name} 
            level={battle.enemyMonster.level} 
            currentHp={battle.enemyMonster.currentHp} 
            maxHp={battle.enemyMonster.maxHp} 
          />
          <div className="mt-8 flex justify-center">
            <img 
              src={battle.enemyMonster.imageUrl} 
              alt="Enemy" 
              className={`w-32 h-32 pixelated transition-transform ${isAnimating && battle.turn === 'PLAYER' ? 'animate-pulse' : ''}`}
            />
          </div>
        </div>

        {/* Player Side */}
        <div className="absolute bottom-40 left-10">
          <StatusBar 
            name={battle.playerMonster.name} 
            level={battle.playerMonster.level} 
            currentHp={battle.playerMonster.currentHp} 
            maxHp={battle.playerMonster.maxHp} 
          />
          <div className="mt-8 flex justify-center">
             <img 
              src={battle.playerMonster.imageUrl} 
              alt="Player" 
              className={`w-32 h-32 pixelated scale-x-[-1] transition-transform ${isAnimating && battle.turn === 'ENEMY' ? 'animate-bounce' : ''}`}
            />
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-gray-800 h-1/3 p-4 flex gap-4 border-t-4 border-black">
        {/* Battle Logs */}
        <div className="flex-1 bg-white/10 p-4 rounded-xl overflow-y-auto text-xs space-y-2">
          {battle.logs.map((log, i) => (
            <div key={i} className={i === 0 ? 'text-yellow-400 font-bold' : 'text-gray-300'}>
              &gt; {log}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="w-1/2 grid grid-cols-2 gap-3">
          {battle.turn === 'PLAYER' && !isAnimating ? (
            battle.playerMonster.moves.map((move) => (
              <button
                key={move.name}
                onClick={() => executeMove(move, true)}
                className="bg-red-600 hover:bg-red-500 text-white p-2 rounded-lg pixel-border text-[10px] transition-all"
              >
                {move.name.toUpperCase()}
              </button>
            ))
          ) : (
            <div className="col-span-2 flex items-center justify-center text-yellow-500 animate-pulse">
              WAITING...
            </div>
          )}
          {battle.turn === 'PLAYER' && !isAnimating && (
            <button
              onClick={handleCapture}
              className="bg-yellow-600 hover:bg-yellow-500 text-white p-2 rounded-lg pixel-border text-[10px] transition-all"
            >
              GEMIBALL
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BattleScene;
