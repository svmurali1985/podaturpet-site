#!/usr/bin/env python3
from pathlib import Path
import re

ROOT = Path(".")
required = ["index.html", "cotton-lungi-wholesale.html", "lungi-wholesale-india.html"]
missing = [f for f in required if not (ROOT / f).exists()]
if missing:
    raise SystemExit("ERROR: missing files: " + ", ".join(missing))

def replace_once(text, old, new, label):
    if old in text:
        return text.replace(old, new, 1), True
    print(f"WARNING: {label} exact text not found; skipped.")
    return text, False

# ---------- HOME ----------
p = ROOT / "index.html"
html = p.read_text(encoding="utf-8")
count = 0

changes = [
(
'<title>Podaturpet Lungis | Wholesale Lungi Suppliers from Tamil Nadu, India</title>',
'<title>Podaturpet Lungi Wholesale & Supplier Network | Tamil Nadu</title>',
"home title"
),
(
'<meta name="description" content="Source cotton, handloom and powerloom lungis from Podaturpet, Tamil Nadu. Wholesale buyer enquiries from India and worldwide are welcome. Connect directly by WhatsApp." />',
'<meta name="description" content="Explore Podaturpet lungi wholesale sourcing in Tamil Nadu. Connect with the local textile network for cotton, handloom and powerloom lungi bulk enquiries in India and worldwide." />',
"home description"
),
(
'<meta name="keywords" content="Podaturpet lungis, wholesale lungi suppliers, lungi manufacturers Tamil Nadu, cotton lungi wholesale, handloom lungis, powerloom lungis, lungi exporters India, Podaturpet textiles" />',
'<meta name="keywords" content="Podaturpet lungi wholesale, lungi suppliers Podaturpet, cotton lungi wholesale Tamil Nadu, bulk lungi sourcing, handloom lungis, powerloom lungis, Podaturpet textiles" />',
"home keywords"
),
]
for old,new,label in changes:
    html, ok = replace_once(html, old, new, label)
    count += int(ok)

network_section = """
<section class="section" id="podaturpet-supplier-network">
  <div class="container">
    <div class="section-head">
      <div>
        <div class="eyebrow">Podaturpet Lungi Supplier Network</div>
        <h2>A textile town buyers can source from.</h2>
      </div>
      <p>
        Podaturpet and the surrounding Tiruvallur textile belt have an established lungi
        trading and weaving ecosystem. Podaturpet.com is an independent sourcing and
        connection platform — we help wholesale buyers describe their requirement and
        connect with opportunities in the local textile network.
      </p>
    </div>

    <div class="cards">
      <article class="card">
        <h3>Cotton Lungi Wholesale</h3>
        <p>Explore checked cotton lungi designs and prepare a clear bulk-buying requirement.</p>
        <a href="cotton-lungi-wholesale.html">Explore cotton lungis →</a>
      </article>
      <article class="card">
        <h3>India Wholesale Buyers</h3>
        <p>Buyer guidance for retailers, wholesalers, resellers and distributors across India.</p>
        <a href="lungi-wholesale-india.html">India sourcing guide →</a>
      </article>
      <article class="card">
        <h3>Handloom & Powerloom</h3>
        <p>Learn about the two production traditions represented in the Podaturpet textile ecosystem.</p>
        <a href="podaturpet-weaving-textiles.html">Understand local textiles →</a>
      </article>
    </div>

    <div class="note" style="margin-top:24px">
      <strong>For buyers:</strong> include quantity, preferred design or colour, fabric requirement,
      size/specification, destination and business type. Product claims, MOQ, price, packing,
      payment and delivery terms should be confirmed with the relevant supplier before ordering.
    </div>
  </div>
</section>
"""

if 'id="podaturpet-supplier-network"' not in html:
    marker = '<section class="manufacturer-ad"'
    idx = html.find(marker)
    if idx == -1:
        marker = '<section class="buyer-assurance"'
        idx = html.find(marker)
    if idx != -1:
        html = html[:idx] + network_section + "\n" + html[idx:]
        count += 1
    else:
        print("WARNING: homepage insertion point not found; supplier network section skipped.")

p.write_text(html, encoding="utf-8")

# ---------- COTTON WHOLESALE ----------
p = ROOT / "cotton-lungi-wholesale.html"
html = p.read_text(encoding="utf-8")
cotton_count = 0

html, ok = replace_once(
    html,
    "<title>Cotton Lungi Wholesale | Checked Lungis from Podaturpet</title>",
    "<title>Cotton Lungi Wholesale in Tamil Nadu | Podaturpet Sourcing</title>",
    "cotton title"
); cotton_count += int(ok)

html, ok = replace_once(
    html,
    '<meta name="description" content="Explore cotton lungi wholesale sourcing from Podaturpet, Tamil Nadu. Real checked designs for retailers, wholesalers, distributors and overseas buyers.">',
    '<meta name="description" content="Cotton lungi wholesale sourcing from Podaturpet, Tamil Nadu. Explore checked designs and send bulk requirements for retailer, wholesaler, distributor and overseas buyer enquiries.">',
    "cotton description"
); cotton_count += int(ok)

