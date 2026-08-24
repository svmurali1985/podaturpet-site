from __future__ import annotations

import json
from html import escape
from pathlib import Path


ROOT = Path(__file__).resolve().parent
HOME = ROOT / "index.html"


def replace_once(document: str, previous: str, replacement: str, label: str) -> str:
    if previous not in document:
        if replacement in document:
            return document
        raise RuntimeError(f"Could not locate {label}")
    return document.replace(previous, replacement, 1)


html = HOME.read_text(encoding="utf-8")

html = replace_once(html, "<title>Podaturpet Lungi Wholesale & Supplier Network | Tamil Nadu</title>", "<title>Podaturpet Lungi Wholesale & Town Guide | Tamil Nadu</title>", "homepage title")
html = replace_once(html, 'content="Discover Podaturpet lungi wholesale designs, original powerloom weaving footage and straightforward buyer enquiries. Explore Tamil Nadu textile sourcing for India and worldwide markets."', 'content="Discover Podaturpet lungi wholesale, checked cotton designs and textile sourcing, or explore Podaturpet tourist places, town stories, local shops and public information."', "homepage search description")
html = replace_once(html, 'content="Podaturpet lungi wholesale, lungi suppliers Podaturpet, cotton lungi wholesale Tamil Nadu, bulk lungi sourcing, handloom lungis, powerloom lungis, Podaturpet textiles"', 'content="Podaturpet lungi wholesale, Podhaturpet lungi suppliers, cotton lungi wholesale Tamil Nadu, checked lungis, lungies, Podaturpet tourist places, Podaturpet town guide, Pothatturpettai, 631208"', "homepage topic keywords")
html = replace_once(html, 'content="Podaturpet Lungis — Woven Trust from Tamil Nadu"', 'content="Podaturpet — Wholesale Lungis & Independent Town Guide"', "homepage social title")
html = replace_once(html, 'content="From the looms of Podaturpet to buyers around the world: real product photographs, original weaving footage and clearer wholesale sourcing conversations."', 'content="Explore distinctive wholesale lungi designs or discover Podaturpet attractions, local stories, public offices and useful town information."', "homepage social description")
html = replace_once(html, 'content="Discover real lungi designs, original weaving footage and clear wholesale sourcing enquiries from Podaturpet, India."', 'content="Discover Podaturpet lungi wholesale designs, nearby attractions, verified public contacts and original local stories."', "homepage Twitter description")

stylesheet = '  <link rel="stylesheet" href="/podaturpet-business-redesign.css">\n'
if stylesheet not in html:
    html = replace_once(html, "</head>", stylesheet + "</head>", "homepage stylesheet insertion")

html = replace_once(html, '<a href="#powerloom-video">Weaving Video</a>\n        <a href="#india-buyers">India Buyers</a>\n        <a href="#international-buyers">International</a>\n        <a href="#town-guide">Town Guide</a>', '<a href="#lungi-campaign">Wholesale Lungis</a>\n        <a href="#powerloom-video">Our Weaving</a>\n        <a href="#town-guide">Town Guide</a>\n        <a href="#advertise">Advertise</a>', "desktop navigation")

html = replace_once(html, '<span class="proof">India &amp; worldwide buyers</span>', '<span class="proof">India &amp; worldwide buyers</span>\n          <a class="proof" href="#town-guide">Looking for Podaturpet town information? →</a>', "hero town-guide signpost")

intent_selector = '''
  <section class="visitor-choice" id="choose-your-journey" aria-label="Choose the right Podaturpet website section">
    <div class="container">
      <div class="visitor-choice-intro"><strong>What brings you to Podaturpet today?</strong><span>Choose the experience that fits.</span></div>
      <div class="visitor-choice-grid">
        <a class="visitor-choice-card is-buyer" href="#lungi-campaign"><div><small>For textile buyers</small><h2>I am looking for lungis.</h2><p>Explore original designs, wholesale sourcing and buyer enquiries.</p></div><span class="visitor-choice-arrow" aria-hidden="true">→</span></a>
        <a class="visitor-choice-card is-town" href="#podaturpet-attractions"><div><small>For town visitors</small><h2>I want to discover Podaturpet.</h2><p>Find nearby places, stories, government offices and local information.</p></div><span class="visitor-choice-arrow" aria-hidden="true">→</span></a>
      </div>
    </div>
  </section>

'''

