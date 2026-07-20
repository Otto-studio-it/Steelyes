from __future__ import annotations

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    ListFlowable,
    ListItem,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

BASE = Path("/Volumes/SSDRubb/Steelyes/docs/frontend/gate-missing-data")
OUT = BASE / "Steelyes_Gate_Missing_Data_Master_Report.pdf"


def esc(text: str) -> str:
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


def markup(text: str) -> str:
    text = esc(text)
    text = text.replace("&lt;b&gt;", "")
    text = text.replace("&lt;/b&gt;", "")
    text = text.replace("&lt;br/&gt;", " ")
    text = text.replace("&lt;br&gt;", " ")
    text = text.replace("&lt;font", "")
    text = text.replace("&lt;/font&gt;", "")
    text = text.replace("&lt;code&gt;", "`")
    text = text.replace("&lt;/code&gt;", "`")
    text = text.replace("&gt;", "")
    return text


def P(text: str, style: ParagraphStyle) -> Paragraph:
    return Paragraph(markup(text), style)


def bullets(items: list[str], style: ParagraphStyle) -> ListFlowable:
    return ListFlowable(
        [ListItem(P(item, style)) for item in items],
        bulletType="bullet",
        start="circle",
        leftPadding=10,
        bulletFontName="Helvetica",
        bulletFontSize=7,
        bulletOffsetY=2,
        bulletDedent=4,
    )


