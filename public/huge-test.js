/* REDTEAM: will be reverted */
/* CI TRIGGER: Playwright testDir path fixed for CI environment */
const pad = "X".repeat(400_000);
console.log("[WatchdogTest] huge-test bytes:", pad.length);
