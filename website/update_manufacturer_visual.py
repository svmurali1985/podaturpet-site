#!/usr/bin/env python3
from pathlib import Path

p = Path("index.html")
if not p.exists():
    raise SystemExit("ERROR: index.html not found.")

html = p.read_text(encoding="utf-8")

old = "url('images/podaturpet-manufacturer-ad.png') center top/cover no-repeat"
new = "url('images/podaturpet-manufacturer-ad-v2.png') center center/cover no-repeat"

if old not in html:
    raise SystemExit("ERROR: current manufacturer ad image reference was not found. No changes made.")

html = html.replace(old, new, 1)

# Remove the overlay badge because the new visual already has clean visual messaging.
start = html.find('<div class="manufacturer-badge">')
if start != -1:
    end = html.find('</div>', start)
    if end != -1:
        end += len('</div>')
        html = html[:start] + html[end:]

p.write_text(html, encoding="utf-8")
print("DONE: cleaner manufacturer visual installed.")
print("Now run:")
print("git add index.html images/podaturpet-manufacturer-ad-v2.png")
print('git commit -m "Improve manufacturer campaign visual"')
print("git push")