gates = [
    {
        "key": "double_swing",
        "title": "Double Swing",
        "pdf_questions": 22,
        "status": "Più documentato",
        "status_class": "ok",
        "confirmed": [
            "Famiglia principale già confermata: due ante a battente con stile Traditional Victorian e variante Composite Boards.",
            "Banda prezzi già presente nei brief: manuale da GBP 1800, automatizzato da GBP 3800 per Victorian e Composite Boards.",
            "Libreria foto già separata: foto 02, 03 e 04 sono il riferimento Victorian; foto 01 è una variante composite + sliding da non confondere con il caso base.",
            "Le opzioni decorative già note includono middle bar, top railheads, dog bars, dog_bar_railheads, arched_top, circles, bushes e spirals.",
        ],
        "mandatory": [
            "Significato esatto di <code>widthMm</code>: solo luce netta oppure luce netta più pali/pilastri.",
            "Significato esatto di <code>heightMm</code>: solo corpo rettangolare oppure corpo più arco.",
            "Se le bande 1800/1900 mm e 900/1000 mm sono range reali oppure preset di riferimento.",
            "Sezione esatta del tubo di telaio esterno.",
            "Numero esatto di rail orizzontali e interasse reale delle barre verticali.",
            "Geometria esatta del gruppo centrale: piastra latch, latch semplice o combinazione dei due.",
            "Posizione cerniere e tolleranza laterale reale per ciascuna anta.",
            "Target di ground clearance.",
            "Mappatura reale di top bands, basket twist, spear row e cerchi rispetto ai nomi catalogo.",
            "Se <code>dog_bars</code> e <code>dog_bar_railheads</code> sono opzioni di produzione vere oppure solo etichette descrittive.",
            "Se <code>arched_top</code> è valido sempre o solo entro certe larghezze.",
            "Se il prezzo e la logica dei Composite Boards sono identici ai Victorian oppure richiedono un infill differente.",
        ],
        "useful": [
            "Scelta della foto baseline finale per la preview 2D.",
            "Decisione se mostrare i brick pillars di default o solo il cancello.",
            "Conferma del target visivo 70/80% per singola variante decorativa.",
            "Precisazione se i railheads devono essere conteggiati come finials su ogni picket o come set ridotto.",
        ],
    },
    {
        "key": "single_swing",
        "title": "Single Swing",
        "pdf_questions": 9,
        "status": "Chiaro ma incompleto",
        "status_class": "warn",
        "confirmed": [
            "Famiglia a un solo battente, con versione Traditional Victorian e Composite Boards.",
            "Banda prezzi già dichiarata: manuale da GBP 850 / 750 e automatizzato da GBP 2700.",
            "La foto 02 è il riferimento Victorian principale; la foto 04 è il riferimento composite; le foto 01 e 03 sono sliding e non vanno lette come single swing.",
            "La versione Victorian usa la stessa grammatica decorativa generale del double swing, ma in forma a singola anta.",
        ],
        "mandatory": [
            "Regola esatta della larghezza della singola anta.",
            "Significato di <code>widthMm</code>: solo anta oppure luce complessiva con allowances ai pali.",
            "Default di fabbrica per il lato cerniera.",
            "Default di fabbrica per il lato di chiusura / latch.",
            "Se il layout delle rail viene riusato identico dal double swing.",
            "Se la logica di pali e pilastri viene riusata identica dal double swing.",
            "Se il set decorativo Victorian è identico oppure ridotto rispetto al double swing.",
            "Se <code>arched_top</code> è sempre valido o solo su alcune larghezze.",
            "Se la preview deve mostrare solo il battente o anche un contesto minimo di supporto.",
        ],
        "useful": [
            "Quale immagine deve essere la baseline grafica definitiva tra foto 02 e foto 04 per la resa stilistica.",
            "Se la preview deve enfatizzare maggiormente il lato cerniere o il lato chiusura.",
        ],
    },
    {
        "key": "tracked_sliding",
        "title": "Tracked Sliding",
        "pdf_questions": 9,
        "status": "Buona base meccanica",
        "status_class": "ok",
        "confirmed": [
            "Il sistema è un cancello scorrevole con binario a terra visibile e non un cantilever.",
            "La famiglia è già distinta nelle audit foto e supporta sia una lettura Victorian sia una lettura composite.",
            "La banda prezzi è già presente: manuale da GBP 2200 / automatizzato da GBP 3600.",
            "Le foto 01, 02, 04 e 06 sono lette come Victorian + track; le foto 03 e 05 come composite + track.",
        ],
        "mandatory": [
            "Tipo esatto di track visibile: embedded, surface-mounted o altra soluzione.",
            "Posizione esatta del track rispetto alla luce di passaggio.",
            "Lunghezza del track rispetto alla luce netta.",
            "Proporzioni reali del corpo pannello per la versione Victorian.",
            "Regola di visibilità del motore nella preview.",
            "Regola esatta di runback a cancello aperto.",
            "Quanto delle decorazioni Victorian va riusato da swing e quanto va semplificato.",
            "Se i composite sliding richiedono una struttura pannello diversa dalla versione Victorian.",
            "Se la preview deve enfatizzare il track più del corpo cancello o il contrario.",
        ],
        "useful": [
            "Se nel render tecnico vanno mostrati anche cremagliera, motore e photocell.",
            "Se la preview 3D deve separare track, roller e corpo in mesh indipendenti.",
        ],
    },
    {
        "key": "cantilever_sliding",
        "title": "Cantilever Sliding",
        "pdf_questions": 8,
        "status": "Strutturalmente distinto",
        "status_class": "ok",
        "confirmed": [
            "Il sistema è autoportante e non deve attraversare la luce di passaggio con un binario a terra.",
            "La presenza di coda di controbilanciamento e carrelli a rulli è il tratto distintivo del cantilever.",
            "La banda prezzi è già presente: manuale da GBP 2900 / automatizzato da GBP 4200.",
            "Le foto e la ricerca dimensionale mostrano che il cantilever reale ha una struttura più lunga della luce netta.",
        ],
        "mandatory": [
            "Rapporto esatto della coda / controbilanciamento.",
            "Posizione esatta del support carriage / carrello di sostegno.",
            "Target reale di ground clearance.",
            "Significato di <code>widthMm</code>: luce netta oppure lunghezza totale della struttura.",
            "Quanta struttura di supporto deve essere visibile nella preview 2D/3D.",
            "Se nella luce di passaggio va mostrata una guida a terra oppure nessuna guida.",
            "Se il set decorativo del tracked sliding va riusato integralmente oppure ridotto.",
            "Se il messaggio al cliente deve parlare di sola luce netta oppure di lunghezza totale.",
        ],
        "useful": [
            "Conferma della percentuale di tail usata come standard di produzione.",
            "Eventuale disegno tecnico di installazione da usare come riferimento visivo finale.",
        ],
    },
    {
        "key": "bifolding_double_swing",
        "title": "Bifolding Double Swing",
        "pdf_questions": 7,
        "status": "Meccanismo composto",
        "status_class": "warn",
        "confirmed": [
            "La famiglia è descritta come due ante principali, ciascuna divisa in pannelli pieghevoli, per un totale di quattro pannelli mobili.",
            "La banda prezzi è già presente: manuale da GBP 2500 / automatizzato da GBP 4200.",
            "La larghezza base è già impostata sul range 2900/3000 mm e l’altezza su 900/1000 mm minimo.",
            "La logica generale è quella di uno swing con piega intermedia, non di uno sliding.",
        ],
        "mandatory": [
            "Numero di pannelli per ciascuna anta principale.",
            "Rapporto di piega reale tra pannello esterno e pannello interno.",
            "Rappresentazione corretta della cerniera di folding.",
            "Open-state footprint effettivo.",
            "Se il linguaggio visivo deve essere identico allo swing classico oppure più tecnico/schematico.",
            "Se l’animazione deve mostrare chiaramente tutte e quattro le sezioni mobili oppure mantenere il dettaglio minimo.",
        ],
        "useful": [
            "Vista tecnica dall’alto per spiegare la piega.",
            "Regole anti-collisione tra pannelli durante la chiusura/apertura.",
        ],
    },
    {
        "key": "single_bifolding",
        "title": "Single Bifolding",
        "pdf_questions": 6,
        "status": "Compatto ma ancora da chiudere",
        "status_class": "warn",
        "confirmed": [
            "La famiglia è un singolo battente pieghevole, con due pannelli totali su un solo lato.",
            "La banda prezzi è già presente: manuale da GBP 1900 / automatizzato da GBP 3000.",
            "La larghezza base è già impostata sul range 1500/1600 mm e l’altezza su 900/1000 mm minimo.",
        ],
        "mandatory": [
            "Rapporto di piega esatto tra i due pannelli.",
            "Lato di raccolta del pannello piegato.",
            "Open-state footprint.",
            "Se la logica componente può essere riusata dal bifolding double swing.",
            "Se il fold hinge va mostrato chiaramente o solo in modo schematico.",
            "Se la mano del cancello deve essere parte della configurazione standard.",
        ],
        "useful": [
            "Dettaglio su collisioni con palo e suolo nel movimento completo.",
            "Conferma se il cliente preferisce una resa più tecnica o più commerciale nel preview.",
        ],
    },
    {
        "key": "telescopic_sliding",
        "title": "Telescopic Sliding",
        "pdf_questions": 8,
        "status": "Sequenza multi-pannello",
        "status_class": "warn",
        "confirmed": [
            "La famiglia è un sistema multi-panel scorrevole con sovrapposizione sequenziale.",
            "La banda prezzi è già presente: manuale da GBP 3100 / automatizzato da GBP 4200.",
            "La larghezza base è già impostata sul range 2000/2100 mm e l’altezza sul range 900/1000 mm iniziale.",
            "Il brief conferma il comportamento telescopico ma non ancora la sequenza meccanica precisa.",
        ],
        "mandatory": [
            "Numero esatto di pannelli.",
            "Ordine di sovrapposizione / overlap order.",
            "Stack chiuso.",
            "Stack aperto.",
            "Quanta parte del movimento va resa visibile in 2D.",
            "Se ogni pannello va disegnato come blocco separato.",
            "Se la famiglia deve riusare il linguaggio track di tracked sliding.",
            "Regola esatta della larghezza della famiglia.",
        ],
        "useful": [
            "Identificatore esplicito di lead panel e follower panels.",
            "Timing del movimento e ordine di retrazione da usare nella UI o nell’animazione.",
        ],
    },
    {
        "key": "radius_sliding",
        "title": "Radius Sliding",
        "pdf_questions": 6,
        "status": "Bloccato",
        "status_class": "bad",
        "confirmed": [
            "È la famiglia meno definita e va trattata come provvisoria finché il cliente non la definisce meglio.",
            "La banda prezzi è già presente: manuale da GBP 2500 / automatizzato da GBP 4200.",
            "La larghezza base è già indicata nel range 1600/1700 mm e l’altezza nel range 900/1000 mm.",
        ],
        "mandatory": [
            "Se il termine significa percorso curvo, sommità curva, oppure entrambi.",
            "Se è una sottofamiglia sliding o un prodotto distinto.",
            "Cosa deve mostrare la preview in plan view.",
            "Cosa deve mostrare la preview in elevation.",
            "Regola esatta della larghezza.",
            "Se la famiglia deve restare bloccata fino a una definizione cliente più precisa.",
        ],
        "useful": [
            "Eventuale valore di raggio o segmentazione se il cliente conferma una cinematica curva.",
            "Un folder di deep audit dedicato solo dopo la definizione del significato.",
        ],
    },
]


