// Unit words (masculine standalone form)
const ONES = [
  '', 'واحد', 'اتنين', 'تلاتة', 'أربعة', 'خمسة',
  'ستة', 'سبعة', 'تمنية', 'تسعة',
];

// Construct form for 3-10 when followed by a counted noun
const ONES_CONSTRUCT = [
  '', '', '', 'تلات', 'أربع', 'خمس',
  'ست', 'سبع', 'تمن', 'تسع',
];

const TEENS = [
  'عشرة', 'حداشر', 'اتناشر', 'تلتاشر', 'أربعتاشر',
  'خمستاشر', 'ستاشر', 'سبعتاشر', 'تمنتاشر', 'تسعتاشر',
];

const TENS = [
  '', '', 'عشرين', 'تلاتين', 'أربعين', 'خمسين',
  'ستين', 'سبعين', 'تمانين', 'تسعين',
];

const HUNDREDS = [
  '', 'مية', 'ميتين', 'تلتمية', 'أربعمية', 'خمسمية',
  'ستمية', 'سبعمية', 'تمنمية', 'تسعمية',
];

function numberToWords(n: number): string {
  if (n === 0) return 'صفر';
  if (n < 0) return numberToWords(-n);

  const parts: string[] = [];

  // Thousands
  if (n >= 1000) {
    const thousands = Math.floor(n / 1000);
    if (thousands === 1) {
      parts.push('ألف');
    } else if (thousands === 2) {
      parts.push('ألفين');
    } else if (thousands >= 3 && thousands <= 10) {
      parts.push(`${ONES_CONSTRUCT[thousands]} تلاف`);
    } else if (thousands >= 11 && thousands <= 19) {
      parts.push(`${TEENS[thousands - 10]} ألف`);
    } else if (thousands >= 20 && thousands <= 99) {
      const t = Math.floor(thousands / 10);
      const u = thousands % 10;
      if (u === 0) {
        parts.push(`${TENS[t]} ألف`);
      } else {
        parts.push(`${ONES[u]} و${TENS[t]} ألف`);
      }
    }
    n = n % 1000;
  }

  // Hundreds
  if (n >= 100) {
    const h = Math.floor(n / 100);
    parts.push(HUNDREDS[h]);
    n = n % 100;
  }

  // Tens and ones
  if (n >= 20) {
    const t = Math.floor(n / 10);
    const u = n % 10;
    if (u === 0) {
      parts.push(TENS[t]);
    } else {
      parts.push(`${ONES[u]} و${TENS[t]}`);
    }
  } else if (n >= 10) {
    parts.push(TEENS[n - 10]);
  } else if (n > 0) {
    parts.push(ONES[n]);
  }

  return parts.join(' و');
}

function numberWithCurrency(n: number, currency: string, dual: string): string {
  if (n === 0) return `صفر ${currency}`;
  if (n === 1) return `${currency} واحد`;
  if (n === 2) return dual;
  
  if (n >= 3 && n <= 10) {
    return `${ONES_CONSTRUCT[n] || ONES[n]} ${currency}`;
  }
  
  return `${numberToWords(n)} ${currency}`;
}

export function amountToArabicWords(piasters: number): string {
  const totalPounds = Math.floor(piasters / 100);
  const remainingPiasters = piasters % 100;

  let result = '';

  // Handle pounds
  if (totalPounds > 0) {
    result = numberWithCurrency(totalPounds, 'جنيه', 'جنيهين');
  } else if (remainingPiasters === 0) {
    return 'صفر جنيه';
  }

  // Handle piasters
  if (remainingPiasters > 0) {
    let piasterWord = '';
    if (remainingPiasters === 25) {
      piasterWord = 'ربع';
    } else if (remainingPiasters === 50) {
      piasterWord = 'نص';
    } else if (remainingPiasters === 75) {
      piasterWord = 'تلات أرباع';
    } else {
      piasterWord = numberWithCurrency(remainingPiasters, 'قرش', 'قرشين');
    }

    if (totalPounds > 0) {
      result += ' و' + piasterWord;
    } else {
      result = piasterWord;
    }
  }

  return result;
}

const PHRASES = [
  (amount: string) => `معاك دلوقتي ${amount}`,
  (amount: string) => `برافو! حصالتك بقت ${amount}`,
  (amount: string) => `عاش يا بطل! معاك ${amount}`,
  (amount: string) => `يا سلام! وصلت لـ ${amount}`,
  (amount: string) => `ما شاء الله! ${amount}`,
];

export function getSpeechText(piasters: number): string {
  const words = amountToArabicWords(piasters);
  const phrase = PHRASES[Math.floor(Math.random() * PHRASES.length)];
  return phrase(words);
}
