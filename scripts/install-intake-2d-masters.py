from pathlib import Path
import re, base64, json
from io import BytesIO
from PIL import Image

ROOT = Path('.')
EXPORT = Path('foto /double swing gates/esport per ora ')
DS_FALLBACK = Path('foto /DS')  # DS subfolder in esport is empty

HANDLE_PATS = [
    re.compile(r'<path d="M608 332H592[^"]*"[^/]*/>\s*'),
    re.compile(r'<path d="M607 372H593V428H607V372Z"[^/]*/>\s*'),
    re.compile(r'<path d="M600 382V418"[^/]*/>\s*'),
    re.compile(r'<path d="M1051 382H1037V438H1051V382Z"[^/]*/>\s*'),
    re.compile(r'<path d="M1044 392V428"[^/]*/>\s*'),
]

def strip_handles(text: str) -> tuple[str, int]:
    n = 0
    for pat in HANDLE_PATS:
        text, c = pat.subn('', text)
        n += c
    return text, n

def clean_dir(dst: Path):
    dst.mkdir(parents=True, exist_ok=True)
    for p in dst.glob('._*'):
        p.unlink(missing_ok=True)

def write_svg(dst: Path, text: str):
    clean_dir(dst.parent)
    dst.write_text(text, encoding='utf-8')

def install_from_map(gate: str, mapping: dict[str, Path], strip: bool):
    dst_dir = ROOT / f'docs/frontend/2d-masters/{gate}/silhouettes'
    clean_dir(dst_dir)
    for dest_name, src in mapping.items():
        text = src.read_text(encoding='utf-8')
        n = 0
        if strip:
            text, n = strip_handles(text)
        write_svg(dst_dir / dest_name, text)
        print(f'{gate}: {src.name} → {dest_name} (strip={n})')
    # figma-base
    (ROOT / f'docs/frontend/2d-masters/{gate}/figma-base.svg').write_text(
        (dst_dir / 'base.svg').read_text(encoding='utf-8'), encoding='utf-8'
    )

def png_wrap(png: Path, out: Path, paper=(1200, 860)):
    im = Image.open(png).convert('RGBA')
    pw, ph = paper
    iw, ih = im.size
    scale = min(pw / iw, ph / ih)
    nw, nh = int(iw * scale), int(ih * scale)
    canvas = Image.new('RGBA', paper, (255, 255, 255, 255))
    resized = im.resize((nw, nh), Image.Resampling.LANCZOS)
    canvas.paste(resized, ((pw - nw)//2, (ph - nh)//2), resized)
    buf = BytesIO(); canvas.save(buf, format='PNG', optimize=True)
    b64 = base64.b64encode(buf.getvalue()).decode('ascii')
    svg = (
        f'<svg width="{pw}" height="{ph}" viewBox="0 0 {pw} {ph}" fill="none" '
        f'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n'
        f'<image width="{pw}" height="{ph}" href="data:image/png;base64,{b64}" '
        f'xlink:href="data:image/png;base64,{b64}"/>\n</svg>\n'
    )
    write_svg(out, svg)

# --- double_swing from foto /DS (esport/DS empty) ---
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
# dog_bars motorised from png or derived
install_from_map('double_swing', ds_map, strip=True)
# dog_bars_motorised + composite_motorised derived
dd = ROOT / 'docs/frontend/2d-masters/double_swing/silhouettes'
write_svg(dd / 'dog_bars_motorised.svg', (dd / 'dog_bars.svg').read_text(encoding='utf-8'))
write_svg(dd / 'composite_motorised.svg', (dd / 'composite.svg').read_text(encoding='utf-8'))
print('double_swing: derived dog_bars_motorised + composite_motorised')

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
install_from_map('single_swing', ss_map, strip=True)

# --- bifolding manual+auto ---
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
install_from_map('bifolding_double_swing', bf_map, strip=True)

# --- shared packs (manual==auto, handle overlay only) ---
def shared5(gate: str, prefix: str, typo_prefix: str | None = None):
    p = typo_prefix or prefix
    mapping = {
        'base.svg': EXPORT / f'{p}_base 1.svg',
        'arched.svg': EXPORT / f'{p}_arched 1.svg',
        'dog_bars.svg': EXPORT / f'{p}_dog_bars 1.svg',
        'arched_dog_bars.svg': EXPORT / f'{p}_arched_dog_bars 1.svg',
        'composite.svg': EXPORT / f'{p}_composite 1.svg',
    }
    # radius has no composite
    if gate == 'radius_sliding':
        mapping.pop('composite.svg')
        install_from_map(gate, mapping, strip=True)
        dst = ROOT / f'docs/frontend/2d-masters/{gate}/silhouettes'
        write_svg(dst / 'composite.svg', (dst / 'base.svg').read_text(encoding='utf-8'))
        print(f'{gate}: composite.svg ← base (missing in export)')
        return
    install_from_map(gate, mapping, strip=True)

shared5('tracked_sliding', 'tracked_sliding')
shared5('cantilever_sliding', 'cantiliver_sliding')  # typo in filenames
shared5('telescopic_sliding', 'telescopis_sliding')  # typo in filenames
shared5('radius_sliding', 'radius_sliding')

# single_bifolding — mostly svg, arched is png
sb_map = {
    'base.svg': EXPORT / 'single_bifolding_base 1.svg',
    'dog_bars.svg': EXPORT / 'single_bifolding_dog_bars 1.svg',
    'arched_dog_bars.svg': EXPORT / 'single_bifolding_arched_dog_bars 1.svg',
    'composite.svg': EXPORT / 'single_bifolding_composite 1.svg',
}
install_from_map('single_bifolding', sb_map, strip=True)
arched_svg = EXPORT / 'single_bifolding_arched 1.svg'
arched_png = EXPORT / 'single_bifolding_arched 1.png'
arched_out = ROOT / 'docs/frontend/2d-masters/single_bifolding/silhouettes/arched.svg'
if arched_svg.exists() and arched_svg.stat().st_size > 5000:
    text, n = strip_handles(arched_svg.read_text(encoding='utf-8'))
    write_svg(arched_out, text)
    print(f'single_bifolding: arched.svg ← vector SVG (strip={n})')
elif arched_png.exists():
    png_wrap(arched_png, arched_out)
    print('single_bifolding: arched.svg ← PNG wrap (vector missing)')
else:
    raise SystemExit('single_bifolding arched asset missing')
(ROOT / 'docs/frontend/2d-masters/single_bifolding/figma-base.svg').write_text(
    (ROOT / 'docs/frontend/2d-masters/single_bifolding/silhouettes/base.svg').read_text(encoding='utf-8'),
    encoding='utf-8',
)

print('\n=== SUMMARY ===')
for gate in ['double_swing','single_swing','tracked_sliding','cantilever_sliding','bifolding_double_swing','single_bifolding','telescopic_sliding','radius_sliding']:
    files = sorted(p.name for p in (ROOT/f'docs/frontend/2d-masters/{gate}/silhouettes').glob('*.svg') if not p.name.startswith('._'))
    print(f'{gate}: {len(files)} → {files}')