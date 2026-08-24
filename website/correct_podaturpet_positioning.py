#!/usr/bin/env python3
from pathlib import Path

p = Path("index.html")
if not p.exists():
    raise SystemExit("ERROR: index.html not found.")

html = p.read_text(encoding="utf-8")

replacements = {
    "Direct from Podaturpet • Wholesale Ready": "Podaturpet Textile Network • Wholesale Sourcing",
    "We weave. We deliver. <span>You grow.</span>": "Source from Podaturpet. <span>Grow your business.</span>",
    """We work directly from the Podaturpet textile region to supply quality lungis for
        retailers, distributors and wholesale buyers. <strong>Our goal is simple:</strong>
        dependable quality, fair wholesale pricing and a business relationship you can trust.""":
    """Podaturpet.com helps wholesale buyers discover and connect with the lungi and textile
        network of Podaturpet, Tamil Nadu. <strong>Our goal is simple:</strong> make it easier
        for retailers, distributors and international buyers to find sourcing opportunities
        from this traditional textile region.""",
    """Give us one opportunity. Try our lungis once, check the quality yourself,
        and then decide your next bulk order.""":
    """Looking for lungis in bulk? Send your requirement and connect with sourcing
        opportunities from the Podaturpet textile network.""",
    "Direct Manufacturing Connection": "Podaturpet Supplier Connections",
    "Closer to the weaving source with fewer unnecessary layers.": "Connect with the local weaving and textile sourcing network.",
    "Quality-Focused Lungis": "Lungi Sourcing Options",
    "Cotton, handloom and powerloom options for different markets.": "Explore cotton, handloom and powerloom sourcing opportunities.",
    "Give Us a Chance — Get Wholesale Quote": "Send Your Wholesale Requirement",
    "Podaturpet lungi manufacturing and wholesale buyer promotion": "Podaturpet lungi sourcing and wholesale buyer promotion",
}

changed = 0
for old, new in replacements.items():
    if old in html:
        html = html.replace(old, new, 1)
        changed += 1

# Remove unsupported direct-manufacturer language elsewhere in the homepage campaign area.
html = html.replace("Direct Manufacturing Connection", "Podaturpet Supplier Connections")
html = html.replace("Direct Manufacturing", "Supplier Network")

p.write_text(html, encoding="utf-8")
print(f"DONE: corrected business positioning ({changed} targeted replacements).")
print("Podaturpet.com is now described as a wholesale sourcing/connection platform, not a manufacturer.")
print("Now run:")
print("git add index.html")
print('git commit -m "Correct Podaturpet wholesale sourcing positioning"')
print("git push")
