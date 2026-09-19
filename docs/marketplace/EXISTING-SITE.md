# Existing site inspection and reuse

Source of truth: website(20260919-192634).zip, supplied in this task. The extraction inventoried 287 source/content files; 225 decoded text files were read, and 62 HTML files (46 root pages plus historical copies) were inventoried for title, canonical, scripts, styles and forms. There are 22 distinct script references across active root pages. Binary assets are preserved; this is not a claim to have interacted with every historical page or verified ownership of every image.

| Existing component | What was present | Reuse / extension |
|---|---|---|
| People Information Hub | Two language pages, 36 guides, dated official sources, bookmarks, print | Same URLs, guide builder and source content; service-routing links added |
| Tamil Life Assistant | Inline local matcher and shared floating assistant | Same assistant.js; shared parser from existing core.js; no second bot |
| Directory | One canonical URL, 24 local retail categories, businesses.json empty | Same URL, dataset, builder and community.js; global provider records use schema_version 2 |
| Provider submission | Existing town contribution form and permission checkbox | Business-only country, service/language, public contact and authorization fields added |
| Lungi catalogue and wholesale pages | Established catalogue, products, enquiry routes and images | Preserved; explicit wholesale queries remain in existing assistant paths |
| Invoice and travel planner | Existing free invoice and family travel tools | Preserved byte-for-byte; no new copies |
| Ads | Existing advertising page, flash/gentle notices and ad assets | Preserved; no new ad network or copied ad system |
| Visitor counter | Existing privacy counter and public regional aggregates | Preserved; no second counter |
| Analytics | Shared visitor-tracking.js, existing Cloudflare /track endpoint, local hub counts | Add five fixed service stages only; prevent old quote/WhatsApp misclassification; separate service analytics consent |
| Shared styles | Existing directory business-redesign.css, guide styles, local Tamil font | Scoped styles appended to the existing stylesheet; no new CSS bundle or font |
| Content build | tools/build_content.py with --only | Same build entry; validated global records and generated public data module |
| Moderation/server | No provider admin store, CRM or analytics Worker source | Add private owner-operated moderation/outcome CLI; do not invent backend receipt or deploy an unknown Worker |

`content/businesses.json` is still an empty array in the deliverable. There were no approved providers to migrate or claim as verified. Old-format approved records remain supported by the existing renderer and appear once; they do not gain global matching or new verification claims without the new review process. The 24 original retail category cards remain intact. No parallel directory or country landing-page farm was created.
