import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { egpToPiaster, piasterToEgp } from '../../lib/money';
import { toHindiNumerals, formatArabicDate } from '../../lib/date';

export default function Withdraw() {
  const getBalancePiasters = useAppStore(state => state.getBalancePiasters);
  const addWithdrawal = useAppStore(state => state.addWithdrawal);
  const withdrawals = useAppStore(state => state.withdrawals);

  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const balance = getBalancePiasters();

  const handleWithdraw = () => {
    const valueEgp = parseFloat(amount);
    if (isNaN(valueEgp) || valueEgp <= 0) {
      alert('الرجاء إدخال مبلغ صحيح');
      return;
    }
    const valuePiaster = egpToPiaster(valueEgp);
    if (valuePiaster > balance) {
      alert('المبلغ أكبر من الرصيد الحالي');
      return;
    }
    addWithdrawal(valuePiaster, note.trim() || undefined);
    setAmount('');
    setNote('');
    alert('تم السحب بنجاح!');
  };

  const sortedWithdrawals = [...withdrawals].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10);

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
      <h3 className="text-xl font-bold text-gray-800 mb-4">السحب من الحصالة</h3>
      
      <div className="bg-blue-50 text-blue-800 rounded-xl p-3 mb-4 text-center font-bold text-lg">
        الرصيد الحالي: {toHindiNumerals(piasterToEgp(balance))} جنيه
      </div>

      <div className="flex flex-col gap-3 mb-4">
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="المبلغ"
            className="flex-1 border-2 border-red-200 rounded-xl px-4 py-3 text-xl text-center focus:border-red-500"
            dir="ltr"
            step="0.5"
            min="0.5"
          />
          <span className="text-lg">جنيه</span>
        </div>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="السبب (اختياري)"
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-lg focus:border-gray-500"
        />
        <button
          onClick={handleWithdraw}
          className="w-full bg-red-500 hover:bg-red-600 text-white rounded-xl py-3 text-lg font-bold min-h-[48px]"
        >
          سحب
        </button>
      </div>

      {sortedWithdrawals.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="font-bold text-gray-700 mb-3">آخر السحوبات</h4>
          <div className="flex flex-col gap-2">
            {sortedWithdrawals.map(w => (
              <div key={w.id} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg text-sm border">
                <div>
                  <div className="font-bold text-red-600">- {toHindiNumerals(piasterToEgp(w.amount))} جنيه</div>
                  <div className="text-gray-500">{formatArabicDate(new Date(w.createdAt).toISOString().split("T")[0])}</div>
                </div>
                <div className="text-gray-700 max-w-[50%] text-left truncate">{w.note || '---'}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
