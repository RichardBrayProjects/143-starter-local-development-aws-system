#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"
cdk bootstrap "aws://$ACCOUNT_ID/eu-west-2"
