# Documentation Automation Plan

## Goals

- Keep API reference synced with actual backend.
- Prevent drift in authentication + rate limit docs.
- Auto-validate OpenAPI before merge.

## Candidates

| Automation | Tool | Priority | Notes |
|------------|------|----------|-------|
| OpenAPI validation | swagger-cli | High | Blocks PR if invalid |
| Changelog anchor check | custom node script | Medium | Ensures date ordering |
| Dead link check | docusaurus build (onBrokenLinks=throw) | High | Already active |
| Lint markdown style | remark-lint | Medium | Optional phase 2 |
| API schema diff report | custom script + saved baseline | Low | Later |

## Scripts (Proposed)

`scripts/validate-openapi.sh`

```bash
#!/usr/bin/env bash
set -euo pipefail
npx swagger-cli validate openapi/envoyou-api.yaml
```text

`scripts/lint-markdown.sh`

```bash
#!/usr/bin/env bash
set -euo pipefail
npx remark . --frail
```text

## GitHub Actions Outline

```yaml
name: docs-ci
on: [pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: bash scripts/validate-openapi.sh
      - run: npm run docs:build
```text

## Future

- Generate TypeScript client: `openapi-typescript` → `sdk/`
- Publish package to npm (optional)

---
Last updated: 2025-09-13
