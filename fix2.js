import * as fs from 'fs';

// PinGate.tsx
let pg = fs.readFileSync('src/components/PinGate.tsx', 'utf-8');
pg = pg.replace(
`            if (verifyPin(newPin, pinHash!)) {
              setIsUnlocked(true);
            } else {
              setError(true);
              setTimeout(() => {
                setPin('');
                setError(false);
              }, 500);
            }`,
`            verifyPin(newPin, pinHash!).then(match => {
              if (match) {
                setIsUnlocked(true);
              } else {
                setError(true);
                setTimeout(() => {
                  setPin('');
                  setError(false);
                }, 500);
              }
            });`
);
fs.writeFileSync('src/components/PinGate.tsx', pg);

// Security.tsx
let sec = fs.readFileSync('src/components/settings/Security.tsx', 'utf-8');
sec = sec.replace(
`      const match = await verifyPin(currentPin, pinHash);
      if (match) {
        setMode('enterNew');
      } else {
        setErrorMsg('ط§ظ„ط±ظ…ط² ط؛ظٹط± طµط­ظٹط­');
        setCurrentPin('');
      }`,
`      const match = await verifyPin(currentPin, pinHash);
      if (match) {
        setMode('enterNew');
      } else {
        setErrorMsg('الرمز غير صحيح');
        setCurrentPin('');
      }`
);

fs.writeFileSync('src/components/settings/Security.tsx', sec);
console.log('Fixed async/await');
