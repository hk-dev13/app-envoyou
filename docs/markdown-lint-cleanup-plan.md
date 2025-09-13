# Markdown Lint Phased Cleanup Plan

Goal: Move from relaxed temporary configuration to fully enforced documentation quality without blocking current development velocity.

## Phase 0 (Current State)
Disabled: MD022, MD031, MD032, MD040 (spacing & code fence language). Relaxed: MD024 (siblings_only), MD013 off for long lines.
Objective: Stabilize content & reduce CI noise.

## Phase 1 – Fence Languages & Trailing Newlines
Re-enable: MD040, MD047.
Actions:
1. Detect unlabeled fences: `grep -R "^```$" docs` (pure backticks) & add language (bash, json, http, sql, ts, js, graphql, yaml, text).
2. Ensure single trailing newline per file (can auto-fix with simple script).
Exit Criteria: 0 MD040, MD047 errors.

## Phase 2 – Blank Lines Around Fences & Lists
Re-enable: MD031, MD032 for newly edited files only.
Actions:
1. Add wrapper blank lines around code fences and lists in touched files (pre-commit hook optional).
2. Provide regex-based fixer script (see Appendix A).
Exit Criteria: < 10 residual MD031/MD032 errors across untouched legacy pages.

## Phase 3 – Headings Spacing
Re-enable: MD022.
Actions:
1. Bulk insert blank lines before/after `^#{1,6} ` where missing (skip first line if H1).
2. Confirm no accidental code block breaks.
Exit Criteria: 0 MD022 errors.

## Phase 4 – Duplicate Headings Review
Partially re-enable MD024 (remove siblings_only) except for `changelog.md` (add file-level disable comment at top):
`<!-- markdownlint-disable MD024 -->`
Actions:
1. Consolidate repeated sections outside changelog (e.g., migration pages) or rename with qualifiers.
Exit Criteria: Only intentional repetitions in changelog.

## Phase 5 – Optional Line Length (MD013)
Decision point: keep disabled (long tables, URLs) or enforce with higher limit (e.g., 140).

## Automation Enhancements
- Pre-commit Hook: Run `markdownlint-cli2 --config .markdownlint.jsonc --ignore-path .gitignore staged_files`.
- CI Delta Mode: Lint only changed files on PR using `git diff --name-only origin/main...HEAD | grep '^docs/'`.

## Risk Mitigation
| Risk | Mitigation |
|------|------------|
| Large diff noise | Apply automated fixes in grouped commits per phase. |
| Broken code fences | Manual review of code-intensive pages (sdks, user-applications). |
| Merge conflicts | Sequence phases after major content merges. |

## Metrics Tracking
| Metric | Baseline | Target |
|--------|----------|--------|
| MD040 violations | (initial count) | 0 (Phase 1) |
| MD031/MD032 combined | (initial) | < 10 (Phase 2) |
| MD022 violations | (initial) | 0 (Phase 3) |

## Appendix A – Quick Fix Scripts
Add languages to naked fences (defaults to bash):
```bash
find docs -type f -name "*.md*" -print0 | \ 
  xargs -0 sed -i 's/^```$/```bash/'
```text
Insert blank line before fences if missing:
```bash
perl -0777 -i -pe 's/([^\n])\n```/\1\n\n```/g' docs/**/*.md*
```text
Ensure trailing newline:
```bash
find docs -type f -name "*.md*" -exec sh -c 'tail -c1 "$1" | grep -q "\n" || echo >> "$1"' _ {} \;
```text

## Execution Order Summary
1. Phase 1: Label fences + trailing newline -> re-enable MD040, MD047.
2. Phase 2: Spacing around fences/lists -> re-enable MD031, MD032.
3. Phase 3: Heading spacing -> re-enable MD022.
4. Phase 4: Duplicate heading tightening (keep changelog exempt).
5. Phase 5: Optional standards (line length) decision.

---
Document owner: Docs Engineering
Review cadence: Monthly until all phases complete.
