#!/usr/bin/env bash
set -euo pipefail

SITE_URL="${SITE_URL:-http://localhost:4321}"
MAX_RETRIES=3
RETRY_DELAY=10

check() {
  local path="$1"
  local description="$2"

  for attempt in $(seq 1 "$MAX_RETRIES"); do
    echo "[$attempt/$MAX_RETRIES] Testing $description ($SITE_URL$path)..."
    status=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL$path")

    if [ "$status" = "200" ]; then
      echo "  -> $description: OK (200)"
      return 0
    fi

    echo "  -> Got $status, retrying in ${RETRY_DELAY}s..."
    sleep "$RETRY_DELAY"
  done

  echo "FAIL: $description returned $status after $MAX_RETRIES attempts"
  return 1
}

echo "=== Smoke Test ==="
echo "Target: $SITE_URL"
echo ""

# Check homepage
check "/" "Homepage"

# Check health endpoint returns 200 with expected JSON
echo ""
echo "Checking /api/health JSON response..."
for attempt in $(seq 1 "$MAX_RETRIES"); do
  response=$(curl -s "$SITE_URL/api/health")
  status=$(echo "$response" | jq -r '.status // empty' 2>/dev/null || true)
  version=$(echo "$response" | jq -r '.version // empty' 2>/dev/null || true)

  if [ "$status" = "ok" ] && [ -n "$version" ]; then
    echo "  -> Health: OK (status=$status, version=$version)"
    break
  fi

  if [ "$attempt" -eq "$MAX_RETRIES" ]; then
    echo "FAIL: /api/health did not return expected JSON"
    echo "  Response: $response"
    exit 1
  fi

  echo "  -> Unexpected response, retrying in ${RETRY_DELAY}s..."
  sleep "$RETRY_DELAY"
done

echo ""
echo "=== All smoke tests passed ==="
