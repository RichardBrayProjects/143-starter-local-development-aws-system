#!/usr/bin/env bash
set -euo pipefail
pnpm run build
cdk deploy starter-system --require-approval never --app "node infra.js"
