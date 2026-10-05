import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { TaskCard } from './TaskCard';
import { getTodayDate } from '../lib/date';

interface TaskListProps {
  onBalanceIncrease: (newBalance: number) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ onBalanceIncrease }) => {
  const tasks = useAppStore(state => state.tasks);
  const completions = useAppStore(state => state.completions);
  const completeTask = useAppStore(state => state.completeTask);
  const uncompleteTask = useAppStore(state => state.uncompleteTask);
  const checkAndAwardFullDayBonus = useAppStore(state => state.checkAndAwardFullDayBonus);
  const getBalancePiasters = useAppStore(state => state.getBalancePiasters()); // Wait, we can get balance from state, but after updates. We might need a small delay or use store.getState() if it was standard zustand.

  const activeTasks = tasks.filter(t => t.active);
  const today = getTodayDate();
  const todayCompletions = completions.filter(c => c.date === today);
  const completedTaskIds = new Set(todayCompletions.map(c => c.taskId));

  const handleToggle = (taskId: string) => {
    const isCompleted = completedTaskIds.has(taskId);

    if (isCompleted) {
      if (window.confirm('متأكد إنك عايز تلغيها؟')) {
        uncompleteTask(taskId);
      }
    } else {
      completeTask(taskId);
      checkAndAwardFullDayBonus();
      
      // Since zustand updates might be batched/async in react context, 
      // we can read from the store instance directly if we had it, but for now we can 
      // just rely on the next render or pass a dummy, but onBalanceIncrease needs the new balance.
      // We will defer it slightly to let zustand update.
      setTimeout(() => {
        const storeState = useAppStore.getState();
        onBalanceIncrease(storeState.getBalancePiasters());
      }, 50);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full" dir="rtl">
      {activeTasks.length === 0 ? (
        <div className="text-center text-gray-500 py-8">مفيش مهام دلوقتي!</div>
      ) : (
        activeTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            isCompleted={completedTaskIds.has(task.id)}
            onToggle={() => handleToggle(task.id)}
          />
        ))
      )}
    </div>
  );
};
