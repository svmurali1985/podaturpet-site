# Community analytics — supersedes the previous tracker notes

The old visitor tracker/counter calls are retired. The new Worker source is in `community-worker/` and starts inactive until configured. See `community-worker/SETUP.md`.

Only explicitly consenting page loads are counted. No click funnels, campaign tags, referrer, personal entries, visitor IDs or browsing histories are collected by this new backend. Existing local tool counters remain device-only and optional. Contact handoffs do not imply enquiries received or orders.

`community-admin.html` provides authenticated page/day/approximate country/region/city aggregates and comment moderation. It cannot identify anonymous visitors. Repeat loads count again, privacy choices and free-service limits reduce totals, and locations may be inaccurate. Old historic metrics are not imported.

All 36 active public pages include comments and the optional page-count controls once configured. The 14 redirect pages remain unchanged. No paid dependency is added. The old remote Worker/database was not supplied; disable or restrict its public stats separately after migration.
