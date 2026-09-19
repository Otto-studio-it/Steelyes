"""Isolate the metal railhead and paint everything else opaque white.

Client intake shots are often iPhone screenshots of dciron.co.uk: status bar,
gallery thumbs, prices, cookie policy, Safari chrome. Catalogue tiles must
show only the finial on a white field (Q5 / CA-17).
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import re

import numpy as np
from PIL import Image

SKU_RE = re.compile(r"(RH\d+[A-Z]*)", re.IGNORECASE)
SOURCE_ALIASES = {
    "RH6WB": ("RH6WB", "RH6W/B", "RH6W:B", "RH6W-B"),
    "RH15W": ("RH15W", "RH15WO", "RH15W/O", "RH15W:O"),
    "RH7NP": ("RH7NP",),
}

IMAGE_SUFFIXES = {".jpg", ".jpeg", ".png", ".webp", ".heic"}


@dataclass(frozen=True)
class CleanResult:
    image: Image.Image
    sku: str | None
    metal_pixels: int
    discarded_components: int
    source_size: tuple[int, int]


def _as_rgb_array(image: Image.Image) -> np.ndarray:
    return np.asarray(image.convert("RGB"), dtype=np.uint8)


def _saturation_luminance(rgb: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    r = rgb[:, :, 0].astype(np.float32)
    g = rgb[:, :, 1].astype(np.float32)
    b = rgb[:, :, 2].astype(np.float32)
    mx = np.maximum(np.maximum(r, g), b)
    mn = np.minimum(np.minimum(r, g), b)
    sat = np.divide(mx - mn, mx, out=np.zeros_like(mx), where=mx > 0)
    lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
    return sat, lum


def metal_mask(rgb: np.ndarray) -> np.ndarray:
    """Grey/black metal on a pale field. Drops saturated UI (red prices, stars)."""
    sat, lum = _saturation_luminance(rgb)
    mn = rgb.min(axis=2).astype(np.float32)
    near_white = (mn >= 236) | ((lum >= 240) & (sat < 0.10))
    metal = (~near_white) & (sat < 0.34) & (lum < 228)
    return metal


def binary_dilate(mask: np.ndarray, radius: int) -> np.ndarray:
    if radius <= 0:
        return mask
    from PIL import ImageFilter

    size = radius * 2 + 1
    if size % 2 == 0:
        size += 1
    im = Image.fromarray(mask.astype(np.uint8) * 255, mode="L")
    return np.asarray(im.filter(ImageFilter.MaxFilter(size))) > 127


def binary_close(mask: np.ndarray, radius: int) -> np.ndarray:
    """Close thin gaps (fleur curls, AA holes) so one railhead stays one blob."""
    if radius <= 0:
        return mask
    return ~binary_dilate(~binary_dilate(mask, radius), radius)


def _shrink_mask(mask: np.ndarray, max_side: int = 360) -> tuple[np.ndarray, float]:
    h, w = mask.shape
    longest = max(h, w)
    if longest <= max_side:
        return mask, 1.0
    scale = longest / max_side
    small = Image.fromarray(mask.astype(np.uint8) * 255, mode="L").resize(
        (max(1, int(w / scale)), max(1, int(h / scale))),
        Image.Resampling.NEAREST,
    )
    return np.asarray(small) > 127, scale


def label_components(mask: np.ndarray) -> tuple[np.ndarray, int]:
    """8-connected labels on True pixels only. 0 is background."""
    h, w = mask.shape
    ys, xs = np.where(mask)
    n = int(ys.size)
    if n == 0:
        return np.zeros((h, w), dtype=np.int32), 0

    parent = np.arange(n, dtype=np.int32)
    index_of = -np.ones((h, w), dtype=np.int32)
    index_of[ys, xs] = np.arange(n, dtype=np.int32)

    def find(i: int) -> int:
        while parent[i] != i:
            parent[i] = parent[parent[i]]
            i = parent[i]
        return i

    neighbors = ((-1, -1), (-1, 0), (-1, 1), (0, -1))
    for i in range(n):
        y, x = int(ys[i]), int(xs[i])
        for dy, dx in neighbors:
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w:
                j = int(index_of[ny, nx])
                if j >= 0:
                    ri, rj = find(i), find(j)
                    if ri != rj:
                        parent[rj] = ri

    labels_flat = np.zeros(n, dtype=np.int32)
    remap: dict[int, int] = {}
    next_id = 1
    for i in range(n):
        root = find(i)
        assigned = remap.get(root)
        if assigned is None:
            remap[root] = next_id
            assigned = next_id
            next_id += 1
        labels_flat[i] = assigned
    labels = np.zeros((h, w), dtype=np.int32)
    labels[ys, xs] = labels_flat
    return labels, next_id - 1


def _component_stats(labels: np.ndarray, component_id: int) -> dict[str, float]:
    ys, xs = np.where(labels == component_id)
    area = float(ys.size)
    return {
        "id": float(component_id),
        "area": area,
        "cy": float(ys.mean()) if area else 0.0,
        "cx": float(xs.mean()) if area else 0.0,
        "min_y": float(ys.min()) if area else 0.0,
        "max_y": float(ys.max()) if area else 0.0,
        "min_x": float(xs.min()) if area else 0.0,
        "max_x": float(xs.max()) if area else 0.0,
    }


def _text_row_ids(stats_by_id: dict[int, dict[str, float]], height: int) -> set[int]:
    """Drop a horizontal run of similar ink (title, price, cookie line)."""
    buckets: dict[int, list[int]] = {}
    for component_id, stats in stats_by_id.items():
        band = int(stats["cy"] / max(height * 0.04, 1.0))
        buckets.setdefault(band, []).append(component_id)
    drop: set[int] = set()
    for ids in buckets.values():
        if len(ids) < 4:
            continue
        areas = [stats_by_id[i]["area"] for i in ids]
        median = float(np.median(np.array(areas)))
        if median <= 0:
            continue
        similar = [i for i in ids if 0.25 * median <= stats_by_id[i]["area"] <= 4.0 * median]
        if len(similar) >= 4:
            drop.update(similar)
    return drop


def pick_primary_component(labels: np.ndarray, count: int) -> tuple[int, int]:
    """Largest metal mass in the product well; ignore price/title/thumb strip."""
    h, w = labels.shape
    best_id = 0
    best_score = -1.0
    discarded = 0
    min_area = max(40.0, h * w * 0.0004)
    stats_by_id = {i: _component_stats(labels, i) for i in range(1, count + 1)}
    text_ids = _text_row_ids(stats_by_id, h)
    for component_id in range(1, count + 1):
        stats = stats_by_id[component_id]
        if component_id in text_ids:
            discarded += 1
            continue
        if stats["area"] < min_area:
            discarded += 1
            continue
        bbox_h = max(1.0, stats["max_y"] - stats["min_y"] + 1)
        bbox_w = max(1.0, stats["max_x"] - stats["min_x"] + 1)
        cy = stats["cy"] / h
        height_frac = bbox_h / h
        width_frac = bbox_w / w
        aspect = bbox_w / bbox_h
        # Title / price lines are wide and short. Gallery thumbs sit low.
        if aspect > 2.4 and height_frac < 0.16:
            discarded += 1
            continue
        if width_frac > 0.55 and height_frac < 0.14:
            discarded += 1
            continue
        if cy > 0.70 and height_frac < 0.20:
            discarded += 1
            continue
        vertical = 1.7 if cy < 0.28 else 1.25 if cy < 0.50 else 0.85 if cy < 0.64 else 0.15
        tall = min(2.2, bbox_h / bbox_w)
        score = stats["area"] * vertical * tall
        # A sliver glued to the top edge is a cropped screenshot leftover.
        # Prefer the complete gallery thumb when that is all we have of the model.
        touches_top = stats["min_y"] <= max(2.0, 0.04 * h)
        touches_border = (
            touches_top
            or stats["max_y"] >= h - max(2.0, 0.03 * h)
            or stats["min_x"] <= max(2.0, 0.02 * w)
            or stats["max_x"] >= w - max(2.0, 0.02 * w)
        )
        if not touches_border:
            score *= 1.6
        if touches_top and height_frac < 0.32 and stats["area"] < 0.05 * h * w:
            score *= 0.05
        if score > best_score:
            best_score = score
            best_id = component_id
    if best_id == 0 and count:
        areas = [(int((labels == i).sum()), i) for i in range(1, count + 1)]
        best_id = max(areas)[1]
        discarded = max(0, count - 1)
    else:
        discarded = max(0, count - (1 if best_id else 0))
    return best_id, discarded


def keep_mask_for_rgb(rgb: np.ndarray) -> tuple[np.ndarray, int]:
    metal = metal_mask(rgb)
    # Close only 1px on the working grid so letters do not fuse into a fake "body".
    work, _scale = _shrink_mask(metal)
    work = binary_close(work, 1)
    labels_small, count = label_components(work)
    if count == 0:
        return np.zeros(rgb.shape[:2], dtype=bool), 0
    primary, discarded = pick_primary_component(labels_small, count)
    keep_small = labels_small == primary
    keep = np.asarray(
        Image.fromarray(keep_small.astype(np.uint8) * 255, mode="L").resize(
            (rgb.shape[1], rgb.shape[0]),
            Image.Resampling.NEAREST,
        )
    ) > 127
    edge_r = max(1, int(min(rgb.shape[:2]) * 0.004))
    keep = binary_dilate(keep, edge_r) & metal
    return keep, discarded


def crop_on_white(rgb: np.ndarray, keep: np.ndarray, canvas: int = 512, pad_ratio: float = 0.10) -> Image.Image:
    if not keep.any():
        blank = Image.new("RGB", (canvas, canvas), (255, 255, 255))
        return blank
    ys, xs = np.where(keep)
    y0, y1 = int(ys.min()), int(ys.max()) + 1
    x0, x1 = int(xs.min()), int(xs.max()) + 1
    bh, bw = y1 - y0, x1 - x0
    pad = max(8, int(max(bh, bw) * pad_ratio))
    y0 = max(0, y0 - pad)
    x0 = max(0, x0 - pad)
    y1 = min(rgb.shape[0], y1 + pad)
    x1 = min(rgb.shape[1], x1 + pad)

    cut = np.full((y1 - y0, x1 - x0, 3), 255, dtype=np.uint8)
    local = keep[y0:y1, x0:x1]
    cut[local] = rgb[y0:y1, x0:x1][local]
    piece = Image.fromarray(cut, mode="RGB")

    scale = min((canvas * 0.86) / piece.width, (canvas * 0.86) / piece.height)
    nw = max(1, int(piece.width * scale))
    nh = max(1, int(piece.height * scale))
    resized = piece.resize((nw, nh), Image.Resampling.LANCZOS)
    canvas_im = Image.new("RGB", (canvas, canvas), (255, 255, 255))
    # Sit slightly low so the chooser (object-bottom) does not clip the tip.
    x = (canvas - nw) // 2
    y = canvas - nh - max(8, int(canvas * 0.06))
    canvas_im.paste(resized, (x, y))
    return canvas_im


def clean_rgb(rgb: np.ndarray, canvas: int = 512) -> tuple[Image.Image, int]:
    keep, discarded = keep_mask_for_rgb(rgb)
    return crop_on_white(rgb, keep, canvas=canvas), discarded


def clean_image(image: Image.Image, canvas: int = 512, sku: str | None = None) -> CleanResult:
    rgb = _as_rgb_array(image)
    cleaned, discarded = clean_rgb(rgb, canvas=canvas)
    keep, _ = keep_mask_for_rgb(rgb)
    return CleanResult(
        image=cleaned,
        sku=sku,
        metal_pixels=int(keep.sum()),
        discarded_components=discarded,
        source_size=(rgb.shape[1], rgb.shape[0]),
    )


def normalize_sku_token(token: str) -> str:
    raw = token.upper().replace(" ", "")
    raw = raw.replace(":", "").replace("/", "").replace("-", "")
    if raw in {"RH6WB", "RH6W"}:
        return "RH6WB"
    if raw in {"RH15WO", "RH15W"}:
        return "RH15W"
    return raw


def sku_from_filename(name: str) -> str | None:
    stem = Path(name).stem.strip()
    compact = stem.upper().replace(" ", "").replace(":", "").replace("/", "")
    for sku, aliases in SOURCE_ALIASES.items():
        for alias in aliases:
            needle = alias.upper().replace(":", "").replace("/", "").replace(" ", "")
            if compact == needle or compact.replace("-", "") == needle:
                return sku
    match = SKU_RE.search(stem.replace(" ", ""))
    if not match:
        return None
    return normalize_sku_token(match.group(1))


def iter_source_images(root: Path) -> list[Path]:
    if root.is_file():
        return [root]
    files: list[Path] = []
    for path in root.rglob("*"):
        if not path.is_file() or path.name.startswith("._"):
            continue
        if path.suffix.lower() in IMAGE_SUFFIXES:
            files.append(path)
    return sorted(files)


def prefer_source(paths: list[Path]) -> Path:
    """Prefer a full screenshot over an already-cropped webp when both exist."""
    ranked = sorted(
        paths,
        key=lambda p: (
            0 if p.suffix.lower() in {".jpg", ".jpeg", ".png"} else 1,
            -p.stat().st_size,
        ),
    )
    return ranked[0]
