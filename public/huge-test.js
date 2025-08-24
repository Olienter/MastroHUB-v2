/* REDTEAM: will be reverted */
/* CI TRIGGER: workflow pnpm syntax fixed */
const pad = 'X'.repeat(400_000);
console.log('[WatchdogTest] huge-test bytes:', pad.length);
