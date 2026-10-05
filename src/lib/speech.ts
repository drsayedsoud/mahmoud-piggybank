import { getSpeechText } from './amountToArabicWords';

let voices: SpeechSynthesisVoice[] = [];
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

export function initVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve([]);
      return;
    }

    const loadVoices = () => {
      voices = window.speechSynthesis.getVoices();
      resolve(voices);
    };

    // Some browsers load voices asynchronously
    if (window.speechSynthesis.getVoices().length > 0) {
      loadVoices();
    } else {
      window.speechSynthesis.addEventListener('voiceschanged', loadVoices, { once: true });
      // Fallback timeout
      setTimeout(loadVoices, 2000);
    }
  });
}

export function getArabicVoices(): SpeechSynthesisVoice[] {
  if (voices.length === 0) {
    voices = window.speechSynthesis?.getVoices() || [];
  }
  return voices.filter((v) => v.lang.startsWith('ar'));
}

function findBestVoice(preferredURI?: string | null): SpeechSynthesisVoice | null {
  const arabicVoices = getArabicVoices();
  if (arabicVoices.length === 0) return null;

  // Try preferred voice first
  if (preferredURI) {
    const preferred = arabicVoices.find((v) => v.voiceURI === preferredURI);
    if (preferred) return preferred;
  }

  // Try Egyptian Arabic
  const egyptian = arabicVoices.find((v) => v.lang === 'ar-EG');
  if (egyptian) return egyptian;

  // Try Saudi Arabic
  const saudi = arabicVoices.find((v) => v.lang === 'ar-SA');
  if (saudi) return saudi;

  // Any Arabic voice
  return arabicVoices[0];
}

export function speakAmount(
  piasters: number,
  options?: { voiceURI?: string | null; rate?: number; enabled?: boolean }
): void {
  if (options?.enabled === false) return;
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  // Debounce: wait 500ms after last call
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    window.speechSynthesis.cancel();

    const text = getSpeechText(piasters);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-EG';
    utterance.rate = options?.rate ?? 0.9;

    const voice = findBestVoice(options?.voiceURI);
    if (voice) {
      utterance.voice = voice;
    }

    window.speechSynthesis.speak(utterance);
  }, 500);
}

export function cancelSpeech(): void {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
  window.speechSynthesis?.cancel();
}

export function speakNow(
  piasters: number,
  options?: { voiceURI?: string | null; rate?: number }
): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  const text = getSpeechText(piasters);
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ar-EG';
  utterance.rate = options?.rate ?? 0.9;

  const voice = findBestVoice(options?.voiceURI);
  if (voice) utterance.voice = voice;

  window.speechSynthesis.speak(utterance);
}

export function hasArabicVoice(): boolean {
  return getArabicVoices().length > 0;
}
