#!/usr/bin/env bash
set -euo pipefail

if [[ -d "$HOME/.orbstack/bin" ]]; then export PATH="$HOME/.orbstack/bin:$PATH"; fi
if [[ -d "/Applications/OrbStack.app/Contents/MacOS/xbin" ]]; then export PATH="/Applications/OrbStack.app/Contents/MacOS/xbin:$PATH"; fi
if ! docker info >/dev/null 2>&1; then open -ga OrbStack; fi
until docker info >/dev/null 2>&1; do sleep 1; done

if ! docker ps -a --format '{{.Names}}' | grep -qx starter-postgres; then
  docker volume create starter-postgres-data >/dev/null
  docker run --name starter-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=starter -p 5432:5432 -v starter-postgres-data:/var/lib/postgresql/data -d postgres:17 >/dev/null
elif ! docker ps --format '{{.Names}}' | grep -qx starter-postgres; then
  docker start starter-postgres >/dev/null
fi

until docker exec starter-postgres pg_isready -U postgres -d starter >/dev/null 2>&1; do sleep 1; done
if [[ ! -d node_modules ]]; then pnpm install; fi

echo "Local database is ready."
echo "Terminal 1: pnpm run dev:server"
echo "Terminal 2: pnpm run dev:web"
echo "Open: http://localhost:5173"
