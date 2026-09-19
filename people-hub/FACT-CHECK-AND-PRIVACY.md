# Fact-check, privacy and security review

Review: 19 September 2026.

## Information boundaries

The existing 32 guides remain, with four original bilingual additions: diaspora support, overseas recruiter checks, education cost planning and remittance quote comparison. Sources are HTTPS links with explicit access notes and review dates. Older existing dates are not silently renewed. Limited or failed access is not labelled full verification. Research.md records primary-source observations and gaps. Dynamic fees, vacancies, rates, deadlines and eligibility are not imported into calculations or presented as live data.

The India-related diaspora pathways are not universal services for all Tamil-speaking nationalities. The new guide says to check jurisdiction and eligibility. Local-body identification is supported by the Tiruvallur district page; it is not a verification of any shop. businesses.json remains empty. No personal legal, medical, visa, tax or investment decision is automated. Sources and a disclaimer remain visible in both languages.

## Privacy boundaries checked

- Hub questions and numbers stay in the current DOM; not written to storage, logs, URLs or outbound analytics. Matching uses the built local index.
- Optional shortcuts contain public guide IDs only. Optional funnel counts contain seven bounded integers plus schema version. No question, topic ID, financial value, message or identity is stored in those counts.
- Counting is off by default; GPC/DNT block it. Turning it off deletes only its key. Storage failure leaves search/calculators working. Same-origin scripts/extensions/shared users can access browser storage; it is not encrypted.
- Consent is required before a help draft appears. A changed field or revoked checkbox removes both links and the preview. Clicking WhatsApp/email passes the displayed draft to the chosen third party; sending is an additional action in that app. Contact identity becomes visible when the message is sent. Initial consent covers the Podaturpet / MuraRaj team only, not marketing or referrals.
- No document upload, account, password, payment, geolocation, microphone or cloud speech API. Local voice availability is browser-dependent.
- Automatic sensitive-input screening catches common long-number/email/URL patterns, not every personal fact. UI explicitly asks users not to enter private information. The team must minimize retention and obtain separate permission for any named-provider referral.
- Existing hosting logs, external link destinations and other site pages retain their own privacy behavior. Ordinary static-page hosting requests are not anonymous guarantees.

## Security checks

Answers, user notes and calculations are rendered through textContent, not interpolated as HTML. Message query values are URL-encoded; recipients come from existing configuration. Region/help choices and bounded numbers are validated. Calculations reject negatives, malformed input, invalid months, invalid rates and impossible deductions. Public sources use rel=noopener/noreferrer and the hub has no-referrer policy. Existing CSP remains default-deny with self-hosted scripts/styles/fonts and connect-src none. No secrets or new runtime third-party packages were introduced.

The existing directory publisher escapes record text, restricts URLs, validates phones/dates and now labels sponsored records with publication-consent and recency gates. Tests use fixtures only in a temporary directory. This is a scoped implementation review, not a penetration test of the hosting platform or a legal compliance certification.
