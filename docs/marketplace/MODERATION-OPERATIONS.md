# Private moderation and business outcomes

This is a working local operator tool, not a public admin page. Repository/OS access controls who can publish. There is no public write API or self-service “verified” checkbox. Keep the store and evidence outside the website and outside any public cloud folder. The CLI applies 0700 directory / 0600 file permissions and uses a file lock and atomic writes. Back up this private store securely: using a different empty store cannot replace an already-published managed dataset.

## Provider intake and review

The existing town contribution form is the public application route. A user chooses business listing, provides authorized business contact details and consents to review/publication. Submission alone never publishes a listing. Do not request document scans in the public enquiry flow.

From your website repository:

```bash
python3 tools/marketplace_admin.py --store "$HOME/Podaturpet-private" init
python3 tools/marketplace_admin.py --store "$HOME/Podaturpet-private" template --kind application
python3 tools/marketplace_admin.py --store "$HOME/Podaturpet-private" template --kind checks
```

Fill the two generated PRIVATE template files with a real business's authorized details and truthful review evidence. Empty templates cannot be approved. Use service IDs from content/services.json (launch=true), ISO country codes, supported language codes and an explicit local/remote area per country. A remote provider is not automatically worldwide. Region/city are public business service areas, never a user's exact address.

Application fields: id, name, description.en/ta, services, languages, areas[{country,region,city,mode}], contact{phone,whatsapp,website}, pricing, sponsored. Phone values use +countrycode digits. Pricing is quote-only or fixed/from/range with explicit currency, amount, unit, taxes and checked_on. No default INR, exchange rate or cross-currency sorting. Amount precision is checked for common 0/2/3-minor-unit currencies.

Checks must record confirmed=true, UTC YYYY-MM-DD and a PRIVATE evidence_ref for identity, contact, consent and scope. Identity also requires a public_source URL; scope requires a lawful jurisdiction entry for every country/region served. Document how the actual business identity, contact ownership, claimed language and lawful service scope were checked. A plausible URL alone is not identity verification. The tool enforces required records, dates and allowed professional registry domains; the operator must do the real review honestly.

For accounting, licences must contain service, country, region, source, checked_on, expires_on, active=true and scope_confirmed=true. Ontario uses the CPA Ontario policy, India uses ICAI. Verify active practice permission for the offered work, not just membership. No other accounting jurisdiction is open automatically. Local law may require additional checks even in an otherwise general category; scope confirmation is mandatory.

Tutoring requires a safeguarding check with confirmed=true, checked_on, evidence_ref and guardian_contact_only=true. Do not imply a background check occurred unless you actually verified it under an appropriate process. Handyman scope excludes regulated electrical/gas/plumbing work. Translation listings do not imply certified acceptance.

```bash
python3 tools/marketplace_admin.py --store "$HOME/Podaturpet-private" submit --file "$HOME/Podaturpet-private/application-template.json"
python3 tools/marketplace_admin.py --store "$HOME/Podaturpet-private" --actor owner review --id YOUR-PROVIDER-ID --file "$HOME/Podaturpet-private/checks-template.json"
python3 tools/marketplace_admin.py --store "$HOME/Podaturpet-private" --actor owner approve --id YOUR-PROVIDER-ID --reason checks-completed
python3 tools/marketplace_admin.py --store "$HOME/Podaturpet-private" publish
python3 tools/build_content.py --only podaturpet-local-business-directory.html
```

Replace YOUR-PROVIDER-ID with the actual application ID. Review the resulting public JSON, generated data and directory HTML before committing. Reviewer identity, private evidence references, applications and outcomes are not exported. The published record contains only normalized public fields, check dates, public evidence source and bounded review expiry. No ratings or blanket verified badge are generated.

## Renewal, complaints and withdrawal

Checks normally expire after 90 days; professional checks after 30 days or the licence expiry, whichever comes first. Dates use UTC to avoid server/browser day-boundary disagreement. Old or future checks fail approval. Public matching and contact controls also refuse expired records. No-JavaScript pages show dated information; keep static publication current because cached copies cannot be remotely erased by JavaScript.

```bash
python3 tools/marketplace_admin.py --store "$HOME/Podaturpet-private" pause --id YOUR-PROVIDER-ID --reason complaint-under-review
python3 tools/marketplace_admin.py --store "$HOME/Podaturpet-private" publish
python3 tools/build_content.py --only podaturpet-local-business-directory.html
```

Publish/deploy that removal promptly; “pause” alone changes only the private store. Use reject or revoke for corresponding decisions. A paused record needs a fresh review before re-approval. For corrections or removal, users use the existing contribution/correction form; no second reporting system was added. Sponsored status is disclosed, has no effect on matching rank and does not change review gates. Retain public contact consent only while needed; resolve deletion requests in the original communication channel and remove unnecessary private evidence under your documented retention policy.

## Record a real business result

Every consented WhatsApp draft carries a random PS- reference. It is not sent to web analytics or saved by the browser tool. Use it only after a real recipient confirms actual receipt. Do not treat a browser handoff event as receipt.

```bash
python3 tools/marketplace_admin.py --store "$HOME/Podaturpet-private" outcome --ref PS-REPLACEWITH16HEX --provider YOUR-PROVIDER-ID --stage received --consent --evidence-ref YOUR-PRIVATE-TICKET-ID
```

Use the exact real reference (PS- followed by 16 hexadecimal characters), not the placeholder. Record received → qualified → quoted → won only as those events actually occur. lost or withdrawn are also supported. Each step requires an opaque private evidence reference; no name, phone, message or document is accepted there. A won result requires --amount and --currency; do not report a payment as verified unless your underlying evidence confirms it. Calling the tool is an operator attestation, not automatic payment verification.

```bash
python3 tools/marketplace_admin.py --store "$HOME/Podaturpet-private" report
```

The aggregate report groups won values by currency and never converts/sums unlike currencies. Duplicate or out-of-order transitions fail. Withdrawal removes the outcome's value and detailed history; an audit reference remains for integrity. Keep the private store away from the web, restrict who can operate it, and minimize retained communication evidence. No customer list, chat transcript or private enquiry is published.
