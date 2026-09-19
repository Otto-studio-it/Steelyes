"""Synthetic coverage for railhead photo cleanup (no client binaries required)."""

from __future__ import annotations

import sys
import unittest
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

from lib.railhead_photo_clean import (  # noqa: E402
    clean_image,
    metal_mask,
    sku_from_filename,
)


def _spear(draw: ImageDraw.ImageDraw, cx: int, top: int, color: tuple[int, int, int]) -> None:
    draw.polygon([(cx, top), (cx + 28, top + 90), (cx + 8, top + 90), (cx + 8, top + 150), (cx - 8, top + 150), (cx - 8, top + 90), (cx - 28, top + 90)], fill=color)


class SkuMappingTests(unittest.TestCase):
    def test_manifest_style_names(self) -> None:
        self.assertEqual(sku_from_filename("Rh1.JPG"), "RH1")
        self.assertEqual(sku_from_filename(" RH7NP.JPG"), "RH7NP")
        self.assertEqual(sku_from_filename(" Rh6W:B.JPG"), "RH6WB")
        self.assertEqual(sku_from_filename("RH15W.JPG"), "RH15W")
        self.assertEqual(sku_from_filename("RH15WO.webp"), "RH15W")
        self.assertIsNone(sku_from_filename("Screenshot 2026-07-30.png"))


class IsolationTests(unittest.TestCase):
    def test_covers_price_thumbs_and_keeps_metal(self) -> None:
        im = Image.new("RGB", (400, 800), (255, 255, 255))
        draw = ImageDraw.Draw(im)
        metal = (90, 90, 95)
        _spear(draw, 200, 40, metal)
        # Gallery thumbs + red price + grey cookie line (phone product page).
        draw.rectangle((40, 360, 90, 420), outline=(40, 110, 220), width=3)
        draw.ellipse((50, 375, 80, 410), fill=metal)
        draw.text((40, 520), "Price: £0.55 Ex VAT", fill=(200, 20, 20))
        draw.text((40, 560), "Cookie policy", fill=(90, 90, 90))
        draw.rectangle((0, 0, 399, 28), fill=(245, 245, 247))
        draw.text((16, 6), "15:51", fill=(20, 20, 20))

        result = clean_image(im, canvas=256, sku="RH32")
        arr = np.asarray(result.image)
        sat_red = (arr[:, :, 0] > 160) & (arr[:, :, 1] < 80)
        self.assertFalse(sat_red.any(), "red price pixels must be painted white")
        grey = metal_mask(arr)
        self.assertGreater(int(grey.sum()), 200)
        # Metal should sit in the lower-middle of the square tile, not the status bar.
        ys, xs = np.where(grey)
        self.assertGreater(float(ys.mean()), arr.shape[0] * 0.25)
        self.assertLess(float(ys.min()), arr.shape[0] * 0.55)

    def test_cut_off_product_does_not_keep_title_text(self) -> None:
        """Many public tiles still show the shop title because the finial was cropped off."""
        im = Image.new("RGB", (400, 400), (255, 255, 255))
        draw = ImageDraw.Draw(im)
        metal = (88, 88, 92)
        draw.ellipse((170, 0, 230, 28), fill=metal)
        draw.text((40, 140), "RH2 Railhead 150 x 70 x 16mm", fill=(20, 20, 20))
        draw.text((40, 220), "Price: £0.50 Ex VAT", fill=(30, 90, 200))
        result = clean_image(im, canvas=256, sku="RH2")
        arr = np.asarray(result.image)
        # Title ink is near-black; the kept metal is mid-grey. Require no large black field.
        black_text = (arr.max(axis=2) < 40).sum()
        self.assertLess(int(black_text), 80)
        self.assertGreater(int(metal_mask(arr).sum()), 40)

    def test_prefers_complete_thumb_over_top_edge_sliver(self) -> None:
        im = Image.new("RGB", (400, 400), (255, 255, 255))
        draw = ImageDraw.Draw(im)
        metal = (80, 80, 84)
        draw.rectangle((150, 0, 250, 22), fill=metal)
        _spear(draw, 80, 90, metal)
        result = clean_image(im, canvas=256)
        arr = np.asarray(result.image)
        mask = metal_mask(arr)
        ys, xs = np.where(mask)
        self.assertGreater(int(mask.sum()), 300)
        self.assertGreater(float(ys.max() - ys.min()), 80)

    def test_already_clean_tile_keeps_a_single_body(self) -> None:
        im = Image.new("RGB", (256, 256), (255, 255, 255))
        draw = ImageDraw.Draw(im)
        _spear(draw, 128, 30, (70, 72, 78))
        result = clean_image(im, canvas=256)
        self.assertGreater(result.metal_pixels, 100)
        cleaned = metal_mask(np.asarray(result.image))
        self.assertGreater(int(cleaned.sum()), 100)


if __name__ == "__main__":
    unittest.main()
