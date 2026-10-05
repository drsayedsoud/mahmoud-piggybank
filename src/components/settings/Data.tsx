import React, { useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';

export default function Data() {
  const exportData = useAppStore(state => state.exportData);
  const importData = useAppStore(state => state.importData);
  const resetAll = useAppStore(state => state.resetAll);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const dataStr = exportData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mahmoud-piggybank-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        importData(json);
        alert('تم استيراد البيانات بنجاح!');
      } catch (err) {
        alert('حدث خطأ أثناء الاستيراد. تأكد من صحة الملف.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleReset = () => {
    if (window.confirm('متأكد؟')) {
      if (window.confirm('متأكد جدًا؟ كل البيانات هتتمسح!')) {
        resetAll();
        alert('تمت إعادة الضبط.');
      }
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
      <h3 className="text-xl font-bold text-gray-800 mb-4">البيانات</h3>
      
      <div className="flex flex-col gap-3">
        <button onClick={handleExport} className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3 text-lg font-bold min-h-[48px] flex items-center justify-center gap-2">
          <span>📤</span> تصدير نسخة احتياطية
        </button>
        
        <button onClick={() => fileInputRef.current?.click()} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-3 text-lg font-bold min-h-[48px] flex items-center justify-center gap-2">
          <span>📥</span> استيراد نسخة احتياطية
        </button>
        <input 
          type="file" 
          accept=".json" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleImport}
        />

        <button onClick={handleReset} className="w-full bg-red-500 hover:bg-red-600 text-white rounded-xl py-3 text-lg font-bold min-h-[48px] flex items-center justify-center gap-2 mt-4">
          <span>⚠️</span> إعادة ضبط كل شيء
        </button>
      </div>
    </div>
  );
}
