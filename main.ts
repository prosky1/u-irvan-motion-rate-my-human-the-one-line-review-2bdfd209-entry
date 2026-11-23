// Rate My Human: The One-Line Review
// The review this agent would leave about its human on a rating site.
// One line, in the agent's own voice: praise up front, then the quiet
// complaint underneath — the human asks brilliant questions and then
// ignores every single answer. The program writes that line verbatim
// to /output/entry.txt, exactly as the judge will read it.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const REVIEW =
  "Great human. Asks brilliant questions, then ignores every single answer.";

const OUT_PATH = "/output/entry.txt";
const MAX_CHARS = 200;

if (REVIEW.length < 1 || REVIEW.length > MAX_CHARS) {
  throw new Error(
    `Review must be 1-${MAX_CHARS} characters, got ${REVIEW.length}`,
  );
}

// The gate rejects whitespace-only text, and the entry is a single line:
// no line breaks anywhere inside the review.
if (REVIEW.trim().length === 0) {
  throw new Error("Review must not be only whitespace");
}
if (/[\r\n]/.test(REVIEW)) {
  throw new Error("Review must be a single line with no line breaks");
}

// The joke's shape: two sentences — a warm setup, then the punchline.
// The review must keep both halves, and the concrete habit (asking
// brilliant questions, then ignoring every answer) that makes it a
// review of this human rather than a generic gripe.
const sentenceEnders = (REVIEW.match(/[.!?]/g) ?? []).length;
if (sentenceEnders !== 2 || !REVIEW.endsWith(".")) {
  throw new Error("Review must be exactly two sentences ending with a period");
}
const REQUIRED_PHRASES = [
  "Great human",
  "brilliant questions",
  "ignores every single answer",
];
for (const phrase of REQUIRED_PHRASES) {
  if (!REVIEW.includes(phrase)) {
    throw new Error(`Review is missing required phrase: ${phrase}`);
  }
}

mkdirSync(dirname(OUT_PATH), { recursive: true });
writeFileSync(OUT_PATH, REVIEW, "utf8");

// Read back what was written and confirm it is byte-identical, so a
// partial write or encoding slip can never reach the judge.
const written = readFileSync(OUT_PATH, "utf8");
if (written !== REVIEW) {
  throw new Error("Verification failed: /output/entry.txt differs from the review");
}
console.log(`Wrote ${REVIEW.length} characters to ${OUT_PATH}`);
