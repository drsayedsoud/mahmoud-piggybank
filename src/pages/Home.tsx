import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { formatArabicDate, getTodayDate } from '../lib/date';
import { speakAmount } from '../lib/speech';
import { PiggyBank } from '../components/PiggyBank';
import { TaskList } from '../components/TaskList';
import { DayProgress } from '../components/DayProgress';
import { Celebration } from '../components/Celebration';

export default function Home() {
  const store = useAppStore();
  const today = getTodayDate();
  const allCompleted = store.allActiveTasksCompletedToday();
  const [celebrationDismissed, setCelebrationDismissed] = useState(false);

  useEffect(() => {
    const lastDay = localStorage.getItem('lastCelebrationDate');
    if (lastDay !== today) {
      setCelebrationDismissed(false);
      localStorage.setItem('lastCelebrationDate', today);
    }
  }, [today]);

  const handleBalanceIncrease = (newBalance: number) => {
    speakAmount(newBalance, {
      voiceURI: store.selectedVoiceURI,
      rate: store.speechRate,
      enabled: store.soundEnabled,
    });
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <header className="text-center">
        <h1 className="text-3xl font-black text-blue-900 mb-2">أهلًا يا محمود 👋</h1>
        <p className="text-gray-500 font-bold">{formatArabicDate(today)}</p>
      </header>

      <PiggyBank />
      <DayProgress />
      <TaskList onBalanceIncrease={handleBalanceIncrease} />

      {allCompleted && !celebrationDismissed && (
        <Celebration show={true} onDismiss={() => setCelebrationDismissed(true)} />
      )}
    </div>
  );
}
