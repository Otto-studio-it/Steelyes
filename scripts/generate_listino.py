#!/usr/bin/env python3
"""Generate Steelyes service catalogue PDF using fpdf2."""

from pathlib import Path
from fpdf import FPDF
from PIL import Image as PILImage
import io

IMAGES = Path("/Volumes/SSDRubb/Steelyes/apps/web/public/images")
OUTPUT = Path("/Volumes/SSDRubb/Steelyes/apps/web/public/downloads/steelyes-listino-2026.pdf")

# Brand colours (RGB)
RED    = (158, 0, 12)
DARK   = (16, 16, 16)
WARM   = (92, 64, 61)
CREAM  = (245, 243, 240)
BORDER = (228, 228, 226)
WHITE  = (255, 255, 255)
AMBER  = (212, 130, 10)

def img(rel: str) -> str | None:
    p = IMAGES / rel
    return str(p) if p.exists() else None


class Listino(FPDF):
    def __init__(self):
        super().__init__("P", "mm", "A4")
        self.set_auto_page_break(False)
        self.set_margins(0, 0, 0)
        # Register fonts
        self._load_fonts()

    def _load_fonts(self):
        self._has_ttf = False
        reg = "/Users/ruben/Library/Fonts/Inter-VariableFont_opsz,wght.ttf"
        bold = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
        fallback_reg = "/System/Library/Fonts/Supplemental/Arial.ttf"
        try:
            r = reg if Path(reg).exists() else fallback_reg
            b = bold if Path(bold).exists() else r
            self.add_font("uni", "", r)
            self.add_font("uni", "B", b)
            self._has_ttf = True
        except Exception:
            self._has_ttf = False

    def sf(self, style: str = "", size: int = 9):
        if self._has_ttf:
            self.set_font("uni", "B" if style == "B" else "", size)
        else:
            self.set_font("Helvetica", style, size)

    # ── colour helpers ──────────────────────────────────────────────

    def fill(self, rgb): self.set_fill_color(*rgb)
    def stroke(self, rgb): self.set_draw_color(*rgb)
    def tc(self, rgb): self.set_text_color(*rgb)

    # ── drawing helpers ─────────────────────────────────────────────

    def hrule(self, x, y, w, h=0.3, color=None):
        if color:
            self.stroke(color)
        self.set_line_width(h)
        self.line(x, y, x + w, y)

    def rect_fill(self, x, y, w, h, color):
        self.fill(color)
        self.stroke(color)
        self.set_line_width(0.1)
        self.rect(x, y, w, h, "F")

    def accent_bar(self, x, y, h, w=1.2):
        self.rect_fill(x, y, w, h, RED)

    def place_image(self, rel_path: str, x, y, w, h):
        path = img(rel_path)
        if not path:
            self.rect_fill(x, y, w, h, CREAM)
            self.stroke(BORDER)
            self.set_line_width(0.2)
            self.rect(x, y, w, h, "D")
            return
        try:
            # Crop to aspect ratio before placing
            with PILImage.open(path) as im:
                src_w, src_h = im.size
                target_ratio = w / h
                src_ratio = src_w / src_h
                if src_ratio > target_ratio:
                    new_w = int(src_h * target_ratio)
                    left = (src_w - new_w) // 2
                    im = im.crop((left, 0, left + new_w, src_h))
                else:
                    new_h = int(src_w / target_ratio)
                    top = (src_h - new_h) // 2
                    im = im.crop((0, top, src_w, top + new_h))
                buf = io.BytesIO()
                im = im.convert("RGB")
                im.save(buf, format="JPEG", quality=82)
                buf.seek(0)
            self.image(buf, x, y, w, h)
        except Exception as e:
            self.rect_fill(x, y, w, h, CREAM)

    def label(self, text, x, y, color=None, size=6, bold=False):
        self.tc(color or RED)
        self.sf("B" if bold else "", size)
        self.set_xy(x, y)
        self.cell(0, 3, text.upper())

    def heading(self, text, x, y, size=22, color=None, w=0):
        self.sf("B", size)
        self.tc(color or DARK)
        self.set_xy(x, y)
        self.multi_cell(w or 160, size * 0.42, text.upper(), align="L")

    def body(self, text, x, y, w=120, color=None, size=8, lh=4.2):
        self.sf("", size)
        self.tc(color or WARM)
        self.set_xy(x, y)
        self.multi_cell(w, lh, text, align="L")

    # ── Page header / footer ─────────────────────────────────────────

    def page_header(self, section: str):
        self.hrule(14, 14, 182, 0.2, BORDER)
        self.sf("B", 9)
        self.tc(DARK)
        self.set_xy(14, 10)
        self.cell(0, 4, "STEELYES")
        self.tc(RED)
        self.cell(0, 4, ".")
        self.sf("", 7)
        self.tc((160, 160, 160))
        self.set_xy(14, 16)
        self.cell(0, 3, section.upper())
        self.set_xy(0, 0)

    def page_footer(self):
        y = 284
        self.hrule(14, y, 182, 0.2, BORDER)
        self.sf("", 6)
        self.tc((180, 180, 180))
        self.set_xy(14, y + 1.5)
        self.cell(0, 3, "Steelyes Ltd — Service Catalogue 2026")
        self.set_xy(0, y + 1.5)
        self.cell(196, 3, "All prices indicative - subject to survey and written confirmation", align="R")

    # ── Spec cell ────────────────────────────────────────────────────

    def spec_cell(self, x, y, w, h, label_text, value_text):
        self.fill(CREAM)
        self.stroke(BORDER)
        self.set_line_width(0.2)
        self.rect(x, y, w, h, "FD")
        self.label(label_text, x + 2, y + 1.5, color=(180, 180, 180), size=5.5)
        self.sf("B", 7)
        self.tc(DARK)
        self.set_xy(x + 2, y + 4.5)
        self.cell(w - 4, 3.5, value_text.upper(), ln=0)

    # ── Gate card ────────────────────────────────────────────────────

    def gate_card(self, x, y, img_path, ref, title, subtitle, desc, specs: list, w_total=182):
        h = 42
        img_w = 55
        body_w = w_total - img_w

        # border
        self.stroke(BORDER)
        self.set_line_width(0.2)
        self.rect(x, y, w_total, h, "D")

        # image
        self.place_image(img_path, x, y, img_w, h)

        # body
        bx = x + img_w + 4
        by = y + 3

        self.label(ref, bx, by, color=RED, size=5.5)
        by += 3.5
        self.sf("B", 13)
        self.tc(DARK)
        self.set_xy(bx, by)
        self.cell(body_w - 6, 5.5, title.upper())
        by += 5.5
        self.sf("", 6.5)
        self.tc(WARM)
        self.set_xy(bx, by)
        self.cell(body_w - 6, 3, subtitle.upper())
        by += 4.5

        self.sf("", 7)
        self.tc(WARM)
        self.set_xy(bx, by)
        self.multi_cell(body_w - 6, 3.5, desc)

        # spec grid (2×2)
        sx = bx
        sy = y + h - 13
        sw = (body_w - 6) / 2 - 1
        sh = 5.5
        for i, (sl, sv) in enumerate(specs[:4]):
            cx = sx + (sw + 2) * (i % 2)
            cy = sy + sh * (i // 2) + (1 if i >= 2 else 0)
            self.spec_cell(cx, cy, sw, sh, sl, sv)

    # ── Service card ─────────────────────────────────────────────────

    def service_card(self, x, y, img_path, category, title, desc, capabilities, w=89, img_h=35):
        total_h = img_h + 55
        self.stroke(BORDER)
        self.set_line_width(0.2)
        self.rect(x, y, w, total_h, "D")

        self.place_image(img_path, x, y, w, img_h)

        bx = x + 4
        by = y + img_h + 3
        self.label(category, bx, by, color=RED, size=6)
        by += 3.5
        self.sf("B", 12)
        self.tc(DARK)
        self.set_xy(bx, by)
        self.multi_cell(w - 8, 5.5, title.upper(), align="L")
        by += 5.5 * (1 + title.count("\n"))
        self.sf("", 7)
        self.tc(WARM)
        self.set_xy(bx, by)
        self.multi_cell(w - 8, 3.5, desc, align="L")
        by = self.get_y() + 2

        for cap in capabilities:
            self.sf("", 6.5)
            self.tc(RED)
            self.set_xy(bx, by)
            self.cell(3, 3, "-")
            self.tc(DARK)
            self.set_xy(bx + 4, by)
            self.multi_cell(w - 12, 3.5, cap)
            by = self.get_y()

        # price note
        self.hrule(bx, by + 1, w - 8, 0.2, BORDER)
        by += 3
        self.sf("B", 7)
        self.tc(RED)
        self.set_xy(bx, by)
        self.cell(w - 8, 3, "Indicative pricing - subject to survey")

    # ── Process step ─────────────────────────────────────────────────

    def process_step(self, x, y, num, title, body_text, w=43, h=45):
        self.fill(CREAM)
        self.stroke(BORDER)
        self.set_line_width(0.2)
        self.rect(x, y, w, h, "FD")

        self.sf("B", 22)
        self.tc(BORDER)
        self.set_xy(x + 3, y + 2)
        self.cell(w - 6, 10, num)

        self.sf("B", 8)
        self.tc(DARK)
        self.set_xy(x + 3, y + 13)
        self.cell(w - 6, 4, title.upper())

        self.sf("", 7)
        self.tc(WARM)
        self.set_xy(x + 3, y + 18)
        self.multi_cell(w - 6, 3.5, body_text)

        self.rect_fill(x + 3, y + h - 3, 10, 1.5, RED)


# ═══════════════════════════════════════════════════════════════════
# BUILD
# ═══════════════════════════════════════════════════════════════════

def build():
    pdf = Listino()

    # ─────────────────────────────────────────
    # COVER
    # ─────────────────────────────────────────
    pdf.add_page()
    pdf.rect_fill(0, 0, 210, 297, DARK)

    # Cover background: darkened hero image
    cover_img2 = img("home/hero-modern-driveway-gate.jpg")
    if cover_img2:
        try:
            from PIL import ImageEnhance
            with PILImage.open(cover_img2) as im:
                im = im.convert("RGB")
                im = ImageEnhance.Brightness(im).enhance(0.30)
                buf = io.BytesIO()
                im.save(buf, format="JPEG", quality=80)
                buf.seek(0)
            pdf.image(buf, 0, 0, 210, 297)
        except Exception:
            pass

    # Left accent bar
    pdf.rect_fill(14, 40, 1.5, 100, RED)

    # Company tag
    pdf.sf("B", 7)
    pdf.tc(RED)
    pdf.set_xy(18, 38)
    pdf.cell(0, 3.5, "STEELYES LTD  -  SERVICE CATALOGUE  -  2026")

    # Main brand
    pdf.sf("B", 54)
    pdf.tc(WHITE)
    pdf.set_xy(18, 48)
    pdf.cell(0, 22, "STEEL")
    pdf.tc(RED)
    pdf.set_xy(18, 68)
    pdf.cell(0, 22, "YES.")

    # Divider
    pdf.rect_fill(18, 96, 18, 1.5, RED)

    # Tagline
    pdf.sf("", 11)
    pdf.tc((220, 220, 220))
    pdf.set_xy(18, 101)
    pdf.cell(0, 5, "Bespoke Steel Fabrication")

    # Description
    pdf.sf("", 9)
    pdf.tc((190, 190, 190))
    pdf.set_xy(18, 112)
    pdf.multi_cell(130, 4.5,
        "Bespoke steel gates, railings, balconies, and security fabrication.\n"
        "Made to measure. Installed with care. Specified from the site outward.",
        align="L")

    # Services list
    services = ["Steel Gates (6 types)", "Railings & Balustrades", "Steel Balconies",
                "Perimeter Security", "Full Installation Service", "Architectural Bespoke"]
    pdf.set_xy(18, 140)
    for s in services:
        pdf.sf("", 7.5)
        pdf.tc(RED)
        pdf.set_x(18)
        pdf.cell(4, 4.5, "-")
        pdf.tc((200, 200, 200))
        pdf.cell(0, 4.5, s)
        pdf.ln(4.5)

    # Footer
    pdf.hrule(14, 272, 182, 0.2, (60, 60, 60))
    pdf.sf("B", 8)
    pdf.tc(WHITE)
    pdf.set_xy(14, 274)
    pdf.cell(80, 4, "STEELYES LTD")
    pdf.sf("", 7)
    pdf.tc((130, 130, 130))
    pdf.set_xy(14, 279)
    pdf.cell(100, 3.5, "United Kingdom - steelyes.co.uk")
    pdf.sf("B", 7)
    pdf.tc(RED)
    pdf.set_xy(130, 274)
    pdf.cell(66, 3.5, "EST. UK - 2024", align="R")

    # Disclaimer
    pdf.sf("I", 6)
    pdf.tc((100, 100, 100))
    pdf.set_xy(14, 284)
    pdf.multi_cell(182, 3,
        "All pricing indicated is indicative and subject to site survey, specification, and written confirmation. "
        "No price constitutes a formal quotation until confirmed in writing by Steelyes Ltd.", align="L")

    # ─────────────────────────────────────────
    # PAGE 2 — OVERVIEW
    # ─────────────────────────────────────────
    pdf.add_page()
    pdf.page_header("Company Overview")

    y = 24
    pdf.accent_bar(14, y, 18)
    pdf.label("WHO WE ARE", 18, y, color=RED, size=7)
    pdf.sf("B", 22)
    pdf.tc(DARK)
    pdf.set_xy(18, y + 5)
    pdf.cell(0, 9, "UK STEEL FABRICATORS")
    y += 16
    pdf.rect_fill(18, y, 14, 1.5, RED)
    y += 5

    pdf.sf("", 8.5)
    pdf.tc(WARM)
    pdf.set_xy(18, y)
    pdf.multi_cell(150, 4.2,
        "Steelyes Ltd designs, fabricates, and installs bespoke structural steelwork for residential and "
        "commercial clients across the United Kingdom. Every project begins with a site survey. "
        "Every specification is confirmed before production is committed.")
    y = pdf.get_y() + 4

    # Disclaimer banner
    pdf.fill((255, 248, 240))
    pdf.stroke((232, 200, 138))
    pdf.set_line_width(0.2)
    pdf.rect(14, y, 182, 15, "FD")
    pdf.rect_fill(14, y, 1.5, 15, AMBER)
    pdf.sf("B", 7)
    pdf.tc(AMBER)
    pdf.set_xy(18, y + 2)
    pdf.cell(0, 3.5, "PRICING NOTICE")
    pdf.sf("", 7.5)
    pdf.tc((122, 90, 30))
    pdf.set_xy(18, y + 7)
    pdf.multi_cell(174, 3.6,
        "All prices shown in this catalogue are indicative only and subject to site survey, specification review, "
        "and written confirmation. Final pricing depends on opening dimensions, site conditions, finish selection, "
        "automation requirements, and access logistics.")
    y += 19

    # Info grid 2×3
    cells = [
        ("Products", "6 Gate Types + Services"),
        ("Coverage", "UK-Wide"),
        ("Fabrication", "All in-house"),
        ("Lead Time", "Confirmed per project"),
        ("Automation", "Manual & Motorised"),
        ("Quote", "Free site survey"),
    ]
    cw = 88; ch = 11
    for i, (lbl, val) in enumerate(cells):
        cx = 14 + (cw + 6) * (i % 2)
        cy = y + (ch + 2) * (i // 2)
        pdf.fill(CREAM)
        pdf.stroke(BORDER)
        pdf.set_line_width(0.2)
        pdf.rect(cx, cy, cw, ch, "FD")
        pdf.label(lbl, cx + 3, cy + 2.5, color=(170, 170, 170), size=5.5)
        pdf.sf("B", 8.5)
        pdf.tc(DARK)
        pdf.set_xy(cx + 3, cy + 6)
        pdf.cell(cw - 6, 4, val.upper())
    y += (ch + 2) * 3 + 5

    # Services overview grid 3×2
    cats = [
        ("01", "Steel Gates", "6 gate types — cantilever, bifold, pedestrian,\ntelescopic, sliding, and architectural."),
        ("02", "Railings", "Balustrades, handrails, stair edges,\nlanding protection and perimeter continuity."),
        ("03", "Balconies", "Structural frames, infill panels,\nand retrofit fixing systems."),
        ("04", "Security", "Doors, grilles, enclosures,\nand protective perimeter screens."),
        ("05", "Installation", "Full service: survey, drawings,\nfabrication, and on-site install."),
        ("06", "Architectural", "Non-standard, design-led commissions\nfor architects and developers."),
    ]
    pdf.label("SERVICES OFFERED", 14, y, color=RED, size=6.5)
    y += 4
    cw2 = 57; ch2 = 20
    for i, (num, title, desc) in enumerate(cats):
        cx = 14 + (cw2 + 3) * (i % 3)
        cy = y + (ch2 + 2) * (i // 3)
        pdf.fill(CREAM)
        pdf.stroke(BORDER)
        pdf.set_line_width(0.2)
        pdf.rect(cx, cy, cw2, ch2, "FD")
        pdf.rect_fill(cx, cy, cw2, 1.2, RED)
        pdf.sf("B", 6)
        pdf.tc(RED)
        pdf.set_xy(cx + 2, cy + 3)
        pdf.cell(cw2 - 4, 3, f"CATEGORY {num}")
        pdf.sf("B", 9)
        pdf.tc(DARK)
        pdf.set_xy(cx + 2, cy + 7)
        pdf.cell(cw2 - 4, 4, title.upper())
        pdf.sf("", 6.5)
        pdf.tc(WARM)
        pdf.set_xy(cx + 2, cy + 12)
        pdf.multi_cell(cw2 - 4, 3.2, desc)
    y += (ch2 + 2) * 2 + 5

    # Photo strip
    strip_imgs = [
        ("home/hero-modern-driveway-gate.jpg", "Modern driveway gate"),
        ("railings/railings-black-cross-london.jpg", "Steel railings London"),
        ("balconies/balcony-juliet-glass-london.jpg", "Juliet balcony"),
    ]
    sw = 58
    for i, (ip, _) in enumerate(strip_imgs):
        pdf.place_image(ip, 14 + (sw + 2) * i, y, sw, 26)

    pdf.page_footer()

    # ─────────────────────────────────────────
    # PAGE 3 — GATES A (ST-101 to ST-103)
    # ─────────────────────────────────────────
    pdf.add_page()
    pdf.page_header("Category 01 — Steel Gates")

    y = 24
    pdf.accent_bar(14, y, 14)
    pdf.label("PRODUCT CATALOGUE", 18, y, color=RED, size=7)
    pdf.sf("B", 22)
    pdf.tc(DARK)
    pdf.set_xy(18, y + 4)
    pdf.cell(0, 9, "STEEL GATES")
    pdf.sf("", 8.5)
    pdf.tc(WARM)
    pdf.set_xy(18, y + 13)
    pdf.multi_cell(150, 4,
        "Six gate systems, each designed for a different entrance condition. All available in manual or motorised "
        "configuration, with finishing and access control confirmed during specification.")
    y = pdf.get_y() + 4

    gates_a = [
        ("gates/sliding-gate-anthracite-residential.jpg", "Ref: ST-101", "Cantilever",
         "Counter-balanced slide",
         "Slides without a full ground track across the entrance. Suitable for driveways where levels, "
         "drainage, or surface finish need to be considered. Posts, support, and run-back confirmed per site.",
         [("Mechanism", "Cantilever slide"), ("Automation", "Available"),
          ("Span", "Survey required"), ("Price", "On request")]),
        ("gates/classic-ornate-driveway-gate-arch.jpg", "Ref: ST-102", "Bifold",
         "Folding dual-leaf",
         "Maximum aperture, minimal swing footprint. Leaves fold as they open, ideal for tight entrances or "
         "short driveways. Infill, privacy level, and access control specified to the entrance.",
         [("Mechanism", "Bifold (dual-leaf fold)"), ("Automation", "Available"),
          ("Span", "Survey required"), ("Price", "On request")]),
        ("gates/pedestrian-gate-ornate-brick.jpg", "Ref: ST-103", "Pedestrian",
         "Personnel-access gate",
         "Single-leaf for side entrances, gardens, service paths, and property boundaries. Design matched to "
         "the wider gate style for a consistent frontage. Locking and access confirmed per specification.",
         [("Mechanism", "Single-leaf swing"), ("Width", "Made to measure"),
          ("Locking", "Per specification"), ("Price", "On request")]),
    ]

    for gate_img, ref, title, sub, desc, specs in gates_a:
        pdf.gate_card(14, y, gate_img, ref, title, sub, desc, specs)
        y += 44

    pdf.page_footer()

    # ─────────────────────────────────────────
    # PAGE 4 — GATES B (ST-104 to ST-106) + Finials
    # ─────────────────────────────────────────
    pdf.add_page()
    pdf.page_header("Category 01 — Steel Gates (cont.)")

    y = 24

    gates_b = [
        ("gates/sliding-gate-spear-finials.jpg", "Ref: ST-104", "Telescopic",
         "Multi-panel slide",
         "Wide openings, shorter stack. Multiple moving panels reduce the side space normally needed by a "
         "single long leaf. Track, drainage, and run-back confirmed before fabrication sign-off.",
         [("Mechanism", "Telescopic slide"), ("Automation", "Reviewed per site"),
          ("Span", "Survey required"), ("Price", "On request")]),
        ("gates/sliding-gate-automated-open.jpg", "Ref: ST-105", "Sliding",
         "Single-panel slide",
         "Clean travel, reliable every cycle. Practical where the entrance has usable side space but "
         "limited swing clearance. Track or cantilever options reviewed by site.",
         [("Mechanism", "Single-panel slide"), ("Automation", "Available"),
          ("Span", "Survey required"), ("Price", "On request")]),
        ("gates/privacy-diagonal-gate-dusk.jpg", "Ref: ST-106", "Architectural",
         "Statement fabrication  -  Fully bespoke",
         "Fully bespoke where a standard catalogue style is not enough. Entrance, property style, privacy "
         "needs, and design intent shape the specification. For architects and high-specification commissions.",
         [("Mechanism", "Specified to project"), ("Finish", "Specified to project"),
          ("Span", "Survey required"), ("Price", "Price on request")]),
    ]

    for gate_img, ref, title, sub, desc, specs in gates_b:
        pdf.gate_card(14, y, gate_img, ref, title, sub, desc, specs)
        y += 44

    # Finials section
    y += 2
    pdf.accent_bar(14, y, 10)
    pdf.label("GATE OPTIONS — FINIAL STYLES", 18, y, color=RED, size=7)
    y += 5
    pdf.sf("", 7.5)
    pdf.tc(WARM)
    pdf.set_xy(18, y)
    pdf.cell(0, 3.5, "Decorative finial options available across all gate types. Selected during specification.")
    y += 7

    finials = [
        ("components/component-finial-spear.jpg", "Spear"),
        ("components/component-finial-ball.jpg", "Ball"),
        ("components/component-finial-acorn.jpg", "Acorn"),
        ("components/component-finial-diamond.jpg", "Diamond"),
        ("components/component-finial-star.jpg", "Star"),
    ]
    fw = 33; fh = 24
    for i, (fi, fn) in enumerate(finials):
        fx = 14 + (fw + 2) * i
        pdf.place_image(fi, fx, y, fw, fh)
        pdf.stroke(BORDER)
        pdf.set_line_width(0.2)
        pdf.rect(fx, y, fw, fh, "D")
        pdf.sf("B", 7)
        pdf.tc(DARK)
        pdf.set_xy(fx, y + fh + 1.5)
        pdf.cell(fw, 3.5, fn.upper(), align="C")

    pdf.page_footer()

    # ─────────────────────────────────────────
    # PAGE 5 — FINISHES & OPTIONS
    # ─────────────────────────────────────────
    pdf.add_page()
    pdf.page_header("Finishes & Gate Options")

    y = 24
    pdf.accent_bar(14, y, 14)
    pdf.label("FINISHING", 18, y, color=RED, size=7)
    pdf.sf("B", 22)
    pdf.tc(DARK)
    pdf.set_xy(18, y + 4)
    pdf.cell(0, 9, "FINISHES & COATINGS")
    pdf.sf("", 8.5)
    pdf.tc(WARM)
    pdf.set_xy(18, y + 14)
    pdf.multi_cell(150, 4,
        "All gates are powder-coated or paint-finished to specification. Standard options below. "
        "Custom RAL colours and specialist coatings reviewed during specification. "
        "Final palette subject to confirmation by Steelyes.")
    y = pdf.get_y() + 5

    finishes = [
        ((26, 26, 26), "Matte Black", "Standard - most popular"),
        ((107, 111, 114), "Zinc Grey", "Contemporary - industrial"),
        ((122, 91, 58), "Bronze", "Warm - traditional"),
        ((232, 228, 222), "Pearl White", "Classic - clean"),
    ]
    sw = 43; sh = 26
    for i, (swatch, name, note) in enumerate(finishes):
        sx = 14 + (sw + 4) * i
        pdf.rect_fill(sx, y, sw, sh - 10, swatch)
        pdf.stroke(BORDER)
        pdf.set_line_width(0.2)
        pdf.rect(sx, y, sw, sh, "D")
        pdf.rect_fill(sx, y + sh - 10, sw, 10, WHITE)
        pdf.rect(sx, y + sh - 10, sw, 10, "D")
        pdf.sf("B", 7.5)
        pdf.tc(DARK)
        pdf.set_xy(sx + 2, y + sh - 8.5)
        pdf.cell(sw - 4, 3.5, name)
        pdf.sf("", 6)
        pdf.tc(WARM)
        pdf.set_xy(sx + 2, y + sh - 4.5)
        pdf.cell(sw - 4, 3.5, note)
    y += sh + 7

    # Options
    pdf.label("GATE OPTIONS & ADD-ONS", 14, y, color=RED, size=7)
    y += 5

    options = [
        ("Motorisation / Automation",
         "Electric motor and control system for automated opening and closing. "
         "Intercom and remote access options available. Battery backup reviewed during specification."),
        ("Intercom & Access Control",
         "Video intercom, keypads, fob readers, and app-based entry. "
         "Integrated with motor system or standalone. Reviewed against site requirements."),
        ("Finial Upgrades",
         "Spear, ball, acorn, diamond, or star finials. Selected during specification. "
         "Priced per finial unit, subject to confirmation."),
        ("Privacy Infill Panels",
         "Horizontal or diagonal steel infill to increase privacy. "
         "Reviewed against gate type, span, and structural requirements."),
    ]
    ow = 88
    for i, (opt_title, opt_desc) in enumerate(options):
        ox = 14 + (ow + 6) * (i % 2)
        oy = y + 28 * (i // 2)
        pdf.fill(CREAM)
        pdf.stroke(BORDER)
        pdf.set_line_width(0.2)
        pdf.rect(ox, oy, ow, 26, "FD")
        pdf.rect_fill(ox, oy, ow, 1.2, RED)
        pdf.sf("B", 8.5)
        pdf.tc(DARK)
        pdf.set_xy(ox + 3, oy + 4)
        pdf.cell(ow - 6, 4, opt_title.upper())
        pdf.sf("", 7)
        pdf.tc(WARM)
        pdf.set_xy(ox + 3, oy + 9.5)
        pdf.multi_cell(ow - 6, 3.5, opt_desc)
        pdf.sf("B", 7)
        pdf.tc(RED)
        pdf.set_xy(ox + 3, oy + 22)
        pdf.cell(ow - 6, 3, "Subject to survey  -  price on request")
    y += 28 * 2 + 5

    # Photo row
    ph_imgs = [
        ("gates/sliding-gate-classic-ornate-tudor.jpg",),
        ("home/modern-diagonal-steel-gate.jpg",),
        ("home/installed-classic-frontage-gate.jpg",),
    ]
    ph_w = 58
    for i, (pi,) in enumerate(ph_imgs):
        pdf.place_image(pi, 14 + (ph_w + 2) * i, y, ph_w, 28)
        pdf.stroke(BORDER)
        pdf.set_line_width(0.2)
        pdf.rect(14 + (ph_w + 2) * i, y, ph_w, 28, "D")

    pdf.page_footer()

    # ─────────────────────────────────────────
    # PAGE 6 — SERVICES (Railings, Balconies, Security)
    # ─────────────────────────────────────────
    pdf.add_page()
    pdf.page_header("Categories 02–04 — Services")

    y = 24
    pdf.accent_bar(14, y, 14)
    pdf.label("SERVICES", 18, y, color=RED, size=7)
    pdf.sf("B", 22)
    pdf.tc(DARK)
    pdf.set_xy(18, y + 4)
    pdf.cell(0, 9, "BEYOND GATES")
    pdf.sf("", 8.5)
    pdf.tc(WARM)
    pdf.set_xy(18, y + 14)
    pdf.multi_cell(150, 4,
        "In addition to our gate catalogue, Steelyes fabricates and installs a full range of structural steelwork. "
        "All service work is specified after a site survey, with compliance and fixing details confirmed before production.")
    y = pdf.get_y() + 5

    # Railings + Balconies side by side
    pdf.service_card(14, y,
        "railings/railings-black-cross-london.jpg",
        "CATEGORY 02",
        "Railings &\nBalustrades",
        "Steel railing systems for residential and commercial — balustrades, handrails, stair edges, "
        "and perimeter continuity with gate installations.",
        ["Balustrades — internal + external",
         "Handrails — repeatable geometry",
         "Landings + stairs — edge protection",
         "Gate perimeter integration"],
        w=89, img_h=34)

    pdf.service_card(105, y,
        "balconies/balcony-juliet-glass-london.jpg",
        "CATEGORY 03",
        "Steel\nBalconies",
        "Structural balcony frames and infill panels fabricated around the building, load paths, "
        "and real conditions of retrofit installation.",
        ["Structural frames — residential + commercial",
         "Infill — glass, mesh, or solid panel",
         "Fixing brackets — verified pre-fabrication",
         "Consistent finish with gate + railing work"],
        w=89, img_h=34)

    y += 90

    # Security full-width
    sec_w = 182; sec_img_w = 65; sec_h = 46
    pdf.stroke(BORDER)
    pdf.set_line_width(0.2)
    pdf.rect(14, y, sec_w, sec_h, "D")
    pdf.place_image("railings/railings-victorian-spear-london.jpg", 14, y, sec_img_w, sec_h)
    bx = 14 + sec_img_w + 5; by = y + 4
    pdf.label("CATEGORY 04", bx, by, color=RED, size=6)
    by += 4
    pdf.sf("B", 14)
    pdf.tc(DARK)
    pdf.set_xy(bx, by)
    pdf.cell(0, 6, "PERIMETER SECURITY")
    by += 7
    pdf.sf("", 7.5)
    pdf.tc(WARM)
    pdf.set_xy(bx, by)
    pdf.multi_cell(110, 3.8,
        "Steel security doors, grilles, access enclosures, and protective screens "
        "built for high-wear use. Specified around access frequency, opening dimensions, and hardware requirements.")
    by = pdf.get_y() + 2
    caps_sec = ["Security doors — heavy-duty steel", "Grilles & screens — fixed or hinged",
                "Access enclosures — plant + equipment", "Perimeter barriers — protective screens"]
    for i, cap in enumerate(caps_sec):
        cx = bx + (55 * (i % 2))
        cy = by + 4.5 * (i // 2)
        pdf.sf("", 7)
        pdf.tc(RED)
        pdf.set_xy(cx, cy)
        pdf.cell(4, 3.5, "-")
        pdf.tc(DARK)
        pdf.cell(0, 3.5, cap)
    pdf.sf("B", 7)
    pdf.tc(RED)
    pdf.set_xy(bx, y + sec_h - 6)
    pdf.cell(0, 3.5, "Pricing: on request  -  subject to survey")

    y += sec_h + 5

    # Additional gallery
    gal_imgs = [
        ("railings/railings-ornate-bronze-driveway.jpg",),
        ("railings/railings-ornate-copper-scroll.jpg",),
        ("balconies/balcony-rooftop-glass-london.jpg",),
        ("balconies/balcony-steel-structure.jpg",),
    ]
    gw = 43
    for i, (gi,) in enumerate(gal_imgs):
        gx = 14 + (gw + 3) * i
        pdf.place_image(gi, gx, y, gw, 26)
        pdf.stroke(BORDER)
        pdf.set_line_width(0.2)
        pdf.rect(gx, y, gw, 26, "D")

    pdf.page_footer()

    # ─────────────────────────────────────────
    # PAGE 7 — INSTALLATION + CTA
    # ─────────────────────────────────────────
    pdf.add_page()
    pdf.page_header("Installation Process & Contact")

    y = 24
    pdf.accent_bar(14, y, 14)
    pdf.label("HOW WE WORK", 18, y, color=RED, size=7)
    pdf.sf("B", 22)
    pdf.tc(DARK)
    pdf.set_xy(18, y + 4)
    pdf.cell(0, 9, "FROM SURVEY TO HANDOVER")
    pdf.sf("", 8.5)
    pdf.tc(WARM)
    pdf.set_xy(18, y + 14)
    pdf.multi_cell(150, 4,
        "Every Steelyes project follows the same four-step process. No production is committed before the specification "
        "is agreed and signed off. Lead times are confirmed per project.")
    y = pdf.get_y() + 5

    steps = [
        ("01", "Site Survey",
         "We confirm fixing substrates, dimensions, site conditions, and constraints before any "
         "drawing work begins. Free for all confirmed projects."),
        ("02", "Drawings & Spec",
         "Fabrication drawings reviewed with the client. All options, finishes, and access hardware "
         "locked before production is committed."),
        ("03", "Fabrication",
         "Sections cut, welded, dressed, and prepared for finishing in-house. Quality checks at each stage. "
         "Lead time confirmed after sign-off."),
        ("04", "Install & Handover",
         "On-site installation and alignment coordinated around access. Hardware commissioned and tested. "
         "Handover notes provided on request."),
    ]
    sw_p = 43
    for i, (num, title, body) in enumerate(steps):
        pdf.process_step(14 + (sw_p + 2) * i, y, num, title, body, w=sw_p, h=42)
    y += 46

    # Photo row
    ph3 = [
        "home/steelwork-finial-detail.jpg",
        "home/classic-ornate-driveway-gate.jpg",
        "railings/railings-curved-black-steps.jpg",
    ]
    pw3 = 58
    for i, pi in enumerate(ph3):
        pdf.place_image(pi, 14 + (pw3 + 2) * i, y, pw3, 28)
        pdf.stroke(BORDER)
        pdf.set_line_width(0.2)
        pdf.rect(14 + (pw3 + 2) * i, y, pw3, 28, "D")
    y += 32

    # CTA block
    cta_h = 62
    pdf.rect_fill(14, y, 182, cta_h, DARK)
    pdf.rect_fill(14, y, 2.5, cta_h, RED)

    tx = 20; ty = y + 5
    pdf.sf("B", 20)
    pdf.tc(WHITE)
    pdf.set_xy(tx, ty)
    pdf.cell(0, 8, "REQUEST A FREE SURVEY")
    ty += 9
    pdf.rect_fill(tx, ty, 16, 1.5, RED)
    ty += 5

    pdf.sf("", 8.5)
    pdf.tc((185, 185, 185))
    pdf.set_xy(tx, ty)
    pdf.multi_cell(140, 4.2,
        "Send us your plans, photos, or a rough brief. We will confirm what is feasible, outline the "
        "specification, and provide a fixed written quotation. No obligation. UK-wide coverage.")
    ty = pdf.get_y() + 4

    contact_items = [
        ("Website", "steelyes.co.uk"),
        ("Quote Request", "steelyes.co.uk/contact"),
        ("Coverage", "United Kingdom"),
        ("Catalogue Edition", "2026  -  v1"),
    ]
    for i, (clabel, cval) in enumerate(contact_items):
        cx = tx + 85 * (i % 2)
        cy = ty + 9 * (i // 2)
        pdf.label(clabel, cx, cy, color=RED, size=5.5)
        pdf.sf("B", 8.5)
        pdf.tc(WHITE)
        pdf.set_xy(cx, cy + 3.5)
        pdf.cell(80, 4, cval)

    # Legal disclaimer
    logy = y + cta_h - 10
    pdf.hrule(tx, logy, 174, 0.2, (55, 55, 55))
    pdf.sf("I", 6)
    pdf.tc((90, 90, 90))
    pdf.set_xy(tx, logy + 2)
    pdf.multi_cell(172, 3,
        "All prices and specifications shown are indicative and subject to site survey, specification review, "
        "and written confirmation by Steelyes Ltd. This catalogue does not constitute a formal quotation or contract.", align="L")

    pdf.page_footer()

    # ─────────────────────────────────────────
    # OUTPUT
    # ─────────────────────────────────────────
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    pdf.output(str(OUTPUT))
    size_kb = OUTPUT.stat().st_size // 1024
    print(f"✓  PDF written: {OUTPUT}")
    print(f"   Size: {size_kb} KB  -  7 pages")


if __name__ == "__main__":
    build()
