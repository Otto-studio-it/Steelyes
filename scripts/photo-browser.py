#!/usr/bin/env python3
"""Build a browsable photo catalog from a source image folder.

The tool is intentionally simple:
- scans a folder of source photos
- extracts dimensions and file size
- generates thumbnails
- writes an HTML browser + JSON manifest + contact sheet

It is designed for reviewing a client photo dump and deciding which images
should be used for home, gallery, services, or fabrication-focused sections.
"""

from __future__ import annotations

import argparse
import csv
import json
import math
import os
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Iterable

from PIL import Image, ImageDraw, ImageFont, ImageOps


IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".heic", ".avif"}
EXCLUDE_PREFIX = "._"


@dataclass
class Asset:
    source_path: str
    rel_path: str
    size_bytes: int
    width: int
    height: int
    orientation: str
    aspect_ratio: float
    aspect_bucket: str
    recommended_use: str
    notes: str
    thumb_path: str


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Build a browsable photo catalog.")
    parser.add_argument("--source", required=True, help="Source image folder to scan")
    parser.add_argument(
        "--output",
        default="docs/frontend/photo-browser",
        help="Output folder for the generated browser assets",
    )
    parser.add_argument(
        "--title",
        default="Steelyes Photo Browser",
        help="Title used in the generated HTML",
    )
    return parser.parse_args()


def iter_image_files(root: Path) -> Iterable[Path]:
    for path in sorted(root.rglob("*")):
        if not path.is_file():
            continue
        if path.name.startswith(EXCLUDE_PREFIX):
            continue
        if path.suffix.lower() in IMAGE_EXTS:
            yield path


def safe_open_image(path: Path) -> Image.Image | None:
    try:
        img = Image.open(path)
        return ImageOps.exif_transpose(img)
    except Exception:
        return None


def classify_asset(width: int, height: int, rel_path: str) -> tuple[str, str]:
    aspect = width / height if height else 1.0
    lower = rel_path.lower()

    if "welding" in lower or "workshop" in lower:
        return "fabrication / workshop", "home, about, gallery fabrication"
    if "steelwork" in lower or "finial" in lower or "detail" in lower:
        return "detail / finish proof", "home, gallery fabrication, detail strip"
    if "balcony" in lower or "structure" in lower:
        return "structural steel / balcony", "services/structures, services/balconies, gallery"
    if "rail" in lower:
        return "railings / balustrades", "services/railings, gallery"
    if "gate" in lower:
        return "gate hero / gate card", "home, gates, gallery"

    if aspect >= 1.35:
        return "hero / wide feature", "home hero, service hero, gallery wide"
    if aspect <= 0.85:
        return "portrait / detail", "gallery, detail stack, service detail"
    return "gallery / versatile", "gallery, service card, case study"


def aspect_bucket(width: int, height: int) -> str:
    if not width or not height:
        return "unknown"
    ratio = width / height
    if ratio >= 1.5:
        return "wide"
    if ratio <= 0.85:
        return "portrait"
    return "square-ish"


def human_size(size: int) -> str:
    if size < 1024:
        return f"{size} B"
    kb = size / 1024
    if kb < 1024:
        return f"{kb:.1f} KB"
    return f"{kb / 1024:.2f} MB"


def make_thumbnail(src: Path, dst: Path, size: int = 640) -> tuple[int, int] | None:
    try:
        with Image.open(src) as img:
            img = ImageOps.exif_transpose(img)
            img.thumbnail((size, size), Image.Resampling.LANCZOS)
            dst.parent.mkdir(parents=True, exist_ok=True)
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            img.save(dst, quality=85, optimize=True)
            return img.size
    except Exception:
        return None


