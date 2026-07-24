# Steelyes — Specifica Tecnica Finale per Configuratore Cancelli 2D/3D

## Scopo del documento

Questo documento definisce la specifica tecnica di riferimento per progettare il configuratore Steelyes, il motore di pricing, la preview 2D e la futura modellazione 3D dei cancelli e dei pannelli di recinzione. Il contenuto distingue rigorosamente tra dati confermati dal cliente e assunzioni tecniche di settore da tenere come parametri configurabili o da validare prima della produzione. [cite:1][cite:2]

Il brief cliente conferma otto tipologie di cancello, due famiglie stilistiche principali, un insieme di opzioni decorative, logiche di prezzo “FROM GBP” e il requisito di gestire anche i railing panels come componenti parametrici collegati al cancello. [cite:2]

## Stato di affidabilità dei dati

### Dati confermati dal cliente

Sono confermati dal materiale cliente i seguenti elementi: tipologie di cancello, misure iniziali di riferimento, prezzi FROM per versione manuale e automatizzata, distinzione tra Traditional Victorian Style e Composite Boards, opzioni decorative richieste e necessità di associare pannelli di recinzione al cancello. [cite:2]

Sono inoltre confermate le regole commerciali base: i prezzi sono di partenza, l’aumento di altezza aumenta il prezzo, l’aumento di larghezza aumenta il prezzo e le opzioni aggiuntive incrementano il totale. [cite:2]

### Dati non confermati da non trattare come definitivi

Non risultano confermati direttamente dal cliente i dettagli come sezione esatta dei tubolari, spessori standard dei profili, interassi normativi fissi, formule matematiche definitive di conteggio dei railheads, raggi di curvatura numerici, limiti strutturali peso/vento, compatibilità rigide tra opzioni e tipo di cancello, né la geometria di montaggio di tutti i motori. [cite:2]

Questi elementi possono essere modellati come struttura tecnica interna o valori default modificabili, ma non devono essere esposti come specifica definitiva di produzione finché non vengono validati con il cliente o con il costruttore. [cite:1][cite:2]

## Obiettivi funzionali del configuratore

Il configuratore deve consentire la selezione di un solo gate type per sessione di configurazione, la scelta dello stile, la selezione della modalità manuale o automatizzata, l’inserimento di width e height, la gestione delle opzioni decorative, la gestione di più railing panels e la visualizzazione del prezzo totale in formato “FROM GBP”. [cite:2]

La preview deve mostrare almeno il cancello in forma parametrica 2D e, quando possibile, almeno un pannello di recinzione adiacente che erediti lo stile del cancello. Per il futuro 3D, il cliente richiede una somiglianza visiva di circa 70/80% rispetto alle immagini di riferimento, soprattutto per i dettagli decorativi come i railheads. [cite:2]

## Entità principali del dominio

### Gate

Ogni cancello deve essere rappresentato come entità parametrica principale con i campi minimi seguenti:

- `gateType`
- `style`
- `operationMode`
- `widthMm`
- `heightMm`
- `openingSide`
- `openingDirection`
- `automationEnabled`
- `decorativeOptions[]`
- `railingPanels[]`
- `pricingContext`
- `previewContext`
- `validationState`

### Railing panel

Ogni pannello di recinzione deve essere modellato come entità figlia configurabile, con quantità totale e singoli pannelli dotati di altezza e lunghezza. Questa struttura è richiesta esplicitamente dal cliente. [cite:2]

Struttura minima raccomandata:

```json
{
  "quantity": 2,
  "panels": [
    {
      "panelId": 1,
      "heightMm": 1000,
      "lengthMm": 1500
    },
    {
      "panelId": 2,
      "heightMm": 1000,
      "lengthMm": 1800
    }
  ]
}
```

### Decorative option

Ogni opzione decorativa deve avere almeno:

- `optionKey`
- `label`
- `pricingMode`
- `fixedPriceGbp`
- `unitPriceGbp`
- `quantityRule`
- `geometryEffect`
- `styleCompatibility`
- `gateTypeCompatibility`
- `confirmationStatus`

## Catalogo tipologie di cancello

### Elenco ufficiale delle tipologie

Le tipologie confermate dal cliente sono le seguenti: DOUBLE SWING, SINGLE SWING, TRACKED SLIDING, CANTILEVER SLIDING, BIFOLDING DOUBLE SWING, SINGLE BIFOLDING, TELESCOPIC SLIDING e RADIUS SLIDING. [cite:2]

Questa tassonomia deve essere usata come enumerazione ufficiale del sistema, senza aggiungere ulteriori famiglie finché non vengono confermate. [cite:2]

## Scheda tecnica dettagliata per ciascun gate type

### 1. Double Swing

#### Identità tecnica

Il Double Swing è un cancello a battente doppio composto da due ante incernierate ai pilastri laterali. La sua cinematica base è una rotazione di ciascuna anta attorno al proprio asse verticale di cerniera. [cite:2]

