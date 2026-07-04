#!/usr/bin/env bash
set -euo pipefail
cdk destroy starter-system --force --app "node infra.js"
