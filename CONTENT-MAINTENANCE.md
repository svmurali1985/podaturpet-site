# Maintaining the updated website

The shipped HTML is ready to upload. Python is needed only after changing the shared content files. No Python runs on your web hosting.

From the website folder, run:

```bash
python3 tools/build_content.py
```

Review and upload the changed HTML files along with any changed assets. Do not rerun the older redesign scripts: they predate this update and can overwrite the new layout.

## Shared navigation and contact

`content/site.json` controls the primary navigation and new shared footer on the content pages. The generator writes real links into HTML, so navigation does not depend on JavaScript or a JSON download.

If changing your actual phone or email later, also update the existing enquiry, feedback and assistant scripts and older inline contact links. This update preserves their current working number; the new shared footer is not a replacement for those existing contact handlers.

## Product facts

`content/products.json` holds six design references. Colours and patterns come from the existing catalogue. Empty commercial fields show “Ask for confirmation.” Fill `fabric`, `dimensions`, `minimum_order`, `packing`, `samples` and `lead_time` only when confirmed; provide `verified_on` as YYYY-MM-DD when supplying those specifications. No prices, stock guarantees or certifications are inferred from pictures.

## Business records

`content/businesses.json` starts as `[]`, because no verified individual business records were supplied. Add records after checking the information and publishing permission. The 24 existing category cards remain available.

Required fields for an approved record:

| Field | Value |
|---|---|
| `approved` | Boolean `true` only after review |
| `name` | Actual business name |
| `category` | Such as textiles or food |
| `address` | Confirmed public address |
| `public_phone` | Public number with country code |
| `hours` | Confirmed hours or “By appointment” if accurate |
| `verified_on` | YYYY-MM-DD |
| `source_url` | HTTPS link supporting the listing |
| `map_url` | Checked HTTPS map link |

The generator rejects incomplete approved records. Unapproved records never appear on the page. Once records are published, the page shows searchable cards with public phone, directions and sources. Keep private notes and unpublished personal details outside these files, because the website source may be public.

## Events

`content/events.json` also starts as `[]`. Required fields: `approved`, `title`, `start`, `end`, `location`, `organiser`, `source_url`, `verified_on`.

Use timezone-aware start and end strings, for example the format `YYYY-MM-DDTHH:MM:SS+05:30` for India. The generator rejects dates without timezones and dates that end before they start. It excludes expired events; the visitor script also hides events that expired after the last build when the page opens. With JavaScript disabled, the static event list reflects the last rebuild, so rebuild regularly and after an event ends.

## Photos, interviews and historical memories

The contribution form opens a prepared WhatsApp message. Visitors attach photos in WhatsApp and send them themselves. There is no automatic upload service or public publishing endpoint.

Before publishing, record the photographer/interviewee’s permission, correct place and date, and the distinction between a first-hand memory and a documented historical fact. Regional images must retain their original credits and must not be described as Podaturpet street photographs.

The stories page already links to photo, interview and then-and-now contributions. Publish completed stories in the existing stories page when real material is available, rather than adding empty standalone pages.