#### Dati commerciali confermati

| Stile | Altezza riferimento | Larghezza riferimento | Manuale | Automatico |
|---|---|---:|---:|---:|
| Traditional Victorian Style | 900/1000 mm [cite:2] | 1800/1900 mm [cite:2] | FROM GBP 1800 [cite:2] | FROM GBP 3800 [cite:2] |
| Composite Boards | non distinto nel brief [cite:2] | non distinto nel brief [cite:2] | FROM GBP 1800 [cite:2] | FROM GBP 3800 [cite:2] |

#### Parametri geometrici obbligatori

- `widthMm` = larghezza totale varco
- `heightMm` = altezza complessiva lato massimo visibile
- `leafCount` = 2
- `leftLeafWidthMm`
- `rightLeafWidthMm`
- `meetingGapMm`
- `sideClearanceMm`
- `hingeOffsetMm`
- `frameTopProfile`
- `frameBottomProfile`
- `centerSplitEnabled`

#### Regole cinematiche

- Stato chiuso: entrambe le ante allineate sul piano di chiusura.
- Stato aperto: ogni anta ruota attorno al proprio hinge pivot.
- Il sistema deve supportare `openingDirection = inward | outward`.
- Il sistema deve supportare `openingSide = symmetric | asymmetric` se in futuro le ante non saranno identiche.

#### Requisiti preview 2D

- Vista frontale con due ante specchiate.
- Evidenza della linea di incontro centrale.
- Visualizzazione chiara delle decorazioni replicate su entrambe le ante.

#### Requisiti 3D

- Pivot indipendente per anta sinistra e anta destra.
- Animazione di apertura parametrica per angolo per anta.
- Supporto per eventuale visualizzazione pistoni o motori interrati come layer opzionale, perché il brief non specifica un solo tipo di automazione. [cite:2]

#### Automazione

I cancelli a battente possono essere automatizzati con attuatori dedicati; tuttavia il brief cliente non definisce il tipo esatto di motore da usare come standard. La specifica software deve quindi gestire l’automazione come famiglia tecnica astratta, non come singolo hardware definitivo. [cite:2]

#### Note implementative

Per il pricing, il Double Swing deve usare un prezzo base per stile e modalità, al quale sommare incrementi dimensionali e opzioni. Il sistema non deve calcolare automaticamente una formula strutturale per la divisione delle ante come dato “produttivo” senza conferma del costruttore. [cite:2]

### 2. Single Swing

#### Identità tecnica

Il Single Swing è un cancello a battente singolo con un’unica anta incernierata su un lato. È indicato dal cliente anche per aperture ridotte o uso pedonale. [cite:2]

#### Dati commerciali confermati

| Stile | Altezza riferimento | Larghezza riferimento | Manuale | Automatico |
|---|---|---:|---:|---:|
| Traditional Victorian Style | 900/1000 mm [cite:2] | 800/900 mm [cite:2] | FROM GBP 850 [cite:2] | FROM GBP 2700 [cite:2] |
| Composite Boards | non distinto nel brief [cite:2] | non distinto nel brief [cite:2] | FROM GBP 750 [cite:2] | FROM GBP 2700 [cite:2] |

#### Parametri geometrici obbligatori

- `widthMm`
- `heightMm`
- `leafCount` = 1
- `hingeSide = left | right`
- `openingDirection = inward | outward`
- `latchSide`
- `frameTopProfile`
- `frameBottomProfile`

#### Regole cinematiche

- Rotazione unica attorno all’asse di cerniera.
- L’animazione deve supportare apertura destra o sinistra secondo il lato cerniere.
- L’ingombro di rotazione è fondamentale nella preview tecnica, anche se la misura esatta libera non è stata fornita dal cliente. [cite:2]

#### Requisiti preview 2D/3D

- Visualizzazione chiara del lato cerniere.
- Possibilità di invertire la mano del cancello.
- Decorazioni posizionate secondo singola anta, senza duplicazione speculare.

#### Automazione

Anche qui l’automazione deve restare astratta come “swing operator” finché il cliente non conferma hardware, schema fissaggio e posizione attuatore. [cite:2]

### 3. Tracked Sliding

#### Identità tecnica

Il Tracked Sliding è un cancello scorrevole monoblocco che si muove lateralmente su una guida a terra. Le fonti tecniche descrivono questo tipo come sistema con anta che trasla linearmente, supportata da ruote o rulli e spesso guidata anche da un gruppo superiore anti-ribaltamento. [cite:1]

#### Dati commerciali confermati

| Stile | Altezza riferimento | Larghezza riferimento | Manuale | Automatico |
|---|---|---:|---:|---:|
| Traditional Victorian Style | 900/1000 mm [cite:2] | 2500/2600 mm [cite:2] | FROM GBP 2200 [cite:2] | FROM GBP 3600 [cite:2] |
| Composite Boards | non distinto nel brief [cite:2] | non distinto nel brief [cite:2] | FROM GBP 2200 [cite:2] | FROM GBP 3600 [cite:2] |

