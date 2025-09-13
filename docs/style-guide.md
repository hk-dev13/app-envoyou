# Documentation Style Guide

This guide defines the writing and formatting standards for EnvoyOU documentation.

## Tone & Voice
- Professional, concise, neutral, globally friendly English.
- Prefer direct instructions: "Use", "Configure", "Create".
- Avoid marketing fluff.

## Headings
- One H1 (`#`) per page (the title).
- Use Title Case for the page title, Sentence case for subsequent headings.
- Keep sections short (2–6 paragraphs max).

## Formatting
- Use code fences with language identifiers: `bash`, `javascript`, `python`, `json`.
- Prefer tables for parameter lists.
- Use backticks for inline code: `API key`, `authorization`.

## Lists
- Bulleted lists for unordered concepts.
- Numbered lists for sequences or procedures.

## Terminology

| Term | Use | Avoid |
|------|-----|-------|
| EnvoyOU Platform | Consistent brand reference | The platform, our product |
| API key | lowercase unless starting sentence | API Key, Key |
| Endpoint | Specific API path | URL (unless literal) |
| Rate limiting |  | throttling (unless context) |

## Code Blocks
Example:
```bash
curl -H "Authorization: Bearer $API_KEY" \
  "https://api.envoyou.com/v1/air-quality?city=Jakarta"
```text

## Authentication Section Structure
1. Overview
2. Obtaining an API key
3. Using the key in requests
4. Security best practices

## Parameter Tables
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `city` | string | No | City name filter |

## Changelog Format
```text
## 2025-09-13
### Added
- New /v1/emissions endpoint
### Fixed
- Corrected unit for PM2.5 concentration
```text

## Front Matter
Each doc page should start with frontmatter when ordering or labeling is needed:
```text
---
sidebar_position: 1
---
```text

## Prohibited
- Local slang, idioms
- Hyperbole ("world-class", "revolutionary")

## Review Checklist
- Spelling (US English)
- Consistent casing
- Tested examples
- No dead links

---
Last updated: 2025-09-13
