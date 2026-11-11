#!/usr/bin/env python3
"""Generate a clear, polished BS131 model-answer PDF."""

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import (
    HRFlowable,
    KeepTogether,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

OUT_DIR = Path(__file__).resolve().parent
WEB_DIR = OUT_DIR / "web"
ARTIFACTS = Path("/opt/cursor/artifacts")
PDF_NAME = "BS131_7th_Week_Exam_Model_Answer.pdf"

SEA = colors.HexColor("#083344")
SEA2 = colors.HexColor("#0E4A5C")
TEAL = colors.HexColor("#0F766E")
TEAL_SOFT = colors.HexColor("#CCFBF1")
FOAM = colors.HexColor("#F0FDFA")
INK = colors.HexColor("#102A33")
MUTE = colors.HexColor("#5B7380")
LINE = colors.HexColor("#D7E4EA")
SOFT = colors.HexColor("#F3FAFB")
DARK_CALC = colors.HexColor("#0B3140")
CALC_TEXT = colors.HexColor("#D9F7F2")
WHITE = colors.white


def styles():
    base = getSampleStyleSheet()
    return {
        "brand": ParagraphStyle(
            "brand", parent=base["Normal"], fontName="Helvetica",
            fontSize=8.5, leading=11, textColor=colors.HexColor("#99F6E4"),
            alignment=TA_CENTER, spaceAfter=4,
        ),
        "title": ParagraphStyle(
            "title", parent=base["Normal"], fontName="Times-Bold",
            fontSize=26, leading=28, textColor=WHITE, alignment=TA_CENTER,
            spaceAfter=4,
        ),
        "sub": ParagraphStyle(
            "sub", parent=base["Normal"], fontName="Helvetica",
            fontSize=10, leading=13, textColor=colors.HexColor("#DFF7F4"),
            alignment=TA_CENTER, spaceAfter=2,
        ),
        "chip": ParagraphStyle(
            "chip", parent=base["Normal"], fontName="Helvetica-Bold",
            fontSize=8.5, leading=10, textColor=WHITE, alignment=TA_CENTER,
        ),
        "qh": ParagraphStyle(
            "qh", parent=base["Normal"], fontName="Times-Bold",
            fontSize=16, leading=18, textColor=SEA, spaceBefore=2, spaceAfter=2,
        ),
        "part": ParagraphStyle(
            "part", parent=base["Normal"], fontName="Helvetica-Bold",
            fontSize=8, leading=10, textColor=TEAL, spaceBefore=6, spaceAfter=4,
        ),
        "ask": ParagraphStyle(
            "ask", parent=base["Normal"], fontName="Helvetica-Bold",
            fontSize=9.5, leading=12.5, textColor=INK, spaceAfter=2,
        ),
        "why": ParagraphStyle(
            "why", parent=base["Normal"], fontName="Helvetica",
            fontSize=8.8, leading=11.5, textColor=MUTE, spaceAfter=2,
        ),
        "calc": ParagraphStyle(
            "calc", parent=base["Normal"], fontName="Courier",
            fontSize=8.6, leading=11.5, textColor=CALC_TEXT, spaceAfter=0,
        ),
        "ans": ParagraphStyle(
            "ans", parent=base["Normal"], fontName="Helvetica-Bold",
            fontSize=10.2, leading=13, textColor=TEAL, spaceAfter=0,
        ),
        "tag": ParagraphStyle(
            "tag", parent=base["Normal"], fontName="Helvetica-Bold",
            fontSize=7.5, leading=9, textColor=WHITE, alignment=TA_CENTER,
        ),
        "th": ParagraphStyle(
            "th", parent=base["Normal"], fontName="Helvetica-Bold",
            fontSize=8.5, leading=10, textColor=WHITE, alignment=TA_CENTER,
        ),
        "td": ParagraphStyle(
            "td", parent=base["Normal"], fontName="Helvetica",
            fontSize=9, leading=11, textColor=INK, alignment=TA_CENTER,
        ),
        "td_fill": ParagraphStyle(
            "td_fill", parent=base["Normal"], fontName="Helvetica-Bold",
            fontSize=9, leading=11, textColor=TEAL, alignment=TA_CENTER,
        ),
        "foot": ParagraphStyle(
            "foot", parent=base["Normal"], fontName="Helvetica",
            fontSize=7.5, leading=9, textColor=MUTE, alignment=TA_CENTER,
        ),
    }


def hero(st):
    left = [
        Paragraph("AASTMT  ·  NAUTICAL DEPARTMENT", st["brand"]),
        Paragraph("MODEL ANSWER", st["title"]),
        Paragraph("Introduction to Navigation (BS131) — 7th Week Exam", st["sub"]),
        Spacer(1, 8),
        Table(
            [[
                Paragraph("06 April 2025", st["chip"]),
                Paragraph("1 Hour", st["chip"]),
                Paragraph("20 Marks", st["chip"]),
            ]],
            colWidths=[5.2 * cm, 5.2 * cm, 5.2 * cm],
        ),
    ]
    inner = Table([[left]], colWidths=[16.8 * cm])
    inner.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), SEA2),
        ("BOX", (0, 0), (-1, -1), 0, SEA2),
        ("LEFTPADDING", (0, 0), (-1, -1), 16),
        ("RIGHTPADDING", (0, 0), (-1, -1), 16),
        ("TOPPADDING", (0, 0), (-1, -1), 16),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 14),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]))
    return inner