lungi_campaign = '''
  <section class="lungi-campaign" id="lungi-campaign" aria-labelledby="lungi-campaign-title">
    <div class="container"><div class="lungi-campaign-frame">
      <div class="lungi-campaign-copy"><span class="lungi-campaign-tag">Dedicated Podaturpet lungi promotion</span><h2 id="lungi-campaign-title">A design worth stocking. A town worth trusting.</h2><p>Source memorable checked lungi designs from the Podaturpet textile region. Tell us the style, quantity and destination you need to start a genuine wholesale conversation.</p><div class="lungi-campaign-points"><span>Original product photographs</span><span>Wholesale enquiries</span><span>India &amp; international buyers</span></div><div class="lungi-campaign-actions"><a class="lungi-campaign-primary" href="https://wa.me/918778836385?text=Hello%20Podaturpet%20Team%2C%20I%20am%20looking%20for%20wholesale%20lungis.%20Design%3A%20____%20Quantity%3A%20____%20Destination%3A%20____" target="_blank" rel="noopener noreferrer">Get a wholesale quote</a><a class="lungi-campaign-secondary" href="/lungi-product-catalogue.html">View all lungi designs</a></div></div>
      <div class="lungi-campaign-visual"><img src="/images/newphoto2.jpeg" alt="Original photograph of Podaturpet white checked lungis with a distinctive blue woven border" loading="lazy" decoding="async"><div class="lungi-campaign-badge"><strong>Podaturpet checked lungis</strong><span>Ask about your preferred pattern, quantity and destination.</span></div></div>
    </div></div>
  </section>

'''

attractions_preview = '''
  <section class="town-attraction-preview" id="podaturpet-attractions" aria-labelledby="podaturpet-attractions-title">
    <div class="container"><div class="town-attraction-heading"><div class="section-head"><div class="kicker">A separate guide to the Podaturpet region</div><h2 id="podaturpet-attractions-title">Come for the town. Discover what is around it.</h2><p>Find nearby temples, hill landscapes, waterfalls and practical local information without mixing visitor guidance with textile advertising.</p></div><a class="town-attraction-link" href="/podaturpet-tourist-places.html">See every place to visit →</a></div>
      <div class="town-attraction-grid">
        <a class="town-attraction-card" href="/podaturpet-tourist-places.html"><span class="town-attraction-symbol" aria-hidden="true">🛕</span><span class="town-attraction-type">Temple town</span><h3>Tiruttani Murugan Temple</h3><p>A well-known regional hill temple and local travel landmark.</p></a>
        <a class="town-attraction-card" href="/podaturpet-tourist-places.html"><span class="town-attraction-symbol" aria-hidden="true">💧</span><span class="town-attraction-type">Nature escape</span><h3>Kailasakona Waterfall</h3><p>Explore a waterfall destination on the Andhra Pradesh side.</p></a>
        <a class="town-attraction-card" href="/podaturpet-tourist-places.html"><span class="town-attraction-symbol" aria-hidden="true">⛰️</span><span class="town-attraction-type">Hills and views</span><h3>Nagari Hills</h3><p>Discover the distinctive hills and research responsible trekking.</p></a>
        <a class="town-attraction-card" href="/podaturpet-tourist-places.html"><span class="town-attraction-symbol" aria-hidden="true">🪔</span><span class="town-attraction-type">Hill pilgrimage</span><h3>Sholingur Temple</h3><p>Find official information about this regional hill-temple visit.</p></a>
      </div><p class="town-attraction-footnote">Town information, local stories and government contacts have their own dedicated pages. <a class="town-attraction-link" href="#town-guide">Explore the town guide →</a></p>
    </div>
  </section>

'''

if 'id="choose-your-journey"' not in html:
    html = replace_once(html, '  <div class="strip">', intent_selector + '  <div class="strip">', "visitor choice placement")
if 'id="lungi-campaign"' not in html:
    html = replace_once(html, '  <section class="product-showcase" id="products">', lungi_campaign + '  <section class="product-showcase" id="products">', "dedicated lungi campaign placement")
if 'id="podaturpet-attractions"' not in html:
    html = replace_once(html, '  <section class="loom-film" id="powerloom-video">', attractions_preview + '  <section class="loom-film" id="powerloom-video">', "independent town attractions placement")

html = replace_once(html, 'Advertising enquiries are handled separately from textile sales and business directory listings.</p><div class="town-ad-actions">', 'Advertising enquiries are handled separately from textile sales and business directory listings.</p><p class="separate-ad-note">Independent advertising placement · Not a textile promotion</p><div class="town-ad-actions">', "independent advertising label")

website_before = '"alternateName":["Podaturpet Lungis","Podhaturpet Textiles"],\n    "description":"Wholesale lungi sourcing and textile buyer connections from Podaturpet, Tamil Nadu, India.",\n    "inLanguage":"en-IN"'
website_after = '"alternateName":["Podaturpet Lungis","Podhaturpet","Pothatturpettai","Podaturpet Town Guide"],\n    "description":"Independent Podaturpet website with wholesale lungi sourcing, local visitor information, regional attractions, town stories and public-service guides.",\n    "inLanguage":["en-IN","ta-IN"]'
html = replace_once(html, website_before, website_after, "WebSite structured data")

