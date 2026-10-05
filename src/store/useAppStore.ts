import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task, Completion, Withdrawal } from '../types';
import { getTodayDate } from '../lib/date';
import { getBalance, getDayEarnings } from '../lib/money';

const DEFAULT_TASKS: Task[] = [
  { id: 't1', title: 'الصلاة', points: 1, icon: '🕌', order: 0, active: true },
  { id: 't2', title: 'واجب المدرسة', points: 1, icon: '📚', order: 1, active: true },
  { id: 't3', title: 'واجب الأبلة هند', points: 1, icon: '📝', order: 2, active: true },
  { id: 't4', title: 'واجب الأستاذ سيد', points: 1, icon: '📖', order: 3, active: true },
  { id: 't5', title: 'واجب الأستاذ مصبح', points: 1, icon: '✏️', order: 4, active: true },
  { id: 't6', title: 'واجب المس رضا', points: 1, icon: '📓', order: 5, active: true },
  { id: 't7', title: 'حفظ ربع القرآن', points: 1, icon: '🤲', order: 6, active: true },
  { id: 't8', title: 'ترتيب السرير', points: 1, icon: '🛏️', order: 7, active: true },
  { id: 't9', title: 'صلاة في المسجد', points: 1, icon: '🕋', order: 8, active: true },
  { id: 't10', title: 'رضا الأم', points: 1, icon: '❤️', order: 9, active: true },
];

interface AppState {
  // State
  tasks: Task[];
  completions: Completion[];
  withdrawals: Withdrawal[];
  pointValuePiasters: number;
  fullDayBonusPoints: number;
  pinHash: string | null;
  soundEnabled: boolean;
  speechRate: number;
  selectedVoiceURI: string | null;

  // Derived helpers
  getActiveTasks: () => Task[];
  getTodayCompletions: () => Completion[];
  isTaskCompletedToday: (taskId: string) => boolean;
  getCompletionForTaskToday: (taskId: string) => Completion | undefined;
  getBalancePiasters: () => number;
  getTodayEarningsPiasters: () => number;
  hasFullDayBonusToday: () => boolean;
  allActiveTasksCompletedToday: () => boolean;
  getStreak: () => { current: number; best: number };
  getDayCompletions: (date: string) => Completion[];
  getDayStatus: (date: string) => 'none' | 'partial' | 'full';

