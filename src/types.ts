export interface Task {
  id: string;
  title: string;
  points: number;
  icon: string;
  order: number;
  active: boolean;
}

export interface Completion {
  id: string;
  date: string; // YYYY-MM-DD
  taskId: string;
  taskTitle: string;
  points: number;
  pointValue: number; // in piasters (qurush) at time of earning
  createdAt: number;
  isFullDayBonus?: boolean;
}

export interface Withdrawal {
  id: string;
  amount: number; // in piasters
  note?: string;
  createdAt: number;
}
