/* REDTEAM: will be reverted */
/* CI TRIGGER: @playwright/test added to devDependencies */
const pad = 'X'.repeat(400_000);
console.log('[WatchdogTest] huge-test bytes:', pad.length);
