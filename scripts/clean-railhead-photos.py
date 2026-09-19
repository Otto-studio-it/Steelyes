#!/usr/bin/env python3
"""Clean railhead catalogue photos: metal only, opaque white everywhere else.

Takes phone-shop screenshots (or already-cropped tiles) from the railhead
intake folder, drops prices / thumbs / Safari chrome, and writes 512² WebP
tiles for the Refine chooser.

Examples:
  python3 scripts/clean-railhead-photos.py
  python3 scripts/clean-railhead-photos.py --source "foto /railhead"
  python3 scripts/clean-railhead-photos.py --dry-run
"""

from __future__ import annotations

import argparse
import json
import sys
from collections import defaultdict
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from lib.railhead_photo_clean import (  # noqa: E402
    clean_image,
    iter_source_images,
    prefer_source,
    sku_from_filename,
)
from PIL import Image  # noqa: E402

DEFAULT_SOURCES = [
    ROOT / "foto /railhead",
    Path("/Volumes/SSDRubb/Steelyes/foto /railhead"),
    ROOT / "docs/frontend/2d-masters/railheads/references",
    ROOT / "apps/web/public/2d-masters/railheads/photos",
]
PUBLIC_OUT = ROOT / "apps/web/public/2d-masters/railheads/photos"
DOCS_OUT = ROOT / "docs/frontend/2d-masters/railheads/photos"
PHOTO_MANIFEST = PUBLIC_OUT / "manifest.json"
DOCS_PHOTO_MANIFEST = DOCS_OUT / "manifest.json"


def collect_by_sku(source_roots: list[Path]) -> dict[str, list[Path]]:
    grouped: dict[str, list[Path]] = defaultdict(list)
    seen: set[Path] = set()
    for root in source_roots:
        if not root.exists():
            continue
        for path in iter_source_images(root):
            resolved = path.resolve()
            if resolved in seen:
                continue
            sku = sku_from_filename(path.name)
            if not sku:
                continue
            seen.add(resolved)
            grouped[sku].append(path)
    return dict(grouped)


def write_webp(image: Image.Image, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    image.save(dest, format="WEBP", quality=88, method=6)


def extra_aliases(sku: str) -> list[str]:
    if sku == "RH15W":
        return ["RH15WO"]
    return []


def update_manifest(path: Path) -> None:
    if not path.exists():
        return
    data = json.loads(path.read_text(encoding="utf-8"))
    data["updated"] = date.today().isoformat()
    policy = data.get("policy", "")
    note = "cleaned by scripts/clean-railhead-photos.py (metal only, white cover)"
    if "cleaned by scripts/clean-railhead-photos.py" not in policy:
        data["policy"] = f"{policy.rstrip('.')} · {note}."
    path.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--source",
        action="append",
        type=Path,
        help="Folder of JPG/PNG/WebP railhead shots (repeatable). Defaults probe intake + references + public tiles.",
    )
    parser.add_argument("--out", type=Path, default=PUBLIC_OUT)
    parser.add_argument("--also-out", type=Path, action="append", default=[DOCS_OUT])
    parser.add_argument("--canvas", type=int, default=512)
    parser.add_argument("--only", action="append", help="Limit to these SKUs (e.g. RH32)")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    sources = args.source if args.source else DEFAULT_SOURCES
    grouped = collect_by_sku(sources)
    if args.only:
        wanted = {sku.upper() for sku in args.only}
        grouped = {sku: paths for sku, paths in grouped.items() if sku in wanted}

    if not grouped:
        print("No railhead photos found. Pass --source pointing at foto /railhead or the public tiles.", file=sys.stderr)
        return 1

    print(f"Found {len(grouped)} SKUs")
    written = 0
    for sku in sorted(grouped, key=lambda s: (len(s), s)):
        src = prefer_source(grouped[sku])
        image = Image.open(src)
        result = clean_image(image, canvas=args.canvas, sku=sku)
        names = [sku, *extra_aliases(sku)]
        note = ""
        if result.metal_pixels < 900 and max(result.source_size) <= 640:
            note = " (small source — likely a gallery thumb; rerun with foto /railhead JPG)"
        print(
            f"  {sku}: {src.name} {result.source_size[0]}×{result.source_size[1]} "
            f"→ metal={result.metal_pixels} discarded={result.discarded_components}{note}"
        )
        if args.dry_run:
            continue
        for dest_root in [args.out, *args.also_out]:
            for name in names:
                write_webp(result.image, dest_root / f"{name}.webp")
        written += 1

    if not args.dry_run:
        update_manifest(PHOTO_MANIFEST)
        for extra in args.also_out:
            update_manifest(extra / "manifest.json")
        print(f"Wrote {written} cleaned tiles to {args.out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
