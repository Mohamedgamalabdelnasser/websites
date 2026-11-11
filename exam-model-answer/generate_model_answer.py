#!/usr/bin/env python3
"""Generate BS131 7th Week Exam model answer PDF."""

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm, mm
from reportlab.platypus import (
    HRFlowable,
    KeepTogether,
    ListFlowable,
    ListItem,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

OUT_DIR = Path(__file__).resolve().parent
ARTIFACTS = Path("/opt/cursor/artifacts")
PDF_NAME = "BS131_7th_Week_Exam_Model_Answer.pdf"


def make_styles():
    base = getSampleStyleSheet()
    styles = {
        "cover_title": ParagraphStyle(
            "cover_title",
            parent=base["Title"],
            fontName="Helvetica-Bold",
            fontSize=18,
            leading=22,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#0B2E4A"),
            spaceAfter=6,
        ),
        "cover_sub": ParagraphStyle(
            "cover_sub",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=11,
            leading=15,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#1F3A4D"),
            spaceAfter=3,
        ),
        "meta": ParagraphStyle(
            "meta",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=9.5,
            leading=13,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#334155"),
            spaceAfter=2,
        ),
        "h1": ParagraphStyle(
            "h1",
            parent=base["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=13,
            leading=17,
            textColor=colors.HexColor("#0B2E4A"),
            spaceBefore=12,
            spaceAfter=6,
            borderPadding=3,
        ),
        "h2": ParagraphStyle(
            "h2",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=11,
            leading=14,
            textColor=colors.HexColor("#1B4D6A"),
            spaceBefore=8,
            spaceAfter=4,
        ),
        "body": ParagraphStyle(
            "body",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=10,
            leading=14,
            alignment=TA_JUSTIFY,
            textColor=colors.HexColor("#111827"),
            spaceAfter=4,
        ),
        "step": ParagraphStyle(
            "step",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=10,
            leading=14,
            leftIndent=8,
            textColor=colors.HexColor("#111827"),
            spaceAfter=2,
        ),
        "formula": ParagraphStyle(
            "formula",
            parent=base["Normal"],
            fontName="Courier",
            fontSize=9.5,
            leading=13,
            leftIndent=14,
            textColor=colors.HexColor("#0F172A"),
            spaceBefore=2,
            spaceAfter=2,
            backColor=colors.HexColor("#F1F5F9"),
        ),
        "answer": ParagraphStyle(
            "answer",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=10.5,
            leading=14,
            textColor=colors.HexColor("#065F46"),
            spaceBefore=3,
            spaceAfter=6,
            leftIndent=4,
        ),
        "note": ParagraphStyle(
            "note",
            parent=base["Normal"],
            fontName="Helvetica-Oblique",
            fontSize=9,
            leading=12,
            textColor=colors.HexColor("#475569"),
            spaceAfter=4,
        ),
        "footer": ParagraphStyle(
            "footer",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#64748B"),
        ),
        "table_cell": ParagraphStyle(
            "table_cell",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=9.5,
            leading=12,
            alignment=TA_CENTER,
        ),
        "table_head": ParagraphStyle(
            "table_head",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=9.5,
            leading=12,
            alignment=TA_CENTER,
            textColor=colors.white,
        ),
    }
    return styles


def hr():
    return HRFlowable(
        width="100%",
        thickness=1,
        color=colors.HexColor("#0B2E4A"),
        spaceBefore=2,
        spaceAfter=8,
    )


def soft_hr():
    return HRFlowable(
        width="100%",
        thickness=0.5,
        color=colors.HexColor("#94A3B8"),
        spaceBefore=4,
        spaceAfter=6,
    )


def answer_box(text, styles):
    data = [[Paragraph(text, styles["answer"])]]
    t = Table(data, colWidths=[17.2 * cm])
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#ECFDF5")),
                ("BOX", (0, 0), (-1, -1), 0.8, colors.HexColor("#059669")),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    return t


def section_banner(title, styles):
    data = [[Paragraph(title, ParagraphStyle(
        "banner",
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=15,
        textColor=colors.white,
        alignment=TA_LEFT,
    ))]]
    t = Table(data, colWidths=[17.2 * cm])
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#0B2E4A")),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ]
        )
    )
    return t


