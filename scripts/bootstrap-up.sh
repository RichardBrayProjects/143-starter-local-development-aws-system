#!/usr/bin/env bash
set -euo pipefail
ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"
cdk bootstrap "aws://$ACCOUNT_ID/eu-west-2"
