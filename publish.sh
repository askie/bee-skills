#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

echo "==> Running prepublish checks..."
node scripts/prepare.js

echo ""
echo "==> Publishing @dhfpub/bee-skills to npm..."
npm publish --access public

echo ""
echo "==> Done!"
