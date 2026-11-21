#!/bin/sh
# Usage: scripts/bump-version.sh 15.72
# Updates every version stamp in one go: app meta tag, service worker, landing page, README check.
set -e
V="$1"; [ -z "$V" ] && { echo "usage: $0 15.72"; exit 1; }
cd "$(dirname "$0")/.."
sed -i -E "s|(<meta name=\"oel-version\" content=\")v[0-9.]+|\1v$V|" app/index.html
sed -i -E "s|^const VERSION = '[0-9.]+';|const VERSION = '$V';|" app/sw.js
sed -i -E "s|(<span class=\"nav-version\">)v[0-9.]+|\1v$V|" index.html
echo "Stamps now:"
grep -o 'oel-version" content="[^"]*"' app/index.html
grep -n "^const VERSION" app/sw.js
grep -o 'nav-version">[^<]*' index.html
grep -q "| \*\*v$V\*\* |" README.md && echo "README changelog row: ok" || echo "REMINDER: add a v$V row to the README changelog"
