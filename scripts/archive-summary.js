#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const root = path.resolve(process.cwd());
const summaryPath = path.join(root, 'DAILY_SUMMARY.md');
const archiveDir = path.join(root, 'docs', 'internal', 'daily-archive');
const indexFile = path.join(archiveDir, 'index.json');
const docsCopyDir = path.join(root, 'docs', 'internal');

function ensureDir(p) { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); }

if (!fs.existsSync(summaryPath)) {
  console.error('DAILY_SUMMARY.md not found at', summaryPath);
  process.exit(1);
}

let content = fs.readFileSync(summaryPath, 'utf8');
// Extract date from first heading line: # Daily Summary (YYYY-MM-DD)
const firstLine = content.split('\n').find(l => l.startsWith('# Daily Summary')) || '';
const dateMatch = firstLine.match(/\((\d{4}-\d{2}-\d{2})\)/);
const dateStr = dateMatch ? dateMatch[1] : new Date().toISOString().slice(0,10);

ensureDir(archiveDir);

const archiveFile = path.join(archiveDir, `${dateStr}.md`);
let index = { entries: [] };
if (fs.existsSync(indexFile)) {
  try { index = JSON.parse(fs.readFileSync(indexFile,'utf8')); } catch { index = { entries: [] }; }
}
let previous = index.entries.filter(e => e.date < dateStr).sort((a,b) => a.date.localeCompare(b.date)).pop() || null;
let currentCommit = '';
try { currentCommit = execSync('git rev-parse HEAD',{cwd:root}).toString().trim(); } catch { /* ignore */ }

if (!fs.existsSync(archiveFile)) {
  fs.writeFileSync(archiveFile, content, 'utf8');
  index.entries.push({ date: dateStr, file: path.basename(archiveFile), commit: currentCommit });
  console.log('Archived summary to', path.relative(root, archiveFile));
} else {
  console.log('Archive already exists for date', dateStr, '- skipping');
  // ensure index has entry
  if (!index.entries.find(e => e.date === dateStr)) {
    index.entries.push({ date: dateStr, file: path.basename(archiveFile), commit: currentCommit });
  }
}

// Prune old archives (keep last N)
const KEEP_DAYS = parseInt(process.env.ARCHIVE_KEEP_DAYS || '14', 10);
let allArchives = fs.readdirSync(archiveDir).filter(f => /\d{4}-\d{2}-\d{2}\.md$/.test(f)).sort();
if (allArchives.length > KEEP_DAYS) {
  const toDelete = allArchives.slice(0, allArchives.length - KEEP_DAYS);
  toDelete.forEach(f => {
    fs.unlinkSync(path.join(archiveDir, f));
    console.log('Pruned old archive', f);
    index.entries = index.entries.filter(e => e.file !== f);
  });
}

// Persist index
fs.writeFileSync(indexFile, JSON.stringify(index, null, 2));

// Append changelog diff section (git log since previousDate)
if (previous && previous.commit) {
  try {
    const diffFiles = execSync(`git diff --name-only ${previous.commit}...${currentCommit}`, { cwd: root, stdio: ['ignore','pipe','ignore'] }).toString().trim().split('\n').filter(Boolean);
    if (diffFiles.length) {
      const list = diffFiles.map(f => `- ${f}`).join('\n');
      content += `\n\n## Changed Files (since ${previous.date})\n${list}\n`;
    }
  } catch (e) {
    console.warn('Could not append changed files list:', e.message);
  }
} else {
  content += `\n\n<!-- No previous commit reference available for diff -->\n`;
}

// Also expose a docs page (rolling) for latest summary
ensureDir(docsCopyDir);
const docsLatest = path.join(docsCopyDir, 'daily-summary.md');
const banner = `---\nid: daily-summary\nslug: /internal/daily-summary\nsidebar_label: Daily Summary\n---\n\n`;
fs.writeFileSync(docsLatest, banner + content, 'utf8');
console.log('Updated docs latest summary at', path.relative(root, docsLatest));
