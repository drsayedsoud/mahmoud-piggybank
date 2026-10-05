import React from 'react';

interface BottomNavProps {
  activePage: 'home' | 'history' | 'settings';
  onNavigate: (page: 'home' | 'history' | 'settings') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activePage, onNavigate }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe">
      <div className="max-w-[480px] mx-auto flex justify-around items-center h-16 px-4" dir="rtl">
        
        <button 
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
            activePage === 'home' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
          }`}
          style={{ touchAction: 'manipulation' }}
        >
          <span className={`text-2xl transition-transform ${activePage === 'home' ? 'scale-110' : ''}`}>🏠</span>
          <span className="text-[10px] font-bold">الرئيسية</span>
        </button>

        <button 
          onClick={() => onNavigate('history')}
          className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
            activePage === 'history' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
          }`}
          style={{ touchAction: 'manipulation' }}
        >
          <span className={`text-2xl transition-transform ${activePage === 'history' ? 'scale-110' : ''}`}>📅</span>
          <span className="text-[10px] font-bold">السجل</span>
        </button>

        <button 
          onClick={() => onNavigate('settings')}
          className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
            activePage === 'settings' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
          }`}
          style={{ touchAction: 'manipulation' }}
        >
          <span className={`text-2xl transition-transform ${activePage === 'settings' ? 'scale-110' : ''}`}>⚙️</span>
          <span className="text-[10px] font-bold">الإعدادات</span>
        </button>

      </div>
    </div>
  );
};