def build_pdf(path: Path):
    styles = make_styles()
    doc = SimpleDocTemplate(
        str(path),
        pagesize=A4,
        leftMargin=1.9 * cm,
        rightMargin=1.9 * cm,
        topMargin=1.6 * cm,
        bottomMargin=1.6 * cm,
        title="BS131 7th Week Exam — Model Answer",
        author="Model Answer",
        subject="Introduction to Navigation BS131",
    )

    story = []

    # Cover / header
    story.append(Paragraph(
        "ARAB ACADEMY FOR SCIENCE, TECHNOLOGY &amp; MARITIME TRANSPORT",
        styles["cover_sub"],
    ))
    story.append(Paragraph(
        "College of Maritime Transport &amp; Technology — Nautical Department",
        styles["cover_sub"],
    ))
    story.append(Spacer(1, 6))
    story.append(Paragraph("MODEL ANSWER", styles["cover_title"]))
    story.append(Paragraph(
        "Introduction to Navigation (BS131) — 7th Week Exam",
        styles["cover_sub"],
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "Date: 06 April 2025 &nbsp;&nbsp;|&nbsp;&nbsp; Duration: 1 Hour &nbsp;&nbsp;|&nbsp;&nbsp; Total: 20 Marks",
        styles["meta"],
    ))
    story.append(Paragraph(
        "Detailed worked solutions with rules, intermediate steps, and final answers",
        styles["meta"],
    ))
    story.append(Spacer(1, 4))
    story.append(hr())

    # ===================== Q1 =====================
    story.append(section_banner("Question (1) — 7 Marks &nbsp;&nbsp;|&nbsp;&nbsp; CLO (1), (2) · PLO (a), (d)", styles))
    story.append(Spacer(1, 8))
    story.append(Paragraph("A) Complete the following sentences", styles["h2"]))

    story.append(Paragraph("<b>1-a.</b> Parallel of latitude is a small circle, the plane of which is parallel to the plane of ……………", styles["body"]))
    story.append(Paragraph("A parallel of latitude is formed by the intersection of the Earth with a plane parallel to the equatorial plane. Therefore every parallel lies parallel to the equator.", styles["step"]))
    story.append(answer_box("Answer: the Equator", styles))

    story.append(Paragraph("<b>1-b.</b> Rhumb line is the line on the earth's surface which cuts all …………… at the same angle.", styles["body"]))
    story.append(Paragraph("By definition, a rhumb line (loxodrome) maintains a constant true course, so it intersects every meridian at the same angle.", styles["step"]))
    story.append(answer_box("Answer: Meridians (meridians of longitude)", styles))

    story.append(Paragraph("<b>1-c.</b> Meridians are semi great circles joining …………… and are perpendicular to the equator.", styles["body"]))
    story.append(Paragraph("Each meridian is a semi-great circle running from the North Pole to the South Pole and cutting the equator at 90°.", styles["step"]))
    story.append(answer_box("Answer: the North and South Poles (the poles)", styles))

    story.append(soft_hr())
    story.append(Paragraph("B) Position calculations", styles["h2"]))
    story.append(Paragraph("<b>B-1.</b> Calculate D.Lat and D.Long between Pos. A and Pos. B", styles["body"]))
    story.append(Paragraph("Pos. A = 28° 30.8′ S , 057° 28.6′ W", styles["step"]))
    story.append(Paragraph("Pos. B = 29° 42.6′ N , 069° 33.4′ W", styles["step"]))
    story.append(Spacer(1, 3))
    story.append(Paragraph("<b>Difference of Latitude (D.Lat)</b>", styles["body"]))
    story.append(Paragraph("Sign convention used: North (+), South (−).", styles["note"]))
    story.append(Paragraph("Lat A = −28° 30.8′ &nbsp;&nbsp; Lat B = +29° 42.6′", styles["formula"]))
    story.append(Paragraph("D.Lat = Lat B − Lat A = 29° 42.6′ − (−28° 30.8′) = 29° 42.6′ + 28° 30.8′", styles["formula"]))
    story.append(Paragraph("D.Lat = 58° 13.4′ North &nbsp;(vessel changes latitude northward from A to B)", styles["formula"]))
    story.append(Spacer(1, 3))
    story.append(Paragraph("<b>Difference of Longitude (D.Long)</b>", styles["body"]))
    story.append(Paragraph("Both longitudes are West; Pos. B is further west than Pos. A.", styles["note"]))
    story.append(Paragraph("D.Long = 069° 33.4′ W − 057° 28.6′ W = 012° 04.8′ West", styles["formula"]))
    story.append(answer_box(
        "Final Answer (B-1): &nbsp; D.Lat = 58° 13.4′ N &nbsp;&nbsp;|&nbsp;&nbsp; D.Long = 12° 04.8′ W",
        styles,
    ))

    story.append(Paragraph("<b>B-2.</b> Find the coordinates of the final position", styles["body"]))
    story.append(Paragraph("Pos. A = 33° 24.8′ N , 172° 15.6′ E", styles["step"]))
    story.append(Paragraph("D.Lat = 22° 56.7′ S &nbsp;&nbsp; D.Long = 011° 57.8′ E", styles["step"]))
    story.append(Spacer(1, 3))
    story.append(Paragraph("<b>Final Latitude</b>", styles["body"]))
    story.append(Paragraph("Final Lat = 33° 24.8′ N − 22° 56.7′ = 10° 28.1′ N", styles["formula"]))
    story.append(Paragraph("<b>Final Longitude</b>", styles["body"]))
    story.append(Paragraph("Final Long (raw) = 172° 15.6′ E + 011° 57.8′ E = 184° 13.4′ E", styles["formula"]))
    story.append(Paragraph(
        "Longitude cannot exceed 180°. Convert the excess over 180° to West longitude:",
        styles["step"],
    ))
    story.append(Paragraph("184° 13.4′ E = (360° − 184° 13.4′) W = 175° 46.6′ W", styles["formula"]))
    story.append(Paragraph("Alternatively: excess east of 180° is 4° 13.4′, so West = 180° − 4° 13.4′ = 175° 46.6′ W.", styles["note"]))
    story.append(answer_box(
        "Final Answer (B-2): &nbsp; 10° 28.1′ N , 175° 46.6′ W",
        styles,
    ))

    # ===================== Q2 =====================
    story.append(Spacer(1, 8))
    story.append(section_banner("Question (2) — 6 Marks &nbsp;&nbsp;|&nbsp;&nbsp; CLO (3), (4), (6) · PLO (a), (d)", styles))
    story.append(Spacer(1, 8))
    story.append(Paragraph("A) Extract the following values from the figure", styles["h2"]))
    story.append(Paragraph(
        "From the printed diagram: Magnetic North (M.N) lies <b>6° West</b> of True North (T.N); "
        "Compass North (C.N) lies <b>2° East</b> of T.N; the heading arc from C.N is <b>085°</b>; "
        "the lighthouse bearing arc from T.N is <b>122°</b>.",
        styles["body"],
    ))

    story.append(Paragraph("<b>1) Variation</b>", styles["body"]))
    story.append(Paragraph("Variation is the angle between True North and Magnetic North.", styles["step"]))
    story.append(Paragraph("M.N is 6° to the West of T.N ⇒ Variation = 6° W", styles["formula"]))
    story.append(answer_box("Variation = 6° W", styles))

    story.append(Paragraph("<b>2) Total Compass Error</b>", styles["body"]))
    story.append(Paragraph("Total Compass Error (C.E.) is the angle between True North and Compass North.", styles["step"]))
    story.append(Paragraph("C.N is 2° to the East of T.N ⇒ Total C.E. = 2° E", styles["formula"]))
    story.append(Paragraph("Check rule: <i>Error East, Compass Least</i> — compass courses will be less than true courses.", styles["note"]))
    story.append(answer_box("Total Compass Error = 2° E", styles))

    story.append(Paragraph("<b>3) Compass Course</b>", styles["body"]))
    story.append(Paragraph("The figure labels the course arc from Compass North to the ship’s heading as 085°.", styles["step"]))
    story.append(answer_box("Compass Course = 085° C", styles))

    story.append(Paragraph("<b>4) True Course</b>", styles["body"]))
    story.append(Paragraph("Apply total compass error (Error East → add to compass to obtain true):", styles["step"]))
    story.append(Paragraph("True Course = Compass Course + C.E. (E) = 085° + 2° = 087° T", styles["formula"]))
    story.append(Paragraph("Cross-check via Magnetic Course:", styles["note"]))
    story.append(Paragraph("C.E. = Var + Dev ⇒ +2° = (−6°) + Dev ⇒ Dev = 8° E", styles["formula"]))
    story.append(Paragraph("Mag. Course = Comp. Course + Dev (E) = 085° + 8° = 093° M", styles["formula"]))
    story.append(Paragraph("True Course = Mag. Course − Var (W) = 093° − 6° = 087° T ✓", styles["formula"]))
    story.append(answer_box("True Course = 087° T", styles))

    story.append(Paragraph("<b>5) True Bearing</b>", styles["body"]))
    story.append(Paragraph("The figure labels the bearing arc from True North to the lighthouse line as 122°.", styles["step"]))
    story.append(answer_box("True Bearing = 122° T", styles))

    story.append(Paragraph("<b>6) Relative Bearing</b>", styles["body"]))
    story.append(Paragraph("Relative bearing = True Bearing − True Course (starboard / Green if positive).", styles["step"]))
    story.append(Paragraph("Relative Bearing = 122° − 087° = 035° Green (Starboard)", styles["formula"]))
    story.append(answer_box("Relative Bearing = 035° Green (to Starboard)", styles))

    # Summary table for Q2A
    story.append(Paragraph("Summary of extracted / calculated values", styles["h2"]))
    q2_data = [
        [Paragraph(x, styles["table_head"]) for x in ["Quantity", "Value"]],
        [Paragraph("Variation", styles["table_cell"]), Paragraph("6° W", styles["table_cell"])],
        [Paragraph("Total Compass Error", styles["table_cell"]), Paragraph("2° E", styles["table_cell"])],
        [Paragraph("Compass Course", styles["table_cell"]), Paragraph("085° C", styles["table_cell"])],
        [Paragraph("True Course", styles["table_cell"]), Paragraph("087° T", styles["table_cell"])],
        [Paragraph("True Bearing", styles["table_cell"]), Paragraph("122° T", styles["table_cell"])],
        [Paragraph("Relative Bearing", styles["table_cell"]), Paragraph("035° Green", styles["table_cell"])],
    ]
    q2_table = Table(q2_data, colWidths=[9 * cm, 8.2 * cm])
    q2_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0B2E4A")),
                ("BACKGROUND", (0, 1), (-1, 1), colors.HexColor("#F8FAFC")),
                ("BACKGROUND", (0, 3), (-1, 3), colors.HexColor("#F8FAFC")),
                ("BACKGROUND", (0, 5), (-1, 5), colors.HexColor("#F8FAFC")),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#94A3B8")),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    story.append(q2_table)

    story.append(Spacer(1, 10))
    story.append(Paragraph("B) Insert the appropriate term (Gnomonic Projection — North Polar Aspect)", styles["h2"]))
    story.append(Paragraph(
        "On a gnomonic chart a straight line is a <b>great-circle track</b>. The Seattle–London track shows "
        "an initial course near Seattle of about <b>029°</b> and a final course near London of about <b>129°</b>. "
        "The three marked points on the track are identified as follows:",
        styles["body"],
    ))
    story.append(Paragraph("1 → point near departure / start of the GC track → <b>Initial Course</b>", styles["step"]))
    story.append(Paragraph("2 → highest-latitude point of the great circle (nearest the pole) → <b>Vertex</b>", styles["step"]))
    story.append(Paragraph("3 → point near arrival / end of the GC track → <b>Final Course</b>", styles["step"]))
    story.append(answer_box(
        "1. Initial Course (Initial Great Circle Course)&nbsp;&nbsp;&nbsp;"
        "2. Vertex&nbsp;&nbsp;&nbsp;"
        "3. Final Course (Final Great Circle Course)",
        styles,
    ))
    story.append(Paragraph(
        "Note: Intermediate open circles at successive meridians are also the transfer waypoints used when converting the GC track to rhumb-line legs on a Mercator chart.",
        styles["note"],
    ))

    # ===================== Q3 =====================
    story.append(Spacer(1, 8))
    story.append(section_banner("Question (3) — 7 Marks &nbsp;&nbsp;|&nbsp;&nbsp; CLO (3), (6) · PLO (a), (d)", styles))
    story.append(Spacer(1, 8))
    story.append(Paragraph("A) Fill in the missed values of the following table", styles["h2"]))
    story.append(Paragraph(
        "Rule used (Compass ↔ Magnetic): &nbsp; Mag. Course = Comp. Course ± Deviation, "
        "where <b>East deviation is added</b> to compass to obtain magnetic, and <b>West deviation is subtracted</b> "
        "(equivalently: Deviation East ⇒ Compass Least).",
        styles["body"],
    ))

    story.append(Paragraph("<b>Row 1:</b> C.Course = 155°, Dev. = 3° W, Mag.Course = ?", styles["body"]))
    story.append(Paragraph("Mag. Course = 155° − 3° (W) = 152° M", styles["formula"]))

    story.append(Paragraph("<b>Row 2:</b> Dev. = 5° E, Mag.Course = 273°, C.Course = ?", styles["body"]))
    story.append(Paragraph("Comp. Course = 273° − 5° (E) = 268° C", styles["formula"]))
    story.append(Paragraph("Check: 268° + 5° E = 273° M ✓", styles["note"]))

    filled = [
        [Paragraph(x, styles["table_head"]) for x in ["", "C.Course", "Dev.", "Mag.Course"]],
        [
            Paragraph("1", styles["table_cell"]),
            Paragraph("155°", styles["table_cell"]),
            Paragraph("3° W", styles["table_cell"]),
            Paragraph("<b>152° M</b>", styles["table_cell"]),
        ],
        [
            Paragraph("2", styles["table_cell"]),
            Paragraph("<b>268° C</b>", styles["table_cell"]),
            Paragraph("5° E", styles["table_cell"]),
            Paragraph("273°", styles["table_cell"]),
        ],
    ]
    ft = Table(filled, colWidths=[2.2 * cm, 5 * cm, 5 * cm, 5 * cm])
    ft.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0B2E4A")),
                ("BACKGROUND", (3, 1), (3, 1), colors.HexColor("#D1FAE5")),
                ("BACKGROUND", (1, 2), (1, 2), colors.HexColor("#D1FAE5")),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#94A3B8")),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    story.append(Spacer(1, 4))
    story.append(ft)
    story.append(Spacer(1, 6))
    story.append(answer_box("Row 1 Mag.Course = 152° M &nbsp;&nbsp;|&nbsp;&nbsp; Row 2 C.Course = 268° C", styles))

    story.append(Paragraph("B) Relative / True bearings", styles["h2"]))
    story.append(Paragraph(
        "<b>B-1.</b> T.Co = 023°, Relative bearing of lighthouse = 045° <b>Red</b>. Find T.Bg.",
        styles["body"],
    ))
    story.append(Paragraph(
        "Convention: <b>Red = Port (left)</b> → subtract relative bearing from the ship’s true course. "
        "<b>Green = Starboard (right)</b> → add.",
        styles["note"],
    ))
    story.append(Paragraph("T.Bg = T.Co − Rel.Bg (Red) = 023° − 045° = −022°", styles["formula"]))
    story.append(Paragraph("Normalize to the 000°–360° range: −022° + 360° = 338°", styles["formula"]))
    story.append(answer_box("True Bearing of the lighthouse = 338° T", styles))

    story.append(Paragraph(
        "<b>B-2.</b> T.Co = 111°, True bearing of lighthouse = 140°. Find Relative bearing.",
        styles["body"],
    ))
    story.append(Paragraph("Relative Bearing = T.Bg − T.Co = 140° − 111° = 029°", styles["formula"]))
    story.append(Paragraph("Positive result ⇒ object is on the starboard side ⇒ Green.", styles["step"]))
    story.append(answer_box("Relative Bearing = 029° Green (Starboard)", styles))

    story.append(Paragraph("C) Compass &amp; Gyro errors", styles["h2"]))
    story.append(Paragraph(
        "Given: True Course = 333° T &nbsp;|&nbsp; Compass Course = 322° C &nbsp;|&nbsp; "
        "Gyro Course = 335° &nbsp;|&nbsp; Deviation = 5° E",
        styles["body"],
    ))

    story.append(Paragraph("<b>C-1. Total Compass Error</b>", styles["body"]))
    story.append(Paragraph("C.E. = True Course − Compass Course = 333° − 322° = 11°", styles["formula"]))
    story.append(Paragraph("Compass is less than True ⇒ Error is Easterly (<i>Error East, Compass Least</i>).", styles["step"]))
    story.append(answer_box("Total Compass Error = 11° E", styles))

    story.append(Paragraph("<b>C-2. Variation</b>", styles["body"]))
    story.append(Paragraph("Using signed values (East +, West −): &nbsp; C.E. = Variation + Deviation", styles["step"]))
    story.append(Paragraph("+11° = Variation + (+5°) ⇒ Variation = +6° = 6° E", styles["formula"]))
    story.append(Paragraph("Check:", styles["note"]))
    story.append(Paragraph("Mag. Course = Comp. + Dev (E) = 322° + 5° = 327° M", styles["formula"]))
    story.append(Paragraph("True Course = Mag. + Var (E) = 327° + 6° = 333° T ✓", styles["formula"]))
    story.append(answer_box("Variation = 6° E", styles))

    story.append(Paragraph("<b>C-3. Gyro Error</b>", styles["body"]))
    story.append(Paragraph("Gyro Error = Gyro Course − True Course = 335° − 333° = 2°", styles["formula"]))
    story.append(Paragraph("Gyro reading is greater than true ⇒ Gyro is <b>High</b> by 2°.", styles["step"]))
    story.append(answer_box("Gyro Error = 2° High (2° H)", styles))

    story.append(Paragraph("<b>C-4. Compass bearing &amp; Gyro bearing if True Bearing = 359° T</b>", styles["body"]))
    story.append(Paragraph("Apply the same errors found above (errors are constant for the given heading situation):", styles["step"]))
    story.append(Paragraph("Compass Bearing = True Bearing − C.E. (E) = 359° − 11° = 348° C", styles["formula"]))
    story.append(Paragraph("Gyro Bearing = True Bearing + Gyro Error (High) = 359° + 2° = 361° ≡ 001° G", styles["formula"]))
    story.append(answer_box(
        "Compass Bearing = 348° C &nbsp;&nbsp;|&nbsp;&nbsp; Gyro Bearing = 001° G",
        styles,
    ))

    # Final summary
    story.append(Spacer(1, 10))
    story.append(section_banner("Quick Reference — Final Answers Only", styles))
    story.append(Spacer(1, 8))

    summary = [
        [Paragraph(x, styles["table_head"]) for x in ["Item", "Final Answer"]],
        [Paragraph("Q1-A a / b / c", styles["table_cell"]),
         Paragraph("Equator / Meridians / North &amp; South Poles", styles["table_cell"])],
        [Paragraph("Q1-B1 D.Lat / D.Long", styles["table_cell"]),
         Paragraph("58° 13.4′ N / 12° 04.8′ W", styles["table_cell"])],
        [Paragraph("Q1-B2 Final Position", styles["table_cell"]),
         Paragraph("10° 28.1′ N , 175° 46.6′ W", styles["table_cell"])],
        [Paragraph("Q2-A (Var / CE / C.Co / T.Co / T.Bg / Rel)", styles["table_cell"]),
         Paragraph("6°W / 2°E / 085°C / 087°T / 122°T / 035°G", styles["table_cell"])],
        [Paragraph("Q2-B Terms 1 / 2 / 3", styles["table_cell"]),
         Paragraph("Initial Course / Vertex / Final Course", styles["table_cell"])],
        [Paragraph("Q3-A Mag / Comp", styles["table_cell"]),
         Paragraph("152° M / 268° C", styles["table_cell"])],
        [Paragraph("Q3-B1 T.Bg", styles["table_cell"]),
         Paragraph("338° T", styles["table_cell"])],
        [Paragraph("Q3-B2 Rel.Bg", styles["table_cell"]),
         Paragraph("029° Green", styles["table_cell"])],
        [Paragraph("Q3-C CE / Var / GE", styles["table_cell"]),
         Paragraph("11°E / 6°E / 2° High", styles["table_cell"])],
        [Paragraph("Q3-C4 Comp.Bg / Gyro.Bg", styles["table_cell"]),
         Paragraph("348° C / 001° G", styles["table_cell"])],
    ]
    st = Table(summary, colWidths=[7.2 * cm, 10 * cm])
    st.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0B2E4A")),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F1F5F9")]),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#94A3B8")),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    story.append(st)

    story.append(Spacer(1, 14))
    story.append(hr())
    story.append(Paragraph(
        "End of Model Answer — Introduction to Navigation (BS131) · 7th Week Exam · 20 Marks",
        styles["footer"],
    ))
    story.append(Paragraph(
        "Rules applied: Cadet (Compass Add East True) · Error East/Compass Least · Red = Port / Green = Starboard · Gyro High/Low",
        styles["footer"],
    ))

    def add_page_number(canvas, doc_):
        canvas.saveState()
        page = canvas.getPageNumber()
        canvas.setFont("Helvetica", 8)
        canvas.setFillColor(colors.HexColor("#64748B"))
        canvas.drawCentredString(
            A4[0] / 2,
            1.0 * cm,
            f"BS131 Model Answer  ·  Page {page}",
        )
        canvas.restoreState()

    doc.build(story, onFirstPage=add_page_number, onLaterPages=add_page_number)
    return path


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    ARTIFACTS.mkdir(parents=True, exist_ok=True)
    primary = OUT_DIR / PDF_NAME
    build_pdf(primary)
    artifact = ARTIFACTS / PDF_NAME
    artifact.write_bytes(primary.read_bytes())
    print(f"Wrote {primary}")
    print(f"Wrote {artifact}")
    print(f"Size: {primary.stat().st_size} bytes")


if __name__ == "__main__":
    main()
