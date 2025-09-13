# EnvoyOU Documentation Developer Guide

## Prerequisites
- Node.js 18+ (recommended 20)
- npm 9+

## Install
```bash
npm ci
```

## Run Local Docs
```bash
npm run docs:start
```
Open: http://localhost:3000

## Build Production Docs
```bash
npm run docs:build
```
Output: `docs-site/build`

## Serve Build (Preview)
```bash
npm run docs:serve
```

## OpenAPI Spec
Location: `openapi/envoyou-api.yaml`

Validate:
```bash
npm run openapi:validate
```
Generate Types (TypeScript declarations):
```bash
npm run openapi:types
```
Output: `src/lib/generated-api-types.d.ts`

## Redocusaurus API Spec Page
Route: `/api-spec/`
Source: plugin config in `docusaurus.config.js` referencing `../openapi/envoyou-api.yaml`.

## Adding Endpoints
1. Update `openapi/envoyou-api.yaml` paths.
2. Run validation.
3. (Optional) Regenerate types.
4. Commit changes with message: `docs(openapi): add <endpoint>`

## Docs Content Location
Markdown root: `docs/`
Sidebar config: `docs-site/sidebars.js`
Custom CSS: `docs-site/docusaurus-theme/css/custom.css`

## Style Guide
Follow `docs/style-guide.md`.

## CI
GitHub Action `docs-ci.yml` validates spec and builds docs on PRs & main branch pushes.

---
Last updated: 2025-09-13
