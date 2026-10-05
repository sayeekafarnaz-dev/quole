#!/bin/sh
# Run only in the isolated Quole project on a machine that permits Chrome/Chromium.
# This script does not deploy, contact live websites, or use LLM credentials.
set -eu
cd "$(dirname "$0")/.."
npm install
npm test
npm run test:widget
npx playwright install chromium
npm run test:browser
