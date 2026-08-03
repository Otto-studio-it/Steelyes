from __future__ import annotations

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import landscape, letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


ROOT = Path("/Volumes/SSDRubb/Steelyes")
OUT_DIR = ROOT / "docs/frontend/gate-missing-data"


GATES = [
    {
        "slug": "double_swing",
        "title": "Double Swing",
        "subtitle": "Victorian reference baseline and core swing geometry",
        "focus": "double swing drawing, Victorian styling, price bands, and option mapping",
        "items": [
            ("Does `widthMm` mean clear opening only, or clear opening plus posts/pillars?", "Exact value / definition", "Size semantics"),
            ("Does `heightMm` mean the rectangular gate body only, or body plus arch?", "Exact value / definition", "Size semantics"),
            ("Are the published `1800/1900 mm` and `900/1000 mm` bands minimum-to-maximum ranges, or just example presets?", "Range vs preset", "Size semantics"),
            ("Do the reference photos represent the same catalog size, or are they larger site-specific installs?", "Single choice / confirmation", "Photo baseline"),
            ("How many horizontal rails should the Victorian double swing have in production?", "Exact value", "Structure"),
            ("What is the exact tube section for the outer frame?", "Exact value", "Structure"),
            ("What is the exact picket spacing or center-to-center pitch?", "Exact value", "Structure"),
            ("What is the exact ground clearance target?", "Exact value", "Structure"),
            ("Should the center meeting detail be a decorative latch plate, a simple latch, or both?", "Single choice", "Center hardware"),
            ("Is the drop bolt always present, or only on some installs?", "Yes/No + frequency", "Center hardware"),
            ("Which visual element is the real product match for the top and bottom circular bands?", "Exact mapping", "Decoration mapping"),
            ("Which visual element is the real product match for basket twist details?", "Exact mapping", "Decoration mapping"),
            ("Which visual element is the real product match for the spear row at the middle?", "Exact mapping", "Decoration mapping"),
            ("Should `bushes` and `spirals` stay as the current approximations, or do they need new product names?", "Naming + mapping decision", "Decoration catalog"),
            ("Is `top_railheads` supposed to mean a finial on every picket, or a smaller counted set?", "Exact count rule", "Railheads"),
            ("Is `Traditional Victorian Style` the only style that should show the full Victorian decoration set?", "Yes/No", "Style rules"),
            ("Should `Composite Boards` reuse the same pricing logic but a different infill drawing?", "Yes/No", "Style rules / pricing"),
            ("Is `arched_top` always valid for `double_swing`, or only on some widths?", "Yes/No + condition", "Option rules"),
            ("Are `dog_bars` and `dog_bar_railheads` separate options in production, or only visual labels?", "Product decision", "Option rules"),
            ("Which single photo should be treated as the baseline reference for the final 2D preview?", "Single photo choice", "Preview reference"),
            ("Should the final preview match photo 02, 03, or 04 most closely?", "Single photo choice", "Preview reference"),
            ("Do you want the preview to show brick pillars by default, or only the gate assembly?", "Yes/No + default visual", "Preview layout"),
        ],
    },
    {
        "slug": "single_swing",
        "title": "Single Swing",
        "subtitle": "Single-leaf swing geometry for compact access",
        "focus": "single leaf dimensions, hinge side, latch side, and reuse of swing drawing grammar",
        "items": [
            ("What is the exact leaf width rule for the single swing family?", "Exact value / range", "Size semantics"),
            ("Is `widthMm` for single swing the leaf only or the full opening including post allowances?", "Exact definition", "Size semantics"),
            ("What is the default hinge side: left or right?", "Single choice", "Handing"),
            ("What is the default latch side?", "Single choice", "Handing"),
            ("Should the single swing reuse the same rail layout as the double swing reference?", "Yes/No", "Geometry reuse"),
            ("Should the single swing reuse the same pillar / post logic as the double swing reference?", "Yes/No", "Geometry reuse"),
            ("Should the Victorian decorative set be identical to double swing, or reduced?", "Exact mapping / decision", "Decoration rules"),
            ("Is `arched_top` allowed on every single swing width, or only on some widths?", "Yes/No + condition", "Option rules"),
            ("Should the preview show only the gate leaf, or the gate leaf plus a simplified support context?", "Yes/No + default", "Preview layout"),
        ],
    },
    {
        "slug": "tracked_sliding",
        "title": "Tracked Sliding",
        "subtitle": "Ground-track sliding gate with visible runback",
        "focus": "track geometry, panel proportions, motor visibility, and open-state runback",
        "items": [
            ("What is the visible track style: embedded, surface-mounted, or another type?", "Exact choice", "Track geometry"),
            ("Where exactly should the track be positioned relative to the opening?", "Exact value / rule", "Track geometry"),
            ("What is the expected track length relative to the clear opening?", "Exact value / rule", "Track geometry"),
            ("What are the panel body proportions for the Victorian version?", "Exact value / range", "Panel geometry"),
            ("Should the motor be visible in the preview, and if yes how much?", "Yes/No + visibility rule", "Automation"),
            ("What is the open-state runback rule?", "Exact rule", "Motion"),
            ("Should the sliding preview show the same decorative details as the swing family, or a simplified set?", "Exact mapping / decision", "Decoration reuse"),
            ("Do composite sliding variants need a different panel structure than Victorian?", "Yes/No", "Composite variant"),
            ("Should the preview emphasize the track more than the gate body, or the gate body more than the track?", "Single choice", "Visual priority"),
        ],
    },
    {
        "slug": "cantilever_sliding",
        "title": "Cantilever Sliding",
        "subtitle": "Self-supporting sliding gate without a ground track across the opening",
        "focus": "counterbalance tail, opening semantics, support carriage, and no-track preview rules",
        "items": [
            ("What is the final tail ratio?", "Exact value / percentage", "Counterbalance"),
            ("Where should the support carriage be positioned in the drawing?", "Exact value / rule", "Support structure"),
            ("What is the ground clearance target?", "Exact value", "Structure"),
            ("What does `widthMm` mean here: clear opening or total assembly length?", "Exact definition", "Size semantics"),
            ("How much of the support structure must be visible in the 2D preview?", "Exact visibility rule", "Visual layout"),
            ("Should the preview show any ground guide in the opening, or none at all?", "Yes/No", "Motion truth"),
            ("Should cantilever reuse the same decorative rules as tracked sliding, or a reduced set?", "Exact mapping / decision", "Decoration rules"),
            ("Should the opening width shown to the user be the clear opening only?", "Yes/No", "Customer wording"),
        ],
    },
    {
        "slug": "bifolding_double_swing",
        "title": "Bifolding Double Swing",
        "subtitle": "Two swing leaves, each split into folding panels",
        "focus": "panel split, folding hinge representation, and open-state footprint",
        "items": [
            ("How many panels should each main leaf have?", "Exact value", "Panel structure"),
            ("How should the fold be split across each leaf?", "Exact ratio", "Panel structure"),
            ("How should the folding hinge be represented in the preview?", "Exact mapping / style", "Folding hardware"),
            ("What is the open-state footprint?", "Exact value / rule", "Motion"),
            ("Should the same Victorian visual style be reused from double swing?", "Yes/No", "Style reuse"),
            ("Should `widthMm` be read as total opening width or another assembly measure?", "Exact definition", "Size semantics"),
            ("Should the preview show four moving panels clearly, or keep the folding detail minimal?", "Single choice", "Visual priority"),
        ],
    },
    {
        "slug": "single_bifolding",
        "title": "Single Bifolding",
        "subtitle": "Single leaf folding gate for compact openings",
        "focus": "fold split, collection side, and compact folding preview logic",
        "items": [
            ("What is the fold split ratio?", "Exact value / ratio", "Panel structure"),
            ("Which side does the folded leaf collect to?", "Single choice", "Collection side"),
            ("What is the open-state footprint?", "Exact value / rule", "Motion"),
            ("Can the same component logic be reused from bifolding double swing?", "Yes/No", "Reuse"),
            ("Should the preview show the fold hinge clearly or keep it schematic?", "Single choice", "Visual priority"),
            ("What is the exact width rule for this family?", "Exact value / range", "Size semantics"),
        ],
    },
    {
        "slug": "telescopic_sliding",
        "title": "Telescopic Sliding",
        "subtitle": "Multi-panel sliding gate with overlap sequencing",
        "focus": "panel count, overlap order, and open/closed stack states",
        "items": [
            ("How many panels does the gate have?", "Exact value", "Panel count"),
            ("What is the overlap order between panels?", "Exact rule", "Motion sequencing"),
            ("What is the closed position stack?", "Exact value / rule", "Closed state"),
            ("What is the open position stack?", "Exact value / rule", "Open state"),
            ("How much of the motion should be visible in 2D?", "Exact visibility rule", "Preview detail"),
            ("Should each panel be drawn as a separate block in the preview?", "Yes/No", "Drawing model"),
            ("Should telescopic sliding reuse the same track language as tracked sliding?", "Yes/No", "Mechanism reuse"),
            ("What is the exact width rule for the family?", "Exact value / range", "Size semantics"),
        ],
    },
    {
        "slug": "radius_sliding",
        "title": "Radius Sliding",
        "subtitle": "Ambiguous radius/curved sliding family that must be defined first",
        "focus": "mechanism definition, curved path vs curved top, and preview meaning",
        "items": [
            ("Does the term mean a curved path, a curved top, or both?", "Single choice", "Mechanism meaning"),
            ("Is it a sliding family or a separate product definition?", "Single choice", "Product scope"),
            ("What should the preview show in plan view?", "Exact rule", "Plan preview"),
            ("What should the preview show in elevation?", "Exact rule", "Elevation preview"),
            ("What is the exact width rule?", "Exact value / range", "Size semantics"),
            ("Should this stay blocked until the client defines the meaning?", "Yes/No", "Release gating"),
        ],
    },
]


