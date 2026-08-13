#!/usr/bin/env python3
"""
Install official Design masters from the client export folder into docs/frontend/2d-masters.

Source of truth (exact filenames):
  foto /double swing gates/esport per ora /
  foto /DS   ← double_swing only (esport/DS/ is empty)

Product lock (2026-08-05):
  - Copy SVG bytes as-is — do NOT strip geometry.
  - Filenames with manual/manuale already bake the leaf handle.
  - Filenames without manual/automatic = one shared CAD; design has no handle
    regardless of motorised (no UI handle overlay).
  - Filenames with automatic/motorised = dedicated motorised master (no handle).
"""

from __future__ import annotations

from pathlib import Path
import base64
from io import BytesIO

from PIL import Image

ROOT = Path('.')
EXPORT = Path('foto /double swing gates/esport per ora ')
DS_FALLBACK = Path('foto /DS')  # esport/DS is empty; official DS set lives here


def clean_dir(dst: Path) -> None:
    dst.mkdir(parents=True, exist_ok=True)
    for p in dst.glob('._*'):
        p.unlink(missing_ok=True)


def write_svg(dst: Path, text: str) -> None:
    clean_dir(dst.parent)
    dst.write_text(text, encoding='utf-8')


def install_from_map(gate: str, mapping: dict[str, Path]) -> None:
    dst_dir = ROOT / f'docs/frontend/2d-masters/{gate}/silhouettes'
    clean_dir(dst_dir)
    for dest_name, src in mapping.items():
        if not src.exists():
            raise SystemExit(f'Missing source for {gate}/{dest_name}: {src}')
        text = src.read_text(encoding='utf-8')
        write_svg(dst_dir / dest_name, text)
        print(f'{gate}: {src.name} → {dest_name} (verbatim)')
    # figma-base mirrors base
    (ROOT / f'docs/frontend/2d-masters/{gate}/figma-base.svg').write_text(
        (dst_dir / 'base.svg').read_text(encoding='utf-8'),
        encoding='utf-8',
    )


