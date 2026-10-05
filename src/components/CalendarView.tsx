import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { getMonthDays, getFirstDayOfMonth, toHindiNumerals, formatArabicDate, getTodayDate } from '../lib/date';
import { formatMoney } from '../lib/money';

const arabicMonths = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];
const arabicDays = ['سبت', 'أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة'];

export default function CalendarView() {
  const getDayStatus = useAppStore(state => state.getDayStatus);
  const getDayCompletions = useAppStore(state => state.getDayCompletions);
  
  const today = getTodayDate();
  const todayDateObj = new Date(today);

  const [currentMonth, setCurrentMonth] = useState(todayDateObj.getMonth());
  const [currentYear, setCurrentYear] = useState(todayDateObj.getFullYear());

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  const daysInMonth = getMonthDays(currentYear, currentMonth);
  // getFirstDayOfMonth gives 0 for Sunday... 6 for Saturday
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth); 
  // We want Saturday to be index 0
  const offset = (firstDay + 1) % 7; 
  
  const blankCells = Array(offset).fill(null);
  const dayCells = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const renderModal = () => {
    if (!selectedDate) return null;
    const completions = getDayCompletions(selectedDate);
    const totalEarned = completions.reduce((sum, c) => sum + (c.points * c.pointValue), 0);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-sm relative">
          <button onClick={() => setSelectedDate(null)} className="absolute top-4 left-4 text-2xl font-bold min-h-[48px] min-w-[48px]">❌</button>
          <h3 className="text-xl font-bold mb-4">{formatArabicDate(selectedDate)}</h3>
          {completions.length === 0 ? (
            <p className="text-gray-500 text-center py-4 font-bold">لم يتم إنجاز مهام في هذا اليوم</p>
          ) : (
            <>
              <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                {completions.map(c => (
                  <div key={c.id} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                    <span className="font-bold text-gray-800">{c.taskTitle}</span>
                    <span className="text-green-600 font-bold">+{formatMoney((c.points * c.pointValue))}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 text-center font-black text-xl text-blue-600">
                الإجمالي: {formatMoney(totalEarned)}
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handleNextMonth} className="p-2 text-xl font-bold bg-gray-100 rounded-lg min-h-[48px] min-w-[48px]">◀</button>
        <h2 className="text-xl font-bold text-gray-800">
          {arabicMonths[currentMonth]} {toHindiNumerals(currentYear)}
        </h2>
        <button onClick={handlePrevMonth} className="p-2 text-xl font-bold bg-gray-100 rounded-lg min-h-[48px] min-w-[48px]">▶</button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {arabicDays.map(d => (
          <div key={d} className="text-xs font-bold text-gray-500">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {blankCells.map((_, i) => (
          <div key={`blank-${i}`} className="aspect-square" />
        ))}
        {dayCells.map(d => {
          const mStr = String(currentMonth + 1).padStart(2, '0');
          const dStr = String(d).padStart(2, '0');
          const dateStr = `${currentYear}-${mStr}-${dStr}`;
          
          const status = getDayStatus(dateStr);
          const isToday = dateStr === today;
          
          let bgColor = 'bg-gray-50';
          if (status === 'partial') bgColor = 'bg-yellow-200 text-yellow-800';
          if (status === 'full') bgColor = 'bg-green-300 text-green-900';

          return (
            <button
              key={d}
              onClick={() => setSelectedDate(dateStr)}
              className={`aspect-square flex items-center justify-center rounded-lg text-lg font-bold transition-transform active:scale-95 ${bgColor} ${isToday ? 'border-2 border-blue-500 ring-2 ring-blue-200' : ''}`}
            >
              {toHindiNumerals(d)}
            </button>
          );
        })}
      </div>

      {renderModal()}
    </div>
  );
}
