import React from 'react';
import type { Task } from '../types';
import { toHindiNumerals } from '../lib/date';

interface TaskCardProps {
  task: Task;
  isCompleted: boolean;
  onToggle: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, isCompleted, onToggle }) => {
  return (
    <div
      onClick={onToggle}
      style={{ touchAction: 'manipulation' }}
      className={`min-h-[64px] rounded-2xl p-4 shadow-sm border-2 cursor-pointer transition-all duration-300 flex items-center gap-4 ${
        isCompleted 
          ? 'bg-green-100 border-green-400 scale-[0.98]' 
          : 'bg-white border-gray-200 hover:border-blue-300'
      }`}
      dir="rtl"
    >
      <div 
        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
          isCompleted ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'
        }`}
      >
        {isCompleted && <span className="text-white text-lg leading-none">✔</span>}
      </div>

      <div className="text-3xl flex-shrink-0">
        {task.icon}
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <h3 className={`text-lg font-bold ${isCompleted ? 'text-green-800' : 'text-gray-800'}`}>
          {task.title}
        </h3>
      </div>

      <div className="flex-shrink-0 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
        <span className="text-blue-700 font-bold text-sm">
          +{toHindiNumerals(task.points.toString())} نقطة
        </span>
      </div>
    </div>
  );
};
