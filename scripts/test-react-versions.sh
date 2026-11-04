#!/usr/bin/env bash

set -Eeuo pipefail

TMP_DIR=$(mktemp -d)

cp package.json "$TMP_DIR/package.json"
cp yarn.lock "$TMP_DIR/yarn.lock"

cleanup() {
  STATUS=$?
  trap - EXIT
  cp "$TMP_DIR/package.json" package.json
  cp "$TMP_DIR/yarn.lock" yarn.lock
  if ! yarn install; then
    STATUS=1
  fi
  rm -rf "$TMP_DIR"
  exit "$STATUS"
}

trap cleanup EXIT

REACT_VERSIONS=(
  "16.8.0"
  "16.14.0"
  "17.0.2"
  "18.3.1"
  "19.1.0"
  "19.3.1"
)

for VERSION in "${REACT_VERSIONS[@]}"; do
  echo "React v$VERSION"

  node - "$VERSION" <<'NODE'
const fs = require('fs');
const version = process.argv[2];
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
for (const dependency of ['react', 'react-dom']) {
  const sections = ['devDependencies', 'dependencies', 'optionalDependencies'];
  const section = sections.find((key) => pkg[key] && pkg[key][dependency]) || 'devDependencies';
  pkg[section] = pkg[section] || {};
  pkg[section][dependency] = version;
}
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
NODE

  yarn install
  yarn test:react --runInBand
  echo "React v$VERSION: PASSED"
done

