#!/usr/bin/env bash
# Point apex + www steelyes.co.uk at Coolify (away from expired Vercel).
# Usage:
#   export CLOUDFLARE_API_TOKEN='token-with-Zone.DNS-Edit'
#   ./scripts/cloudflare-steelyes-apex-dns.sh
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
# Origin IP is not committed: it would let traffic bypass Cloudflare.
IP="${ORIGIN_IP:?Set ORIGIN_IP to the origin server address}"

upsert_a() {
  local name="$1"
  local fqdn
  if [[ "$name" == "@" ]]; then
    fqdn="steelyes.co.uk"
  else
    fqdn="${name}.steelyes.co.uk"
  fi

  # Remove conflicting CNAME first (www often still points at Vercel)
  local cname_json rid
  cname_json="$(curl -sS "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records?type=CNAME&name=${fqdn}" \
    -H "Authorization: Bearer ${TOKEN}" -H "Content-Type: application/json")"
  while read -r rid; do
    [[ -z "$rid" ]] && continue
    curl -sS -X DELETE "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records/${rid}" \
      -H "Authorization: Bearer ${TOKEN}" -H "Content-Type: application/json" \
      | python3 -c "import json,sys; d=json.load(sys.stdin); print('DELETE CNAME', '${fqdn}', d.get('success'), d.get('errors'))"
  done < <(python3 -c "import json,sys; d=json.load(sys.stdin); print('\\n'.join(r['id'] for r in (d.get('result') or [])))" <<<"$cname_json")

  local existing body
  existing="$(curl -sS "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records?type=A&name=${fqdn}" \
    -H "Authorization: Bearer ${TOKEN}" -H "Content-Type: application/json")"
  rid="$(python3 -c "import json,sys; d=json.load(sys.stdin); r=d.get('result') or []; print(r[0]['id'] if r else '')" <<<"$existing")"
  body="$(python3 -c "import json; print(json.dumps({'type':'A','name':'''$name''','content':'''$IP''','ttl':1,'proxied':True}))")"

  if [[ -n "$rid" ]]; then
    # Keep a single A record; delete extras
    python3 -c "import json,sys; d=json.load(sys.stdin); print('\\n'.join(r['id'] for r in (d.get('result') or [])[1:]))" <<<"$existing" \
      | while read -r extra; do
          [[ -z "$extra" ]] && continue
          curl -sS -X DELETE "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records/${extra}" \
            -H "Authorization: Bearer ${TOKEN}" -H "Content-Type: application/json" >/dev/null
        done
    curl -sS -X PUT "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records/${rid}" \
      -H "Authorization: Bearer ${TOKEN}" -H "Content-Type: application/json" \
      --data "$body" | python3 -c "import json,sys; d=json.load(sys.stdin); print('UPDATE A', d.get('success'), d.get('result',{}).get('name'), d.get('result',{}).get('content'), d.get('errors'))"
  else
    curl -sS -X POST "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records" \
      -H "Authorization: Bearer ${TOKEN}" -H "Content-Type: application/json" \
      --data "$body" | python3 -c "import json,sys; d=json.load(sys.stdin); print('CREATE A', d.get('success'), d.get('result',{}).get('name'), d.get('result',{}).get('content'), d.get('errors'))"
  fi
}

upsert_a "@"
upsert_a "www"
echo "Done. Expected: A @ and www → ${IP} (proxied)."
echo "Check: dig +short steelyes.co.uk A @1.1.1.1 ; dig +short www.steelyes.co.uk A @1.1.1.1"