buyer_guide = """
<section class="story">
  <h2>Why buyers search Podaturpet for lungis</h2>
  <p>
    Podaturpet has a documented textile and lungi business ecosystem, with local businesses
    listed publicly as cotton-lungi suppliers, wholesalers and manufacturers. Podaturpet.com
    does not claim to manufacture these products; our role is to help buyers explore the
    sourcing ecosystem and start a clear wholesale enquiry.
  </p>
  <h3>Before asking for a wholesale quote</h3>
  <p>
    Prepare six details: approximate quantity, fabric preference, pattern or colour,
    size/specification, destination and whether you are a retailer, wholesaler or distributor.
    This makes it easier to discuss availability, samples, MOQ, packing and commercial terms.
  </p>
  <div class="links">
    <a href="lungi-wholesale-india.html">Wholesale lungis in India</a>
    <a href="handloom-lungis.html">Handloom lungis</a>
    <a href="powerloom-lungis.html">Powerloom lungis</a>
    <a href="podaturpet-lungi-weaving-story.html">Podaturpet weaving story</a>
  </div>
</section>
"""
if "Why buyers search Podaturpet for lungis" not in html:
    marker = '<div class="cta">'
    idx = html.find(marker)
    if idx != -1:
        html = html[:idx] + buyer_guide + "\n" + html[idx:]
        cotton_count += 1

# Add lightweight FAQ structured data.
if '"@type":"FAQPage"' not in html:
    faq = """<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"FAQPage",
  "mainEntity":[
    {
      "@type":"Question",
      "name":"Can wholesale buyers source lungis from Podaturpet?",
      "acceptedAnswer":{"@type":"Answer","text":"Podaturpet has a local textile and lungi business ecosystem. Podaturpet.com helps buyers explore sourcing opportunities and send wholesale requirements; final product and commercial terms must be confirmed with the relevant supplier."}
    },
    {
      "@type":"Question",
      "name":"What details should I send for a cotton lungi wholesale enquiry?",
      "acceptedAnswer":{"@type":"Answer","text":"Send approximate quantity, fabric preference, pattern or colour, size or specification, destination and your business type."}
    }
  ]
}
</script>
"""
    html = html.replace("</head>", faq + "</head>", 1)
    cotton_count += 1

p.write_text(html, encoding="utf-8")

# ---------- INDIA WHOLESALE ----------
p = ROOT / "lungi-wholesale-india.html"
html = p.read_text(encoding="utf-8")
india_count = 0

html, ok = replace_once(
    html,
    "<title>Wholesale Lungis in India | Podaturpet Cotton Lungi Sourcing</title>",
    "<title>Lungi Wholesale in India | Source from Podaturpet, Tamil Nadu</title>",
    "India title"
); india_count += int(ok)

india_section = """
<section class="story">
  <h2>Podaturpet as a lungi sourcing location</h2>
  <p>
    Public business directories list multiple lungi and textile businesses in and around
    Podaturpet, including cotton, checked, printed and handloom lungi activity. This gives
    buyers a legitimate reason to consider the town when researching Tamil Nadu sourcing.
    Podaturpet.com is an independent connection platform, not the manufacturer of every
    product shown or discussed on this site.
  </p>
  <h3>Useful sourcing paths</h3>
  <div class="links">
    <a href="cotton-lungi-wholesale.html">Cotton lungi wholesale</a>
    <a href="handloom-lungis.html">Handloom lungis</a>
    <a href="powerloom-lungis.html">Powerloom lungis</a>
    <a href="lungi-wholesale-chennai.html">Chennai buyers</a>
    <a href="lungi-wholesale-bengaluru.html">Bengaluru buyers</a>
    <a href="lungi-wholesale-hyderabad.html">Hyderabad buyers</a>
    <a href="lungi-wholesale-worldwide.html">International sourcing</a>
  </div>
</section>
"""
if "Podaturpet as a lungi sourcing location" not in html:
    marker = '<div class="cta">'
    idx = html.find(marker)
    if idx != -1:
        html = html[:idx] + india_section + "\n" + html[idx:]
        india_count += 1

p.write_text(html, encoding="utf-8")

# ---------- IMAGE PERFORMANCE ----------
# Add lazy loading/async decoding to non-hero content images on supporting pages.
perf_count = 0
for p in ROOT.glob("*.html"):
    if p.name == "index.html":
        continue
    text = p.read_text(encoding="utf-8")
    new = re.sub(
        r'<img(?![^>]*\bloading=)([^>]*src="images/[^"]+"[^>]*)>',
        r'<img loading="lazy" decoding="async"\1>',
        text
    )
    if new != text:
        p.write_text(new, encoding="utf-8")
        perf_count += 1

print("DONE: Google-focused SEO update applied.")
print(f"Homepage changes: {count}")
print(f"Cotton wholesale changes: {cotton_count}")
print(f"India wholesale changes: {india_count}")
print(f"Supporting pages with image-performance updates: {perf_count}")
print("No manufacturer claim was added for Podaturpet.com.")
print("Next run:")
print("git add -u")
print('git commit -m "Strengthen Podaturpet lungi wholesale SEO"')
print("git push")
