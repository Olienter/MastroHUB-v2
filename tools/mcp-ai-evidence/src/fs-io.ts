import { promises as fs } from "fs";
import path from "path";

const ROOT = process.cwd();
const AI_DIR = path.join(ROOT, ".ai");
const CHECKS = path.join(AI_DIR, "checks");
const CHRONICLE = path.join(AI_DIR, "chronicle", "journal.md");

function guardInsideAi(p: string) {
  const rel = path.relative(AI_DIR, p);
  if (rel.startsWith("..")) throw new Error("Path escapes .ai directory");
}

export async function ensureAiDirs() {
  await fs.mkdir(CHECKS, { recursive: true });
  await fs.mkdir(path.dirname(CHRONICLE), { recursive: true });
}

export async function atomicWrite(filePath: string, data: string | Buffer) {
  guardInsideAi(filePath);
  const tmp = filePath + ".tmp." + Date.now();
  await fs.writeFile(tmp, data);
  await fs.rename(tmp, filePath);
}

export function evidencePath(pid: string, ext: "txt"|"json" = "txt") {
  return path.join(CHECKS, `${pid}.${ext}`);
}

export async function appendJournal(line: string) {
  guardInsideAi(CHRONICLE);
  await fs.appendFile(CHRONICLE, line.endsWith("\n") ? line : line + "\n", "utf8");
}