def build_contact_sheet(assets: list[Asset], out_path: Path, cols: int = 4) -> None:
    if not assets:
        return

    thumb_w = 340
    thumb_h = 320
    label_h = 72
    gap = 20
    header_h = 120

    rows = math.ceil(len(assets) / cols)
    width = cols * thumb_w + (cols + 1) * gap
    height = header_h + rows * (thumb_h + label_h) + (rows + 1) * gap

    canvas = Image.new("RGB", (width, height), (245, 243, 240))
    draw = ImageDraw.Draw(canvas)
    font = ImageFont.load_default()
    title_font = ImageFont.load_default()

    draw.text((gap, 24), "Steelyes photo contact sheet", fill=(27, 28, 26), font=title_font)
    draw.text((gap, 46), f"{len(assets)} images reviewed from the source folder", fill=(92, 64, 61), font=font)
    draw.text((gap, 66), "Use this sheet to spot the strongest fabrication, railings, balconies and gate visuals.", fill=(92, 64, 61), font=font)

    for index, asset in enumerate(assets):
        row = index // cols
        col = index % cols
        x = gap + col * (thumb_w + gap)
        y = header_h + gap + row * (thumb_h + label_h + gap)
        thumb = Image.open(out_path.parent / asset.thumb_path).convert("RGB")

        frame = Image.new("RGB", (thumb_w, thumb_h), (255, 255, 255))
        thumb_box = ImageOps.contain(thumb, (thumb_w - 24, thumb_h - 24), Image.Resampling.LANCZOS)
        tx = (thumb_w - thumb_box.width) // 2
        ty = (thumb_h - thumb_box.height) // 2
        frame.paste(thumb_box, (tx, ty))
        canvas.paste(frame, (x, y))
        draw.rectangle([x, y, x + thumb_w, y + thumb_h], outline=(200, 194, 188), width=1)

        text_y = y + thumb_h + 8
        draw.text((x, text_y), asset.rel_path, fill=(27, 28, 26), font=font)
        draw.text(
            (x, text_y + 16),
            f"{asset.width}x{asset.height} · {asset.aspect_bucket} · {human_size(asset.size_bytes)}",
            fill=(92, 64, 61),
            font=font,
        )
        draw.text(
            (x, text_y + 32),
            f"{asset.recommended_use}",
            fill=(158, 0, 12),
            font=font,
        )

    out_path.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(out_path, quality=92)


