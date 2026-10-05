import React from 'react';
import { useAppStore } from '../store/useAppStore';
import CalendarView from '../components/CalendarView';
import { toHindiNumerals } from '../lib/date';
import { formatMoney } from '../lib/money';

export default function History() {
  const getStreak = useAppStore(state => state.getStreak);
  const getTodayEarningsPiasters = useAppStore(state => state.getTodayEarningsPiasters);
  
  const streak = getStreak();
  const todayEarnings = getTodayEarningsPiasters();

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <header className="text-center mb-2">
        <h1 className="text-3xl font-black text-amber-600 mb-2">السجل والإنجازات 🏆</h1>
      </header>

      <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl p-6 text-white shadow-lg text-center relative overflow-hidden">
        <div className="text-6xl mb-2 relative z-10">🔥</div>
        <div className="text-4xl font-black mb-1 relative z-10">{toHindiNumerals(streak.current)}</div>
        <div className="text-xl font-bold opacity-90 relative z-10">أيام متتالية</div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
        <h3 className="text-gray-500 font-bold mb-1">أرباح اليوم</h3>
        <div className="text-2xl font-black text-green-600">{formatMoney(todayEarnings)}</div>
      </div>

      <CalendarView />
    </div>
  );
}
