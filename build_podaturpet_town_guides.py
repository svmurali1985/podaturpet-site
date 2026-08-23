from __future__ import annotations

from datetime import date
from html import escape
from pathlib import Path
from urllib.parse import quote
import xml.etree.ElementTree as ET


ROOT = Path(__file__).resolve().parent
PHONE = "+91 87788 36385"
WHATSAPP = "918778836385"
TODAY = date.today().isoformat()

PAGES = {
    "places": ("podaturpet-tourist-places.html", "Places to visit"),
    "stories": ("podaturpet-stories-and-culture.html", "Town stories"),
    "business": ("podaturpet-local-business-directory.html", "Local businesses"),
    "government": ("podaturpet-government-offices.html", "Government offices"),
    "useful": ("podaturpet-useful-information.html", "Useful information"),
}


def whatsapp(message: str) -> str:
    return f"https://wa.me/{WHATSAPP}?text={quote(message)}"


def external(url: str, text: str) -> str:
    return f'<a href="{escape(url, quote=True)}" target="_blank" rel="noopener noreferrer">{escape(text)}</a>'


def card(symbol: str, category: str, title: str, description: str, url: str = "", link: str = "", meta: str = "") -> str:
    action = f'<a class="guide-card-action" href="{escape(url, quote=True)}" target="_blank" rel="noopener noreferrer">{escape(link)} →</a>' if url else ""
    details = f'<div class="guide-meta">{escape(meta)}</div>' if meta else ""
    return f'<article class="guide-card"><div class="guide-card-symbol" aria-hidden="true">{symbol}</div><span class="guide-card-category">{escape(category)}</span><h2>{escape(title)}</h2><p>{escape(description)}</p>{details}{action}</article>'


def page(key: str, title: str, description: str, heading: str, lead: str, content: str) -> None:
    filename, _ = PAGES[key]
    navigation = "".join(
        f'<a href="/{escape(path)}"{(" aria-current=\"page\"" if page_key == key else "")}>{escape(label)}</a>'
        for page_key, (path, label) in PAGES.items()
    )
    document = f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{escape(title)}</title>
  <meta name="description" content="{escape(description, quote=True)}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="https://podaturpet.com/{escape(filename)}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="{escape(title, quote=True)}">
  <meta property="og:description" content="{escape(description, quote=True)}">
  <meta property="og:url" content="https://podaturpet.com/{escape(filename)}">
  <link rel="icon" href="/images/podaturpet-logo.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/podaturpet-town-guide.css">
</head>
<body class="guide-body">
  <header class="guide-header">
    <div class="guide-shell guide-header-inner">
      <a class="guide-brand" href="/" aria-label="Podaturpet.com home"><img src="/images/podaturpet-logo.svg" width="44" height="44" alt="Podaturpet woven logo"><span><strong>PODATURPET</strong><small>Independent town guide</small></span></a>
      <a class="guide-header-link" href="/#town-guide">Town guide home</a>
    </div>
    <nav class="guide-subnav" aria-label="Podaturpet town guide sections"><div class="guide-shell guide-subnav-inner">{navigation}</div></nav>
  </header>
  <section class="guide-hero"><div class="guide-shell"><div class="guide-kicker">Podaturpet · Tiruvallur · Tamil Nadu</div><h1>{escape(heading)}</h1><p class="guide-lead">{escape(lead)}</p></div></section>
  <main class="guide-main"><div class="guide-shell">{content}</div></main>
  <footer class="guide-footer"><div class="guide-shell guide-footer-inner"><div>© Podaturpet.com · Independent town information</div><div><a href="/#advertise">Advertising enquiries</a> · <a href="/">Return home</a></div></div></footer>
