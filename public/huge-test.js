/* REDTEAM: will be reverted */
/* CI TRIGGER: Playwright webServer config + watchdog test updated */
const pad = 'X'.repeat(400_000);
console.log('[WatchdogTest] huge-test bytes:', pad.length);