#### Parametri geometrici obbligatori

- `widthMm`
- `heightMm`
- `leafCount` = 1
- `slideDirection = left | right`
- `trackVisible = true`
- `trackLengthMm`
- `runbackLengthMm`
- `guidePostOffsetMm`
- `closingPostPosition`

#### Regole cinematiche

- Traslazione lineare pura su asse orizzontale.
- Nessuna rotazione principale dell’anta nel modello standard.
- La corsa di apertura deve essere visualizzata come spostamento dell’intera anta fuori dal varco. [cite:1][cite:2]

#### Componenti tecnici da rappresentare

- Guida a pavimento o track lineare.
- Anta scorrevole completa.
- Possibile guida superiore/anti-ribaltamento come layer tecnico opzionale, perché la letteratura di settore la considera parte tipica del sistema tracked. [cite:1]
- Eventuale motore con cremagliera per versioni automatizzate, senza vincolare marca o kit. [cite:1]

#### Requisiti 3D

- Mesh track separata dalla mesh gate.
- Nodo di movimento per traslazione su asse locale.
- Eventuale cremagliera come sottocomponente.

### 4. Cantilever Sliding

#### Identità tecnica

Il Cantilever Sliding è un cancello scorrevole autoportante che non usa una guida nel varco di passaggio. La sua logica meccanica si basa su una porzione di controbilanciamento posteriore e su carrelli a rulli fissati a una fondazione esterna al varco. [cite:1]

#### Dati commerciali confermati

| Stile | Altezza riferimento | Larghezza riferimento | Manuale | Automatico |
|---|---|---:|---:|---:|
| Traditional Victorian Style | 900/1000 mm [cite:2] | 2500/2600 mm [cite:2] | FROM GBP 2900 [cite:2] | FROM GBP 4200 [cite:2] |
| Composite Boards | non distinto nel brief [cite:2] | non distinto nel brief [cite:2] | FROM GBP 2900 [cite:2] | FROM GBP 4200 [cite:2] |

#### Parametri geometrici obbligatori

- `widthMm`
- `heightMm`
- `clearOpeningMm`
- `totalStructureLengthMm`
- `counterbalanceLengthMm`
- `slideDirection = left | right`
- `carriageBaseLengthMm`
- `groundClearanceMm`
- `supportFrameVisible = true`

#### Regole cinematiche

- Traslazione lineare su asse orizzontale.
- La coda di bilanciamento si muove insieme al corpo principale.
- Nel modello il cancello non deve apparire come semplice tracked sliding senza track: la parte di controbilanciamento è elemento tecnico distintivo e il cliente ha chiesto che la preview 3D la rifletta. [cite:2]

#### Requisiti 3D

- Corpo cancello principale + coda di bilanciamento come singolo gruppo logico.
- Carrelli e supporto esterno modellati come elementi tecnici separati.
- Nessuna guida attraversante il varco pedonale/carrabile. [cite:1]

#### Automazione

Le fonti di settore descrivono di norma automazioni esterne a cremagliera per scorrevoli cantilever, ma il tuo sistema deve mantenere il campo `automationHardwareType` configurabile. [cite:1]

### 5. Bifolding Double Swing

#### Identità tecnica

Il Bifolding Double Swing è composto da due ante principali, ognuna divisa in due pannelli incernierati verticalmente. In totale il sistema gestisce quattro pannelli mobili. [cite:2]

#### Dati commerciali confermati

| Stile | Altezza riferimento | Larghezza riferimento | Manuale | Automatico |
|---|---|---:|---:|---:|
| Traditional Victorian Style | 900/1000 mm min. [cite:2] | 2900/3000 mm [cite:2] | FROM GBP 2500 [cite:2] | FROM GBP 4200 [cite:2] |
| Composite Boards | non distinto nel brief [cite:2] | non distinto nel brief [cite:2] | FROM GBP 2500 [cite:2] | FROM GBP 4200 [cite:2] |

#### Parametri geometrici obbligatori

- `widthMm`
- `heightMm`
- `mainLeafCount` = 2
- `subLeafPerMainLeaf` = 2
- `totalMovingPanels` = 4
- `leftOuterPanelWidthMm`
- `leftInnerPanelWidthMm`
- `rightInnerPanelWidthMm`
- `rightOuterPanelWidthMm`
- `foldAxisOffsets[]`
- `openingDirection = inward | outward`

#### Regole cinematiche

- Ogni anta principale ruota dal pilastro.
- Ogni semi-anta secondaria si ripiega sulla primaria tramite cerniera intermedia.
- Il sistema di animazione deve supportare una catena cinematica con pannello primario e pannello secondario collegati. [cite:2]

