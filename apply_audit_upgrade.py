from pathlib import Path
import re
from PIL import Image

ROOT = Path(__file__).resolve().parent
TODAY = "2026-09-07"

BUSINESS_PAGES = {
    "index.html", "about-podaturpet.html", "blue-border-lungi-wholesale.html",
    "cotton-lungi-wholesale.html", "handloom-lungis.html",
    "how-checked-lungis-are-made.html", "lungi-product-catalogue.html",
    "lungi-suppliers-mumbai.html", "lungi-wholesale-bengaluru.html",
    "lungi-wholesale-chennai.html", "lungi-wholesale-delhi.html",
    "lungi-wholesale-hyderabad.html", "lungi-wholesale-india.html",
    "lungi-wholesale-kerala.html", "lungi-wholesale-kolkata.html",
    "lungi-wholesale-worldwide.html", "modern-lungi-global-collection.html",
    "modern-lungi-investors-research-partners.html",
    "modern-lungi-product-innovation.html", "podaturpet-lungi-weaving-story.html",
    "podaturpet-textile-supplier-enquiry.html", "podaturpet-weaving-textiles.html",
    "powerloom-lungis.html", "white-checked-lungi-wholesale.html",
    "wholesale-lungi-sample-buying-guide.html", "wholesale-lungis-malaysia.html",
    "wholesale-lungis-oman.html", "wholesale-lungis-saudi-arabia.html",
    "wholesale-lungis-singapore.html", "wholesale-lungis-sri-lanka.html",
    "wholesale-lungis-uae.html",
}

TITLE_UPDATES = {
    "blue-border-lungi-wholesale.html": "Blue Border Lungi Wholesale | Podaturpet",
    "cotton-lungi-wholesale.html": "Cotton Lungi Wholesale | Podaturpet",
    "lungi-product-catalogue.html": "Wholesale Lungi Catalogue | Podaturpet",
    "lungi-wholesale-bengaluru.html": "Wholesale Lungis Bengaluru | Podaturpet",
    "lungi-wholesale-delhi.html": "Wholesale Lungis Delhi | Podaturpet",
    "lungi-wholesale-india.html": "Wholesale Lungis India | Podaturpet",
    "lungi-wholesale-kolkata.html": "Wholesale Lungis Kolkata | Podaturpet",
    "modern-lungi-investors-research-partners.html": "Modern Lungi Research Partners | Podaturpet",
    "podaturpet-government-offices.html": "Podaturpet Government Offices & Contacts",
    "podaturpet-local-business-directory.html": "Podaturpet Local Business Directory",
    "podaturpet-lungi-weaving-story.html": "Podaturpet Lungi Weaving Story",
    "podaturpet-stories-and-culture.html": "Podaturpet Stories, Festivals & Culture",
    "podaturpet-textile-supplier-enquiry.html": "Podaturpet Textile Business Enquiry",
    "podaturpet-town-guide.html": "Podaturpet Town Guide | Services & Travel",
    "podaturpet-useful-information.html": "Podaturpet Useful Information & Services",
}

DESCRIPTION_UPDATES = {
    "index.html": "Explore photographed checked lungi designs from Podaturpet, Tamil Nadu. Request samples, specifications and wholesale quotations for India and international markets.",
    "blue-border-lungi-wholesale.html": "Explore white checked lungis with blue borders. Send your quantity, destination and sample requirements for a direct Podaturpet wholesale discussion.",
    "cotton-lungi-wholesale.html": "Explore checked cotton lungi designs from Podaturpet and send your quantity, specifications and destination for a wholesale quotation.",
    "modern-lungi-global-collection.html": "Explore Modern Lungi styling concepts for travel, streetwear, resort and everyday use. Concept designs are presented for research and development.",
    "modern-lungi-investors-research-partners.html": "Explore research, testing and product-development opportunities for the Modern Lungi concept from Podaturpet.",
    "modern-lungi-product-innovation.html": "Explore Modern Lungi product concepts combining woven identity with travel, storage, movement and climate-focused design ideas.",
    "white-checked-lungi-wholesale.html": "Explore white checked lungi designs and send your quantity, destination, measurements and sample requirements for wholesale discussion.",
}

REFERENCES = {
    "Classic White Checks": "PT-WC-01",
    "White &amp; Blue Border": "PT-BB-02",
    "Everyday Colour": "PT-CC-03",
    "Heritage Checks": "PT-HC-04",
    "Blue Check Designs": "PT-PC-05",
    "Understated Checks": "PT-NC-06",
}

