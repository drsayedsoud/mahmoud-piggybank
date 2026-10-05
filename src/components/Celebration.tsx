import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface CelebrationProps {
  show: boolean;
  onDismiss: () => void;
}

export const Celebration: React.FC<CelebrationProps> = ({ show, onDismiss }) => {
  useEffect(() => {
    if (show) {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();

      const timer = setTimeout(() => {
        onDismiss();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [show, onDismiss]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity" dir="rtl">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-[bounce_0.5s_ease-out]">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">برافو يا بطل!</h2>
        <p className="text-xl text-gray-600 mb-8">خلصت كل مهامك النهارده</p>
        
        <button 
          onClick={onDismiss}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-2xl text-xl transition-colors active:scale-95 touch-manipulation"
        >
          تمام 👍
        </button>
      </div>
    </div>
  );
};