#### Riferimenti meccanici utili

Le fonti sui kit bifolding mostrano meccanismi a leve, cerniere e kit nascosti o semi-nascosti, con possibilità di apertura manuale e automatizzata e con tolleranze limitate tra pannelli. Questi riferimenti aiutano a capire il comportamento tecnico, ma non sostituiscono la conferma del sistema costruttivo del cliente. [cite:3]

#### Requisiti preview 2D/3D

- Front view con quattro sezioni leggibili.
- Top view tecnica con rappresentazione della piega.
- Animazione di folding e swing simultanea.
- Verifica collisioni tra pannelli durante la piega.

### 6. Single Bifolding

#### Identità tecnica

Il Single Bifolding è un cancello con una sola anta principale suddivisa in due pannelli incernierati. L’intero pacchetto si piega e ruota su un solo lato del varco. [cite:2]

#### Dati commerciali confermati

| Stile | Altezza riferimento | Larghezza riferimento | Manuale | Automatico |
|---|---|---:|---:|---:|
| Traditional Victorian Style | 900/1000 mm min. [cite:2] | 1500/1600 mm [cite:2] | FROM GBP 1900 [cite:2] | FROM GBP 3000 [cite:2] |
| Composite Boards | non distinto nel brief [cite:2] | non distinto nel brief [cite:2] | FROM GBP 1900 [cite:2] | FROM GBP 3000 [cite:2] |

#### Parametri geometrici obbligatori

- `widthMm`
- `heightMm`
- `leafCount` = 1
- `subLeafCount` = 2
- `hingeSide = left | right`
- `openingDirection = inward | outward`
- `outerPanelWidthMm`
- `innerPanelWidthMm`
- `foldGapMm`

#### Regole cinematiche

- Rotazione dell’anta principale su pilastro.
- Ripiegamento del secondo pannello sul primo.
- Stessa logica di famiglia del Bifolding Double Swing ma applicata a un solo lato. [cite:2][cite:3]

#### Requisiti 3D

- Due pivot principali: hinge sul pilastro e cerniera di folding.
- Gestione collisioni con pilastro e suolo.

### 7. Telescopic Sliding

#### Identità tecnica

Il Telescopic Sliding è un sistema scorrevole multi-panel dove due o più ante scorrono in sequenza e si sovrappongono, così da ridurre lo spazio laterale necessario rispetto a uno scorrevole monoblocco. Questo comportamento generale è coerente con la letteratura sui cancelli sliding multi-panel, anche se il cliente non ha ancora definito il numero esatto di pannelli e il rapporto di trascinamento. [cite:1][cite:2]

#### Dati commerciali confermati

| Stile | Altezza riferimento | Larghezza riferimento | Manuale | Automatico |
|---|---|---:|---:|---:|
| Traditional Victorian Style | 900/1000 mm start [cite:2] | 2000/2100 mm [cite:2] | FROM GBP 3100 [cite:2] | FROM GBP 4200 [cite:2] |
| Composite Boards | non distinto nel brief [cite:2] | non distinto nel brief [cite:2] | FROM GBP 3100 [cite:2] | FROM GBP 4200 [cite:2] |

#### Parametri geometrici obbligatori

- `widthMm`
- `heightMm`
- `panelCount`
- `slideDirection = left | right`
- `panelOverlapDepthMm`
- `runbackLengthMm`
- `trackCount`
- `leadPanelId`
- `followerPanelIds[]`

#### Regole cinematiche

- Ogni pannello trasla lungo il proprio percorso.
- I pannelli devono impacchettarsi in sequenza.
- L’ordine di retrazione deve essere esplicitamente definito nel dataset di configurazione, non assunto in codice senza dato di prodotto. [cite:2]

#### Requisiti preview 2D/3D

- Front view con divisioni pannelli.
- Top view o layer tecnico per far capire la sovrapposizione.
- Stato aperto con pannelli “stacked”.

### 8. Radius Sliding

#### Identità tecnica

Il Radius Sliding è la tipologia meno definita nel brief e richiede chiarimento prioritario. Il cliente la descrive come “curved / radius sliding gate” e chiede che la curva superiore sia rappresentata nella preview, ma non chiarisce se il termine indichi un cancello che scorre su percorso curvo oppure un cancello scorrevole con profilo superiore arcuato. [cite:2]

#### Dati commerciali confermati

| Stile | Altezza riferimento | Larghezza riferimento | Manuale | Automatico |
|---|---|---:|---:|---:|
| Traditional Victorian Style | 900/1000 mm [cite:2] | 1600/1700 mm [cite:2] | FROM GBP 2500 [cite:2] | FROM GBP 4200 [cite:2] |
| Composite Boards | non distinto nel brief [cite:2] | non distinto nel brief [cite:2] | FROM GBP 2500 [cite:2] | FROM GBP 4200 [cite:2] |

#### Parametri geometrici minimi provvisori

