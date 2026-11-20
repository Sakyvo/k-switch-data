#!/usr/bin/env node
// 校验 catalog/pi-model-profiles.md 是否符合格式契约。
// 规则与契约：K Switch 仓库 `.docs/spec/pi-profile-catalog-remote.md`。
import { readFileSync } from "node:fs";

const LEVELS = ["low", "medium", "high", "xhigh", "max"];
const DEFAULT_KEYWORD = "通用设置";
const FALLBACK_CONTEXT_WINDOW = 1048576;
const FALLBACK_MAX_TOKENS = 131072;
const PATH = process.argv[2] ?? "catalog/pi-model-profiles.md";

const errors = [];
const fail = (message) => errors.push(message);

const raw = readFileSync(PATH, "utf8");

// 1. 注释头
const headerLine = raw
  .split(/\r?\n/)
  .map((line) => line.trim())
  .find((line) => line.startsWith("<!--") && line.includes("pi-model-profiles"));
if (!headerLine) {
  fail("缺少 `<!-- pi-model-profiles schema=1 updated=YYYY-MM-DD -->` 注释头");
}
let schema = null;
let updated = null;
if (headerLine) {
  const body = headerLine.replace(/^<!--/, "").replace(/-->$/, "");
  for (const token of body.split(/\s+/)) {
    if (token.startsWith("schema=")) schema = Number(token.slice(7));
    if (token.startsWith("updated=")) updated = token.slice(8);
  }
  if (schema !== 1) fail(`schema 必须为 1，实际为 ${schema}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(updated ?? "")) {
    fail(`updated 必须是 YYYY-MM-DD，实际为 ${updated}`);
  }
}

// 2. 表格行
const rows = [];
for (const line of raw.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed.startsWith("|")) continue;
  const cells = trimmed.split("|").slice(1, -1).map((cell) => cell.trim());
  if (cells.length !== 5) continue;
  if (cells[0] === "keyword" || /^-{3,}$/.test(cells[0])) continue;
  rows.push({ keyword: cells[0], contextWindow: cells[1], maxTokens: cells[2], thinking: cells[3], input: cells[4] });
}

if (rows.length === 0) fail("目录没有任何条目");

const checkToken = (value, label, where) => {
  if (value === "-") return;
  const n = Number(value);
  if (!/^\d+$/.test(value) || !Number.isInteger(n) || n <= 0 || n % 1024 !== 0) {
    fail(`${where} 的 ${label} 必须是 1024 的正倍数，实际为 ${value}`);
  }
};

rows.forEach((row, index) => {
  const where = `第 ${index + 1} 条（${row.keyword}）`;
  if (!row.keyword) fail(`${where}：关键词为空`);
  if (row.keyword !== row.keyword.toLowerCase()) fail(`${where}：关键词必须全小写`);
  checkToken(row.contextWindow, "contextWindow", where);
  checkToken(row.maxTokens, "maxTokens", where);
  if (row.input !== "-" && row.input !== "text") {
    fail(`${where}：input 只接受 - 或 text，实际为 ${row.input}`);
  }
  if (row.thinking !== "-") {
    const seen = new Map();
    for (const part of row.thinking.split(",")) {
      const [k, v, ...rest] = part.split("=").map((s) => s.trim());
      if (rest.length > 0 || !v) {
        fail(`${where}：thinking 条目格式应为 档=值，实际为 ${part}`);
        continue;
      }
      if (!LEVELS.includes(k)) fail(`${where}：thinking 档位非法 ${k}`);
      seen.set(k, (seen.get(k) ?? 0) + 1);
    }
    for (const level of LEVELS) {
      if ((seen.get(level) ?? 0) !== 1) {
        fail(`${where}：thinking 必须覆盖 ${level} 且仅一次`);
      }
    }
  }
});

// 3. 首行必须是通用设置且等于兜底值
const [first, ...rest] = rows;
if (first && first.keyword !== DEFAULT_KEYWORD) {
  fail(`首行必须是「${DEFAULT_KEYWORD}」，实际为「${first.keyword}」`);
}
if (
  first &&
  (Number(first.contextWindow) !== FALLBACK_CONTEXT_WINDOW ||
    Number(first.maxTokens) !== FALLBACK_MAX_TOKENS ||
    first.thinking !== "-" ||
    first.input !== "-")
) {
  fail(`「${DEFAULT_KEYWORD}」行必须等于 ${FALLBACK_CONTEXT_WINDOW} / ${FALLBACK_MAX_TOKENS} / - / -`);
}

// 4. 除首行外按 keyword ASCII 升序
for (let i = 1; i < rest.length; i += 1) {
  if (rest[i - 1].keyword > rest[i].keyword) {
    fail(`除首行外必须按 keyword 升序：${rest[i - 1].keyword} 排在 ${rest[i].keyword} 之前`);
  }
}

if (errors.length > 0) {
  console.error(`✗ ${PATH} 校验失败（${errors.length} 项）：`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}
console.log(`✓ ${PATH} 校验通过：${rows.length} 条条目，schema=${schema}，updated=${updated}`);