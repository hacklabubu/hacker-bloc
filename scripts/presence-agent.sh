#!/usr/bin/env bash
# Reports who is on the house Wi-Fi to the site. Run it on any always-on
# machine on the LAN (a Pi, the NAS, the Mac mini), every 5 minutes:
#
#   */5 * * * * PRESENCE_TOKEN=... /path/to/presence-agent.sh
#
# What it does: sweeps the local /24 so the ARP table is warm, counts the
# hosts that answered, and posts the number. If known-devices.txt exists next
# to this script, lines of "aa:bb:cc:dd:ee:ff github-username" map devices to
# members, and the recognised usernames are posted too.
#
# Needs: bash, curl, and either `nmap` (best) or `ping` + `arp`.
set -euo pipefail

SITE="${PRESENCE_SITE:-https://www.hackerbloc.com}"
TOKEN="${PRESENCE_TOKEN:?set PRESENCE_TOKEN (same value as on Vercel)}"
DIR="$(cd "$(dirname "$0")" && pwd)"
KNOWN="${PRESENCE_KNOWN:-$DIR/known-devices.txt}"

# The LAN, e.g. 192.168.1.0/24, from the default route.
if command -v ip >/dev/null 2>&1; then
  SUBNET="$(ip -4 route show default | awk '{print $3}' | head -1 | sed 's/\.[0-9]*$/.0\/24/')"
else
  SUBNET="$(route -n get default 2>/dev/null | awk '/gateway/ {print $2}' | sed 's/\.[0-9]*$/.0\/24/')"
fi

# Wake the ARP table, then read it.
if command -v nmap >/dev/null 2>&1; then
  nmap -sn -n "$SUBNET" >/dev/null 2>&1 || true
else
  BASE="${SUBNET%.0/24}"
  for i in $(seq 1 254); do ping -c1 -W1 "$BASE.$i" >/dev/null 2>&1 & done; wait
fi
MACS="$(arp -an 2>/dev/null | grep -oiE '([0-9a-f]{1,2}:){5}[0-9a-f]{1,2}' | tr 'A-F' 'a-f' | sort -u)"
DEVICES="$(printf '%s\n' "$MACS" | grep -c . || true)"

# Known devices -> people.
PEOPLE_JSON="null"; GITHUB_JSON="[]"
if [ -f "$KNOWN" ]; then
  NAMES="$(grep -vE '^\s*(#|$)' "$KNOWN" | while read -r mac user; do
    mac="$(printf '%s' "$mac" | tr 'A-F' 'a-f')"
    printf '%s\n' "$MACS" | grep -qx "$mac" && printf '%s\n' "$user"
  done | sort -u)"
  COUNT="$(printf '%s\n' "$NAMES" | grep -c . || true)"
  PEOPLE_JSON="$COUNT"
  GITHUB_JSON="$(printf '%s\n' "$NAMES" | grep . | sed 's/.*/"&"/' | paste -sd, - | sed 's/^/[/; s/$/]/')"
fi

curl -fsS -X POST "$SITE/api/presence" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"devices\": $DEVICES, \"people\": $PEOPLE_JSON, \"github\": $GITHUB_JSON}" \
  && echo " reported $DEVICES devices, $PEOPLE_JSON people"
