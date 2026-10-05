import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { PinGate } from '../components/PinGate';
import PointValue from '../components/settings/PointValue';
import TasksEditor from '../components/settings/TasksEditor';
import Withdraw from '../components/settings/Withdraw';
import Sound from '../components/settings/Sound';
import Security from '../components/settings/Security';
import Data from '../components/settings/Data';

function FullDayBonusEditor() {
  const fullDayBonusPoints = useAppStore(state => state.fullDayBonusPoints);
  const setFullDayBonusPoints = useAppStore(state => state.setFullDayBonusPoints);
  
  const [val, setVal] = useState(fullDayBonusPoints.toString());

  const handleSave = () => {
    const pts = parseInt(val, 10);
    if (!isNaN(pts) && pts >= 0) {
      setFullDayBonusPoints(pts);
      alert('تم الحفظ بنجاح!');
    } else {
      alert('الرجاء إدخال قيمة صحيحة.');
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
      <h3 className="text-xl font-bold text-gray-800 mb-4">مكافأة اليوم الكامل</h3>
      <div className="flex items-center gap-3 mb-4">
        <input
          type="number"
          min="0"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          className="flex-1 border-2 border-amber-200 rounded-xl px-4 py-3 text-xl text-center focus:border-amber-500"
          dir="ltr"
        />
        <span className="text-lg font-bold">نقطة</span>
      </div>
      <button
        onClick={handleSave}
        className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-xl py-3 text-lg font-bold min-h-[48px]"
      >
        حفظ
      </button>
    </div>
  );
}

export default function Settings() {
  return (
    <PinGate>
      <div className="animate-fade-in pb-10">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-black text-gray-800">الإعدادات ⚙️</h1>
        </header>

        <PointValue />
        <FullDayBonusEditor />
        <TasksEditor />
        <Withdraw />
        <Sound />
        <Security />
        <Data />
      </div>
    </PinGate>
  );
}