def build_pdf(gate: dict) -> Path:
    slug = gate["slug"]
    pdf_path = OUT_DIR / f"{slug}.pdf"
    pdf_path.parent.mkdir(parents=True, exist_ok=True)

    styles = getSampleStyleSheet()
    styles.add(
        ParagraphStyle(
            name="TitleCustom",
            parent=styles["Title"],
            fontName="Helvetica-Bold",
            fontSize=19,
            leading=23,
            textColor=colors.HexColor("#111111"),
            spaceAfter=8,
        )
    )
    styles.add(
        ParagraphStyle(
            name="SubtitleCustom",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=9.5,
            leading=12,
            textColor=colors.HexColor("#444444"),
            spaceAfter=6,
        )
    )
    styles.add(
        ParagraphStyle(
            name="BodyCustom",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=8.2,
            leading=10,
            textColor=colors.black,
        )
    )
    styles.add(
        ParagraphStyle(
            name="HeaderCustom",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=8.8,
            leading=10.5,
            textColor=colors.white,
        )
    )

    page_width, _ = landscape(letter)
    left_margin = right_margin = 0.45 * inch
    table_width = page_width - left_margin - right_margin
    col_widths = [0.36 * inch, 5.15 * inch, 1.95 * inch, 1.55 * inch]
    scale = table_width / sum(col_widths)
    col_widths = [w * scale for w in col_widths]

    story = [
        Paragraph(f"{gate['title']} Missing Data", styles["TitleCustom"]),
        Paragraph(gate["subtitle"], styles["SubtitleCustom"]),
        Paragraph(f"Focus: {gate['focus']}", styles["SubtitleCustom"]),
        Spacer(1, 0.1 * inch),
    ]

    header = [
        Paragraph("<b>#</b>", styles["HeaderCustom"]),
        Paragraph("<b>Missing data</b>", styles["HeaderCustom"]),
        Paragraph("<b>Expected answer type</b>", styles["HeaderCustom"]),
        Paragraph("<b>Topic</b>", styles["HeaderCustom"]),
    ]

    rows = [header]
    for n, (question, answer_type, topic) in enumerate(gate["items"], start=1):
        rows.append(
            [
                Paragraph(str(n), styles["BodyCustom"]),
                Paragraph(question, styles["BodyCustom"]),
                Paragraph(answer_type, styles["BodyCustom"]),
                Paragraph(topic, styles["BodyCustom"]),
            ]
        )

    table = Table(rows, colWidths=col_widths, repeatRows=1, hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1f2937")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("GRID", (0, 0), (-1, -1), 0.45, colors.HexColor("#c7ccd4")),
                ("BOX", (0, 0), (-1, -1), 0.8, colors.HexColor("#9aa3af")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("ALIGN", (0, 0), (0, -1), "CENTER"),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.whitesmoke, colors.HexColor("#f6f8fb")]),
            ]
        )
    )
    story.append(table)
    story.append(Spacer(1, 0.1 * inch))
    story.append(
        Paragraph(
            "If an answer is uncertain, mark it provisional instead of guessing. Keep responses short and tied to the exact question number.",
            styles["SubtitleCustom"],
        )
    )

    def add_page_number(canvas, doc):
        canvas.saveState()
        canvas.setFont("Helvetica", 8)
        canvas.setFillColor(colors.HexColor("#666666"))
        canvas.drawRightString(page_width - right_margin, 0.3 * inch, f"Page {doc.page}")
        canvas.restoreState()

    doc = SimpleDocTemplate(
        str(pdf_path),
        pagesize=landscape(letter),
        leftMargin=left_margin,
        rightMargin=right_margin,
        topMargin=0.45 * inch,
        bottomMargin=0.45 * inch,
        title=f"{gate['title']} Missing Data",
        author="Codex",
    )
    doc.build(story, onFirstPage=add_page_number, onLaterPages=add_page_number)
    return pdf_path


def main() -> None:
    generated = []
    for gate in GATES:
        generated.append(build_pdf(gate))
    for path in generated:
        print(path)


if __name__ == "__main__":
    main()