def png_wrap(png: Path, out: Path, paper=(1200, 860)) -> None:
    im = Image.open(png).convert('RGBA')
    pw, ph = paper
    iw, ih = im.size
    scale = min(pw / iw, ph / ih)
    nw, nh = int(iw * scale), int(ih * scale)
    canvas = Image.new('RGBA', paper, (255, 255, 255, 255))
    resized = im.resize((nw, nh), Image.Resampling.LANCZOS)
    canvas.paste(resized, ((pw - nw) // 2, (ph - nh) // 2), resized)
    buf = BytesIO()
    canvas.save(buf, format='PNG', optimize=True)
    b64 = base64.b64encode(buf.getvalue()).decode('ascii')
    svg = (
        f'<svg width="{pw}" height="{ph}" viewBox="0 0 {pw} {ph}" fill="none" '
        f'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n'
        f'<image width="{pw}" height="{ph}" href="data:image/png;base64,{b64}" '
        f'xlink:href="data:image/png;base64,{b64}"/>\n</svg>\n'
    )
    write_svg(out, svg)


# --- double_swing from foto /DS ---
ds_map = {
    'base.svg': DS_FALLBACK / 'double_swing_base_manual.svg',
    'arched.svg': DS_FALLBACK / 'double_swing_arched_manual.svg',
    'dog_bars.svg': DS_FALLBACK / 'double_swing_dog_bars_manual.svg',
    'arched_dog_bars.svg': DS_FALLBACK / 'double_swing_arched_dog_bars_manual.svg',
    'composite.svg': DS_FALLBACK / 'double_swing_composite_manual.svg',
    'base_motorised.svg': DS_FALLBACK / 'double_swing_autoamaticbase.svg',
    'arched_motorised.svg': DS_FALLBACK / 'double_swing_autoamaticarched.svg',
    'arched_dog_bars_motorised.svg': DS_FALLBACK / 'double_swing_autoamaticarched_dog_bars.svg',
}
install_from_map('double_swing', ds_map)

dd = ROOT / 'docs/frontend/2d-masters/double_swing/silhouettes'
dog_png = DS_FALLBACK / 'double_swing_autoamaticdog_bars.png'
if dog_png.exists():
    png_wrap(dog_png, dd / 'dog_bars_motorised.svg')
    print('double_swing: dog_bars_motorised.svg ← PNG wrap (no vector in export)')
else:
    write_svg(dd / 'dog_bars_motorised.svg', (dd / 'dog_bars.svg').read_text(encoding='utf-8'))
    print('double_swing: dog_bars_motorised.svg ← copy of manual dog_bars (PNG missing)')

# No dedicated composite automatic — reuse composite CAD (no handle in design for auto).
write_svg(dd / 'composite_motorised.svg', (dd / 'composite.svg').read_text(encoding='utf-8'))
print('double_swing: composite_motorised.svg ← composite (no separate automatic file)')

# --- single_swing from esport/SS ---
ss = EXPORT / 'SS'
ss_map = {
    'base.svg': ss / 'single_swing_manual_base.svg',
    'arched.svg': ss / 'single_swing_manual_arched.svg',
    'dog_bars.svg': ss / 'single_swing_manual_dog_bars.svg',
    'arched_dog_bars.svg': ss / 'single_swing_manual_arched_dog_bars.svg',
    'composite.svg': ss / 'single_swing_manual_composite.svg',
    'base_motorised.svg': ss / 'single_swing_automaticbase.svg',
    'arched_motorised.svg': ss / 'single_swing_automaticarched.svg',
    'dog_bars_motorised.svg': ss / 'single_swing_automaticdog_bars.svg',
    'arched_dog_bars_motorised.svg': ss / 'single_swing_automaticarched_dog_bars.svg',
    'composite_motorised.svg': ss / 'single_swing_automaticcomposite.svg',
}
install_from_map('single_swing', ss_map)

# --- bifolding manual + automatic ---
bf_map = {
    'base.svg': EXPORT / 'bifloding_double_swing_manual_base 1.svg',
    'arched.svg': EXPORT / 'bifloding_double_swing_manual_arched 1.svg',
    'dog_bars.svg': EXPORT / 'bifloding_double_swing_manual_dog_bars 1.svg',
    'arched_dog_bars.svg': EXPORT / 'bifloding_double_swing_manual_arched_dog_bars 1.svg',
    'composite.svg': EXPORT / 'bifloding_double_swing_manual_composite 1.svg',
    'base_motorised.svg': EXPORT / 'bifloding_double_swing_automatic_base 1.svg',
    'arched_motorised.svg': EXPORT / 'bifloding_double_swing_automatic_arched 1.svg',
    'dog_bars_motorised.svg': EXPORT / 'bifloding_double_swing_automatic_dog_bars 1.svg',
    'arched_dog_bars_motorised.svg': EXPORT / 'bifloding_double_swing_automatic_arched_dog_bars 1.svg',
    'composite_motorised.svg': EXPORT / 'bifloding_double_swing_automatic_composite 1.svg',
}
install_from_map('bifolding_double_swing', bf_map)


# --- shared packs (one CAD; no handle overlay — design does not place a handle) ---
def shared5(gate: str, prefix: str) -> None:
    mapping = {
        'base.svg': EXPORT / f'{prefix}_base 1.svg',
        'arched.svg': EXPORT / f'{prefix}_arched 1.svg',
        'dog_bars.svg': EXPORT / f'{prefix}_dog_bars 1.svg',
        'arched_dog_bars.svg': EXPORT / f'{prefix}_arched_dog_bars 1.svg',
        'composite.svg': EXPORT / f'{prefix}_composite 1.svg',
    }
    if gate == 'radius_sliding':
        mapping.pop('composite.svg')
        install_from_map(gate, mapping)
        dst = ROOT / f'docs/frontend/2d-masters/{gate}/silhouettes'
        write_svg(dst / 'composite.svg', (dst / 'base.svg').read_text(encoding='utf-8'))
        print(f'{gate}: composite.svg ← base (missing in export)')
        return
    install_from_map(gate, mapping)


shared5('tracked_sliding', 'tracked_sliding')
shared5('cantilever_sliding', 'cantiliver_sliding')  # typo in client filenames
shared5('telescopic_sliding', 'telescopis_sliding')  # typo in client filenames
shared5('radius_sliding', 'radius_sliding')

# single_bifolding — shared CAD (no manual/automatic split in export)
sb_map = {
    'base.svg': EXPORT / 'single_bifolding_base 1.svg',
    'dog_bars.svg': EXPORT / 'single_bifolding_dog_bars 1.svg',
    'arched_dog_bars.svg': EXPORT / 'single_bifolding_arched_dog_bars 1.svg',
    'composite.svg': EXPORT / 'single_bifolding_composite 1.svg',
}
install_from_map('single_bifolding', sb_map)
arched_svg = EXPORT / 'single_bifolding_arched 1.svg'
arched_png = EXPORT / 'single_bifolding_arched 1.png'
arched_out = ROOT / 'docs/frontend/2d-masters/single_bifolding/silhouettes/arched.svg'
if arched_svg.exists() and arched_svg.stat().st_size > 5000:
    write_svg(arched_out, arched_svg.read_text(encoding='utf-8'))
    print('single_bifolding: arched.svg ← vector SVG (verbatim)')
elif arched_png.exists():
    png_wrap(arched_png, arched_out)
    print('single_bifolding: arched.svg ← PNG wrap')
else:
    raise SystemExit('single_bifolding arched asset missing')
(ROOT / 'docs/frontend/2d-masters/single_bifolding/figma-base.svg').write_text(
    (ROOT / 'docs/frontend/2d-masters/single_bifolding/silhouettes/base.svg').read_text(
        encoding='utf-8'
    ),
    encoding='utf-8',
)

print('\n=== SUMMARY ===')
for gate in [
    'double_swing',
    'single_swing',
    'tracked_sliding',
    'cantilever_sliding',
    'bifolding_double_swing',
    'single_bifolding',
    'telescopic_sliding',
    'radius_sliding',
]:
    files = sorted(
        p.name
        for p in (ROOT / f'docs/frontend/2d-masters/{gate}/silhouettes').glob('*.svg')
        if not p.name.startswith('._')
    )
    print(f'{gate}: {len(files)} → {files}')
