import React, { useEffect, useState } from 'react';

export const InstallPrompt: React.FC = () => {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already dismissed
    if (localStorage.getItem('installPromptDismissed')) {
      return;
    }

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    if (isIosDevice) {
      setIsIOS(true);
      setShow(true);
    }

    // Listen for Chrome install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('installPromptDismissed', 'true');
    setShow(false);
  };

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShow(false);
      }
    }
  };

  if (!show) return null;

  return (
    <div className="bg-blue-50 border-b border-blue-100 p-4 relative" dir="rtl">
      <button 
        onClick={handleDismiss}
        className="absolute top-2 left-2 text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm"
      >
        ✕
      </button>
      <div className="flex items-center gap-4 max-w-[480px] mx-auto pt-2">
        <div className="text-4xl">📱</div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-800 text-sm">نزل التطبيق عندك!</h3>
          {isIOS ? (
            <p className="text-xs text-gray-600 mt-1">
              اضغط على زر المشاركة ⬆️ ثم اختر 'إضافة للشاشة الرئيسية'
            </p>
          ) : (
            <button 
              onClick={handleInstall}
              className="mt-2 bg-blue-500 text-white text-xs font-bold py-1.5 px-4 rounded-full shadow-sm hover:bg-blue-600 transition-colors"
            >
              تثبيت التطبيق
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
