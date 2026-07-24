#!/usr/bin/env bash
# Creates Cloudflare A records for Coolify + Listmonk.
# Usage:
#   export CLOUDFLARE_API_TOKEN='token-with-Zone-DNS-Edit'
#   ./scripts/cloudflare-steelyes-dns.sh
set -euo pipefail

TOKEN="${CLOUDFLARE_API_TOKEN:-${CF_API_TOKEN:-}}"
if [[ -z "$TOKEN" && -f /tmp/cf_dns_token_steelyes ]]; then
  TOKEN="$(tr -d ' \n\r\t' </tmp/cf_dns_token_steelyes)"
fi
if [[ -z "$TOKEN" ]]; then
  echo "Missing CLOUDFLARE_API_TOKEN (Zone.DNS Edit on steelyes.co.uk)"
  echo "Create at: https://dash.cloudflare.com/profile/api-tokens"
  echo "Template: Edit zone DNS → steelyes.co.uk"
  exit 1
fi

ZONE_ID="d7ad2184b6477b6b93e77df160d310d0"
IP="165.232.110.218"

upsert() {
  local name="$1"
  local fqdn="${name}.steelyes.co.uk"
  local existing
  existing="$(curl -sS "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records?type=A&name=${fqdn}" \
    -H "Authorization: Bearer ${TOKEN}" -H "Content-Type: application/json")"
  local rid
  rid="$(python3 -c "import json,sys; d=json.load(sys.stdin); r=d.get('result') or []; print(r[0]['id'] if r else '')" <<<"$existing")"
  local body
  body="$(python3 -c "import json; print(json.dumps({'type':'A','name':'''$name''','content':'''$IP''','ttl':1,'proxied':True}))")"
  if [[ -n "$rid" ]]; then
    curl -sS -X PUT "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records/${rid}" \
      -H "Authorization: Bearer ${TOKEN}" -H "Content-Type: application/json" \
      --data "$body" | python3 -c "import json,sys; d=json.load(sys.stdin); print('UPDATE', d.get('success'), d.get('result',{}).get('name'), d.get('errors'))"
  else
    curl -sS -X POST "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records" \
      -H "Authorization: Bearer ${TOKEN}" -H "Content-Type: application/json" \
      --data "$body" | python3 -c "import json,sys; d=json.load(sys.stdin); print('CREATE', d.get('success'), d.get('result',{}).get('name'), d.get('errors'))"
  fi
}

upsert coolify
upsert listmonk
echo "Done. dig +short coolify.steelyes.co.uk ; dig +short listmonk.steelyes.co.uk"