- `widthMm`
- `heightMm`
- `slideDirection = left | right`
- `topProfileShape = straight | arched | customCurve`
- `pathType = straight | curved`
- `radiusValueMm` se applicabile
- `segmentCount` se applicabile

#### Stato progettuale raccomandato

Questa tipologia deve essere inserita nel sistema con `technicalStatus = provisional`. Fino a chiarimento del cliente, il configuratore non deve imporre una cinematica unica. [cite:2]

## Stili costruttivi

### Traditional Victorian Style

Questo stile deve supportare vertical bars, railheads, middle bar, dog bars, circles, bushes, spirals e opzione arched top, in coerenza col brief cliente. [cite:2]

Dal punto di vista software, lo stile deve essere un insieme di regole geometriche e di compatibilità, non solo una skin visiva. Le decorazioni devono essere attivabili/disattivabili come moduli indipendenti. [cite:2]

### Composite Boards

Il brief conferma la presenza di una variante Composite Boards per tutte le tipologie elencate, ma non fornisce ancora dettagli definitivi su sezione del telaio, spessore doghe, orientamento, interspazi o rinforzi. [cite:2]

Per questo motivo, il sistema deve prevedere lo stile Composite come famiglia a pannello pieno o semi-pieno, con campi strutturali configurabili via admin. Non devono essere hardcodati spessori o layout fino a conferma. [cite:2]

## Opzioni decorative: specifica tecnica completa

### 1. Middle bar

- Nome interno: `middle_bar`
- Descrizione: barra orizzontale che divide la lunghezza visiva del cancello in due parti. [cite:2]
- Prezzo extra confermato: GBP 275. [cite:2]
- Tipo pricing: `fixed`
- Effetto geometrico: inserisce un traverso orizzontale supplementare.
- Dati mancanti: confermare se il prezzo è per cancello completo o per anta. [cite:2]

### 2. Top railheads

- Nome interno: `top_railheads`
- Descrizione: cap decorative solo sulla parte superiore del cancello. [cite:2]
- Prezzo: dipendente dalla variante scelta; il cliente ha indicato esempi da GBP 1.25 a GBP 25 per railhead. [cite:2]
- Tipo pricing: `unit_variable`
- Effetto geometrico: istanzia una testa decorativa sopra ciascuna barra verticale interessata.
- Dati mancanti: catalogo finale varianti, prezzo esatto per variante, formula conteggio, compatibilità per gate type. [cite:2]

### 3. Dog bars

- Nome interno provvisorio: `dog_bars`
- Descrizione: doppia densità di barre nella parte bassa del cancello. [cite:2]
- Prezzo base confermato: GBP 75 standard. [cite:2]
- Incremento aggiuntivo confermato: GBP 4.50 per ogni barra aumentando la larghezza. [cite:2]
- Tipo pricing: `fixed_plus_width_multiplier`
- Effetto geometrico: aggiunge verticali supplementari nella zona inferiore.
- Dati mancanti: formula esatta di conteggio, intervallo di spaziatura, conferma se il GBP 75 è per cancello o per anta. [cite:2]

### 4. Railheads on dog bars

- Nome interno provvisorio: `dog_bar_railheads`
- Descrizione: seconda fila di railheads sulla linea dei dog bars oltre a quella superiore. [cite:2]
- Tipo pricing: uguale ai top railheads. [cite:2]
- Effetto geometrico: duplica la logica railheads anche su una riga intermedia.
- Dati mancanti: confermare se il catalogo variante e la formula conteggio sono identici a quelli superiori. [cite:2]

### 5. Arched top

- Nome interno: `arched_top`
- Descrizione: sommità curva invece che diritta. [cite:2]
- Prezzo extra confermato: GBP 850. [cite:2]
- Tipo pricing: `fixed`
- Effetto geometrico: sostituisce il top lineare con profilo arcuato.
- Ambiguità tecnica: per sliding complessi, bifolding e telescopic bisogna confermare compatibilità meccanica prima di renderla sempre disponibile. Il brief non stabilisce ancora le compatibilità per gate type. [cite:2]

### 6. Circles

- Nome interno provvisorio: `circles`
- Descrizione: cerchi decorativi tra le barre verticali. [cite:2]
- Extra bar price confermato: GBP 275. [cite:2]
- Circle unit price confermato: GBP 2.50. [cite:2]
- Tipo pricing: `fixed_plus_unit`
- Effetto geometrico: aggiunge almeno una barra orizzontale supplementare e un set di cerchi tra le verticali.
- Dati mancanti: formula esatta di conteggio in funzione della larghezza. [cite:2]

### 7. Bushes

- Nome interno: `bushes`
- Descrizione: elementi decorativi applicati alle barre verticali. [cite:2]
- Standard extra confermato: GBP 90. [cite:2]
- Prezzo unitario confermato: da GBP 2.50 fino a GBP 12.50 in funzione della dimensione. [cite:2]
- Tipo pricing: `fixed_plus_unit_variant`
- Effetto geometrico: applica mesh decorative selezionabili su barre specifiche.
- Dati mancanti: size catalog, count rule, placement pattern. [cite:2]

