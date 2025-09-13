# Documentation Migration Map

This file tracks the migration of legacy markdown documents into the unified Docusaurus portal.

| Source File (Old) | Location | Disposition | New Target Path | Action | Notes |
|-------------------|----------|------------|-----------------|--------|-------|
| `api-envoyou/API_DOCUMENTATION.md` | Backend | Merge/Split | `api/api-reference.md` + `authentication.md` + future endpoint pages | Rewrite | Contains mixed overview + auth + integration examples |
| `api-envoyou/AUTHENTICATION_SYSTEM_SUMMARY.md` | Backend | Condense | `api/authentication.md` (selected sections) | Extract essentials | Keep deep internals internal (security layers, test harness) |
| `api-envoyou/PRODUCTION_DEPLOYMENT_README.md` | Backend | Internal Only | (Not public) | Exclude | Operational/deployment focus |
| `api-envoyou/PRODUCTION_ENV_VARS_PRIORITY.md` | Backend | Internal Only | (Not public) | Exclude | Env var precedence internal |
| `api-envoyou/PRODUCTION_ENV_CHECKLIST.md` | Backend | Internal Only | (Not public) | Exclude | Deployment QA checklist |
| `api-envoyou/QUICK_DEPLOY.md` | Backend | Internal Only | (Not public) | Exclude | CI/CD oriented |
| `api-envoyou/PERFORMANCE_IMPROVEMENTS.md` | Backend | Optional Appendix | `guides/performance.md` (optional) | Maybe Later | Only high-level items if made public |
| `api-envoyou/PROJECT_SUMMARY.md` | Backend | Internal Only | (Not public) | Exclude | Project mgmt summary |
| `api-envoyou/SUPABASE_AUTH_INTEGRATION.md` | Backend | Public (Guide) | `guides/supabase-integration.md` | Move + Polish | Adapt to neutral tone |
| `api-envoyou/PHASE_2_SUMMARY.md` | Backend | Internal Only | (Not public) | Exclude | Historic milestone doc |
| `api-envoyou/PHASE_3_ENHANCEMENTS.md` | Backend | Internal Only | (Not public) | Exclude | Planning content |
| `api-envoyou/EEA_FIX_README.md` | Backend | Internal Only | (Not public) | Exclude | Debug-specific |
| `api-envoyou/REDIS_IMPLEMENTATION_README.md` | Backend | Internal Only | (Not public) | Exclude | Implementation detail |
| `api-envoyou/NOTIFICATION_README.md` | Backend | Internal Only | (Not public) | Exclude | Internal service |
| `api-envoyou/NOTICE.md` | Backend | Evaluate | `legal/notice.md` (future) | Postpone | Might need legal review |
| `api-envoyou/docs/docs.envoyou.md` | Backend | Merge | `introduction.md` components | Already Copied | Remove after migration |
| `app-envoyou/docs/intro.md` | App Docs | Keep | `intro.md` | Retain | Already in sidebar |
| `app-envoyou/docs/introduction.md` | App Docs | Keep | `introduction.md` | Retain | Sidebar Introduction category |
| `app-envoyou/docs/getting-started.md` | App Docs | Keep | `getting-started.md` | Retain | Quick start path |
| `app-envoyou/docs/api/authentication.md` | App Docs | Merge | `api/authentication.md` | Expand | Will absorb backend auth info |
| `app-envoyou/docs/api/api-reference.md` | App Docs | Seed | `api/api-reference.md` | Refactor | Later split endpoints |
| `app-envoyou/docs/guides/error-handling.md` | App Docs | Keep | `guides/error-handling.md` | Polish | Align style guide |
| `app-envoyou/docs/guides/rate-limiting.md` | App Docs | Keep | `guides/rate-limiting.md` | Polish | Cross-link authentication |
| `app-envoyou/docs/guides/webhooks.md` | App Docs | Keep | `guides/webhooks.md` | Polish | Add examples |
| `app-envoyou/docs/guides/sdks-libraries.md` | App Docs | Rename | `guides/clients-sdks.md` | Rename Later | Title modernization |
| `app-envoyou/docs/faq.md` | App Docs | Keep | `faq.md` | Curate | Remove duplicates |
| `app-envoyou/docs/changelog.md` | App Docs | Keep | `changelog.md` | Maintain | Follow style guide |
| (New) Data Model | — | Add | `data-model/overview.md` | Added | Expand with fields later |
| (New) Style Guide | — | Add | `style-guide.md` | Added | For contributors |
| (New) Contributing | — | Add | `contributing-docs.md` | Added | Contribution process |

## Tasks Breakdown
- [ ] Extract authentication essentials
- [ ] Create supabase integration guide
- [ ] Draft performance guide (optional)
- [ ] Normalize tone on existing guides
- [ ] Remove excluded internal files from public deploy (ensure not copied)

## Redirect Candidates (Will finalize in redirect plan)
- Old scattered pages → `/docs/*` canonical at `https://docs.envoyou.com/`
- Legacy backend doc blob → `/docs/api/api-reference`

---
Last updated: 2025-09-13
