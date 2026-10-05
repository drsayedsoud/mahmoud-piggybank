import * as fs from 'fs';

// 1. CalendarView.tsx
let cal = fs.readFileSync('src/components/CalendarView.tsx', 'utf-8');
cal = cal.replace(/c\.piastersEarned/g, '(c.points * c.pointValue)');
fs.writeFileSync('src/components/CalendarView.tsx', cal);

// 2. DayProgress.tsx
let dp = fs.readFileSync('src/components/DayProgress.tsx', 'utf-8');
dp = dp.replace(/t\.isActive/g, 't.active');
fs.writeFileSync('src/components/DayProgress.tsx', dp);

// 3. PiggyBank.tsx
let pb = fs.readFileSync('src/components/PiggyBank.tsx', 'utf-8');
pb = pb.replace(/state => state\.balancePiasters/g, 'state => state.getBalancePiasters()');
pb = pb.replace(/c\.pointsAwarded \* 100/g, 'c.points * c.pointValue');
fs.writeFileSync('src/components/PiggyBank.tsx', pb);

// 4. PinGate.tsx
let pg = fs.readFileSync('src/components/PinGate.tsx', 'utf-8');
pg = pg.replace(/setPinHash\(hashPin\(newPin\)\)/g, 'hashPin(newPin).then(setPinHash)');
pg = pg.replace(/if \(verifyPin\(pin, pinHash\)\)/g, 'const match = await verifyPin(pin, pinHash);\n      if (match)');
// Need to make verify handler async if it's not.
pg = pg.replace(/const handleVerify = \(\) => {/g, 'const handleVerify = async () => {');
fs.writeFileSync('src/components/PinGate.tsx', pg);

// 5. Security.tsx
let sec = fs.readFileSync('src/components/settings/Security.tsx', 'utf-8');
sec = sec.replace(/if \(verifyPin\(currentPin, pinHash\)\)/g, 'const match = await verifyPin(currentPin, pinHash);\n      if (match)');
sec = sec.replace(/const handleCurrentSubmit = \(\) => {/g, 'const handleCurrentSubmit = async () => {');
sec = sec.replace(/setPinHash\(hashPin\(newPin\)\)/g, 'hashPin(newPin).then(setPinHash)');
fs.writeFileSync('src/components/settings/Security.tsx', sec);

// 6. Sound.tsx
let snd = fs.readFileSync('src/components/settings/Sound.tsx', 'utf-8');
snd = snd.replace(/enabled: soundEnabled/g, ''); // remove enabled from options
fs.writeFileSync('src/components/settings/Sound.tsx', snd);

// 7. TasksEditor.tsx
let te = fs.readFileSync('src/components/settings/TasksEditor.tsx', 'utf-8');
// remove id from addTask
te = te.replace(/addTask\(\{\s*id: [^,]+,\s*/, 'addTask({ ');
fs.writeFileSync('src/components/settings/TasksEditor.tsx', te);

// 8. Withdraw.tsx
let wd = fs.readFileSync('src/components/settings/Withdraw.tsx', 'utf-8');
wd = wd.replace(/formatArabicDate\(w\.createdAt\)/g, 'formatArabicDate(new Date(w.createdAt).toISOString().split("T")[0])');
fs.writeFileSync('src/components/settings/Withdraw.tsx', wd);

// 9. TaskList.tsx
let tl = fs.readFileSync('src/components/TaskList.tsx', 'utf-8');
tl = tl.replace(/state\.balancePiasters/g, 'state.getBalancePiasters()');
tl = tl.replace(/t\.isActive/g, 't.active');
fs.writeFileSync('src/components/TaskList.tsx', tl);

// 10. History.tsx
let hst = fs.readFileSync('src/pages/History.tsx', 'utf-8');
hst = hst.replace(/toHindiNumerals\(streak\)/g, 'toHindiNumerals(streak.current)');
fs.writeFileSync('src/pages/History.tsx', hst);

console.log('Fixes applied.');
