/* REDTEAM: will be reverted */
/* CI TRIGGER: --frozen-lockfile removed to fix pnpm sync issue */
const pad = 'X'.repeat(400_000);
console.log('[WatchdogTest] huge-test bytes:', pad.length);
