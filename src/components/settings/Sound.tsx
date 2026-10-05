import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { getArabicVoices, initVoices, speakNow } from '../../lib/speech';

export default function Sound() {
  const soundEnabled = useAppStore(state => state.soundEnabled);
  const speechRate = useAppStore(state => state.speechRate);
  const selectedVoiceURI = useAppStore(state => state.selectedVoiceURI);
  
  const setSoundEnabled = useAppStore(state => state.setSoundEnabled);
  const setSpeechRate = useAppStore(state => state.setSpeechRate);
  const setSelectedVoiceURI = useAppStore(state => state.setSelectedVoiceURI);
  const getBalancePiasters = useAppStore(state => state.getBalancePiasters);

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    initVoices().then(() => {
      setVoices(getArabicVoices());
    });
  }, []);

  const handleTest = () => {
    speakNow(getBalancePiasters(), {
      voiceURI: selectedVoiceURI,
      rate: speechRate,
      
    });
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
      <h3 className="text-xl font-bold text-gray-800 mb-4">الصوت</h3>
      
      <div className="flex items-center justify-between mb-4">
        <span className="text-lg font-bold">تفعيل الصوت</span>
        <button 
          onClick={() => setSoundEnabled(!soundEnabled)} 
          className={`w-14 h-7 rounded-full relative transition-colors ${soundEnabled ? 'bg-green-500' : 'bg-gray-300'}`}
        >
          <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${soundEnabled ? 'left-1' : 'right-1'}`} />
        </button>
      </div>

      {voices.length === 0 ? (
        <div className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg font-bold">
          الجهاز ليس به صوت عربي، ثبّت صوتًا عربيًا من إعدادات الجهاز.
        </div>
      ) : (
        <div className="mb-4 flex flex-col gap-2">
          <label className="text-gray-600 font-bold">اختيار الصوت:</label>
          <select 
            value={selectedVoiceURI || ''} 
            onChange={(e) => setSelectedVoiceURI(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl p-3 min-h-[48px] bg-white font-bold"
          >
            {voices.map(v => (
              <option key={v.voiceURI} value={v.voiceURI}>{v.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="mb-6">
        <label className="flex justify-between text-gray-600 font-bold mb-2">
          <span>سرعة الصوت:</span>
          <span dir="ltr">{speechRate.toFixed(1)}x</span>
        </label>
        <input 
          type="range" 
          min="0.5" 
          max="1.5" 
          step="0.1" 
          value={speechRate}
          onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
          className="w-full accent-blue-500"
        />
      </div>

      <button 
        onClick={handleTest}
        className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-xl py-3 text-lg font-bold min-h-[48px]"
      >
        جرّب الصوت 🔊
      </button>
    </div>
  );
}