PRODUCT_PAGE_REFERENCES = {
    "white-checked-lungi-wholesale.html": ("PT-WC-01", "Classic white checks"),
    "blue-border-lungi-wholesale.html": ("PT-BB-02", "White with blue border"),
    "cotton-lungi-wholesale.html": ("PT-CC-03", "Colourful checked cotton styles"),
    "handloom-lungis.html": ("PT-HC-04", "Heritage check styles"),
    "powerloom-lungis.html": ("PT-PC-05", "Blue powerloom check styles"),
}

MARKET_GUIDES = {
    "wholesale-lungis-uae.html": (
        "Preparing a UAE buyer enquiry",
        "For a quotation intended for Dubai, Sharjah, Abu Dhabi or another UAE destination, send the delivery emirate, expected quantity by design, preferred packing and whether you need samples before approval. Ask the team to separate product price, packing and delivery estimates so the commercial comparison is clear. Import documentation, labelling, freight mode and local clearance remain subject to confirmation with the buyer and logistics provider."
    ),
    "wholesale-lungis-saudi-arabia.html": (
        "Preparing a Saudi Arabia buyer enquiry",
        "Share the destination city, buyer type, expected quantities, preferred colours, measurements and carton requirements. If retail labelling or bilingual information is required, include that request before samples or production are discussed. Product classification, import documents, payment, freight and local compliance must be confirmed in writing with the supplying and logistics parties."
    ),
    "wholesale-lungis-oman.html": (
        "Preparing an Oman buyer enquiry",
        "Tell us whether the requirement is for a single shop, wholesale distribution or mixed retail supply, together with the delivery area, design mix and approximate quantity. Ask about sample consolidation, carton assortment and dispatch options before confirming an order. Freight, documentation, payment and local clearance are quoted only after the commercial requirement is clear."
    ),
    "wholesale-lungis-malaysia.html": (
        "Preparing a Malaysia buyer enquiry",
        "Send the buyer category, destination, preferred checked colours, required measurements and quantity per design. For a mixed retail assortment, identify how many pieces are needed in each colour or pattern and whether individual packing is required. Samples, labels, freight, customs documentation and payment terms must be confirmed before a bulk commitment."
    ),
    "wholesale-lungis-sri-lanka.html": (
        "Preparing a Sri Lanka buyer enquiry",
        "Include the destination, business type, design references, measurements, quantity and preferred packing. If you are comparing products for a specific retail segment, describe the expected colour range and presentation. Sample approval, commercial currency, transport, documentation and delivery responsibilities are confirmed separately for each enquiry."
    ),
    "wholesale-lungis-singapore.html": (
        "Preparing a Singapore buyer enquiry",
        "Provide the delivery location, business type, product references and quantity required per design. Buyers requesting smaller mixed assortments should specify colour counts, individual packing and sample expectations. Final availability, measurements, labelling, freight, import documentation and payment terms are confirmed in the written quotation process."
    ),
}

COUNTRY_PAGES = set(MARKET_GUIDES)

RESPONSIVE_SOURCES = {
    "images/hero-lungi-generations-2026.webp": (640, 960, 1280),
    "images/Newphoto1.jpeg": (480, 800),
    "images/newphoto2.jpeg": (480, 800),
    "images/lungi-colors.jpeg": (480, 800, 1200),
    "images/lungi-patterns.jpeg": (480, 800, 1200),
    "images/lungi-blue.jpeg": (480, 800, 1200),
    "images/lungi-grey.jpeg": (480, 800),
    "images/lungi-collection.jpeg": (480, 800, 1200),
}

RESPONSIVE_MAP = {}
responsive_dir = ROOT / "images" / "responsive"
responsive_dir.mkdir(parents=True, exist_ok=True)
for source_name, requested_widths in RESPONSIVE_SOURCES.items():
    source_path = ROOT / source_name
    with Image.open(source_path) as source_image:
        source_width, source_height = source_image.size
        candidates = []
        for width in requested_widths:
            if width >= source_width:
                continue
            height = round(source_height * width / source_width)
            output_name = f"{source_path.stem}-{width}.webp"
            output_path = responsive_dir / output_name
            resized = source_image.copy()
            resized.thumbnail((width, height), Image.Resampling.LANCZOS)
            resized.save(output_path, "WEBP", quality=82, method=6)
            candidates.append((f"/images/responsive/{output_name}", width))
        candidates.append((f"/{source_name}", source_width))
        RESPONSIVE_MAP[source_name] = candidates

