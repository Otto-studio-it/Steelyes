#!/usr/bin/env python3
"""Generate PDF versions of the gate catalog markdown files."""

from __future__ import annotations

import re
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    ListFlowable,
    ListItem,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path("/Volumes/SSDRubb/Steelyes")
CATALOG_DIR = ROOT / "docs/frontend/gate-catalog"
SOURCE_FILES = [
    "README.md",
    "double-swing.md",
    "single-swing.md",
    "tracked-sliding.md",
    "cantilever-sliding.md",
    "bifolding-double-swing.md",
    "single-bifolding.md",
    "telescopic-sliding.md",
    "radius-sliding.md",
]


FONT_REGULAR = "/System/Library/Fonts/Supplemental/Arial.ttf"
FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_ITALIC = "/System/Library/Fonts/Supplemental/Arial Italic.ttf"
FONT_BOLD_ITALIC = "/System/Library/Fonts/Supplemental/Arial Bold Italic.ttf"
FONT_CODE = "Courier"


def register_fonts() -> None:
    pdfmetrics.registerFont(TTFont("Steelyes-Regular", FONT_REGULAR))
    pdfmetrics.registerFont(TTFont("Steelyes-Bold", FONT_BOLD))
    pdfmetrics.registerFont(TTFont("Steelyes-Italic", FONT_ITALIC))
    pdfmetrics.registerFont(TTFont("Steelyes-BoldItalic", FONT_BOLD_ITALIC))


def inline_markup(text: str) -> str:
    text = escape(text)
    text = re.sub(r"`([^`]+)`", r'<font face="Courier">\1</font>', text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"__([^_]+)__", r"<b>\1</b>", text)
    text = re.sub(r"(?<!\w)\*([^*]+)\*(?!\w)", r"<i>\1</i>", text)
    text = re.sub(r"(?<!\w)_([^_]+)_(?!\w)", r"<i>\1</i>", text)
    return text


def is_table_separator(line: str) -> bool:
    cleaned = line.strip().strip("|")
    if not cleaned:
        return False
    parts = [part.strip() for part in cleaned.split("|")]
    return all(re.fullmatch(r":?-{3,}:?", part or "") for part in parts)