### 8. Spirals

- Nome interno: `spirals`
- Descrizione: spirali decorative sulle barre verticali. [cite:2]
- Prezzo unitario minimo confermato: GBP 3.80. [cite:2]
- Tipo pricing: `unit_variable`
- Effetto geometrico: applica spirali decorative lungo le verticali.
- Dati mancanti: costo base setup sì/no, varianti, regola di conteggio e pattern. [cite:2]

## Motore di pricing

### Principi generali

Il motore di prezzo deve rispettare il brief cliente e quindi usare sempre una logica “FROM GBP”. Ogni configurazione parte da un prezzo base, al quale si sommano maggiorazioni per dimensioni e opzioni, senza mai comunicare il totale come prezzo finale garantito se non dopo survey o conferma interna. [cite:2]

### Formula logica raccomandata

La formula software deve essere strutturata così:

```text
totalFromPrice = baseFromPrice
               + widthAdjustment
               + heightAdjustment
               + automationAdjustment
               + styleAdjustment
               + decorativeOptionsAdjustment
               + railingPanelsAdjustment
```

### Componenti di prezzo

- `baseFromPrice`: prezzo di partenza per gate type + style + operation mode. [cite:2]
- `widthAdjustment`: incremento per aumento larghezza rispetto al baseline confermato. [cite:2]
- `heightAdjustment`: incremento per aumento altezza rispetto al baseline confermato. [cite:2]
- `automationAdjustment`: incluso nel prezzo base manual/automatic oppure separabile in admin.
- `decorativeOptionsAdjustment`: somma di fixed, unit e formula-based extras. [cite:2]
- `railingPanelsAdjustment`: da definire in admin poiché il brief richiede i pannelli ma non ne fornisce un listino. [cite:2]

### Regole software obbligatorie

- Non inventare prezzi mancanti.
- Se un prezzo è incompleto, mostrare `subject to survey` o `price on request` oltre al FROM base. [cite:2]
- Le opzioni con catalogo non confermato devono rimanere in stato `provisional`.
- Il motore admin deve permettere aggiornamenti rapidi ai listini, dato che il cliente ha scritto che i prezzi potrebbero cambiare. [cite:2]

## Regole di preview 2D

La preview 2D deve avere almeno tre livelli:

- `front_elevation`
- `top_plan`
- `technical_overlay`

Il front elevation serve a mostrare stile, ante, decorazioni e pannello laterale. Il top plan è essenziale soprattutto per swing, bifolding e sliding, perché deve far capire il verso di apertura e l’ingombro del movimento. Il technical overlay serve a evidenziare hinge side, slide direction, fold joints, coda cantilever, track e pannelli telescopici sovrapposti. [cite:1][cite:2]

## Requisiti per il 3D

### Modello dati 3D minimo

Ogni oggetto 3D deve esporre:

- `meshId`
- `parentMeshId`
- `transform`
- `pivot`
- `openState`
- `animationTrack`
- `collisionBounds`
- `materialVariant`
- `visibilityRules`
- `derivedFromConfig`

### Famiglie di movimento

- Swing: rotazione attorno a pivot verticale.
- Tracked sliding: traslazione lineare su asse laterale. [cite:1]
- Cantilever: traslazione lineare con coda di bilanciamento visibile. [cite:1][cite:2]
- Bifolding: rotazione principale + folding secondario. [cite:3]
- Telescopic: traslazioni multiple sincronizzate.
- Radius sliding: movimento provvisorio finché il cliente non chiarisce la cinematica. [cite:2]

### LOD e modularità

Per accelerare lo sviluppo, il sistema 3D dovrebbe essere modulare:

- telaio base
- vertical bars / boards
- decorative attachments
- hardware layer
- motion controllers
- panel extension module

Questo approccio permette riuso tra vari gate type e riduce il costo di creazione mesh. [cite:2]

## Validazioni necessarie nel configuratore

### Validazioni certe già applicabili

- Un solo gate type attivo per configurazione. [cite:2]
- Quantità railing panels intera e non negativa. [cite:2]
- Ogni railing panel deve avere `heightMm` e `lengthMm`. [cite:2]
- I prezzi mostrati devono restare con prefisso `FROM GBP`. [cite:2]

### Validazioni da attivare solo dopo conferma cliente

- Range dimensionali min/max definitivi.
- Step dimensionali obbligatori.
- Compatibilità arched top con telescopic o bifolding.
- Compatibilità railheads con composite.
- Limiti di peso o superficie per automazione.
- Regole di conteggio automatico per circles, dog bars, railheads, bushes e spirals. [cite:2]

## Specifica admin catalog