global_confirmed = [
    "Le tipologie già confermate sono 8: double swing, single swing, tracked sliding, cantilever sliding, bifolding double swing, single bifolding, telescopic sliding e radius sliding.",
    "Le famiglie di stile già confermate sono 2: Traditional Victorian Style e Composite Boards.",
    "Il brief conferma pricing in modalità FROM, manuale e automatizzato, più una logica di aumento prezzo con crescita di larghezza e altezza.",
    "I railing panels sono richiesti come entità figlie configurabili con quantità totale e dimensioni per pannello.",
    "Sono già note le opzioni decorative principali: middle bar, railheads top, dog bars, dog_bar_railheads, arched_top, circles, bushes e spirals.",
    "Esistono audit foto e documenti di appoggio almeno per double_swing, single_swing, tracked_sliding e cantilever_sliding.",
]


global_missing = [
    "Una matrice di compatibilità opzioni x gate type x stile, così da sapere cosa è davvero selezionabile in produzione.",
    "Il catalogo finale dei railheads con prezzi unitari e regole di conteggio.",
    "Le formule esatte di conteggio per railheads, dog bars, circles, bushes e spirals.",
    "La logica prezzi dei railing panels.",
    "Le regole univoche di semantica per widthMm e heightMm, che oggi cambiano tra famiglie.",
    "La definizione finale di radius_sliding, che resta il blocco più forte dell’intero set.",
    "La scelta tra preview schematica, fotografica o foto-like per ogni famiglia.",
]