def build_html(title: str, assets: list[Asset], out_dir: Path, sheet_rel: str) -> None:
    rows = []
    for asset in assets:
        rows.append(
            f"""
            <article class="card" data-use="{asset.recommended_use}" data-bucket="{asset.aspect_bucket}">
              <img src="{asset.thumb_path}" alt="{asset.rel_path}">
              <div class="meta">
                <div class="top">
                  <h2>{asset.rel_path}</h2>
                  <span>{asset.size_bytes:,} bytes</span>
                </div>
                <p><strong>Size:</strong> {asset.width}x{asset.height} | <strong>Aspect:</strong> {asset.aspect_bucket} | <strong>Use:</strong> {asset.recommended_use}</p>
                <p><strong>Pages:</strong> {asset.notes}</p>
              </div>
            </article>
            """
        )

    html = f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title}</title>
  <style>
    :root {{
      --bg: #fbf9f6;
      --panel: #ffffff;
      --ink: #1b1c1a;
      --muted: #5c403d;
      --accent: #9e000c;
      --border: #d7d1cb;
    }}
    body {{
      margin: 0;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      background: linear-gradient(180deg, #fff 0%, var(--bg) 100%);
      color: var(--ink);
    }}
    header {{
      position: sticky;
      top: 0;
      background: rgba(251,249,246,.92);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
      padding: 20px 24px;
      z-index: 10;
    }}
    h1 {{ margin: 0 0 8px; font-size: 28px; text-transform: uppercase; letter-spacing: .04em; }}
    .summary {{ display: flex; gap: 16px; flex-wrap: wrap; color: var(--muted); font-size: 14px; }}
    .bar {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 10px;
      padding: 14px 24px 0;
    }}
    .pill {{
      background: var(--panel);
      border: 1px solid var(--border);
      padding: 10px 12px;
      border-radius: 999px;
      font-size: 13px;
    }}
    .sheet {{
      margin: 24px auto 0;
      max-width: 1500px;
      padding: 0 24px 24px;
    }}
    .sheet img {{ width: 100%; border: 1px solid var(--border); display: block; }}
    .grid {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
      gap: 16px;
      padding: 24px;
    }}
    .card {{
      background: var(--panel);
      border: 1px solid var(--border);
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,.04);
    }}
    .card img {{ width: 100%; display: block; background: #efeeeb; }}
    .meta {{ padding: 14px; }}
    .top {{ display: flex; justify-content: space-between; gap: 12px; align-items: start; }}
    .top h2 {{ margin: 0; font-size: 14px; line-height: 1.3; word-break: break-word; }}
    .top span {{ font-size: 12px; color: var(--muted); white-space: nowrap; }}
    .meta p {{ margin: 10px 0 0; font-size: 13px; color: var(--muted); line-height: 1.5; }}
    .controls {{
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      padding: 16px 24px 0;
    }}
    button {{
      border: 1px solid var(--border);
      background: white;
      color: var(--ink);
      padding: 10px 14px;
      border-radius: 999px;
      cursor: pointer;
      font: inherit;
    }}
    button.active {{
      background: var(--ink);
      color: white;
      border-color: var(--ink);
    }}
  </style>
</head>
<body>
  <header>
    <h1>{title}</h1>
    <div class="summary">
      <span>{len(assets)} images scanned</span>
      <span>{sheet_rel}</span>
    </div>
  </header>
  <div class="controls" id="controls">
    <button class="active" data-filter="all">All</button>
    <button data-filter="fabrication / workshop">Fabrication</button>
    <button data-filter="gate hero / gate card">Gates</button>
    <button data-filter="railings / balustrades">Railings</button>
    <button data-filter="balconies / terraces">Balconies</button>
    <button data-filter="detail / finish proof">Detail</button>
    <button data-filter="hero / wide feature">Wide</button>
    <button data-filter="portrait / detail">Portrait</button>
  </div>
  <section class="sheet">
    <img src="{sheet_rel}" alt="Contact sheet">
  </section>
  <section class="grid" id="grid">
    {''.join(rows)}
  </section>
  <script>
    const buttons = [...document.querySelectorAll('#controls button')];
    const cards = [...document.querySelectorAll('.card')];
    buttons.forEach(btn => btn.addEventListener('click', () => {{
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      cards.forEach(card => {{
        const ok = filter === 'all' || card.dataset.use === filter || card.dataset.bucket === filter;
        card.style.display = ok ? '' : 'none';
      }});
    }}));
  </script>
</body>
</html>
"""
    (out_dir / "index.html").write_text(html, encoding="utf8")


def main() -> int:
    args = parse_args()
    source = Path(args.source).expanduser().resolve()
    output = Path(args.output).expanduser().resolve()
    thumbs_dir = output / "thumbs"
    output.mkdir(parents=True, exist_ok=True)
    thumbs_dir.mkdir(parents=True, exist_ok=True)

    image_files = list(iter_image_files(source))
    assets: list[Asset] = []

    for src in image_files:
      rel = src.relative_to(source).as_posix()
      with src.open("rb") as handle:
          size_bytes = len(handle.read())

      opened = safe_open_image(src)
      if opened is None:
          continue

      width, height = opened.size
      thumb_name = rel.replace("/", "__")
      thumb_path = thumbs_dir / f"{thumb_name}.jpg"
      make_thumbnail(src, thumb_path)

      role, notes = classify_asset(width, height, rel)
      assets.append(
          Asset(
              source_path=str(src),
              rel_path=rel,
              size_bytes=size_bytes,
              width=width,
              height=height,
              orientation="landscape" if width >= height else "portrait",
              aspect_ratio=round(width / height, 4) if height else 0.0,
              aspect_bucket=aspect_bucket(width, height),
              recommended_use=role,
              notes=notes,
              thumb_path=thumb_path.relative_to(output).as_posix(),
          )
      )

    assets.sort(key=lambda a: (a.recommended_use, a.rel_path))

    manifest = {
        "source": str(source),
        "generated": os.environ.get("SOURCE_DATE_EPOCH") or "",
        "count": len(assets),
        "assets": [asdict(asset) for asset in assets],
    }
    (output / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf8")

    with (output / "manifest.csv").open("w", newline="", encoding="utf8") as handle:
        writer = csv.writer(handle)
        writer.writerow(
            [
                "rel_path",
                "size_bytes",
                "width",
                "height",
                "orientation",
                "aspect_ratio",
                "aspect_bucket",
                "recommended_use",
                "notes",
            ]
        )
        for asset in assets:
            writer.writerow(
                [
                    asset.rel_path,
                    asset.size_bytes,
                    asset.width,
                    asset.height,
                    asset.orientation,
                    asset.aspect_ratio,
                    asset.aspect_bucket,
                    asset.recommended_use,
                    asset.notes,
                ]
            )

    contact_sheet = output / "contact-sheet.jpg"
    build_contact_sheet(assets, contact_sheet)
    build_html(args.title, assets, output, "contact-sheet.jpg")

    print(f"Wrote {output / 'index.html'}")
    print(f"Wrote {output / 'manifest.json'}")
    print(f"Wrote {output / 'manifest.csv'}")
    print(f"Wrote {contact_sheet}")
    print(f"Scanned {len(assets)} images from {source}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
