import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { hashPin, verifyPin } from '../../lib/pin';

export default function Security() {
  const pinHash = useAppStore(state => state.pinHash);
  const setPinHash = useAppStore(state => state.setPinHash);

  const [mode, setMode] = useState<'idle' | 'enterCurrent' | 'enterNew' | 'confirmNew'>('idle');
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const checkCurrent = () => {
    if (currentPin.length === 4) {
      if (!pinHash) {
        setMode('enterNew');
        return;
      }
      verifyPin(currentPin, pinHash).then(match => {
        if (match) {
          setMode('enterNew');
        } else {
          setErrorMsg('الرمز غير صحيح');
          setCurrentPin('');
        }
      });
    }
  };

  const handleCurrentSubmit = () => {
    checkCurrent();
  };

  const handleNewSubmit = () => {
    if (newPin.length === 4) {
      setMode('confirmNew');
    }
  };

  const handleConfirmSubmit = () => {
    if (confirmPin.length === 4) {
      if (confirmPin === newPin) {
        hashPin(newPin).then(hash => {
          setPinHash(hash);
          setMode('idle');
          setCurrentPin('');
          setNewPin('');
          setConfirmPin('');
          setErrorMsg('');
        });
      } else {
        setErrorMsg('الرمز غير متطابق');
        setConfirmPin('');
      }
    }
  };

  const renderKeypad = (value: string, setter: (v: string) => void, onSubmit: () => void) => {
    const handleInput = (n: string) => {
      setErrorMsg('');
      if (value.length < 4) {
        const next = value + n;
        setter(next);
        if (next.length === 4) {
          setTimeout(() => {
            if (mode === 'enterCurrent') setter(next); // Let submit read it
          }, 50);
        }
      }
    };

    const handleDel = () => setter(value.slice(0, -1));

    return (
      <div className="flex flex-col items-center mt-6">
        <div className="flex gap-4 mb-8">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`w-4 h-4 rounded-full ${i < value.length ? 'bg-blue-600' : 'bg-gray-200'}`} />
          ))}
        </div>
        
        <div className="grid grid-cols-3 gap-6 w-full max-w-[240px]">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button key={num} onClick={() => handleInput(num.toString())} className="w-16 h-16 rounded-full bg-gray-50 text-2xl font-bold text-gray-800 hover:bg-gray-100 flex items-center justify-center">
              {num}
            </button>
          ))}
          <div />
          <button onClick={() => handleInput('0')} className="w-16 h-16 rounded-full bg-gray-50 text-2xl font-bold text-gray-800 hover:bg-gray-100 flex items-center justify-center">
            0
          </button>
          <button onClick={handleDel} className="w-16 h-16 rounded-full bg-gray-50 text-xl font-bold text-gray-800 hover:bg-gray-100 flex items-center justify-center">
            ⌫
          </button>
        </div>

        {value.length === 4 && (
          <button onClick={onSubmit} className="mt-8 bg-blue-600 text-white w-full py-4 rounded-2xl font-bold text-xl hover:bg-blue-700">
            تأكيد
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm mb-6">
      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
        <span>🔒</span> الأمان
      </h3>

      {mode === 'idle' ? (
        <button onClick={() => setMode('enterCurrent')} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-4 rounded-2xl flex justify-center items-center gap-2 transition-colors">
          <span>🔑</span> تغيير الرمز السري
        </button>
      ) : (
        <div className="relative">
          <button onClick={() => { setMode('idle'); setErrorMsg(''); }} className="absolute -top-2 left-0 text-gray-500 p-2">
            إلغاء
          </button>
          <h4 className="text-center font-bold text-lg mb-4 text-gray-700">
            {mode === 'enterCurrent' ? 'أدخل الرمز الحالي' : mode === 'enterNew' ? 'أدخل الرمز الجديد' : 'أكد الرمز الجديد'}
          </h4>
          
          {mode === 'enterCurrent' && renderKeypad(currentPin, setCurrentPin, handleCurrentSubmit)}
          {mode === 'enterNew' && renderKeypad(newPin, setNewPin, handleNewSubmit)}
          {mode === 'confirmNew' && renderKeypad(confirmPin, setConfirmPin, handleConfirmSubmit)}

          {errorMsg && <p className="text-red-500 text-center mt-4 font-bold">{errorMsg}</p>}
        </div>
      )}
    </div>
  );
}
