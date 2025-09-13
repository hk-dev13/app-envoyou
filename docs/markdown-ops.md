# Markdown Operations Helpers

These helper scripts reduce noise and enable incremental cleanup without breaking builds.

## Scripts

| Script | Purpose | Notes |
|--------|---------|-------|
| `npm run md:lint` | Lint whole docs tree | Uses relaxed config currently |
| `npm run md:lint:fix` | Auto-fix simple issues | Only spacing & some list formats |
| `npm run md:fences:check` | Detect unlabeled code fences | Count empty ``` occurrences |
| `npm run md:lint:changed` | Lint only changed docs vs main | Requires local `origin/main` up to date |

## Workflow Suggestions

First While editing docs, run: `npm run md:lint:changed` for fast feedback.  
2. Before PR merge, run full: `npm run md:lint`.  
3. Phase 1 goal: Drive `md:fences:check` output to zero, then re-enable MD040.  
4. Use `md:lint:fix`, then manually adjust any remaining complex cases.  

## FAQ
**Why relaxed rules?** Large import created many spacing issues; phased approach prevents blocking feature work.
**Will CI enforce stricter rules later?** Yes, after Phase 2 we re-enable MD040, then MD031/MD032, then MD022.

## Re-Enabling a Rule
Edit `.markdownlint.jsonc`, remove the corresponding `false`, run `npm run md:lint`, fix remaining offenses, commit.