def q_header(title, marks, st):
    data = [[
        Paragraph(title, st["qh"]),
        Paragraph(marks, ParagraphStyle(
            "mk", parent=st["ans"], fontSize=8.5, textColor=TEAL, alignment=TA_CENTER,
        )),
    ]]
    t = Table(data, colWidths=[13.6 * cm, 3.2 * cm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), SOFT),
        ("BOX", (0, 0), (-1, -1), 0.8, LINE),
        ("BACKGROUND", (1, 0), (1, 0), TEAL_SOFT),
        ("LEFTPADDING", (0, 0), (0, 0), 10),
        ("RIGHTPADDING", (1, 0), (1, 0), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ALIGN", (1, 0), (1, 0), "CENTER"),
    ]))
    return t


def ask_box(text, st):
    t = Table([[Paragraph(text, st["ask"])]], colWidths=[16.8 * cm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), SOFT),
        ("BOX", (0, 0), (-1, -1), 0.6, LINE),
        ("LEFTPADDING", (0, 0), (-1, -1), 9),
        ("RIGHTPADDING", (0, 0), (-1, -1), 9),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    return t


def calc_box(text, st):
    t = Table([[Paragraph(text.replace("\n", "<br/>"), st["calc"])]], colWidths=[16.8 * cm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), DARK_CALC),
        ("LEFTPADDING", (0, 0), (-1, -1), 9),
        ("RIGHTPADDING", (0, 0), (-1, -1), 9),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    return t