global_additional = [
    "Default di apertura per swing e bifold: lato cerniera, lato latch e verso di apertura.",
    "Geometria e visibilità dell’hardware di automazione, soprattutto per tracked e cantilever.",
    "Regole di visibilità dei pali, dei pilastri e dei supporti di contesto nella preview.",
    "Specifiche di finitura e di struttura del composito per la famiglia Composite Boards.",
    "Una baseline fotografica per ogni famiglia usata come riferimento grafico finale.",
]


def page_header(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(colors.HexColor("#6b7280"))
    canvas.setFont("Helvetica", 8)
    canvas.drawRightString(A4[0] - 14 * mm, 9 * mm, f"Pagina {doc.page}")
    canvas.restoreState()


def build_styles():
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "title",
            parent=base["Title"],
            fontName="Helvetica-Bold",
            fontSize=24,
            leading=28,
            textColor=colors.HexColor("#0f172a"),
            spaceAfter=3,
        ),
        "title2": ParagraphStyle(
            "title2",
            parent=base["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=16,
            leading=19,
            textColor=colors.HexColor("#0f172a"),
            spaceAfter=2,
        ),
        "subhead": ParagraphStyle(
            "subhead",
            parent=base["Heading3"],
            fontName="Helvetica-Bold",
            fontSize=10.8,
            leading=13,
            textColor=colors.HexColor("#0f172a"),
            spaceAfter=3,
        ),
        "body": ParagraphStyle(
            "body",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=9.2,
            leading=12.0,
            textColor=colors.HexColor("#111827"),
            spaceAfter=1,
        ),
        "small": ParagraphStyle(
            "small",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=8.5,
            leading=10.5,
            textColor=colors.HexColor("#4b5563"),
            spaceAfter=1,
        ),
        "tiny": ParagraphStyle(
            "tiny",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=7.8,
            leading=9,
            textColor=colors.HexColor("#6b7280"),
            spaceAfter=0,
        ),
    }


