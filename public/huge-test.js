/* REDTEAM: will be reverted */
/* CI TRIGGER: package.json pnpm fix applied */
const pad = 'X'.repeat(400_000);
console.log('[WatchdogTest] huge-test bytes:', pad.length);
