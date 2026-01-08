#!/usr/bin/env bash
set -euo pipefail
echo "Repo root build wrapper: invoking user/build-render.sh"
cd "$(dirname "$0")"
if [ -x ./user/build-render.sh ]; then
  echo "Found executable user/build-render.sh — running it"
  ./user/build-render.sh
else
  echo "Calling user/build-render.sh via bash"
  bash ./user/build-render.sh
fi
