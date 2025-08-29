import { spawn, exec } from "node:child_process";

const PORT = process.env.PORT || "3000";
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function run() {
  console.log(":: build");
  await $(`pnpm`, ["run", "build"]);

  console.log(":: start");
  // Fix: Use pnpm and correct start command
  const srv = exec(`pnpm run start`, {
    stdio: "pipe",
    env: { ...process.env, PORT },
  });

  // wait for server to boot
  await wait(5000); // Increased wait time

  try {
    console.log(":: testing health endpoint");
    const health = await (
      await fetch(`http://127.0.0.1:${PORT}/api/health`)
    ).json();
    console.log(":: testing home endpoint");
    const home = await fetch(`http://127.0.0.1:${PORT}/`);

    const result = {
      port: PORT,
      health,
      homeStatus: home.status,
      ok: health?.status === "healthy" && home.status === 200,
      ts: new Date().toISOString(),
    };
    console.log(":: result", JSON.stringify(result, null, 2));

    // Graceful shutdown
    console.log(":: shutting down server");
    srv.kill("SIGTERM");
    await wait(1000);
    if (srv.exitCode === null) {
      srv.kill("SIGKILL");
    }

    process.exit(result.ok ? 0 : 1);
  } catch (e) {
    console.error(":: smoke error", e);
    srv.kill("SIGTERM");
    await wait(1000);
    if (srv.exitCode === null) {
      srv.kill("SIGKILL");
    }
    process.exit(1);
  }
}

function $(cmd, args) {
  return new Promise((res, rej) => {
    const p = exec(`${cmd} ${args.join(" ")}`, { stdio: "inherit" });
    p.on("close", (code) =>
      code === 0 ? res() : rej(new Error(cmd + " exit " + code))
    );
  });
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
