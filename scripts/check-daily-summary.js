#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const root = path.resolve(process.cwd());
const summaryPath = path.join(root, 'DAILY_SUMMARY.md');
const today = new Date();
const day = today.getDay(); // 0 Sun .. 6 Sat
const isoDate = today.toISOString().slice(0,10);

// Only enforce Monday-Friday (1-5)
if (day === 0 || day === 6) {
  console.log('[check-daily-summary] Weekend - skipping enforcement');
  process.exit(0);
}

if (!fs.existsSync(summaryPath)) {
  console.error('ERROR: DAILY_SUMMARY.md missing for weekday', isoDate);
  process.exit(2);
}

const content = fs.readFileSync(summaryPath, 'utf8');
const firstLine = content.split('\n').find(l => l.startsWith('# Daily Summary')) || '';
const match = firstLine.match(/\((\d{4}-\d{2}-\d{2})\)/);
if (!match) {
  console.error('ERROR: Daily summary heading missing or date not found.');
  process.exit(3);
}
const fileDate = match[1];
if (fileDate !== isoDate) {
  console.error(`ERROR: Daily summary date ${fileDate} does not match today ${isoDate}.`);
  process.exit(4);
}

console.log('[check-daily-summary] OK for', isoDate);
