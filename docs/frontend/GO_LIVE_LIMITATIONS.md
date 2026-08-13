---
title: Go-live limitations (client handoff)
description: Honest scope for public launch — what works, what is indicative, what is schematic
owner: Ruben
status: ACTIVE
last_updated: 2026-08-11
---

# Steelyes — Go-live limitations

Share this sheet with Marius at launch. Everything below is intentional, not a bug.

## Contact & legal

- Public inbox: **info@steelyes.co.uk** (site enquiries, quote notifications, invoices to this mailbox).
- Company no. **13415956** · VAT **392 1130 22** · workshop address and phone as shown in the footer.
- Cookie consent: **Cookiebot** (Usercentrics) when `NEXT_PUBLIC_COOKIEBOT_ID` is set. No PostHog / GA.
- Legal pages (privacy, cookies, terms) are live without draft banners; lawyer review remains recommended.

## Pricing

- All configurator and gates prices are **indicative, subject to site survey**.
- Colour / finish uplift (£55/m² class) is **not** a hard line total until the finish rate base is confirmed.
- Railhead unit prices may appear as provisional; **count rules are not client-signed** — do not treat railhead totals as workshop law.
- Aluminium panel / bar upgrades: rates known, **counts not confirmed** — quoted after survey.
- Motorised vs manual: where auto base price is missing, UI must not invent a figure.

## Configurator 2D

- **Design** tab shows CAD masters (photo-locked silhouettes) with live mm strip under the drawing.
- Finish colour is selected in **Installation**; masters stay line-art with a finish swatch cue.
- Handle is **baked into** official `manual`/`manuale` masters when present; otherwise omitted by design — no UI handle overlay.
- Railheads: count rule locked **CA-14** (one per picket bay, auto). Design tab shows **model picker only** (**CA-17**) — finials are not drawn on 2D masters. Engine/UI may still show legacy qty until the polish batch ships.
- Dimension meaning (clear opening vs overall) is still partially open with the client — cantilever is treated as **clear opening** with site-space note.

## Mesh / AR (“View in your space”)

- Available on phone via Apple Quick Look (USDZ) or Google Scene Viewer (GLB).
- Scale is **locked** in native viewers (`allowsContentScaling=0` / `resizable=false`) so tape checks match typed mm.
- Desktop: **copy link** for phone (no QR). Links expire ~**60 minutes**; expired links return 410.
- Localhost / private origins warn that phone links will not reach the device — use public HTTPS or file download.
- Scale is real millimetres → metres from the same `GateConfig` envelope (clear opening × ground-to-top-rail).
- Mesh fidelity: all eight gate types build **workshop** Victorian meshes when style is traditional Victorian (tube pickets; arched / dog bars / composite boards when selected). Bifold = 50/50 fold stile; telescopic = overlapping leaves; radius = articulated train on a curved footprint.
- Top / dog-bar **railheads** appear as decorative finials above the top rail (excluded from typed height).
- Manual configs show a latch-side handle in 3D/AR; motorised omits handle and motor kit (same CA-01 rule as Design).
- AR model store is **memory + disk** on the Coolify host (survives process restart within TTL). Not a permanent download library / multi-node S3 yet.

## Marketing honesty

- Social: Instagram, Facebook, TikTok in header/footer/contact.
- Gallery: workshop / consented imagery only.
- Case study remains hidden or incomplete until client content lands.
- Logo may still be wordmark text until SVG brand asset is supplied.

## Ops notes

- Production app: Coolify → `steelyes.co.uk` (+ www), behind Cloudflare.
- Staging: `staging.steelyes.co.uk`.
- Email: Resend domain verified; `RESEND_FROM` / `WORKSHOP_EMAIL` → info@steelyes.co.uk.
- Inbox: direct emails to info@ now get an auto-reply ("received, team reviewing") + a triage label (Preventivo/Reclamo/Fattura/Garanzia/Generico), via `scripts/gmail-inbox-autoack.gs` on a 10-min Gmail trigger. One-time setup (Marius, ~5 min): `docs/frontend/GMAIL_AUTOACK_SETUP.md`.

## Open Marius questions (do not invent answers)

- Final base prices + size uplift formula
- Finish uplift base / measured area
- ~~Railhead + dog-bar layout count rules~~ → closed **CA-14 / CA-15** (auto per bay). Still open: full railhead SKU £ sign-off, dog-bar **money** worked example, circles **unit price**
- Circles option confirmed **CA-16** (on/off bands) — implement under maintenance polish
- Aluminium panel/bar counts on a worked example
- Exact width/height datum worked example
- Facebook vanity URL (share link is temporary)
- Cookiebot Domain Group ID for production domain (ops)

## Demo script (2 minutes)

1. Open `/configurator` on phone → pick double swing Victorian → change finish.
2. Confirm indicative price + disclaimer.
3. Save / share → open `/quote/[token]` → request quote → check `info@` inbox.
4. **View in your space** → place on floor → rough tape check on width.
5. Show Design master vs Installation colour tab.
