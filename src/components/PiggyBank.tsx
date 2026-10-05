import React, { useEffect, useState, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { toHindiNumerals, getTodayDate } from '../lib/date';
import { piasterToEgp } from '../lib/money';
import { speakAmount } from '../lib/speech';

export const PiggyBank: React.FC = () => {
  const balancePiasters = useAppStore(state => state.getBalancePiasters());
  const completions = useAppStore(state => state.completions);
  const [displayBalance, setDisplayBalance] = useState(balancePiasters);
  const [isShaking, setIsShaking] = useState(false);
  const [coins, setCoins] = useState<{ id: number; left: number }[]>([]);
  const prevBalanceRef = useRef(balancePiasters);
  const coinIdRef = useRef(0);

  const todayEarningsPiasters = useAppStore(state => state.getTodayEarningsPiasters());

  useEffect(() => {
    if (balancePiasters > prevBalanceRef.current) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);

      const newCoinId = coinIdRef.current++;
      setCoins(prev => [...prev, { id: newCoinId, left: 40 + Math.random() * 20 }]);
      setTimeout(() => {
        setCoins(prev => prev.filter(c => c.id !== newCoinId));
      }, 1000);

      const startBalance = prevBalanceRef.current;
      const endBalance = balancePiasters;
      const duration = 1000;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentBalance = Math.floor(startBalance + (endBalance - startBalance) * easeOut);
        
        setDisplayBalance(currentBalance);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayBalance(endBalance);
        }
      };
      requestAnimationFrame(animate);
    } else {
      setDisplayBalance(balancePiasters);
    }
    prevBalanceRef.current = balancePiasters;
  }, [balancePiasters]);

  return (
    <div className="flex flex-col items-center justify-center py-6 relative w-full">
      {coins.map(coin => (
        <div 
          key={coin.id}
          className="absolute w-6 h-6 bg-yellow-400 rounded-full border-2 border-yellow-600 z-10 animate-[drop_1s_ease-in]"
          style={{ left: `${coin.left}%`, top: '10px' }}
        />
      ))}
      
      <div className={`relative mb-4 ${isShaking ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
        <svg width="150" height="150" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M150 100C150 133.137 127.614 160 100 160C72.3858 160 50 133.137 50 100C50 66.8629 72.3858 40 100 40C127.614 40 150 66.8629 150 100Z" fill="#FBCFE8"/>
          <ellipse cx="150" cy="100" rx="20" ry="15" fill="#F472B6"/>
          <ellipse cx="145" cy="95" rx="3" ry="5" fill="#BE185D"/>
          <ellipse cx="155" cy="95" rx="3" ry="5" fill="#BE185D"/>
          <path d="M60 45L40 30L55 60Z" fill="#F472B6"/>
          <path d="M90 35L80 15L110 30Z" fill="#F472B6"/>
          <circle cx="120" cy="80" r="5" fill="#1F2937"/>
          <rect x="70" y="150" width="15" height="20" rx="5" fill="#F472B6"/>
          <rect x="110" y="150" width="15" height="20" rx="5" fill="#F472B6"/>
          <rect x="85" y="40" width="30" height="6" rx="3" fill="#9CA3AF"/>
        </svg>
      </div>

      <div className="flex items-center gap-4">
        <h2 className="text-5xl font-bold text-gray-800" dir="rtl">
          {toHindiNumerals(piasterToEgp(displayBalance).toString())} <span className="text-2xl">جنيه</span>
        </h2>
        <button 
          onClick={() => speakAmount(balancePiasters)}
          className="p-3 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors w-12 h-12 flex items-center justify-center text-xl"
          aria-label="استمع للمبلغ"
        >
          🔊
        </button>
      </div>

      <p className="mt-4 text-gray-600 font-medium text-lg bg-gray-100 px-4 py-2 rounded-full" dir="rtl">
        مكسبك النهارده: {toHindiNumerals(piasterToEgp(todayEarningsPiasters).toString())} جنيه
      </p>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px) rotate(-5deg); }
          50% { transform: translateX(5px) rotate(5deg); }
          75% { transform: translateX(-5px) rotate(-5deg); }
        }
        @keyframes drop {
          0% { transform: translateY(-30px) scale(1); opacity: 1; }
          100% { transform: translateY(60px) scale(0.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
