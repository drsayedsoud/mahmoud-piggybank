import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { egpToPiaster, piasterToEgp } from '../../lib/money';
import { toHindiNumerals } from '../../lib/date';

export default function PointValue() {
  const pointValuePiasters = useAppStore(state => state.pointValuePiasters);
  const setPointValue = useAppStore(state => state.setPointValue);
  
  const [inputValue, setInputValue] = useState(piasterToEgp(pointValuePiasters).toString());

  useEffect(() => {
    setInputValue(piasterToEgp(pointValuePiasters).toString());
  }, [pointValuePiasters]);

  const handleSave = () => {
    const value = parseFloat(inputValue);
    if (!isNaN(value) && value > 0) {
      setPointValue(egpToPiaster(value));
      alert('تم الحفظ بنجاح!');
    } else {
      alert('الرجاء إدخال قيمة صحيحة أكبر من صفر.');
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
      <h3 className="text-xl font-bold text-gray-800 mb-4">قيمة النقطة</h3>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-lg">كل نقطة =</span>
        <input
          type="number"
          step="0.01"
          min="0.01"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 min-w-0 border-2 border-blue-200 rounded-xl px-4 py-3 text-xl text-center focus:outline-none focus:border-blue-500 transition-colors"
          dir="ltr"
        />
        <span className="text-lg">جنيه</span>
      </div>
      <button
        onClick={handleSave}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3 text-lg font-bold transition-colors min-h-[48px]"
      >
        حفظ
      </button>
      <div className="mt-3 text-center text-gray-500 font-bold">
        القيمة الحالية: {toHindiNumerals(piasterToEgp(pointValuePiasters))} جنيه
      </div>
    </div>
  );
}
