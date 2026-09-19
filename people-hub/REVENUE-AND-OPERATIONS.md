# Revenue and operator handoff

## Implemented paths

- Existing advertising page remains the entry for direct ad enquiries. No new ad account, ad network or display ad script was added to the hub.
- The existing directory renderer supports `sponsored: true`, requires `public_listing_consent: true`, refuses a paid record older than 90 days or a future verification date, and labels it “Sponsored / கட்டண விளம்பரம்” before its name. Records stay alphabetically sorted. Payment never changes official guide ranking. Required address, public phone, hours, source, map and verification date validations remain.
- Existing directory categories now support Tamil search terms through the existing community script. No fake provider is published; businesses.json remains unchanged and empty.
- Help requests require explicit consent, a visible draft and a separate user click. Only the existing Podaturpet / MuraRaj team is the recipient. A messaging-app click is not a received lead or sale. No partner receives a message automatically.

## Qualified lead workflow (manual operations, not an invented CRM)

1. A team member actually receives the user's message.
2. Confirm the requested service, broad location and language. Do not request identity scans in an open chat.
3. Offer official free self-service first. State any optional service price and limits before agreement. Never charge for a job promise, guaranteed visa or government approval.
4. If a provider is appropriate, verify their public business information and relevant authorization; show their name and any referral relationship. Obtain separate permission to share a specific message with that named provider. The initial hub checkbox does not authorize referral or marketing.
5. Only then classify as a qualified, consented lead. Record receipt, qualification, consent and outcome in the owner's appropriately secured business process. Delete unnecessary data and honor deletion requests in the same channel. Do not paste private chat messages into website analytics.

No prices, paying advertisers, verified provider relationships, response-time promises or earnings are invented. No payment processor or subscription was added. Premium placement means labelled presentation, not preferential official advice. Display ads can be considered later after audience measurement, consent/legal review for the regions served and a performance budget; avoid disguising ads as official action buttons.

## Funnel implementation and limits

Shared `podaturpet-visitor-tracking.js` has a hub-only mode. Default: no tracking and no network analytics. Optional counts: view → ask → guide → official / calculate → preview → handoff. Users can disable/delete counts and download a count-only JSON report. GPC/DNT disable counting. Only bounded integers under known stage names are retained. A route can skip stages; ratios are diagnostic and are not a strict ordered attribution funnel.

These counts are per browser/device, not shared across visitors, unique people or revenue. The current ZIP does not include the existing analytics Worker source or a CRM. Therefore website-wide conversion reporting, actual lead receipt and payments are not implemented or claimed. Existing site analytics on other pages retain their original behavior. A future server collector needs owner-authorized backend work and a separately reviewed consent/data-retention design; never pass questions, notes, numbers or user identities into it.

## Safe business publication

Edit the existing `content/businesses.json`, obtain consent and verify facts. Do not publish test records. Run `python3 tools/build_content.py --only podaturpet-local-business-directory.html`, review its diff, and preview. The builder also refreshes existing shared markers on the selected page; it does not create a second directory. Omitting --only keeps the original full-site rebuild behavior.
