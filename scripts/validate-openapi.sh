#!/usr/bin/env bash
set -euo pipefail
if [ ! -f openapi/envoyou-api.yaml ]; then
  echo "Spec not found: openapi/envoyou-api.yaml" >&2
  exit 1
fi
npx swagger-cli validate openapi/envoyou-api.yaml
echo "OpenAPI spec valid ✅"