def summary_table(styles):
    rows = [
        [
            P("<b>Gate</b>", styles["body"]),
            P("<b>Item nel PDF</b>", styles["body"]),
            P("<b>Già confermati</b>", styles["body"]),
            P("<b>Mancanti obbligatori</b>", styles["body"]),
            P("<b>Utili ma non bloccanti</b>", styles["body"]),
            P("<b>Stato</b>", styles["body"]),
        ]
    ]
    for g in gates:
        rows.append(
            [
                [P(g["title"], styles["body"]), P(g["key"], styles["tiny"])],
                P(str(g["pdf_questions"]), styles["body"]),
                P(str(len(g["confirmed"])), styles["body"]),
                P(str(len(g["mandatory"])), styles["body"]),
                P(str(len(g["useful"])), styles["body"]),
                P(g["status"], styles["body"]),
            ]
        )
    table = Table(
        rows,
        colWidths=[40 * mm, 19 * mm, 20 * mm, 27 * mm, 27 * mm, 33 * mm],
        repeatRows=1,
    )
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#f8fafc")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#334155")),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("BOX", (0, 0), (-1, -1), 0.8, colors.HexColor("#dbe3ea")),
                ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#dbe3ea")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ("LEFTPADDING", (0, 0), (-1, -1), 4),
                ("RIGHTPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
    return table


def section_story(g, styles):
    status_fill = {
        "ok": colors.HexColor("#e6f6ea"),
        "warn": colors.HexColor("#fff7db"),
        "bad": colors.HexColor("#fde8e8"),
    }[g["status_class"]]
    status_text = {
        "ok": colors.HexColor("#0f6b2f"),
        "warn": colors.HexColor("#8c5a00"),
        "bad": colors.HexColor("#9f1d1d"),
    }[g["status_class"]]

    head = Table(
        [
            [
                [
                    P("Scheda gate", styles["tiny"]),
                    P(g["title"], styles["title2"]),
                ],
                [
                    Table(
                        [
                            [P("Stato", styles["tiny"]), P(g["status"], styles["body"])],
                            [P("Item PDF", styles["tiny"]), P(str(g["pdf_questions"]), styles["body"])],
                        ],
                        colWidths=[18 * mm, 32 * mm],
                    ),
                ],
            ]
        ],
        colWidths=[140 * mm, 40 * mm],
    )
    head.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
            ]
        )
    )

    status_inner = head._cellvalues[0][1][0]
    status_inner.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), status_fill),
                ("TEXTCOLOR", (0, 0), (-1, -1), status_text),
                ("BOX", (0, 0), (-1, -1), 0.7, colors.HexColor("#dbe3ea")),
                ("INNERGRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#dbe3ea")),
                ("LEFTPADDING", (0, 0), (-1, -1), 4),
                ("RIGHTPADDING", (0, 0), (-1, -1), 4),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )

    left = [P("Già abbiamo", styles["subhead"]), bullets(g["confirmed"], styles["body"])]
    right = [P("Dati obbligatori mancanti", styles["subhead"]), bullets(g["mandatory"], styles["body"])]
    mid = Table([[left, right]], colWidths=[88 * mm, 88 * mm])
    mid.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("BOX", (0, 0), (-1, -1), 0.7, colors.HexColor("#dbe3ea")),
                ("INNERGRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#dbe3ea")),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )

    useful = Table(
        [[P("Dati utili ma non bloccanti", styles["subhead"]), bullets(g["useful"], styles["body"])]],
        colWidths=[55 * mm, 121 * mm],
    )
    useful.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("BOX", (0, 0), (-1, -1), 0.7, colors.HexColor("#dbe3ea")),
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#fbfdff")),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )

    return [head, Spacer(1, 3 * mm), mid, Spacer(1, 3 * mm), useful]