def replace_title(text, value):
    return re.sub(r"<title>.*?</title>", f"<title>{value}</title>", text, count=1, flags=re.I | re.S)

def replace_description(text, value):
    pattern = r'<meta\s+name=["\']description["\']\s+content=["\'].*?["\']\s*/?>'
    tag = f'<meta name="description" content="{value}">'
    if re.search(pattern, text, flags=re.I | re.S):
        return re.sub(pattern, tag, text, count=1, flags=re.I | re.S)
    return text.replace("</title>", f"</title>\n  {tag}", 1)

def add_shared_assets(text):
    if "podaturpet-b2b-upgrade.css" not in text:
        text = text.replace("</head>", '  <link rel="stylesheet" href="/podaturpet-b2b-upgrade.css?v=20260907">\n</head>', 1)
    if "podaturpet-b2b-upgrade.js" not in text:
        text = text.replace("</body>", '  <script src="/podaturpet-b2b-upgrade.js?v=20260907" defer></script>\n</body>', 1)
    return text

def add_image_dimensions(text, page_path):
    def update(match):
        tag = match.group(0)
        if re.search(r"\bwidth\s*=", tag, re.I) and re.search(r"\bheight\s*=", tag, re.I):
            return tag
        src_match = re.search(r'\bsrc\s*=\s*(["\'])(.*?)\1', tag, re.I | re.S)
        if not src_match:
            return tag
        src = src_match.group(2).split("?", 1)[0].split("#", 1)[0]
        if src.startswith(("http://", "https://", "//", "data:")):
            return tag
        image_path = ROOT / src.lstrip("/")
        if not image_path.exists():
            image_path = page_path.parent / src
        try:
            with Image.open(image_path) as image:
                width, height = image.size
        except Exception:
            if image_path.suffix.lower() != ".svg":
                return tag
            try:
                svg_text = image_path.read_text(encoding="utf-8")
                view_box = re.search(r'viewBox=["\']\s*[-.\d]+\s+[-.\d]+\s+([.\d]+)\s+([.\d]+)', svg_text, re.I)
                if not view_box:
                    return tag
                width, height = int(float(view_box.group(1))), int(float(view_box.group(2)))
            except Exception:
                return tag
        additions = ""
        if not re.search(r"\bwidth\s*=", tag, re.I):
            additions += f' width="{width}"'
        if not re.search(r"\bheight\s*=", tag, re.I):
            additions += f' height="{height}"'
        if tag.endswith("/>"):
            return tag[:-2] + additions + ">"
        return tag[:-1] + additions + ">"
    return re.sub(r"<img\b[^>]*>", update, text, flags=re.I | re.S)

def add_responsive_sources(text):
    def update(match):
        tag = match.group(0)
        if re.search(r"\bsrcset\s*=", tag, re.I):
            return tag
        src_match = re.search(r'\bsrc\s*=\s*(["\'])(.*?)\1', tag, re.I | re.S)
        if not src_match:
            return tag
        source = src_match.group(2).split("?", 1)[0].split("#", 1)[0].lstrip("/")
        candidates = RESPONSIVE_MAP.get(source)
        if not candidates:
            return tag
        srcset = ", ".join(f"{url} {width}w" for url, width in candidates)
        sizes = "(max-width: 600px) 92vw, (max-width: 1000px) 50vw, 560px"
        attributes = f' srcset="{srcset}" sizes="{sizes}"'
        if tag.endswith("/>"):
            return tag[:-2] + attributes + ">"
        return tag[:-1] + attributes + ">"
    return re.sub(r"<img\b[^>]*>", update, text, flags=re.I | re.S)

