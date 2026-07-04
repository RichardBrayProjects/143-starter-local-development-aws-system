#!/usr/bin/env bash
set -euo pipefail
if [[ -d "$HOME/.orbstack/bin" ]]; then export PATH="$HOME/.orbstack/bin:$PATH"; fi
if [[ -d "/Applications/OrbStack.app/Contents/MacOS/xbin" ]]; then export PATH="/Applications/OrbStack.app/Contents/MacOS/xbin:$PATH"; fi
if docker ps --format '{{.Names}}' | grep -qx starter-postgres; then docker stop starter-postgres >/dev/null; fi
echo "Local database is stopped."
echo "Stop server/frontend terminals with Ctrl-C."