</body>
</html>
'''
    (ROOT / filename).write_text(document, encoding="utf-8")


places = [
    ("🛕", "Temple · Tamil Nadu", "Tiruttani Murugan Temple", "A prominent hill temple in nearby Tiruttani and a natural starting point for exploring the region around Podaturpet.", "https://tiruvallur.nic.in/tourist-place/lord-arulmigu-subramaniya-swami-temple-tiruttani/", "District tourism information", "Check temple timings and current road conditions before travelling."),
    ("⛰️", "Hill temple · Tamil Nadu", "Sholingur Lakshmi Narasimha Temple", "Visit the hill-temple landscape of Sholingur, where the temple and surrounding viewpoints offer a distinctive regional pilgrimage experience.", "https://sholinghurnarasimmar.hrce.tn.gov.in/", "Official temple website", "Confirm access arrangements and visitor facilities with the temple."),
    ("💧", "Waterfall · Andhra Pradesh", "Kailasakona Waterfall", "A nature destination in the Narayanavanam area of Andhra Pradesh, suitable for visitors exploring the Puttur and Nagari side of the region.", "https://www.incredibleindia.gov.in/en/andhra-pradesh/tirupati/kailasakona-waterfall", "Official tourism information", "Water flow, access and safety conditions can change with the weather."),
    ("🥾", "Hills · Andhra Pradesh", "Nagari Hills and Nagari Nose", "A striking hill landscape near Nagari and Puttur. Experienced walkers can research the Nagari Nose route before planning a responsible trek.", "https://indiahikes.com/documented-trek/nagari-nose-chennai", "Read the route information", "Verify local permissions, heat conditions and route difficulty first."),
    ("🌊", "Reservoir · Tiruvallur", "Poondi Reservoir", "Also known as Sathyamoorthy Reservoir, Poondi is a recognised Tiruvallur district destination for visitors interested in regional landscapes.", "https://tiruvallur.nic.in/tourist-place/poondi-reservoir-tiruvallur-taluk/", "District tourism information", "Respect restricted areas and check current visitor access."),
    ("🪔", "Heritage temple · Tamil Nadu", "Thiruvalangadu Vadaranyeswarar Temple", "Explore a historic Shiva temple at Thiruvalangadu and include the surrounding heritage landscape in a wider regional temple visit.", "https://hrce.tn.gov.in/hrcehome/index_temple.php?tid=1518", "Official temple website", "Confirm current opening hours and festival arrangements."),
    ("🙏", "Pilgrimage · Andhra Pradesh", "Tirupati and Tirumala", "The Tirupati–Tirumala pilgrimage region is an option for a longer trip. Use the official Devasthanams portal for genuine visitor information.", "https://www.tirumala.org/", "Official TTD website", "Check official darshan, accommodation and booking requirements."),
    ("🦩", "Longer district trip", "Pulicat and the coastal region", "Pulicat is listed by Tiruvallur District Administration as a district tourism destination and is better treated as a separate, longer excursion.", "https://tiruvallur.nic.in/tourism/tourist-places/", "District tourism directory", "Not a close-by Podaturpet attraction; plan a separate travel day."),
]

place_content = f'''
<section class="guide-section"><h2 class="guide-section-title">Regional places worth exploring</h2><p class="guide-section-intro">A practical mix of temples, hills, water landscapes and wider day-trip ideas. These are regional destinations, not claims that every place is inside Podaturpet.</p><div class="guide-grid">{"".join(card(*item) for item in places)}</div><aside class="guide-callout"><strong>Plan responsibly.</strong> Distances, opening times, water levels, entry rules and road conditions can change. Confirm the current details with the relevant official source or local operator before travelling.</aside></section>
<section class="guide-section"><h2 class="guide-section-title">Discover Podaturpet itself</h2><p class="guide-section-intro">The town is known for its weaving activity, local market life, agricultural surroundings and community traditions.</p><div class="guide-grid two">{card("🧵", "Town culture", "Weaving and textile heritage", "Learn how handloom, powerloom, local trading and checked textile designs contribute to the identity of the Podaturpet region.", "https://podaturpet.com/podaturpet-weaving-textiles.html", "Explore the weaving guide")}{card("📍", "Practical travel", "Podaturpet location and PIN code", "Find the town's PIN code, local orientation and transport guidance before arranging a visit or contacting a nearby business.", "https://podaturpet.com/podaturpet-travel-pin-code.html", "Read travel information")}</div></section>
'''

page("places", "Tourist Places Near Podaturpet | Temples, Hills & Waterfalls", "Discover regional places to visit around Podaturpet, including Tiruttani, Sholingur, Kailasakona, Nagari Hills, Poondi and Tirupati.", "Places to visit near Podaturpet.", "Discover temple towns, hill landscapes, waterfalls and district attractions around the Podaturpet region, with links to official information wherever available.", place_content)

stories = [
    ("Town identity", "A town shaped by threads and trade", "In Podaturpet, a textile story is not only about a finished product. It begins with the families, small businesses, weaving knowledge and everyday trade that connect the town to surrounding communities.", "The local town profile describes handloom and household-linked powerloom activity alongside agriculture. Together, these livelihoods give the place a character that is more layered than a single shop, factory or brand."),
    ("Community celebrations", "When the town gathers for its Amman festivals", "The Podhaturpet town profile identifies Amman festivals as an important part of local community life. These occasions bring neighbourhoods together and connect the town with visitors from surrounding places.", "Festival dates, processions, temple arrangements and public access can change each year. Anyone planning a visit should confirm the details locally before travelling."),
    ("Local history", "A Town Panchayat story that reaches back to 1939", "The published Podhaturpet town profile traces local civic administration to 1939. The town's continuing role as a Town Panchayat reflects the way its community brings together a town centre, public services and surrounding regional livelihoods.", "Historical details should be read alongside their original public sources, and any new community memories or family histories should be added only with permission and proper verification."),
    ("Everyday life", "Between paddy fields, market streets and the loom", "Podaturpet's local profile connects the area with agriculture as well as textile work. That combination helps explain the mixture of market activity, neighbourhood services and practical regional connections that shape everyday life.", "A stronger town story can grow through original photographs, first-hand interviews and contributions from local residents—not by copying somebody else's travel article or images."),
    ("Regional connections", "A meeting point for Tamil Nadu and nearby Andhra routes", "The town's regional connections include nearby places such as Tiruttani, Pallipattu and the Nagari side of the Tamil Nadu–Andhra Pradesh area. Those links support travel, family visits, local trade and textile sourcing.", "Current bus routes, train connections and road conditions should always be confirmed through transport operators or local authorities before a journey."),
]

story_articles = "".join(f'<article class="guide-story"><span class="guide-story-label">{escape(label)}</span><h2>{escape(title)}</h2><p>{escape(first)}</p><p>{escape(second)}</p></article>' for label, title, first, second in stories)
story_content = f'''
<section class="guide-section"><h2 class="guide-section-title">Original stories from a living town</h2><p class="guide-section-intro">Independent editorial descriptions inspired by documented town facts. No third-party articles, photographs or unverified personal stories are reproduced.</p>{story_articles}</section>
<section class="guide-section"><h2 class="guide-section-title">Sources behind the town facts</h2><p class="guide-section-intro">Public facts are checked against the town profile and district administration resources.</p><ul class="guide-source-list"><li>{external("https://townpanchayat.in/podhaturpet", "Podhaturpet town profile")}</li><li>{external("https://tiruvallur.nic.in/department/town-panchayat/", "Tiruvallur District Administration: Town Panchayat directory")}</li><li>{external("https://tiruvallur.nic.in/tourist-place/lord-arulmigu-subramaniya-swami-temple-tiruttani/", "Tiruvallur District Administration: Tiruttani temple")}</li></ul><div class="guide-directory-cta"><h2>Have a genuine Podaturpet story?</h2><p>Share a local history idea, community memory or original photograph. Contributions should be accurate and must be submitted with the necessary permission.</p><a href="{whatsapp('Hello Podaturpet Team, I would like to share an original local story or photograph for the Podaturpet town guide.')}" target="_blank" rel="noopener noreferrer">Share a story idea</a></div></section>
'''

page("stories", "Podaturpet Stories & Culture | Weaving, Festivals and Town History", "Read original Podaturpet stories about weaving heritage, Amman festivals, local history, agriculture, community life and regional trade.", "Every town has a story. Here are some of ours.", "Explore the weaving traditions, community celebrations, public history and everyday life that help explain the character of Podaturpet.", story_content)

categories = [
    ("🧵", "Textile businesses", "Textile shops and weaving", "Textile traders, cloth sellers, loom-related services and regional weaving businesses can request a genuine local listing."),
    ("🛍️", "Everyday shopping", "Grocery and provision stores", "Local grocery shops, provision stores and neighbourhood retailers can introduce their business for a future listing."),
    ("🍽️", "Food and hospitality", "Restaurants, tea shops and bakeries", "Food businesses and refreshment stops can request visibility once their business details are checked."),
    ("💊", "Health and essentials", "Pharmacies and healthcare services", "Medical shops, clinics and relevant health services can submit accurate public business details for review."),
    ("💎", "Retail and services", "Jewellery and electronics", "Jewellery stores, mobile shops, electronics businesses and repair services can request a directory introduction."),
    ("🏫", "Local services", "Education and community services", "Tuition centres, learning services and community-facing businesses can share verified contact information."),
    ("🛠️", "Professional services", "Repairs, trades and transport", "Electricians, mechanics, transport operators and other service providers can request consideration."),
    ("🏦", "Visitor essentials", "Banking, payments and assistance", "Banking and payment-related services can be included only after their organisation and public details are independently confirmed."),
]

directory_cards = "".join(card(symbol, group, title, details) for symbol, group, title, details in categories)
business_content = f'''
<section class="guide-section"><h2 class="guide-section-title">Explore local business categories</h2><p class="guide-section-intro">A professional directory structure for genuine Podaturpet-area businesses. Categories are available now; individual businesses will be added only after their details are received and checked.</p><div class="guide-grid">{directory_cards}</div><aside class="guide-callout"><strong>No invented listings.</strong> A category does not imply that a particular shop has been verified, recommended or advertised. Business names, addresses, opening hours and contact numbers will only be published after confirmation.</aside></section>
<section class="guide-section"><div class="guide-directory-cta"><h2>Own a shop or business near Podaturpet?</h2><p>Send your business name, category, location, public contact number and a short description. Directory enquiries and paid advertising requests are handled separately.</p><a href="{whatsapp('Hello Podaturpet Team, I would like to request a verified local business directory listing. Business name: ____ Category: ____ Location: ____ Contact: ____')}" target="_blank" rel="noopener noreferrer">Request a business listing</a></div></section>
'''

page("business", "Podaturpet Shops & Local Business Directory | Tamil Nadu", "Explore Podaturpet local business categories including textile shops, grocery stores, restaurants, pharmacies, jewellery, services and directory enquiries.", "Local businesses, easy to discover.", "A dedicated local directory for shops, services and community-facing businesses around Podaturpet—kept separate from wholesale sourcing and paid advertisements.", business_content)

government_content = f'''
<section class="guide-section"><h2 class="guide-section-title">Verified local and regional public offices</h2><p class="guide-section-intro">The contacts below are drawn from Tiruvallur District Administration's published directories. Confirm the current number and office arrangements directly before travelling.</p><div class="guide-service-list">
<article class="guide-service"><div><h2>Podhaturpet Town Panchayat</h2><p>The local Town Panchayat office and Executive Officer are relevant for local civic administration and municipal-service enquiries.</p><p>{external("https://tiruvallur.nic.in/department/town-panchayat/", "Verify in the district's Town Panchayat directory")}</p></div><div class="guide-service-contact"><a href="tel:+917824058007">78240 58007</a><a href="tel:+914427849250">044-27849250</a><small>Official district directory</small></div></article>
<article class="guide-service"><div><h2>Pallipet Taluk Office</h2><p>The Pallipet Tahsildar's office is listed by Tiruvallur District Administration for revenue and taluk-level administrative matters.</p><p>{external("https://tiruvallur.nic.in/department/taluk-office/", "Verify in the official Taluk Office directory")}</p></div><div class="guide-service-contact"><a href="tel:+919445000493">94450 00493</a><a href="tel:+914427843231">044-27843231</a><small>Pallipet Tahsildar</small></div></article>
<article class="guide-service"><div><h2>Tiruttani Revenue Division</h2><p>The Tiruttani Revenue Divisional Office is listed in the district administration's official contact directory.</p><p>{external("https://tiruvallur.nic.in/contact-directory/", "Verify in the district contact directory")}</p></div><div class="guide-service-contact"><a href="tel:+919445000411">94450 00411</a><a href="tel:+914427885877">044-27885877</a><small>Revenue Divisional Office</small></div></article>
<article class="guide-service"><div><h2>Postal information: PIN 631208</h2><p>Use India Post's official post-office locator and search by PIN code 631208 to confirm the current serving post office and public details.</p><p>{external("https://www.indiapost.gov.in/locate-postoffice", "Open the official India Post locator")}</p></div><div class="guide-service-contact"><a href="https://www.indiapost.gov.in/locate-postoffice" target="_blank" rel="noopener noreferrer">Find the post office</a><small>India Post official website</small></div></article>
</div><aside class="guide-callout"><strong>Independent information only.</strong> Podaturpet.com is not a government website and does not represent these offices. Names, phone numbers, opening hours and jurisdictions can change.</aside></section>
<section class="guide-section"><h2 class="guide-section-title">More official resources</h2><div class="guide-grid two">{card("🏛️", "District administration", "Tiruvallur district contacts", "Find district departments, revenue contacts, public notices and government service information through the district administration website.", "https://tiruvallur.nic.in/contact-directory/", "Open the official contact directory")}{card("📋", "Town Panchayat administration", "Tamil Nadu Directorate of Town Panchayats", "Use the state directorate for official information related to Town Panchayat administration, public services and relevant state resources.", "https://dtp.tn.gov.in/", "Visit the official directorate")}</div></section>
'''

page("government", "Podaturpet Government Offices & Official Contacts | Town Panchayat", "Find verified Podhaturpet Town Panchayat, Pallipet Taluk Office, Tiruttani revenue division and India Post information with official source links.", "Government offices and official contacts.", "Find official local-government contact information, district administration resources and postal guidance relevant to Podaturpet and its surrounding region.", government_content)

useful_content = f'''
<section class="guide-section"><h2 class="guide-section-title">Emergency and important helplines</h2><p class="guide-section-intro">Use the appropriate emergency service directly. In an urgent emergency, start with the national emergency number.</p><div class="guide-emergency-grid"><div class="guide-emergency"><strong><a href="tel:112">112</a></strong><span>National emergency</span></div><div class="guide-emergency"><strong><a href="tel:108">108</a></strong><span>Ambulance and accident response</span></div><div class="guide-emergency"><strong><a href="tel:181">181</a></strong><span>Women helpline</span></div><div class="guide-emergency"><strong><a href="tel:1098">1098</a></strong><span>Child helpline</span></div></div><aside class="guide-callout"><strong>Emergency notice:</strong> These are public helplines, not Podaturpet.com contact numbers. Availability and call routing are managed by the responsible public authorities.</aside></section>
<section class="guide-section"><h2 class="guide-section-title">Everyday Podaturpet information</h2><div class="guide-grid">{card("📮", "Postal information", "PIN code: 631208", "Use the Podaturpet-area PIN code when checking postal coverage, local addresses and delivery-related information.", "https://www.indiapost.gov.in/locate-postoffice", "Verify using India Post")}{card("🚌", "Regional travel", "Road and bus connections", "Plan travel through regional connections such as Tiruttani, Pallipattu and the Nagari side. Confirm current buses locally before departure.", "https://podaturpet.com/podaturpet-travel-pin-code.html", "Read the local travel guide")}{card("🚉", "Rail travel", "Nearby railway access", "Tiruttani and the Nagari area can serve as useful points of reference when researching nearby rail access. Confirm the exact station and timetable.", "https://www.irctc.co.in/", "Check official rail bookings")}{card("🏥", "Health and medical", "Hospitals and pharmacies", "For urgent medical help call 108. For non-emergency treatment, verify the nearest available clinic, hospital or pharmacy directly.", "https://tiruvallur.nic.in/public-utilities/", "Browse district public utilities")}{card("🏫", "Education", "Schools and learning services", "School availability, admissions, contact information and timings should be verified with the institution or the relevant education authority.", "https://tiruvallur.nic.in/", "Open the district website")}{card("🏦", "Banking and payments", "Banks, ATMs and payment services", "Confirm branch addresses, opening hours and ATM availability with the relevant bank before relying on a third-party listing.", "https://tiruvallur.nic.in/public-utilities/", "Browse district public utilities")}</div></section>
<section class="guide-section"><h2 class="guide-section-title">Trusted public references</h2><ul class="guide-source-list"><li>{external("https://www.india.gov.in/directory/helpline", "National Portal of India: helpline directory")}</li><li>{external("https://chennai.nic.in/helpline/", "Government of Tamil Nadu district helpline reference")}</li><li>{external("https://www.indiapost.gov.in/locate-postoffice", "India Post: locate a post office")}</li><li>{external("https://tiruvallur.nic.in/contact-directory/", "Tiruvallur District Administration: official contact directory")}</li></ul></section>
'''

page("useful", "Podaturpet Useful Information | PIN Code, Travel & Emergency Numbers", "Find Podaturpet PIN code 631208, emergency helplines, transport guidance, postal services, hospitals, schools, banks and official public resources.", "Useful information, when you need it.", "A practical starting point for Podaturpet's PIN code, public helplines, transport, postal services and everyday local information.", useful_content)

index_path = ROOT / "index.html"
index = index_path.read_text(encoding="utf-8")

stylesheet = '  <link rel="stylesheet" href="/podaturpet-town-guide.css">\n'
if stylesheet not in index:
    index = index.replace("</head>", stylesheet + "</head>", 1)

index = index.replace('<a href="#weaving">Our Weaving</a>', '<a href="#town-guide">Town Guide</a>', 1)
old_mobile = '<a href="#international-buyers">Worldwide</a></nav>'
new_mobile = '<a href="#international-buyers">Worldwide</a><a href="#town-guide">Town guide</a><a href="#advertise">Advertise</a></nav>'
index = index.replace(old_mobile, new_mobile, 1)

town_section = f'''
  <section class="town-index" id="town-guide" aria-labelledby="town-guide-title">
    <div class="container">
      <div class="town-index-header"><div class="section-head"><div class="kicker">The independent Podaturpet town guide</div><h2 id="town-guide-title">There is more to a town than what it sells.</h2><p>Discover regional places, local stories, useful public information and genuine community businesses—presented separately from textile sourcing.</p></div><p class="town-index-note">Dedicated town information, original descriptions and official source links where available.</p></div>
      <div class="town-index-grid">
        <a class="town-index-card" href="/podaturpet-tourist-places.html"><div class="town-card-icon" aria-hidden="true">⛰️</div><span class="town-card-label">Travel and discovery</span><h3>Places to visit nearby</h3><p>Explore Tiruttani, Sholingur, Kailasakona, Nagari Hills and more.</p><span class="town-card-link">Discover regional places →</span></a>
        <a class="town-index-card" href="/podaturpet-stories-and-culture.html"><div class="town-card-icon" aria-hidden="true">🪔</div><span class="town-card-label">Stories and culture</span><h3>The stories of Podaturpet</h3><p>Read about local weaving, community festivals, town history and everyday life.</p><span class="town-card-link">Read the town stories →</span></a>
        <a class="town-index-card" href="/podaturpet-local-business-directory.html"><div class="town-card-icon" aria-hidden="true">🏪</div><span class="town-card-label">Local shops and services</span><h3>Local business directory</h3><p>Discover business categories or request a verified local listing.</p><span class="town-card-link">Explore local businesses →</span></a>
        <a class="town-index-card" href="/podaturpet-government-offices.html"><div class="town-card-icon" aria-hidden="true">🏛️</div><span class="town-card-label">Public information</span><h3>Government offices</h3><p>Find Town Panchayat, taluk office and official district contact information.</p><span class="town-card-link">View official contacts →</span></a>
        <a class="town-index-card" href="/podaturpet-useful-information.html"><div class="town-card-icon" aria-hidden="true">📍</div><span class="town-card-label">Everyday essentials</span><h3>Useful local information</h3><p>Check PIN 631208, emergency numbers, transport and public-service links.</p><span class="town-card-link">Find useful information →</span></a>
        <a class="town-index-card" href="/about-podaturpet.html"><div class="town-card-icon" aria-hidden="true">🌾</div><span class="town-card-label">Know the town</span><h3>About Podaturpet</h3><p>Understand the location, local identity and history behind the town.</p><span class="town-card-link">Read the town profile →</span></a>
      </div>
    </div>
  </section>

  <section class="town-advertising" id="advertise" aria-labelledby="advertise-title">
    <div class="container"><div class="town-ad-frame">
      <div class="town-ad-copy" lang="en"><span class="town-ad-label">Independent advertising enquiries</span><h2 id="advertise-title">Give your business a place to be seen.</h2><p>Advertise your company, local shop, service or special offer on Podaturpet.com. Advertising enquiries are handled separately from textile sales and business directory listings.</p><div class="town-ad-actions"><a class="town-ad-button" href="{whatsapp('Hello Podaturpet Team, I would like to advertise my company or business on Podaturpet.com.')}" target="_blank" rel="noopener noreferrer">Enquire about advertising</a><a class="town-ad-phone" href="tel:+918778836385">{PHONE}</a></div></div>
      <div class="town-ad-copy" lang="ta"><span class="town-ad-label">விளம்பரத் தொடர்புக்கு</span><h3>உங்கள் வணிகத்தை அதிகமானோரிடம் கொண்டு செல்லுங்கள்.</h3><p>உங்கள் நிறுவனம், கடை, சேவைகள் அல்லது சிறப்புச் சலுகைகளை Podaturpet.com இணையதளத்தில் விளம்பரம் செய்யுங்கள்.</p><p><strong>விளம்பரம் செய்ய விருப்பமா? எங்களைத் தொடர்புகொள்ளுங்கள்.</strong></p><div class="town-ad-actions"><a class="town-ad-phone" href="tel:+918778836385">தொடர்புக்கு: {PHONE}</a></div></div>
    </div></div>
  </section>

