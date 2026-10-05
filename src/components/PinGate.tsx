import React, { useState } from 'react';
import { hashPin, verifyPin } from '../lib/pin';
import { useAppStore } from '../store/useAppStore';

interface PinGateProps {
  children: React.ReactNode;
}

export const PinGate: React.FC<PinGateProps> = ({ children }) => {
  const pinHash = useAppStore(state => state.pinHash);
  const setPinHash = useAppStore(state => state.setPinHash);
  
  const [pin, setPin] = useState('');
  const [setupPin, setSetupPin] = useState('');
  const [step, setStep] = useState<'setup' | 'confirm' | 'enter'>(pinHash ? 'enter' : 'setup');
  const [error, setError] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  if (isUnlocked || (pinHash === null && step !== 'setup' && step !== 'confirm')) {
    return <>{children}</>;
  }

  const handleInput = (num: string) => {
    if (error) return;
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      
      if (newPin.length === 4) {
        if (step === 'setup') {
          setSetupPin(newPin);
          setTimeout(() => {
            setPin('');
            setStep('confirm');
          }, 300);
        } else if (step === 'confirm') {
          if (newPin === setupPin) {
            hashPin(newPin).then(hash => {
              setPinHash(hash);
              setIsUnlocked(true);
            });
          } else {
            setError(true);
            setTimeout(() => {
              setPin('');
              setStep('setup');
              setError(false);
            }, 500);
          }
        } else if (step === 'enter') {
          verifyPin(newPin, pinHash!).then(match => {
            if (match) {
              setIsUnlocked(true);
            } else {
              setError(true);
              setTimeout(() => {
                setPin('');
                setError(false);
              }, 500);
            }
          });
        }
      }
    }
  };

  const handleBackspace = () => {
    if (error || pin.length === 0) return;
    setPin(pin.slice(0, -1));
  };

  const title = step === 'setup' ? 'أنشئ رمز سري' : step === 'confirm' ? 'أدخل الرمز مرة تانية' : 'أدخل الرمز السري';

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className={`bg-white p-8 rounded-3xl shadow-lg w-full max-w-sm flex flex-col items-center ${error ? 'animate-shake' : ''}`}>
        <h2 className="text-2xl font-bold mb-8 text-gray-800 text-center">{title}</h2>
        
        <div className="flex gap-4 mb-10">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`w-4 h-4 rounded-full transition-colors duration-200 ${i < pin.length ? 'bg-blue-600' : 'bg-gray-200'} ${error ? 'bg-red-500' : ''}`} />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6 w-full max-w-[240px]">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button key={num} onClick={() => handleInput(num.toString())} className="w-16 h-16 rounded-full bg-gray-50 text-2xl font-bold text-gray-800 hover:bg-gray-100 active:bg-gray-200 transition-colors flex items-center justify-center shadow-sm">
              {num}
            </button>
          ))}
          <div />
          <button onClick={() => handleInput('0')} className="w-16 h-16 rounded-full bg-gray-50 text-2xl font-bold text-gray-800 hover:bg-gray-100 active:bg-gray-200 transition-colors flex items-center justify-center shadow-sm">
            0
          </button>
          <button onClick={handleBackspace} className="w-16 h-16 rounded-full bg-gray-50 text-xl font-bold text-gray-800 hover:bg-gray-100 active:bg-gray-200 transition-colors flex items-center justify-center shadow-sm">
            ⌫
          </button>
        </div>
        
        {error && <p className="text-red-500 mt-6 font-bold text-center">الرمز غير صحيح</p>}
      </div>
    </div>
  );
};