organization_before = '"description":"A Podaturpet-focused platform connecting wholesale lungi buyers with textile sourcing opportunities in Tamil Nadu.",'
organization_after = '"description":"An independent Podaturpet platform offering wholesale textile sourcing connections and separate town-information guides.",\n    "logo":"https://podaturpet.com/images/podaturpet-logo.svg",'
html = replace_once(html, organization_before, organization_after, "Organization structured data")

HOME.write_text(html, encoding="utf-8")

guides = {
    "podaturpet-tourist-places.html": {
        "name": "Places to Visit Near Podaturpet",
        "description": "Regional attractions including Tiruttani Murugan Temple, Sholingur, Kailasakona Waterfall, Nagari Hills, Poondi Reservoir and Tirupati.",
        "type": "CollectionPage",
        "items": ["Tiruttani Murugan Temple", "Sholingur Lakshmi Narasimha Temple", "Kailasakona Waterfall", "Nagari Hills and Nagari Nose", "Poondi Reservoir", "Thiruvalangadu Vadaranyeswarar Temple", "Tirupati and Tirumala", "Pulicat and the coastal region"],
    },
    "podaturpet-stories-and-culture.html": {
        "name": "Podaturpet Stories and Culture",
        "description": "Original Podaturpet stories about weaving heritage, Amman festivals, local history and community life.",
        "type": "CollectionPage",
        "items": ["A town shaped by threads and trade", "When the town gathers for its Amman festivals", "A Town Panchayat story that reaches back to 1939", "Between paddy fields, market streets and the loom"],
    },
    "podaturpet-local-business-directory.html": {
        "name": "Podaturpet Local Business Directory",
        "description": "Local business categories and genuine directory-listing enquiries for Podaturpet-area shops and services.",
        "type": "CollectionPage",
        "items": ["Textile shops and weaving", "Grocery and provision stores", "Restaurants, tea shops and bakeries", "Pharmacies and healthcare services", "Jewellery and electronics"],
    },
    "podaturpet-government-offices.html": {
        "name": "Podaturpet Government Offices and Official Contacts",
        "description": "Official-source contact information for Podhaturpet Town Panchayat, Pallipet Taluk Office and regional public services.",
        "type": "WebPage",
        "items": [],
    },
    "podaturpet-useful-information.html": {
        "name": "Podaturpet Useful Information",
        "description": "Podaturpet PIN code 631208, emergency helplines, transport guidance, postal information and public-service links.",
        "type": "WebPage",
        "items": [],
    },
}

for filename, details in guides.items():
    path = ROOT / filename
    document = path.read_text(encoding="utf-8")
    page_url = f"https://podaturpet.com/{filename}"
    breadcrumb = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Podaturpet", "item": "https://podaturpet.com/"},
            {"@type": "ListItem", "position": 2, "name": "Podaturpet Town Guide", "item": "https://podaturpet.com/#town-guide"},
            {"@type": "ListItem", "position": 3, "name": details["name"], "item": page_url},
        ],
    }
    page_schema = {
        "@context": "https://schema.org",
        "@type": details["type"],
        "name": details["name"],
        "url": page_url,
        "description": details["description"],
        "inLanguage": "en-IN",
        "isPartOf": {"@type": "WebSite", "name": "Podaturpet.com", "url": "https://podaturpet.com/"},
        "about": {"@type": "Place", "name": "Podaturpet", "alternateName": ["Podhaturpet", "Pothatturpettai"], "address": {"@type": "PostalAddress", "addressLocality": "Podaturpet", "addressRegion": "Tamil Nadu", "postalCode": "631208", "addressCountry": "IN"}},
    }
    if details["items"]:
        page_schema["mainEntity"] = {"@type": "ItemList", "itemListElement": [{"@type": "ListItem", "position": index, "name": name} for index, name in enumerate(details["items"], start=1)]}

    marker = '  <link rel="stylesheet" href="/podaturpet-town-guide.css">'
    enhancement = marker + '\n  <link rel="stylesheet" href="/podaturpet-business-redesign.css">\n  <script type="application/ld+json">' + json.dumps(breadcrumb, ensure_ascii=False, separators=(",", ":")) + '</script>\n  <script type="application/ld+json">' + json.dumps(page_schema, ensure_ascii=False, separators=(",", ":")) + '</script>'
    if '"@type":"BreadcrumbList"' not in document:
        document = replace_once(document, marker, enhancement, f"{filename} structured data")

    main_marker = '<main class="guide-main"><div class="guide-shell">'
    crumbs = main_marker + '<nav class="guide-breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><a href="/#town-guide">Town guide</a><span aria-hidden="true">/</span><span>' + escape(details["name"]) + '</span></nav>'
    if 'class="guide-breadcrumbs"' not in document:
        document = replace_once(document, main_marker, crumbs, f"{filename} visible breadcrumbs")
    path.write_text(document, encoding="utf-8")

print("Redesigned homepage for separate textile and town journeys; improved structured data on five town-guide pages.")
