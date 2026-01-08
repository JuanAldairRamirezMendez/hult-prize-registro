#!/usr/bin/env bash
set -euo pipefail
# Build wrapper for Render: sets OpenSSL legacy provider and runs CI + production build
cd "$(dirname "$0")"
echo "Working dir: $(pwd)"
export NODE_OPTIONS=--openssl-legacy-provider
echo "Using NODE_OPTIONS=$NODE_OPTIONS"
echo "Running npm ci..."
npm ci
echo "Running production build..."
npm run build -- --configuration production
echo "Build finished. Output at: $(pwd)/dist/angular-landing-page"
