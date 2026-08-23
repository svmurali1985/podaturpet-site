#!/usr/bin/env python3
from pathlib import Path
import re

p = Path("index.html")
if not p.exists():
    raise SystemExit("ERROR: index.html not found. Run this inside your website folder.")

html = p.read_text(encoding="utf-8")

# 1) Enlarge and refine header logo area.
html = re.sub(
    r'\.brand-wrap\{[^}]*\}',
    '.brand-wrap{display:flex;align-items:center;gap:14px;min-width:280px}',
    html,
    count=1
)
html = re.sub(
    r'\.brand-text\{[^}]*\}',
    '.brand-text{display:flex;flex-direction:column;line-height:1.02}',
    html,
    count=1
)
html = re.sub(
    r'\.logo\{\s*color:#fff;font-weight:900;font-size:[^;]+;letter-spacing:[^}]+\}',
    '.logo{color:#fff;font-weight:900;font-size:1.72rem;letter-spacing:-.045em}',
    html,
    count=1
)
html = re.sub(
    r'\.brand-tagline\{[^}]*\}',
    '.brand-tagline{margin-top:6px;color:#e7bd57;font-size:.76rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase}',
    html,
    count=1
)

# Improve SVG logo size if present.
html = re.sub(
    r'<img([^>]+)src="images/podaturpet-logo\.svg"([^>]*)style="[^"]*"([^>]*)>',
    r'<img\1src="images/podaturpet-logo.svg"\2style="width:74px;height:74px;object-fit:contain;flex:none"\3>',
    html,
    count=1
)
html = re.sub(
    r'<img([^>]+)src="images/podaturpet-logo\.svg"([^>]*)>',
    lambda m: m.group(0) if 'style=' in m.group(0) else m.group(0).replace('>', ' style="width:74px;height:74px;object-fit:contain;flex:none">'),
    html,
    count=1
)

# 2) Strengthen hero image treatment while keeping current content.
hero_css = """
    .hero{
      position:relative;
      overflow:hidden;
      min-height:620px;
      display:flex;
      align-items:center;
      isolation:isolate;
    }
    .hero::before{
      content:"";
      position:absolute;
      inset:0;
      background:
        linear-gradient(90deg,rgba(4,21,17,.88) 0%,rgba(4,21,17,.78) 38%,rgba(4,21,17,.34) 68%,rgba(4,21,17,.20) 100%);
      z-index:-1;
    }
    .hero::after{
      content:"";
      position:absolute;
      inset:auto 0 0 0;
      height:120px;
      background:linear-gradient(180deg,transparent,rgba(4,21,17,.42));
      z-index:-1;
      pointer-events:none;
    }
    .hero-inner{padding-top:92px;padding-bottom:92px;max-width:760px}
    .hero h1{font-size:clamp(2.9rem,5.6vw,5.6rem);line-height:.98;max-width:930px}
    .hero-copy{font-size:1.15rem;line-height:1.75;max-width:720px}
    .hero .buttons{margin-top:28px}
    .hero .btn{padding:15px 22px;font-size:1rem}
    .eyebrow{font-size:.79rem;letter-spacing:.16em}
    @media(max-width:900px){
      .brand-wrap{min-width:0}
      .logo{font-size:1.35rem}
      .brand-tagline{font-size:.66rem}
      .hero{min-height:560px}
      .hero-inner{padding-top:72px;padding-bottom:72px}
      .hero h1{font-size:clamp(2.55rem,10vw,4.4rem)}
    }
"""
if hero_css.strip() not in html:
    html = html.replace("</style>", hero_css + "\n  </style>", 1)

# 3) Add stronger buyer assurance cards under hero if not already present.
assurance = """
<section class="buyer-assurance" aria-label="Buyer assurance">
  <div class="container">
    <div class="assurance-grid">
      <div class="assurance-card">
        <strong>Wholesale Ready</strong>
        <span>Buyer enquiries for retail, distribution and bulk sourcing.</span>
      </div>
      <div class="assurance-card">
        <strong>Podaturpet Textile Region</strong>
        <span>Connected to a long-standing lungi weaving and textile ecosystem.</span>
      </div>
      <div class="assurance-card">
        <strong>Worldwide Enquiries</strong>
        <span>India, Gulf, Southeast Asia and international buyer connections.</span>
      </div>
    </div>
  </div>
</section>
"""
assurance_css = """
    .buyer-assurance{background:#f6f1e7;padding:28px 0;border-bottom:1px solid rgba(7,27,23,.08)}
    .assurance-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
    .assurance-card{background:#fff;border:1px solid rgba(7,27,23,.08);border-radius:18px;padding:22px 24px;box-shadow:0 12px 30px rgba(7,27,23,.06)}
    .assurance-card strong{display:block;color:#0b2b23;font-size:1.03rem;margin-bottom:7px}
    .assurance-card span{display:block;color:#52605b;line-height:1.55;font-size:.94rem}
    @media(max-width:800px){.assurance-grid{grid-template-columns:1fr}.buyer-assurance{padding:20px 0}}
"""
if assurance_css.strip() not in html:
    html = html.replace("</style>", assurance_css + "\n  </style>", 1)

if "buyer-assurance" not in html:
    m = re.search(r'</section>\s*<!--\s*HERO', html, re.I)
    if m:
        pass
    # insert after first hero section
    hero_close = html.find("</section>", html.find('class="hero"'))
    if hero_close != -1:
        hero_close += len("</section>")
        html = html[:hero_close] + "\n" + assurance + html[hero_close:]

p.write_text(html, encoding="utf-8")
print("DONE: visual polish applied.")
print("Updated: larger logo/header, stronger hero scale/overlay, premium buyer assurance cards.")
print("SEO content and structured data were left intact.")
print("Now run:")
print("git add index.html")
print('git commit -m "Polish homepage logo and buyer presentation"')
print("git push")
