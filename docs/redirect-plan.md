# Redirect Plan

Purpose: Consolidate all legacy documentation URLs to the unified docs portal at `https://docs.envoyou.com`.

## Netlify `_redirects` Entries (Landing & App Projects)
```text
/docs/*                https://docs.envoyou.com/:splat                301
/app/docs/*            https://docs.envoyou.com/:splat                301
/api/documentation     https://docs.envoyou.com/docs/api/api-reference 301
/api/docs              https://docs.envoyou.com/                      301
/env/docs/*            https://docs.envoyou.com/:splat                301
```text

## API Subdomain (api.envoyou.com)
If an Nginx layer sits in front:
```text
location ~ ^/(api-documentation|documentation|docs/?$) {
  return 301 https://docs.envoyou.com/;
}
```text

If keeping interactive Swagger at `/docs`:
- Keep `/docs` live
- Add banner in Swagger UI linking to "Full Portal" (manual HTML injection or custom index)

## Removal / Decommission Checklist
- [ ] Remove old inline docs links from landing page components
- [ ] Replace any `/api/documentation` references in marketing with `/docs/`
- [ ] Search codebase for hardcoded `API_DOCUMENTATION.md` references
- [ ] Verify 301 responses using `curl -I`

## Verification Commands
```bash
# Example verification after deploy
for p in /docs /app/docs/intro /api/documentation ; do
  curl -I https://envoyou.com$p | grep -E "HTTP|Location"; echo; done
```text

## Monitoring
- Add temporary logging (e.g. edge function) to count hits to redirected legacy paths for 14 days.

---
Last updated: 2025-09-13