def parse_table(lines: list[str], start: int) -> tuple[Table, int]:
    rows: list[list[str]] = []
    i = start
    if i + 1 < len(lines) and is_table_separator(lines[i + 1]):
        rows.append([inline_markup(cell.strip()) for cell in lines[i].strip().strip("|").split("|")])
        i += 2
    while i < len(lines) and lines[i].strip().startswith("|"):
        row = [inline_markup(cell.strip()) for cell in lines[i].strip().strip("|").split("|")]
        rows.append(row)
        i += 1

    data = [[Paragraph(cell, styles["table"]) for cell in row] for row in rows]
    table = Table(data, repeatRows=1, hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#101010")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Steelyes-Bold"),
                ("FONTSIZE", (0, 0), (-1, 0), 9),
                ("LEADING", (0, 0), (-1, 0), 11),
                ("BACKGROUND", (0, 1), (-1, -1), colors.HexColor("#f7f5f2")),
                ("TEXTCOLOR", (0, 1), (-1, -1), colors.HexColor("#333333")),
                ("FONTNAME", (0, 1), (-1, -1), "Steelyes-Regular"),
                ("FONTSIZE", (0, 1), (-1, -1), 8.7),
                ("LEADING", (0, 1), (-1, -1), 10.5),
                ("GRID", (0, 0), (-1, -1), 0.45, colors.HexColor("#dad6d1")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
    return table, i


def parse_markdown(text: str):
    lines = text.splitlines()
    story = []
    i = 0
    while i < len(lines):
        raw = lines[i]
        line = raw.rstrip()

        if not line.strip():
            story.append(Spacer(1, 3.5))
            i += 1
            continue

        heading = re.match(r"^(#{1,6})\s+(.+)$", line)
        if heading:
            level = len(heading.group(1))
            content = inline_markup(heading.group(2).strip())
            if level == 1:
                style = styles["cat_h1"]
            elif level == 2:
                style = styles["cat_h2"]
            elif level == 3:
                style = styles["cat_h3"]
            else:
                style = styles["cat_h4"]
            story.append(Paragraph(content, style))
            i += 1
            continue

        if line.strip().startswith("|") and i + 1 < len(lines) and is_table_separator(lines[i + 1]):
            table, i = parse_table(lines, i)
            story.append(table)
            story.append(Spacer(1, 5))
            continue

        if re.match(r"^\s*-\s+", line):
            items = []
            while i < len(lines) and re.match(r"^\s*-\s+", lines[i]):
                item_text = re.sub(r"^\s*-\s+", "", lines[i]).strip()
                items.append(ListItem(Paragraph(inline_markup(item_text), styles["body_text"])))
                i += 1
            story.append(ListFlowable(items, bulletType="bullet", leftIndent=16))
            story.append(Spacer(1, 4))
            continue

        para_lines = [line.strip()]
        i += 1
        while i < len(lines):
            candidate = lines[i].rstrip()
            if not candidate.strip():
                break
            if re.match(r"^(#{1,6})\s+", candidate) or re.match(r"^\s*-\s+", candidate):
                break
            if candidate.strip().startswith("|") and i + 1 < len(lines) and is_table_separator(lines[i + 1]):
                break
            para_lines.append(candidate.strip())
            i += 1
        paragraph = " ".join(part for part in para_lines if part)
        if paragraph:
            story.append(Paragraph(inline_markup(paragraph), styles["body_text"]))
            story.append(Spacer(1, 4))

    return story


def on_page(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor("#ddd9d3"))
    canvas.setLineWidth(0.5)
    canvas.line(doc.leftMargin, A4[1] - 14 * mm, A4[0] - doc.rightMargin, A4[1] - 14 * mm)
    canvas.line(doc.leftMargin, 14 * mm, A4[0] - doc.rightMargin, 14 * mm)

    canvas.setFont("Steelyes-Bold", 9)
    canvas.setFillColor(colors.HexColor("#101010"))
    canvas.drawString(doc.leftMargin, A4[1] - 11 * mm, "STEELYES")
    canvas.setFillColor(colors.HexColor("#9e000c"))
    canvas.drawString(doc.leftMargin + 45, A4[1] - 11 * mm, ".")

    canvas.setFont("Steelyes-Regular", 7)
    canvas.setFillColor(colors.HexColor("#7a7a7a"))
    canvas.drawString(doc.leftMargin, 11 * mm, "Gate catalog PDF")
    canvas.drawRightString(A4[0] - doc.rightMargin, 11 * mm, f"Page {doc.page}")
    canvas.restoreState()


def build_pdf(source: Path) -> Path:
    pdf_path = source.with_suffix(".pdf")
    text = source.read_text(encoding="utf-8")
    story = [Paragraph(inline_markup(source.stem.replace("-", " ").title()), styles["cat_title"]), Spacer(1, 7)]
    story.extend(parse_markdown(text))
    doc = SimpleDocTemplate(
        str(pdf_path),
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=24 * mm,
        bottomMargin=22 * mm,
        title=source.stem.replace("-", " ").title(),
        author="Codex",
    )
    doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
    return pdf_path


styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        name="cat_title",
        fontName="Steelyes-Bold",
        fontSize=20,
        leading=24,
        textColor=colors.HexColor("#101010"),
        spaceAfter=8,
    )
)
styles.add(
    ParagraphStyle(
        name="cat_h1",
        fontName="Steelyes-Bold",
        fontSize=16,
        leading=19,
        textColor=colors.HexColor("#101010"),
        spaceBefore=8,
        spaceAfter=5,
    )
)
styles.add(
    ParagraphStyle(
        name="cat_h2",
        fontName="Steelyes-Bold",
        fontSize=13,
        leading=16,
        textColor=colors.HexColor("#101010"),
        spaceBefore=7,
        spaceAfter=4,
    )
)
styles.add(
    ParagraphStyle(
        name="cat_h3",
        fontName="Steelyes-Bold",
        fontSize=11.3,
        leading=14,
        textColor=colors.HexColor("#9e000c"),
        spaceBefore=5,
        spaceAfter=3,
    )
)
styles.add(
    ParagraphStyle(
        name="cat_h4",
        fontName="Steelyes-Bold",
        fontSize=10,
        leading=12,
        textColor=colors.HexColor("#333333"),
        spaceBefore=4,
        spaceAfter=2,
    )
)
styles.add(
    ParagraphStyle(
        name="body_text",
        fontName="Steelyes-Regular",
        fontSize=10,
        leading=13,
        textColor=colors.HexColor("#333333"),
        spaceAfter=0,
        alignment=TA_LEFT,
    )
)
styles.add(
    ParagraphStyle(
        name="table",
        fontName="Steelyes-Regular",
        fontSize=8.7,
        leading=10.5,
        textColor=colors.HexColor("#333333"),
    )
)


def main() -> None:
    register_fonts()
    generated = []
    for name in SOURCE_FILES:
        source = CATALOG_DIR / name
        generated.append(build_pdf(source))
    for path in generated:
        print(path)


if __name__ == "__main__":
    main()
