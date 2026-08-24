#!/usr/bin/env python3
from pathlib import Path

p = Path("index.html")
if not p.exists():
    raise SystemExit("ERROR: index.html not found. Run this inside your website folder.")

html = p.read_text(encoding="utf-8")

old = """        <div class="eyebrow">Podaturpet • Tamil Nadu • India</div>

        <h1>
          Local textile strength.
          <strong>Global opportunity.</strong>
        </h1>
        <p class="hero-copy">
          Looking for lungis from a traditional weaving region in Tamil Nadu?
          Connect with Podaturpet.com for wholesale sourcing enquiries, supplier discovery
          and textile business connections from Podaturpet.
        </p>

        <div class="buttons">
          <a href="#contact" class="btn btn-primary">Find Lungi Suppliers</a>
          <a href="#business" class="btn btn-secondary">Wholesale Buyer Enquiry</a>
        </div>"""

new = """        <div class="eyebrow">Podaturpet • Tamil Nadu • India • Woven Trust</div>

        <h1>
          Podaturpet lungis.
          <strong>Woven for the world.</strong>
        </h1>
        <p class="hero-copy">
          Source cotton, handloom and powerloom lungis from the Podaturpet textile region.
          Wholesale enquiries are welcome from retailers, distributors and textile buyers
          across India and international markets.
        </p>

        <div class="buttons">
          <a href="https://wa.me/14793201970?text=Hello%20Murali%2C%20I%20want%20a%20wholesale%20lungi%20quote.%20Product%2Fstyle%3A%20____%20Quantity%3A%20____%20Destination%3A%20____"
             class="btn btn-primary" target="_blank" rel="noopener noreferrer">Get Wholesale Quote</a>
          <a href="#international-buyers" class="btn btn-secondary">International Buyers</a>
        </div>"""

if old not in html:
    raise SystemExit("ERROR: hero section did not match. No changes were made.")

html = html.replace(old, new, 1)
p.write_text(html, encoding="utf-8")

print("DONE: hero section updated successfully.")
print("Next run:")
print("git add index.html")
print('git commit -m "Improve homepage wholesale buyer message"')
print("git push")
