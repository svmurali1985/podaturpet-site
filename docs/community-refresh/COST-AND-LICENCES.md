# Cost, licences and privacy scope — checked 23 September 2026

## New additions

| Item | Cost/licence | Use |
|---|---|---|
| New comments, analytics, admin and Worker code | Original code, MIT in community-worker/LICENSE | May be used commercially without a licence fee; retain notice |
| Browser APIs, system fonts | Native platform features; no downloaded package/font | Rendering, forms, cryptography and storage |
| Cloudflare Workers + D1 | Hosted services on Workers Free; provider terms apply | Server API, private aggregates, moderated comments |
| Python/Node tests and build helper | Standard-library APIs only for backend/build checks | Optional local development; not loaded by visitors |

No new photographs, stock assets, icons, copied articles, testimonials, logos, paid fonts, plugins, trackers, external client libraries, third-party CAPTCHA or AI services have been added. The MIT notice applies to the new implementation, not to previously existing photos, text, trademarks, libraries or submitted comments. Existing content and tool pricing were not relicensed or changed.

The uploaded files do not establish ownership/licences for every existing asset. This update cannot guarantee that all previous material is copyright-clear or that a site is lawful in every jurisdiction. Keep ownership/licence records for the existing material. Comments require the submitter's permission and stay private until manual review, but moderation remains the operator's responsibility. Free access does not itself grant copyright permission.

Cloudflare's free hosted service is not open-source software. If “free licensed” is intended to prohibit all proprietary hosted services, leave the API disabled: this backend uses the existing Cloudflare ecosystem on its free plan. There is no new proprietary client library to licence.

## Zero-cost configuration

Use Workers Free, not merely a Free website/domain plan. The implementation does not enable billing or call an upgrade API. Free plan quota exhaustion stops service; a paid account can charge for overage and the code cannot guarantee zero billing there. Domain/hosting costs the owner already has are outside this update. No purchase is necessary for this implementation.

Official references, checked 23 September 2026:

- Workers limits: https://developers.cloudflare.com/workers/platform/limits/ — 100,000 daily Free requests; error on exhaustion.
- D1 pricing: https://developers.cloudflare.com/d1/platform/pricing/ — 5 million daily rows read, 100,000 daily rows written, 5 GB total Free storage; queries stop at quota and storage must be freed at the limit.
- D1 limits: https://developers.cloudflare.com/d1/platform/limits/ — also review per-database limits before deployment.
- Cloudflare terms: https://www.cloudflare.com/terms/ and privacy: https://www.cloudflare.com/privacypolicy/ — provider service obligations apply.
- ICO consent guidance: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/consent/what-is-valid-consent/ and https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/consent/how-should-we-obtain-record-and-manage-consent/ — informed affirmative choice, genuine refusal and withdrawal informed this design. This is not a claim that one checklist certifies worldwide compliance.
- Copyright Office permission FAQ: https://www.copyright.gov/help/faq/faq-fairuse.html — permission and rights must be assessed for others' work.

## Privacy safeguards in code

Analytics starts off, and only page path + consent leave the browser. Cloudflare's approximate country/region/city is aggregated by UTC day and page. No visitor identifier, IP, referrer, query, user agent or form input is stored by the new analytics application. Counts are not individual people; an individual browsing history cannot be viewed. Hosting networks still receive IP addresses.

Comments are separate from analytics. Name/location/purpose are optional; all submitted fields may be public after approval. No email is collected. Drafts stay in memory. Explicit publication/rights checkbox, moderation, retention filters, daily cleanup, delete control and a removal/copyright-report email are included. Public comments are text, not executable HTML or links.

The private dashboard uses a long random secret, no browser persistence and no external scripts. Secrets stay in Cloudflare settings. Privacy statement explains that public comments can be copied and hosting recovery copies have separate retention. Do not paste confidential information into comments or public repository files.