for page in sorted(ROOT.glob("*.html")):
    text = page.read_text(encoding="utf-8")
    if page.name in TITLE_UPDATES:
        text = replace_title(text, TITLE_UPDATES[page.name])
    if page.name in DESCRIPTION_UPDATES:
        text = replace_description(text, DESCRIPTION_UPDATES[page.name])
    if page.name in BUSINESS_PAGES:
        text = add_shared_assets(text)

    if page.name in COUNTRY_PAGES:
        text = re.sub(
            r'<meta\s+name=["\']robots["\']\s+content=["\'][^"\']*["\']\s*/?>',
            '<meta name="robots" content="noindex,follow,max-image-preview:large">',
            text,
            count=1,
            flags=re.I,
        )
        text = re.sub(
            r'<link\s+rel=["\']canonical["\']\s+href=["\'][^"\']+["\']\s*/?>',
            '<link rel="canonical" href="https://podaturpet.com/lungi-wholesale-worldwide.html">',
            text,
            count=1,
            flags=re.I,
        )

    text = text.replace(
        "Podaturpet.com does not claim to manufacture or stock these products.",
        "Current availability, composition, measurements, sample terms, pricing, packing and delivery are confirmed directly for each wholesale requirement."
    )
    text = text.replace(
        "does not claim to manufacture these products; our role is to help buyers explore the",
        "presents these photographed designs for direct wholesale discussion and helps buyers explore the"
    )
    text = text.replace("with the relevant supplier", "with our wholesale team")
    text = text.replace("Ask the relevant supplier to confirm", "Ask our wholesale team to confirm")

    if page.name in PRODUCT_PAGE_REFERENCES and "buyer-specification-panel" not in text:
        reference, product_name = PRODUCT_PAGE_REFERENCES[page.name]
        panel = (
            '<section class="market-specific-guide buyer-specification-panel">'
            '<div class="eyebrow">Wholesale specification checklist</div>'
            f'<h2>{product_name}</h2><span class="product-reference">Reference {reference}</span>'
            '<p>Use this reference when contacting the team. The photograph identifies the design direction; the final order is based on the confirmed sample and written commercial specification.</p>'
            '<ul class="buyer-spec-list">'
            '<li><strong>Confirm:</strong> fabric composition</li>'
            '<li><strong>Confirm:</strong> finished measurements</li>'
            '<li><strong>Confirm:</strong> weave and colour</li>'
            '<li><strong>Confirm:</strong> sample availability</li>'
            '<li><strong>Confirm:</strong> MOQ and packing</li>'
            '<li><strong>Confirm:</strong> price and delivery</li>'
            '</ul></section>'
        )
        if '<div class="cta">' in text:
            text = text.replace('<div class="cta">', panel + '\n<div class="cta">', 1)
        else:
            text = text.replace('</main>', panel + '\n</main>', 1)

    if page.name == "lungi-product-catalogue.html":
        for heading, reference in REFERENCES.items():
            marker = f"<h2>{heading}</h2>"
            badge = f'{marker}<span class="product-reference">Reference {reference}</span>'
            if marker in text and f"Reference {reference}" not in text:
                text = text.replace(marker, badge, 1)

    if page.name in MARKET_GUIDES and "market-specific-guide" not in text:
        title, copy = MARKET_GUIDES[page.name]
        section = (
            f'<section class="market-specific-guide"><h2>{title}</h2>'
            f'<p>{copy}</p><ul class="buyer-spec-list">'
            '<li><strong>Send:</strong> product reference</li>'
            '<li><strong>Send:</strong> quantity by design</li>'
            '<li><strong>Confirm:</strong> measurements and fabric</li>'
            '<li><strong>Confirm:</strong> sample and packing</li>'
            '<li><strong>Confirm:</strong> price and payment</li>'
            '<li><strong>Confirm:</strong> freight and documentation</li>'
            '</ul></section>'
        )
        text = text.replace('<div class="cta">', section + '\n<div class="cta">', 1)

    text = add_image_dimensions(text, page)
    text = add_responsive_sources(text)
    page.write_text(text, encoding="utf-8")

# Update sitemap dates for the revised public pages while retaining every URL.
sitemap = ROOT / "sitemap.xml"
sitemap_text = sitemap.read_text(encoding="utf-8")
for page_name in COUNTRY_PAGES:
    url = f"https://podaturpet.com/{page_name}"
    sitemap_text = re.sub(
        rf"\s*<url>\s*<loc>{re.escape(url)}</loc>.*?</url>",
        "",
        sitemap_text,
        flags=re.S,
    )
for page_name in BUSINESS_PAGES:
    url = "https://podaturpet.com/" if page_name == "index.html" else f"https://podaturpet.com/{page_name}"
    pattern = rf"(<loc>{re.escape(url)}</loc>\s*<lastmod>)[^<]+(</lastmod>)"
    sitemap_text = re.sub(pattern, rf"\g<1>{TODAY}\g<2>", sitemap_text)
sitemap.write_text(sitemap_text, encoding="utf-8")

print("Applied audited B2B, SEO, accessibility and image-dimension upgrades.")
