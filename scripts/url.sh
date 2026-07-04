#!/usr/bin/env bash
set -euo pipefail
aws cloudformation describe-stacks --stack-name starter-system --query "Stacks[0].Outputs[?OutputKey=='Url'].OutputValue" --output text