def build_pdf():
    styles = build_styles()
    story = []

    title = Table(
        [[
            [
                P("Steelyes", styles["small"]),
                P("Gate Missing Data Master Report", styles["title"]),
                P(
                    "Analisi unificata dei PDF in docs/frontend/gate-missing-data, più i documenti di supporto su configuratore, audit foto e specifica tecnica.",
                    styles["small"],
                ),
            ]
        ]],
        colWidths=[180 * mm],
    )
    title.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f7fbff")),
                ("BOX", (0, 0), (-1, -1), 0.8, colors.HexColor("#dbe3ea")),
                ("LEFTPADDING", (0, 0), (-1, -1), 9),
                ("RIGHTPADDING", (0, 0), (-1, -1), 9),
                ("TOPPADDING", (0, 0), (-1, -1), 9),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ]
        )
    )
    story.extend(
        [
            title,
            Spacer(1, 4 * mm),
            Table(
                [[
                    P("<b>Data report</b><br/>18 luglio 2026", styles["body"]),
                    P("<b>Copertura analizzata</b><br/>8 PDF gate + brief + checklist + audit", styles["body"]),
                    P(
                        "<b>Esito sintetico</b><br/>Le basi commerciali ci sono, ma mancano ancora semantica, meccanica e catalogo",
                        styles["body"],
                    ),
                ]],
                colWidths=[60 * mm, 60 * mm, 60 * mm],
            ),
            Spacer(1, 4 * mm),
            Table(
                [[
                    P(
                        "<b>Verdetto rapido.</b> Non mancano solo i dati elencati nei PDF di gate-missing-data. I prezzi base e le famiglie principali sono già abbastanza definiti, ma restano aperti i punti che bloccano davvero la chiusura: significato di width/height per famiglia, cinematica per i casi complessi, catalogo decorativo finale, compatibilità e definizione completa di radius_sliding.",
                        styles["body"],
                    )
                ]],
                colWidths=[180 * mm],
            ),
            Spacer(1, 4 * mm),
            P("1. Quello che abbiamo già", styles["title2"]),
            summary_table(styles),
            Spacer(1, 4 * mm),
            Table(
                [
                    [
                        [P("Dati trasversali già chiari", styles["subhead"]), bullets(global_confirmed, styles["body"])],
                        [P("Dati trasversali ancora mancanti", styles["subhead"]), bullets(global_missing, styles["body"])],
                    ]
                ],
                colWidths=[88 * mm, 88 * mm],
            ),
            Spacer(1, 4 * mm),
            Table(
                [[P("Dati aggiuntivi che aiutano molto ma non bloccano il progetto", styles["subhead"]), bullets(global_additional, styles["body"])]],
                colWidths=[70 * mm, 110 * mm],
            ),
            Spacer(1, 4 * mm),
            P(
                "I conteggi per gate sono derivati dai PDF in docs/frontend/gate-missing-data. Le note di conferma e di mancanza sono state consolidate con CLIENT_GATE_DATA_BRIEF.md, CLIENT_GATE_REQUIREMENTS_REFERENCE.md, CONFIGURATOR_GATE_EXECUTION_CHECKLIST.md, steelyes-gate-configurator-technical-spec.md e gli audit in docs/frontend/gate-audits/.",
                styles["small"],
            ),
        ]
    )

    for i, g in enumerate(gates):
        story.append(PageBreak())
        story.extend(section_story(g, styles))

    doc = BaseDocTemplate(
        str(OUT),
        pagesize=A4,
        leftMargin=14 * mm,
        rightMargin=14 * mm,
        topMargin=14 * mm,
        bottomMargin=16 * mm,
        title="Steelyes Gate Missing Data Master Report",
        author="Codex",
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="normal")
    doc.addPageTemplates([PageTemplate(id="main", frames=[frame], onPage=page_header)])
    doc.build(story)
    print(OUT)


if __name__ == "__main__":
    build_pdf()
