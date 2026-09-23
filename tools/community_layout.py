"""Idempotent integration for all active public pages; standard library only."""
import re

def apply_community(text, page):
    if page == 'community-admin.html' or re.search(r'http-equiv=["\']refresh', text, re.I):
        return text
    for name in ('podaturpet-feedback', 'podaturpet-visitor-tracking', 'podaturpet-visitor-counter', 'podaturpet-community-config'):
        text = re.sub(r'<script\b[^>]*src=["\'][^"\']*'+name+r'\.js[^"\']*["\'][^>]*>\s*</script>\s*', '', text)
    for name in ('podaturpet-feedback', 'podaturpet-visitor-counter'):
        text = re.sub(r'<link\b[^>]*href=["\'][^"\']*'+name+r'\.css[^"\']*["\'][^>]*>\s*', '', text)
    text = text.replace('</head>', '<link rel="stylesheet" href="/podaturpet-feedback.css?v=20260923-community">\n</head>')
    scripts = ''.join('<script src="/'+n+'.js?v=20260923-community" defer></script>' for n in ('podaturpet-community-config', 'podaturpet-feedback', 'podaturpet-visitor-tracking'))
    return text.replace('</body>', scripts+'\n</body>')

if __name__ == '__main__':
    from pathlib import Path
    import json
    root = Path(__file__).resolve().parents[1]
    pages = []
    for p in root.glob('*.html'):
        text = p.read_text()
        if p.name == 'community-admin.html' or re.search(r'http-equiv=["\']refresh', text, re.I):
            continue
        p.write_text(apply_community(text, p.name))
        pages.append('/'+p.name)
    (root/'community-worker/pages.mjs').write_text('// Public page allowlist. Regenerate after adding pages.\nexport const PAGES = '+json.dumps(sorted(pages), indent=2)+';\n')
    print('Integrated', len(pages), 'active public pages.')