Il pannello admin deve permettere modifica senza deploy dei seguenti dataset:

- prezzi base per gate type, style, operation mode
- baseline dimensionali
- incrementi per width e height
- catalogo railheads
- catalogo bushes e spirals
- pattern decorative placement
- compatibilità opzioni per gate type
- parametri preview 2D
- parametri motion 3D
- listino railing panels
- testi commerciali visibili sul sito

## Schema TypeScript raccomandato

```ts
export type GateType =
  | 'DOUBLE_SWING'
  | 'SINGLE_SWING'
  | 'TRACKED_SLIDING'
  | 'CANTILEVER_SLIDING'
  | 'BIFOLDING_DOUBLE_SWING'
  | 'SINGLE_BIFOLDING'
  | 'TELESCOPIC_SLIDING'
  | 'RADIUS_SLIDING';

export type GateStyle = 'TRADITIONAL_VICTORIAN' | 'COMPOSITE_BOARDS';
export type OperationMode = 'MANUAL' | 'AUTOMATED';
export type OpeningDirection = 'INWARD' | 'OUTWARD' | 'SLIDE_LEFT' | 'SLIDE_RIGHT' | 'PROVISIONAL';

export interface RailingPanel {
  panelId: number;
  heightMm: number;
  lengthMm: number;
}

export interface DecorativeOptionSelection {
  optionKey: string;
  enabled: boolean;
  variantKey?: string;
  quantity?: number;
  derivedQuantity?: number;
  notes?: string;
}

export interface GateConfiguration {
  gateType: GateType;
  style: GateStyle;
  operationMode: OperationMode;
  widthMm: number;
  heightMm: number;
  openingDirection: OpeningDirection;
  hingeSide?: 'LEFT' | 'RIGHT';
  decorativeOptions: DecorativeOptionSelection[];
  railingPanels: RailingPanel[];
}

export interface PriceBreakdown {
  currency: 'GBP';
  displayMode: 'FROM';
  baseFromPrice: number;
  widthAdjustment: number;
  heightAdjustment: number;
  decorativeAdjustment: number;
  railingPanelsAdjustment: number;
  provisionalItems: string[];
  totalFromPrice: number;
}
```

## Dataset iniziale da caricare

### Prezzi base per tipologia

| Gate type | Style | Mode | Base price |
|---|---|---:|---:|
| DOUBLE_SWING | TRADITIONAL_VICTORIAN | MANUAL | 1800 GBP [cite:2] |
| DOUBLE_SWING | TRADITIONAL_VICTORIAN | AUTOMATED | 3800 GBP [cite:2] |
| DOUBLE_SWING | COMPOSITE_BOARDS | MANUAL | 1800 GBP [cite:2] |
| DOUBLE_SWING | COMPOSITE_BOARDS | AUTOMATED | 3800 GBP [cite:2] |
| SINGLE_SWING | TRADITIONAL_VICTORIAN | MANUAL | 850 GBP [cite:2] |
| SINGLE_SWING | TRADITIONAL_VICTORIAN | AUTOMATED | 2700 GBP [cite:2] |
| SINGLE_SWING | COMPOSITE_BOARDS | MANUAL | 750 GBP [cite:2] |
| SINGLE_SWING | COMPOSITE_BOARDS | AUTOMATED | 2700 GBP [cite:2] |
| TRACKED_SLIDING | TRADITIONAL_VICTORIAN | MANUAL | 2200 GBP [cite:2] |
| TRACKED_SLIDING | TRADITIONAL_VICTORIAN | AUTOMATED | 3600 GBP [cite:2] |
| TRACKED_SLIDING | COMPOSITE_BOARDS | MANUAL | 2200 GBP [cite:2] |
| TRACKED_SLIDING | COMPOSITE_BOARDS | AUTOMATED | 3600 GBP [cite:2] |
| CANTILEVER_SLIDING | TRADITIONAL_VICTORIAN | MANUAL | 2900 GBP [cite:2] |
| CANTILEVER_SLIDING | TRADITIONAL_VICTORIAN | AUTOMATED | 4200 GBP [cite:2] |
| CANTILEVER_SLIDING | COMPOSITE_BOARDS | MANUAL | 2900 GBP [cite:2] |
| CANTILEVER_SLIDING | COMPOSITE_BOARDS | AUTOMATED | 4200 GBP [cite:2] |
| BIFOLDING_DOUBLE_SWING | TRADITIONAL_VICTORIAN | MANUAL | 2500 GBP [cite:2] |
| BIFOLDING_DOUBLE_SWING | TRADITIONAL_VICTORIAN | AUTOMATED | 4200 GBP [cite:2] |
| BIFOLDING_DOUBLE_SWING | COMPOSITE_BOARDS | MANUAL | 2500 GBP [cite:2] |
| BIFOLDING_DOUBLE_SWING | COMPOSITE_BOARDS | AUTOMATED | 4200 GBP [cite:2] |
| SINGLE_BIFOLDING | TRADITIONAL_VICTORIAN | MANUAL | 1900 GBP [cite:2] |
| SINGLE_BIFOLDING | TRADITIONAL_VICTORIAN | AUTOMATED | 3000 GBP [cite:2] |
| SINGLE_BIFOLDING | COMPOSITE_BOARDS | MANUAL | 1900 GBP [cite:2] |
| SINGLE_BIFOLDING | COMPOSITE_BOARDS | AUTOMATED | 3000 GBP [cite:2] |
| TELESCOPIC_SLIDING | TRADITIONAL_VICTORIAN | MANUAL | 3100 GBP [cite:2] |
| TELESCOPIC_SLIDING | TRADITIONAL_VICTORIAN | AUTOMATED | 4200 GBP [cite:2] |
| TELESCOPIC_SLIDING | COMPOSITE_BOARDS | MANUAL | 3100 GBP [cite:2] |
| TELESCOPIC_SLIDING | COMPOSITE_BOARDS | AUTOMATED | 4200 GBP [cite:2] |
| RADIUS_SLIDING | TRADITIONAL_VICTORIAN | MANUAL | 2500 GBP [cite:2] |
| RADIUS_SLIDING | TRADITIONAL_VICTORIAN | AUTOMATED | 4200 GBP [cite:2] |
| RADIUS_SLIDING | COMPOSITE_BOARDS | MANUAL | 2500 GBP [cite:2] |
| RADIUS_SLIDING | COMPOSITE_BOARDS | AUTOMATED | 4200 GBP [cite:2] |

