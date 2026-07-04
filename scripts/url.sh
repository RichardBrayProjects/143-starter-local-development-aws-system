#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

aws cloudformation describe-stacks --stack-name starter-system --query "Stacks[0].Outputs[?OutputKey=='Url'].OutputValue" --output text
