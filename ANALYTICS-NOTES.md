# Audience journeys and group sharing

Use these links for your own posts. They lead into the same website while identifying the campaign:

- Wholesale WhatsApp group: https://podaturpet.com/?utm_source=whatsapp&utm_medium=group&utm_campaign=wholesale-buyers
- Town WhatsApp group: https://podaturpet.com/?utm_source=whatsapp&utm_medium=group&utm_campaign=town-community
- Local businesses on Facebook: https://podaturpet.com/?utm_source=facebook&utm_medium=group&utm_campaign=local-businesses

The existing navigation script propagates campaign tags through internal links. The tracker sends only approved tag values in the campaign object. It excludes arbitrary query parameters, contact form contents, and referrer query strings. Existing Global Privacy Control and Do Not Track checks are preserved. It does not run on localhost.

## What to measure

| Audience | Journey |
|---|---|
| Wholesale | Catalogue view → product interest → contact-app handoff → actual received enquiry → confirmed order |
| Town visitors | Town guide → stories / directions / useful information |
| Local businesses | Directory → contribution form → submitted message → reviewed listing |

A WhatsApp or email click is a handoff, not a received enquiry or an order. Keep a separate private enquiry log with received date, campaign if known, product, quantity, destination, response status and order outcome. Do not publish buyer information.

## Implementation and limits

The existing Cloudflare tracking endpoint is preserved. Payloads retain event, page, title and referrer, and add `journey` (`home`, `town`, `wholesale`) plus an allowlisted `campaign` object. New event names are `community_handoff`, `feedback_handoff`, `directions_click`, `story_click`, `town_guide_click`, and `listing_request_click`. Existing page/contact/catalogue events remain.

The ZIP did not include the deployed Cloudflare Worker's code or analytics database. Its acceptance, storage and reporting of the new fields/events have NOT been verified or changed. Update its event allowlist and storage/reporting fields before relying on these additional metrics. No new dashboard, automated email report, unique-visitor metric or actual-order integration is claimed.

Public visitor counts and existing privacy behaviour are preserved. The browser does not add an IP field to its payload, but the server/hosting layer can still receive network addresses. Changing IP retention requires inspecting and changing that server configuration; this ZIP alone does not establish an IP-free backend.
