import * as fs from 'fs';

// PinGate.tsx
let pg = fs.readFileSync('src/components/PinGate.tsx', 'utf-8');
pg = pg.replace(
/if\s*\(\s*verifyPin\(\s*newPin\s*,\s*pinHash!\s*\)\s*\)/g,
'verifyPin(newPin, pinHash!).then(match => { if(match)'
);
// We also need to add closing brace
pg = pg.replace(
/setTimeout\(\(\) => \{\n\s*setPin\(''\);\n\s*setError\(false\);\n\s*\}, 500\);\n\s*\}\n\s*\}/g,
`setTimeout(() => {
                setPin('');
                setError(false);
              }, 500);
            }
          });
        }`
);
fs.writeFileSync('src/components/PinGate.tsx', pg);

// Security.tsx
let sec = fs.readFileSync('src/components/settings/Security.tsx', 'utf-8');
sec = sec.replace(
/if\s*\(\s*!pinHash\s*\|\|\s*verifyPin\(\s*currentPin\s*,\s*pinHash\s*\)\s*\)\s*\{/g,
'verifyPin(currentPin, pinHash!).then(match => { if (!pinHash || match) {'
);
// And the closing brace
sec = sec.replace(
/setCurrentPin\(''\);\n\s*\}\n\s*\}\n\s*\}/g,
`setCurrentPin('');
      }
    });
    }
  }`
);
fs.writeFileSync('src/components/settings/Security.tsx', sec);
