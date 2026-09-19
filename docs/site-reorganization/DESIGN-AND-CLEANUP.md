# Design, architecture and maintenance

## Five clear areas

| Area | Existing destination | Supporting features |
|---|---|---|
| People Information / Tamil Life Assistant | /people-information-hub.html and -ta.html | Official-source guides, existing calculators, family travel planner |
| Global Service Marketplace | /podaturpet-local-business-directory.html | Service/location/language matching, same local retail directory, consented contact |
| Advertise with Us | /advertise-on-podaturpet.html | Website development, invoice maker, clearly disclosed commercial enquiries |
| Lungi / Textiles | /lungi-product-catalogue.html | Existing products, wholesale quotes, weaving stories, Modern Lungi, market selector |
| Podaturpet Local Hub | /podaturpet-town-guide.html | Places, public information, culture, updates and contribution form |

The homepage introduces these areas. It does not implement a second information search or provider search. Existing dedicated destinations remain the source of each feature. Brand links return home; tools and privacy are also discoverable in the footer.

## Shared visual system

The existing podaturpet-colourful.css now owns paper/ink/mint/gold/coral/lilac tokens, spacing, radii, focus treatment, typography, navigation, footer, homepage and enquiry-page layouts. Existing tool CSS owns its forms and print behavior. Tamil uses the already licensed local Noto Sans Tamil font. No remote font service, framework or image dependency was added.

The homepage uses one dark green introduction with a credited regional photograph, five purposeful pastel cards, a compact three-tool row, and a distinct textile feature. Native details keeps the original wholesale workspace reachable without making every visitor scroll through a wholesale landing page. Old hash links open the correct disclosure through the existing editorial controller.

## Safe cleanup decisions

No root URL, redirect, tool, provider record, image/video asset, ad script, visitor-tracking script or core calculator was removed. Repeated presentation fragments were merged. Header and footer credit/contact duplication were consolidated. A neutral homepage contact message replaces a lungi-specific general contact draft. Two local articles now invite local corrections through the existing contribution form.

The old homepage explorer's IDs remain as anchor aliases, but its redundant drawer/script is not loaded there. Its source file remains for historical copies. Four unused homepage stylesheets are no longer requested; no other dependencies are arbitrarily removed. Historical backup folders remain in the full source archive but are not copied by the scoped installer.

Product/market context now travels only to textile destinations, so visiting an information page does not pick up a lungi selection. No private form field is propagated.

## Future changes

- Maintain the five areas in content/site.json → areas. navigation is the legacy compatibility projection; keep it aligned if changing labels.
- The generated shared shell is in tools/site_layout.py. Content remains in existing pages and existing data/builders.
- Regenerate with python3 tools/build_content.py and python3 people-hub/build.py. These do not rebuild or overwrite curated homepage content.
- Keep the original provider moderation process. This visual update does not approve businesses or promise a populated marketplace.
- Do not run historical one-off redesign/install scripts against the current pages. Use the new outer installer for this delivery.