### Baseline dimensionali iniziali

| Gate type | Height baseline | Width baseline |
|---|---|---|
| DOUBLE_SWING | 900/1000 mm [cite:2] | 1800/1900 mm [cite:2] |
| SINGLE_SWING | 900/1000 mm [cite:2] | 800/900 mm [cite:2] |
| TRACKED_SLIDING | 900/1000 mm [cite:2] | 2500/2600 mm [cite:2] |
| CANTILEVER_SLIDING | 900/1000 mm [cite:2] | 2500/2600 mm [cite:2] |
| BIFOLDING_DOUBLE_SWING | 900/1000 mm min [cite:2] | 2900/3000 mm [cite:2] |
| SINGLE_BIFOLDING | 900/1000 mm min [cite:2] | 1500/1600 mm [cite:2] |
| TELESCOPIC_SLIDING | 900/1000 mm start [cite:2] | 2000/2100 mm [cite:2] |
| RADIUS_SLIDING | 900/1000 mm [cite:2] | 1600/1700 mm [cite:2] |

## Roadmap tecnica raccomandata

### Fase 1 — Data model e admin

Creare prima catalogo dati, matrici prezzo e compatibilità. Senza questo layer, 2D e 3D rischiano di essere incoerenti col pricing. [cite:2]

### Fase 2 — Preview 2D parametrica

Implementare prima tutte le tipologie in 2D tecnico, con movimento schematico e decorazioni basilari. Questo consente validazione veloce col cliente. [cite:2]

### Fase 3 — Motore prezzi

Attivare motore FROM con breakdown e campi provvisori. Le opzioni con formula incompleta devono restare editabili lato admin. [cite:2]

### Fase 4 — 3D modulare

Solo dopo validazione di cinematica, decorazioni e compatibilità reali conviene passare alla mesh pipeline 3D. Le fonti tecniche su sliding e bifolding sono utili come riferimento meccanico, ma il modello finale deve seguire il prodotto reale del cliente. [cite:1][cite:3]

## Dati ancora da richiedere al cliente

### Critici per pricing

- step di incremento width
- step di incremento height
- tabella extra per ogni step
- prezzo railing panels
- prezzo finale railheads per variante
- formula di conteggio railheads
- formula di conteggio dog bars
- formula di conteggio circles
- formula di conteggio bushes
- formula di conteggio spirals [cite:2]

### Critici per 2D/3D

- lato apertura default per ciascun gate type
- inward/outward consentito per swing e bifold
- numero pannelli esatto per telescopic
- definizione reale di radius sliding
- geometria composite boards
- catalogo railheads visuale
- compatibilità decorative option per ogni gate type
- eventuale libreria fotografica di riferimento per matching 70/80% [cite:2]

## Regola finale di governance tecnica

Finché il cliente non fornisce i dati mancanti, il configuratore deve distinguere chiaramente fra `confirmed`, `provisional` e `derived`. Questa separazione è fondamentale per evitare che assunzioni tecniche di settore diventino per errore dati commerciali o costruttivi ufficiali. [cite:1][cite:2]

Questo documento deve quindi essere trattato come base finale di sviluppo, ma con un sistema di status per campo e per regola, così da permettere aggiornamenti rapidi senza rifattorizzare il core del configuratore. [cite:2]
