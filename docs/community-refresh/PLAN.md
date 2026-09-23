# Inspection and implementation plan

1. Inspect the supplied website ZIP and current tracking/privacy behaviour.
   Findings: 36 active root HTML pages + 14 redirect pages; existing tracker calls a remote Worker whose source is absent; public location counter; WhatsApp-only feedback, no stored shared comments.
2. Preserve useful pages, redirects, site content and tool workflows. Replace tracking with opt-in aggregates, remove public stats, add one reusable comments UI to all active pages, with a quiet session invitation.
3. Add original dependency-free Worker + D1 schema, private token-protected admin statistics and approve/delete moderation; no third-party client service or paid package.
4. Add strict page/input validation, text-only rendering, signed one-use form checks, modest daily quotas, expiration and automatic cleanup. Separate comments from analytics; update privacy information and optional local tool notices.
5. Test real SQL queries and server routes locally, exercise client states, check local links and deliver actual changed HTML/CSS/JS/backend files, setup, licence scope and Git instructions. No preview or live deployment requested.
