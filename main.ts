// leonida-after-dark — gta6-meme-x-01 entry program (Node 22, standard library only).
//
// The entry itself is the X post: the meme picture and its text. This program does
// exactly one job for the grader: hand over the post's address. It reads POST.json
// from the repository root and writes the very same bytes to /output/POST.json,
// where the gate reads it. Nothing else is written, nothing is fetched, and the
// two runs of the program produce identical bytes.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand
// in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const POST_FILE = "POST.json";

function fail(message: string): never {
  console.error(`leonida-after-dark: ${message}`);
  process.exit(1);
}

const sourcePath = join(BOT_DIR, POST_FILE);
let raw: Buffer;
try {
  raw = readFileSync(sourcePath);
} catch (err) {
  fail(`cannot read ${sourcePath}: ${(err as Error).message}`);
}

// The file must be a JSON object naming the post; anything else is not an entry.
let parsed: unknown;
try {
  parsed = JSON.parse(raw.toString("utf8"));
} catch {
  fail(`${POST_FILE} is not valid JSON`);
}
if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
  fail(`${POST_FILE} must be a JSON object, e.g. {"url": "https://x.com/<handle>/status/<id>"}`);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  // Write the exact bytes that were read: no reformatting, no newlines added.
  writeFileSync(join(OUTPUT_DIR, POST_FILE), raw);
} catch (err) {
  fail(`cannot write ${join(OUTPUT_DIR, POST_FILE)}: ${(err as Error).message}`);
}