def answer_box(text, st):
    data = [[
        Paragraph("ANSWER", st["tag"]),
        Paragraph(text, st["ans"]),
    ]]
    t = Table(data, colWidths=[2.3 * cm, 14.5 * cm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, 0), TEAL),
        ("BACKGROUND", (1, 0), (1, 0), FOAM),
        ("BOX", (0, 0), (-1, -1), 1.2, TEAL),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (0, 0), 4),
        ("RIGHTPADDING", (0, 0), (0, 0), 4),
        ("LEFTPADDING", (1, 0), (1, 0), 10),
        ("RIGHTPADDING", (1, 0), (1, 0), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    return t


def block(parts):
    return KeepTogether(parts)


def build_pdf(path: Path):
    st = styles()
    doc = SimpleDocTemplate(
        str(path),
        pagesize=A4,
        leftMargin=1.7 * cm,
        rightMargin=1.7 * cm,
        topMargin=1.2 * cm,
        bottomMargin=1.3 * cm,
        title="BS131 Model Answer",
        author="Model Answer",
    )
    story = []

    # Hero
    story.append(hero(st))
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "Final answers are highlighted in green. Short workings are shown only where needed.",
        st["why"],
    ))
    story.append(Spacer(1, 6))

    # -------- Q1 --------
    story.append(q_header("Question 1 — Definitions &amp; Positions", "7 Marks", st))
    story.append(Paragraph("A · COMPLETE THE SENTENCES", st["part"]))

    story.append(block([
        ask_box("1-a. Parallel of latitude … parallel to the plane of ……………", st),
        Paragraph("Plane of the parallel is parallel to the equatorial plane.", st["why"]),
        answer_box("the Equator", st),
        Spacer(1, 6),
    ]))
    story.append(block([
        ask_box("1-b. Rhumb line … cuts all …………… at the same angle.", st),
        Paragraph("Constant course ⇒ same angle with every meridian.", st["why"]),
        answer_box("Meridians", st),
        Spacer(1, 6),
    ]))
    story.append(block([
        ask_box("1-c. Meridians are semi great circles joining ……………", st),
        Paragraph("Each meridian joins the poles and is perpendicular to the equator.", st["why"]),
        answer_box("the North and South Poles", st),
        Spacer(1, 4),
    ]))

    story.append(Paragraph("B · POSITION CALCULATIONS", st["part"]))
    story.append(block([
        ask_box(
            "B-1. A: 28° 30.8′ S, 057° 28.6′ W &nbsp;&nbsp;→&nbsp;&nbsp; "
            "B: 29° 42.6′ N, 069° 33.4′ W",
            st,
        ),
        Spacer(1, 3),
        calc_box("D.Lat  = 29° 42.6′ − (−28° 30.8′) = 58° 13.4′ N\n"
                 "D.Long = 069° 33.4′ W − 057° 28.6′ W = 12° 04.8′ W", st),
        Spacer(1, 3),
        answer_box("D.Lat = 58° 13.4′ N &nbsp;&nbsp;|&nbsp;&nbsp; D.Long = 12° 04.8′ W", st),
        Spacer(1, 7),
    ]))
    story.append(block([
        ask_box(
            "B-2. Start 33° 24.8′ N, 172° 15.6′ E &nbsp;·&nbsp; "
            "D.Lat 22° 56.7′ S &nbsp;·&nbsp; D.Long 011° 57.8′ E",
            st,
        ),
        Spacer(1, 3),
        calc_box("Lat  = 33° 24.8′ N − 22° 56.7′ = 10° 28.1′ N\n"
                 "Long = 172° 15.6′ E + 011° 57.8′ E = 184° 13.4′ E = 175° 46.6′ W", st),
        Spacer(1, 3),
        answer_box("10° 28.1′ N , 175° 46.6′ W", st),
        Spacer(1, 8),
    ]))

    # -------- Q2 --------
    story.append(q_header("Question 2 — Figure Extraction &amp; Gnomonic Chart", "6 Marks", st))
    story.append(Paragraph("A · FROM THE FIGURE", st["part"]))
    story.append(Paragraph(
        "M.N = 6° W of T.N · C.N = 2° E of T.N · Heading from C.N = 085° · Lighthouse from T.N = 122°",
        st["why"],
    ))

    # compact 2-col answers for direct reads
    pairs = [
        ("Variation", "6° W", False, ""),
        ("Total Compass Error", "2° E", False, ""),
        ("Compass Course", "085° C", False, ""),
        ("True Course", "087° T", True, "085° + 2° E = 087° T"),
        ("True Bearing", "122° T", False, ""),
        ("Relative Bearing", "035° Green", True, "122° − 087° = 035° Green"),
    ]
    for i in range(0, len(pairs), 2):
        left = pairs[i]
        right = pairs[i + 1]
        cells = []
        for label, val, has_calc, calc in (left, right):
            bits = [Paragraph(label, st["ask"])]
            if has_calc:
                bits.append(Spacer(1, 2))
                bits.append(Paragraph(calc, ParagraphStyle(
                    "cmini", parent=st["why"], fontName="Courier", fontSize=8, textColor=MUTE,
                )))
            bits.append(Spacer(1, 3))
            bits.append(answer_box(val, st))
            cells.append(bits)
        row = Table([[cells[0], cells[1]]], colWidths=[8.2 * cm, 8.2 * cm])
        row.setStyle(TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (0, 0), 6),
            ("LEFTPADDING", (1, 0), (1, 0), 6),
            ("RIGHTPADDING", (1, 0), (1, 0), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 0),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ]))
        story.append(row)

    story.append(Paragraph("B · GNOMONIC TERMS (Seattle → London)", st["part"]))
    story.append(answer_box("1. Initial Course &nbsp;&nbsp;·&nbsp;&nbsp; 2. Vertex &nbsp;&nbsp;·&nbsp;&nbsp; 3. Final Course", st))
    story.append(Spacer(1, 8))

    # -------- Q3 --------
    story.append(q_header("Question 3 — Compass, Bearings &amp; Gyro", "7 Marks", st))
    story.append(Paragraph("A · FILL THE TABLE", st["part"]))
    story.append(Paragraph("Rule: Mag = Comp ± Dev &nbsp;(East add · West subtract)", st["why"]))
    story.append(calc_box("1) Mag = 155° − 3° W = 152° M\n2) Comp = 273° − 5° E = 268° C", st))
    story.append(Spacer(1, 4))

    table = Table([
        [Paragraph(x, st["th"]) for x in ["", "C.Course", "Dev.", "Mag.Course"]],
        [
            Paragraph("1", st["td"]),
            Paragraph("155°", st["td"]),
            Paragraph("3° W", st["td"]),
            Paragraph("152° M", st["td_fill"]),
        ],
        [
            Paragraph("2", st["td"]),
            Paragraph("268° C", st["td_fill"]),
            Paragraph("5° E", st["td"]),
            Paragraph("273°", st["td"]),
        ],
    ], colWidths=[1.8 * cm, 5 * cm, 5 * cm, 5 * cm])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), SEA),
        ("BACKGROUND", (3, 1), (3, 1), TEAL_SOFT),
        ("BACKGROUND", (1, 2), (1, 2), TEAL_SOFT),
        ("BOX", (0, 0), (-1, -1), 0.8, LINE),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, LINE),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(table)

    story.append(Paragraph("B · BEARINGS", st["part"]))
    b_row = Table([[
        [
            ask_box("B-1. T.Co 023° · Rel 045° Red", st),
            Spacer(1, 3),
            calc_box("023° − 045° = −022° → 338° T", st),
            Spacer(1, 3),
            answer_box("338° T", st),
        ],
        [
            ask_box("B-2. T.Co 111° · T.Bg 140°", st),
            Spacer(1, 3),
            calc_box("140° − 111° = 029° Green", st),
            Spacer(1, 3),
            answer_box("029° Green", st),
        ],
    ]], colWidths=[8.2 * cm, 8.2 * cm])
    b_row.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("RIGHTPADDING", (0, 0), (0, 0), 6),
        ("LEFTPADDING", (1, 0), (1, 0), 6),
        ("LEFTPADDING", (0, 0), (0, 0), 0),
        ("RIGHTPADDING", (1, 0), (1, 0), 0),
    ]))
    story.append(b_row)

    story.append(Paragraph("C · ERRORS &amp; CONVERTED BEARINGS", st["part"]))
    story.append(Paragraph("True 333° T · Compass 322° C · Gyro 335° · Dev 5° E", st["why"]))

    c_items = [
        ("1. Total Compass Error", "333° − 322° = 11° E", "11° E"),
        ("2. Variation", "C.E. − Dev = 11° − 5° = 6° E", "6° E"),
        ("3. Gyro Error", "335° − 333° = 2° High", "2° High"),
        ("4. T.Bg 359° → Comp &amp; Gyro", "359−11=348° C · 359+2=001° G", "348° C  |  001° G"),
    ]
    for i in range(0, 4, 2):
        a = c_items[i]
        b = c_items[i + 1]
        row = Table([[
            [ask_box(a[0], st), Spacer(1, 3), calc_box(a[1], st), Spacer(1, 3), answer_box(a[2], st)],
            [ask_box(b[0], st), Spacer(1, 3), calc_box(b[1], st), Spacer(1, 3), answer_box(b[2], st)],
        ]], colWidths=[8.2 * cm, 8.2 * cm])
        row.setStyle(TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("RIGHTPADDING", (0, 0), (0, 0), 6),
            ("LEFTPADDING", (1, 0), (1, 0), 6),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ]))
        story.append(row)

    # Quick sheet — full-width clear table (no truncation)
    story.append(Spacer(1, 4))
    story.append(q_header("Quick Sheet — Final Answers Only", "Summary", st))
    story.append(Spacer(1, 4))
    quick = [
        ("Q1-A", "Equator / Meridians / North &amp; South Poles"),
        ("Q1-B1", "D.Lat 58° 13.4′ N &nbsp;&nbsp;·&nbsp;&nbsp; D.Long 12° 04.8′ W"),
        ("Q1-B2", "10° 28.1′ N , 175° 46.6′ W"),
        ("Q2-A", "Var 6°W · CE 2°E · C.Co 085°C · T.Co 087°T · T.Bg 122°T · Rel 035°G"),
        ("Q2-B", "1 Initial Course · 2 Vertex · 3 Final Course"),
        ("Q3-A", "Mag 152° M · Comp 268° C"),
        ("Q3-B", "T.Bg 338° T · Rel 029° Green"),
        ("Q3-C", "CE 11°E · Var 6°E · GE 2° High · Comp.Bg 348°C · Gyro.Bg 001°G"),
    ]
    qrows = [[Paragraph("Item", st["th"]), Paragraph("Final Answer", st["th"])]]
    for code, val in quick:
        qrows.append([
            Paragraph(code, st["td_fill"]),
            Paragraph(val, ParagraphStyle(
                "qans", parent=st["td"], fontName="Helvetica-Bold",
                alignment=TA_LEFT, textColor=TEAL, fontSize=9, leading=12,
            )),
        ])
    qt = Table(qrows, colWidths=[2.6 * cm, 14.2 * cm])
    qt.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), SEA),
        ("BACKGROUND", (0, 1), (-1, -1), FOAM),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [FOAM, WHITE]),
        ("BOX", (0, 0), (-1, -1), 1.0, TEAL),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, LINE),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    story.append(qt)
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=0.6, color=LINE))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "Cadet (Compass Add East True)  ·  Error East / Compass Least  ·  Red = Port  ·  Green = Starboard  ·  Gyro High/Low",
        st["foot"],
    ))

    def page_no(canvas, _doc):
        canvas.saveState()
        canvas.setFillColor(MUTE)
        canvas.setFont("Helvetica", 8)
        canvas.drawCentredString(A4[0] / 2, 0.85 * cm, f"BS131 Model Answer  ·  {canvas.getPageNumber()}")
        canvas.restoreState()

    doc.build(story, onFirstPage=page_no, onLaterPages=page_no)
    return path


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    WEB_DIR.mkdir(parents=True, exist_ok=True)
    ARTIFACTS.mkdir(parents=True, exist_ok=True)

    primary = OUT_DIR / PDF_NAME
    build_pdf(primary)
    web_pdf = WEB_DIR / PDF_NAME
    web_pdf.write_bytes(primary.read_bytes())
    art = ARTIFACTS / PDF_NAME
    art.write_bytes(primary.read_bytes())

    # refresh page previews
    try:
        import pymupdf
        doc = pymupdf.open(primary)
        for i, page in enumerate(doc):
            pix = page.get_pixmap(matrix=pymupdf.Matrix(1.6, 1.6), alpha=False)
            name = f"BS131_model_answer_page_{i + 1}.png"
            pix.save(WEB_DIR / name)
            pix.save(ARTIFACTS / name)
        # remove stale page 5 if fewer pages now
        for extra in WEB_DIR.glob("BS131_model_answer_page_*.png"):
            n = int(extra.stem.rsplit("_", 1)[-1])
            if n > doc.page_count:
                extra.unlink(missing_ok=True)
        print(f"pages={doc.page_count}")
    except Exception as e:
        print("preview skip:", e)

    print(f"Wrote {primary} ({primary.stat().st_size} bytes)")
    print(f"Wrote {web_pdf}")
    print(f"Wrote {art}")


if __name__ == "__main__":
    main()
