/* REDTEAM: will be reverted */
/* CI TRIGGER: explicit --no-frozen-lockfile to override pnpm action default */
const pad = 'X'.repeat(400_000);
console.log('[WatchdogTest] huge-test bytes:', pad.length);
