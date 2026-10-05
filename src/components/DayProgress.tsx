import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { getTodayDate, toHindiNumerals } from '../lib/date';

export const DayProgress: React.FC = () => {
  const tasks = useAppStore(state => state.tasks);
  const completions = useAppStore(state => state.completions);
  
  const activeTasks = tasks.filter(t => t.active);
  const totalTasks = activeTasks.length;
  
  const today = getTodayDate();
  const completedToday = completions.filter(c => c.date === today && activeTasks.some(t => t.id === c.taskId)).length;

  const progressPercentage = totalTasks === 0 ? 0 : Math.min(100, Math.round((completedToday / totalTasks) * 100));

  return (
    <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100" dir="rtl">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-gray-700">
          أنجزت {toHindiNumerals(completedToday.toString())} من {toHindiNumerals(totalTasks.toString())} مهام
        </span>
        <span className="text-sm font-bold text-blue-600">
          {toHindiNumerals(progressPercentage.toString())}٪
        </span>
      </div>
      
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-l from-blue-400 to-green-400"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};
