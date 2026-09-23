# Activate the free community service

The delivered website contains the actual comments UI and private dashboard.
It is deliberately inactive until YOUR Cloudflare backend is configured.
Publishing static HTML alone cannot store shared comments or authenticate an administrator.
No backend has been deployed and no account/billing settings have been changed for you.

## 1. Check the account plan before creating anything

Use **Workers Free**, with D1 on that Free account. Check Workers & Pages → plan/billing in the Cloudflare dashboard; a domain's Free plan is not the same as the Workers account plan. If Workers is already Paid, do not deploy this service there under a zero-cost requirement. Use a Workers Free account instead. Do not accept an upgrade, trial requiring payment, paid add-on or paid resource.

The code cannot read or enforce the account's billing plan. An app quota is not a billing cap. On Workers Free, Cloudflare stops requests/queries at its free limits. Never upgrade to fix a quota error. Limits are account-wide and other Workers use the same allowance.

This implementation uses only Workers + D1. No Turnstile, analytics subscription, Google service, AI API, email delivery, KV, R2, image service or paid package is added. Cloudflare is a hosted free-plan service governed by its terms, not MIT-licensed software. All new application code is original and supplied under MIT; no third-party runtime library is bundled.

## 2. Create the D1 database (browser only; no installation required)

1. Sign in to your Cloudflare Free account.
2. Open Storage & databases → D1 (labels may vary) and create `podaturpet-community`.
3. Open its SQL console. Run the SQL statements in `schema.sql`. If the console accepts one statement at a time, run them individually in file order. This creates only new community tables.
4. Do not connect this schema to the unknown old tracker database. The new service starts with empty counts/comments; no fake history is inserted.

## 3. Create the Worker

1. In Workers & Pages, create a Worker named `podaturpet-community` using the basic Worker starter (no paid template).
2. Open its code editor, replace the starter with the entire contents of `worker-dashboard.mjs`, and deploy. This is a generated **single ES-module file**, so there are no imports to upload separately. Without configuration the service returns “Service is not enabled.”
3. In Worker settings/bindings, add the D1 binding named **DB**, pointing to the database created above.
4. In Worker settings, add these plain text variables:
   - `ALLOWED_ORIGINS`: `https://podaturpet.com,https://www.podaturpet.com`
   - `ENABLED`: `false` during setup, then `true` after completing the remaining settings.
5. Generate two separate random values locally in Terminal, one command at a time:

   ```sh
   openssl rand -hex 32
   ```

   Save the first as an encrypted Worker secret named `ADMIN_TOKEN`; save the second as `FORM_SECRET`. Keep the admin token in your password manager. Do not paste either into HTML, JavaScript, this repository, a URL, chat or a screenshot. Never use the example strings from tests.
6. Disable Worker Observability/log collection. Do not add console logs, request-body logging or Logpush. Review Cloudflare account/security logging separately; the hosting network still receives IP addresses.
7. Add the daily cron trigger `15 2 * * *` for automatic retention cleanup (02:15 UTC). Reads also exclude expired comments if a cleanup is delayed.
8. Set `ENABLED` to `true`, save/deploy settings. Copy the actual HTTPS `workers.dev` origin displayed for your Worker. Do not guess the account subdomain.

Alternatively, `wrangler.toml` supports an existing local Wrangler installation: insert your D1 database ID, add the secrets through Wrangler, run schema.sql against the new remote DB, set ENABLED, then deploy. The browser procedure above requires no CLI package. `wrangler.toml` defaults to disabled and disables observability. Never publish `.dev.vars`, `.env` or tokens.

## 4. Connect and publish the static website

Edit **only the public endpoint setting** in `podaturpet-community-config.js`:

```js
window.PodaturpetCommunity = Object.freeze({
  apiBase: 'https://YOUR-ACTUAL-WORKER.YOUR-ACCOUNT.workers.dev'
});
```

Use the actual origin, no `/v1` suffix. No token goes here. The UI deliberately accepts only HTTPS workers.dev origins. Commit/push the updated site using the supplied Git commands. If changing configuration later, bump the configuration script's version query on pages so cached browsers receive it.

Visit `https://podaturpet.com/community-admin.html` and enter your admin token. The page itself is public static HTML with no data; all database access is protected by server-side token checks. It is noindex and is not in navigation/sitemap. Token lives only in memory, clears on sign-out/tab exit and after 15 minutes of inactivity. Use a trusted device, close the tab afterwards, and rotate the Worker secret if exposed. Do not add third-party scripts to the admin page.

## 5. Verify with your own real test

- Decline analytics: there should be no `/v1/view` request in browser Network.
- Allow analytics: exactly one count for that page load. Reload to count a new page view. Select “No thanks” to stop future loads being counted. Counts are page loads, not people.
- Submit a clearly labelled test comment. It should be pending, invisible in the public list, and visible only in your private queue.
- Approve it; refresh the public comments. Delete it; refresh again. Remove the test after verification.
- Open the admin page in a signed-out/private browser: no statistics or pending comments should be available.
- Test a Tamil page and a mobile device. Invitation appears once per tab session after 30 seconds when the visitor is not typing. “Add your comments” remains available on every active page.

## 6. Retire the old tracking endpoint

The uploaded ZIP had frontend calls to an existing `podaturpet-visitor-tracker` Worker but did not include its backend. This update removes those calls and the public visitor counter. It does NOT delete the old remotely stored records or disable the old `/stats` endpoint.

After verifying the replacement, disable the old Worker/route in your Cloudflare account, or have its owner restrict its public statistics endpoint and apply the appropriate retention/deletion policy. Review any old database and hosting logs separately. Do not claim historical IP data has been removed until verified. Old cached browser pages may continue calling that Worker until it is disabled.

## Limits and operation

- App cap: 5,000 accepted analytics calls and 100 comment submissions per UTC day. Counters include some failed/repeated attempts; caps limit availability, not billing.
- Free Workers currently: 100,000 requests/day per account; D1 Free: 5 million rows read/day, 100,000 rows written/day, 5 GB total storage. Provider limits may change; see COST-AND-LICENCES.md and the official links before enabling.
- Every list read and spam-check request also consumes free requests. Abuse or frequent dashboard refreshes can exhaust the allowance. Counts/comments then fail gracefully; the static website remains usable. This is deliberately not an unlimited service.
- Signed, one-use form tokens, a small proof-of-work, honeypot, no comment links and mandatory moderation reduce spam. They are not a guarantee against bots; a determined attacker can consume the free quota. Set ENABLED=false to pause the service if needed.
- Analytics records: 90 days. Pending comments: 30 days. Approved comments: 365 days from submission. Review daily and delete privacy/copyright reports promptly. Provider recovery copies/logs have separate retention.
- API accepts known public page paths only. After adding a page: run `python3 tools/community_layout.py`, then `python3 community-worker/build-dashboard.py`, redeploy the Worker and publish the new static files. Redirect aliases point to their real destination; they do not collect separate comments.

No account was accessed, no live service was deployed, and no charge was incurred by this implementation process.