  // Actions
  completeTask: (taskId: string) => void;
  uncompleteTask: (taskId: string) => void;
  checkAndAwardFullDayBonus: () => void;
  addWithdrawal: (amountPiasters: number, note?: string) => void;
  setPointValue: (piasters: number) => void;
  setFullDayBonusPoints: (points: number) => void;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Omit<Task, 'id' | 'order'>) => void;
  removeTask: (id: string) => void;
  toggleTaskActive: (id: string) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id'>>) => void;
  moveTaskUp: (id: string) => void;
  moveTaskDown: (id: string) => void;
  setPinHash: (hash: string) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setSpeechRate: (rate: number) => void;
  setSelectedVoiceURI: (uri: string | null) => void;
  exportData: () => string;
  importData: (json: string) => boolean;
  resetAll: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      tasks: DEFAULT_TASKS,
      completions: [],
      withdrawals: [],
      pointValuePiasters: 100, // 1 EGP = 100 piasters
      fullDayBonusPoints: 0,
      pinHash: null,
      soundEnabled: true,
      speechRate: 0.9,
      selectedVoiceURI: null,

      // Derived
      getActiveTasks: () => {
        return get().tasks.filter((t) => t.active).sort((a, b) => a.order - b.order);
      },

      getTodayCompletions: () => {
        const today = getTodayDate();
        return get().completions.filter((c) => c.date === today);
      },

      isTaskCompletedToday: (taskId: string) => {
        const today = getTodayDate();
        return get().completions.some((c) => c.date === today && c.taskId === taskId && !c.isFullDayBonus);
      },

      getCompletionForTaskToday: (taskId: string) => {
        const today = getTodayDate();
        return get().completions.find((c) => c.date === today && c.taskId === taskId && !c.isFullDayBonus);
      },

      getBalancePiasters: () => {
        return getBalance(get().completions, get().withdrawals);
      },

      getTodayEarningsPiasters: () => {
        return getDayEarnings(get().completions, getTodayDate());
      },

      hasFullDayBonusToday: () => {
        const today = getTodayDate();
        return get().completions.some((c) => c.date === today && c.isFullDayBonus);
      },

      allActiveTasksCompletedToday: () => {
        const today = getTodayDate();
        const activeTasks = get().tasks.filter((t) => t.active);
        const todayCompletions = get().completions.filter((c) => c.date === today && !c.isFullDayBonus);
        return activeTasks.length > 0 && activeTasks.every((t) => todayCompletions.some((c) => c.taskId === t.id));
      },

      getStreak: () => {
        const { completions, tasks } = get();
        const dates = new Set(completions.map((c) => c.date));
        const sortedDates = Array.from(dates).sort().reverse();

        let current = 0;
        let best = 0;
        const today = getTodayDate();

        // Check consecutive days ending with today or yesterday
        const checkDate = new Date();
        // Adjust to Cairo timezone
        const cairoOffset = new Date().toLocaleString('en-US', { timeZone: 'Africa/Cairo' });
        const cairoDate = new Date(cairoOffset);

        for (let i = 0; i < 365; i++) {
          const d = new Date(cairoDate);
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split('T')[0];
          
          // Get active tasks for that day (approximate: use current active tasks)
          const activeTasks = tasks.filter((t) => t.active);
          const dayCompletions = completions.filter((c) => c.date === dateStr && !c.isFullDayBonus);
          const allDone = activeTasks.length > 0 && activeTasks.every((t) => dayCompletions.some((c) => c.taskId === t.id));

          if (allDone) {
            current++;
          } else if (i === 0) {
            // Today not complete yet, that's ok - check from yesterday
            continue;
          } else {
            break;
          }
        }

        // Calculate best streak from all dates
        let streak = 0;
        const allDates = Array.from(dates).sort();
        for (let i = 0; i < allDates.length; i++) {
          const dateStr = allDates[i];
          const activeTasks = tasks.filter((t) => t.active);
          const dayCompletions = completions.filter((c) => c.date === dateStr && !c.isFullDayBonus);
          const allDone = activeTasks.length > 0 && activeTasks.every((t) => dayCompletions.some((c) => c.taskId === t.id));

          if (allDone) {
            streak++;
            best = Math.max(best, streak);
          } else {
            streak = 0;
          }
        }
        best = Math.max(best, current);

        return { current, best };
      },

      getDayCompletions: (date: string) => {
        return get().completions.filter((c) => c.date === date);
      },

      getDayStatus: (date: string) => {
        const { completions, tasks } = get();
        const activeTasks = tasks.filter((t) => t.active);
        const dayCompletions = completions.filter((c) => c.date === date && !c.isFullDayBonus);
        
        if (dayCompletions.length === 0) return 'none';
        const allDone = activeTasks.every((t) => dayCompletions.some((c) => c.taskId === t.id));
        return allDone ? 'full' : 'partial';
      },

      // Actions
      completeTask: (taskId: string) => {
        const state = get();
        const today = getTodayDate();
        
        // Prevent double completion
        if (state.completions.some((c) => c.date === today && c.taskId === taskId && !c.isFullDayBonus)) {
          return;
        }

        const task = state.tasks.find((t) => t.id === taskId);
        if (!task) return;

        const completion: Completion = {
          id: `c_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          date: today,
          taskId: task.id,
          taskTitle: task.title,
          points: task.points,
          pointValue: state.pointValuePiasters,
          createdAt: Date.now(),
        };

        set({ completions: [...state.completions, completion] });
      },

      uncompleteTask: (taskId: string) => {
        const state = get();
        const today = getTodayDate();
        
        // Remove task completion for today
        const newCompletions = state.completions.filter(
          (c) => !(c.date === today && c.taskId === taskId && !c.isFullDayBonus)
        );
        
        // Also remove full day bonus if it exists for today
        const withoutBonus = newCompletions.filter(
          (c) => !(c.date === today && c.isFullDayBonus)
        );
        
        set({ completions: withoutBonus });
      },

      checkAndAwardFullDayBonus: () => {
        const state = get();
        if (state.fullDayBonusPoints <= 0) return;
        if (state.hasFullDayBonusToday()) return;
        if (!state.allActiveTasksCompletedToday()) return;

        const today = getTodayDate();
        const bonus: Completion = {
          id: `bonus_${Date.now()}`,
          date: today,
          taskId: '__full_day_bonus__',
          taskTitle: 'مكافأة اليوم الكامل',
          points: state.fullDayBonusPoints,
          pointValue: state.pointValuePiasters,
          createdAt: Date.now(),
          isFullDayBonus: true,
        };

        set({ completions: [...state.completions, bonus] });
      },

      addWithdrawal: (amountPiasters: number, note?: string) => {
        const state = get();
        const balance = state.getBalancePiasters();
        if (amountPiasters > balance || amountPiasters <= 0) return;

        const withdrawal: Withdrawal = {
          id: `w_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          amount: amountPiasters,
          note,
          createdAt: Date.now(),
        };

        set({ withdrawals: [...state.withdrawals, withdrawal] });
      },

      setPointValue: (piasters: number) => {
        if (piasters <= 0) return;
        set({ pointValuePiasters: piasters });
      },

      setFullDayBonusPoints: (points: number) => {
        set({ fullDayBonusPoints: Math.max(0, points) });
      },

      setTasks: (tasks: Task[]) => set({ tasks }),

      addTask: (task: Omit<Task, 'id' | 'order'>) => {
        const state = get();
        const maxOrder = Math.max(...state.tasks.map((t) => t.order), -1);
        const newTask: Task = {
          ...task,
          id: `t_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          order: maxOrder + 1,
        };
        set({ tasks: [...state.tasks, newTask] });
      },

      removeTask: (id: string) => {
        set({ tasks: get().tasks.filter((t) => t.id !== id) });
      },

      toggleTaskActive: (id: string) => {
        set({
          tasks: get().tasks.map((t) =>
            t.id === id ? { ...t, active: !t.active } : t
          ),
        });
      },

      updateTask: (id: string, updates: Partial<Omit<Task, 'id'>>) => {
        set({
          tasks: get().tasks.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        });
      },

      moveTaskUp: (id: string) => {
        const tasks = [...get().tasks].sort((a, b) => a.order - b.order);
        const idx = tasks.findIndex((t) => t.id === id);
        if (idx <= 0) return;
        const temp = tasks[idx].order;
        tasks[idx].order = tasks[idx - 1].order;
        tasks[idx - 1].order = temp;
        set({ tasks });
      },

      moveTaskDown: (id: string) => {
        const tasks = [...get().tasks].sort((a, b) => a.order - b.order);
        const idx = tasks.findIndex((t) => t.id === id);
        if (idx < 0 || idx >= tasks.length - 1) return;
        const temp = tasks[idx].order;
        tasks[idx].order = tasks[idx + 1].order;
        tasks[idx + 1].order = temp;
        set({ tasks });
      },

      setPinHash: (hash: string) => set({ pinHash: hash }),
      setSoundEnabled: (enabled: boolean) => set({ soundEnabled: enabled }),
      setSpeechRate: (rate: number) => set({ speechRate: rate }),
      setSelectedVoiceURI: (uri: string | null) => set({ selectedVoiceURI: uri }),

      exportData: () => {
        const { tasks, completions, withdrawals, pointValuePiasters, fullDayBonusPoints } = get();
        return JSON.stringify({ tasks, completions, withdrawals, pointValuePiasters, fullDayBonusPoints }, null, 2);
      },

      importData: (json: string) => {
        try {
          const data = JSON.parse(json);
          if (data.tasks && data.completions && data.withdrawals) {
            set({
              tasks: data.tasks,
              completions: data.completions,
              withdrawals: data.withdrawals,
              pointValuePiasters: data.pointValuePiasters ?? 100,
              fullDayBonusPoints: data.fullDayBonusPoints ?? 0,
            });
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },

      resetAll: () => {
        set({
          tasks: DEFAULT_TASKS,
          completions: [],
          withdrawals: [],
          pointValuePiasters: 100,
          fullDayBonusPoints: 0,
          pinHash: null,
          soundEnabled: true,
          speechRate: 0.9,
          selectedVoiceURI: null,
        });
      },
    }),
    {
      name: 'mahmoud-piggybank-storage',
      version: 1,
      onRehydrateStorage: () => (state) => {
        // Validate data on rehydration
        if (state && (!state.tasks || !Array.isArray(state.tasks))) {
          state.tasks = DEFAULT_TASKS;
        }
        if (state && (!state.completions || !Array.isArray(state.completions))) {
          state.completions = [];
        }
        if (state && (!state.withdrawals || !Array.isArray(state.withdrawals))) {
          state.withdrawals = [];
        }
      },
    }
  )
);