'''

marker = '  <section class="contact" id="contact">'
if 'id="town-guide"' not in index:
    if marker not in index:
        raise RuntimeError("Could not locate the existing homepage contact section")
    index = index.replace(marker, town_section + marker, 1)

index_path.write_text(index, encoding="utf-8")

ET.register_namespace("", "http://www.sitemaps.org/schemas/sitemap/0.9")
sitemap_path = ROOT / "sitemap.xml"
tree = ET.parse(sitemap_path)
root = tree.getroot()
namespace = "{http://www.sitemaps.org/schemas/sitemap/0.9}"
existing = {element.findtext(f"{namespace}loc") for element in root.findall(f"{namespace}url")}
for filename, _ in PAGES.values():
    location = f"https://podaturpet.com/{filename}"
    if location in existing:
        continue
    entry = ET.SubElement(root, f"{namespace}url")
    ET.SubElement(entry, f"{namespace}loc").text = location
    ET.SubElement(entry, f"{namespace}lastmod").text = TODAY
    ET.SubElement(entry, f"{namespace}changefreq").text = "monthly"
    ET.SubElement(entry, f"{namespace}priority").text = "0.8"
ET.indent(tree, space="  ")
tree.write(sitemap_path, encoding="utf-8", xml_declaration=True)

print("Updated homepage, added five independent town-guide pages and refreshed sitemap.xml.")
