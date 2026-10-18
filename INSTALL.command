#!/bin/bash
set -euo pipefail
package_dir="$(cd "$(dirname "$0")" && pwd)"
target_dir="${1:-$HOME/website}"
if [ ! -f "$target_dir/index.html" ]; then
  echo "Website folder not found: $target_dir"
  exit 1
fi
backup_dir="$target_dir/invoice-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$backup_dir"
if [ -f "$target_dir/free-invoice.html" ]; then mkdir -p "$backup_dir/$(dirname "free-invoice.html")"; cp "$target_dir/free-invoice.html" "$backup_dir/free-invoice.html"; fi
mkdir -p "$target_dir/$(dirname "free-invoice.html")"
cp "$package_dir/website-update/free-invoice.html" "$target_dir/free-invoice.html"
if [ -f "$target_dir/invoice-tool.css" ]; then mkdir -p "$backup_dir/$(dirname "invoice-tool.css")"; cp "$target_dir/invoice-tool.css" "$backup_dir/invoice-tool.css"; fi
mkdir -p "$target_dir/$(dirname "invoice-tool.css")"
cp "$package_dir/website-update/invoice-tool.css" "$target_dir/invoice-tool.css"
if [ -f "$target_dir/invoice-core.js" ]; then mkdir -p "$backup_dir/$(dirname "invoice-core.js")"; cp "$target_dir/invoice-core.js" "$backup_dir/invoice-core.js"; fi
mkdir -p "$target_dir/$(dirname "invoice-core.js")"
cp "$package_dir/website-update/invoice-core.js" "$target_dir/invoice-core.js"
if [ -f "$target_dir/invoice-tool.js" ]; then mkdir -p "$backup_dir/$(dirname "invoice-tool.js")"; cp "$target_dir/invoice-tool.js" "$backup_dir/invoice-tool.js"; fi
mkdir -p "$target_dir/$(dirname "invoice-tool.js")"
cp "$package_dir/website-update/invoice-tool.js" "$target_dir/invoice-tool.js"
if [ -f "$target_dir/index.html" ]; then mkdir -p "$backup_dir/$(dirname "index.html")"; cp "$target_dir/index.html" "$backup_dir/index.html"; fi
mkdir -p "$target_dir/$(dirname "index.html")"
cp "$package_dir/website-update/index.html" "$target_dir/index.html"
if [ -f "$target_dir/content/site.json" ]; then mkdir -p "$backup_dir/$(dirname "content/site.json")"; cp "$target_dir/content/site.json" "$backup_dir/content/site.json"; fi
mkdir -p "$target_dir/$(dirname "content/site.json")"
cp "$package_dir/website-update/content/site.json" "$target_dir/content/site.json"
if [ -f "$target_dir/sitemap.xml" ]; then mkdir -p "$backup_dir/$(dirname "sitemap.xml")"; cp "$target_dir/sitemap.xml" "$backup_dir/sitemap.xml"; fi
mkdir -p "$target_dir/$(dirname "sitemap.xml")"
cp "$package_dir/website-update/sitemap.xml" "$target_dir/sitemap.xml"
echo "Invoice tool installed. Backup: $backup_dir"
echo "Preview the website before committing."
