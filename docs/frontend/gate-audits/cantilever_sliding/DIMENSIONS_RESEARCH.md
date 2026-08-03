# Ricerca dimensioni — cantilever sliding

Documento di sintesi: **web industry**, **dati cliente Steelyes**, **engine**, **stima da foto** (van SteelYes).

---

## 1. Steelyes — fonti ufficiali

### Sito marketing ([steelyes.co.uk/gates/cantilever](https://steelyes.co.uk/gates/cantilever))

| Campo | Valore pubblicato |
|-------|-------------------|
| Meccanismo | Cantilever slide |
| Span | **Confirmed after measurement and survey** |
| Altezza | Non pubblicata |
| Automazione | Available, subject to survey |
| Pricing | Indicative, subject to survey |

**Conclusione:** Steelyes **non pubblica mm fissi** online — ogni span è survey-led. Il configurator deve restare **indicativo**.

### Brief cliente interno (`CLIENT_GATE_REQUIREMENTS_REFERENCE.md`)

| Campo | Traditional Victorian |
|-------|----------------------|
| Clear width (FROM band) | **2500 / 2600 mm** |
| Height (FROM band) | **900 / 1000 mm** |
| Manual FROM | **£2900** |
| Automated FROM | **£4200** |

Composite: stessi prezzi FROM, dimensioni non specificate.

---

## 2. Engine — regole attuali (`gate-engine`)

### Preset default

```text
gateType: cantilever_sliding
widthMm: 2500        # interpretato come clear opening nel renderer
heightMm: 1000
motorised: true
```

### Tail / counterbalance (codice)

| Condizione | Tail ratio | Tail @ opening | Esempio totale gate* |
|------------|------------|----------------|---------------------|
| `widthMm === 4000` | **1/3 (33.3%)** | 1333 mm | 5333 mm |
| default (es. 2500) | **0.28 (28%)** | 700 mm | 3200 mm |
| default (2600) | 0.28 | 728 mm | 3328 mm |

\*Totale ≈ opening + tail (mesh usa `widthMm * tailRatio` per tail, panel ~64% width at cantilever)

### Mesh 3D (`buildSlidingMeshBoxes`)

- `tailWidth = widthMm * (4000 ? 1/3 : 0.28)`
- `panelWidth = widthMm * 0.64` (cantilever)
- Ruolo box: `counterweight` per tail

---

## 3. Web — standard di settore (UK / internazionale)

Fonti consultate per **proporzioni cantilever** (non Steelyes-specific):

| Fonte | Tail rule | Run-back / totale | Note |
|-------|-----------|-------------------|------|
| [Driveway Gates UK](https://drivewaydrivewaygates.co.uk/driveway-gates/sliding-driveway-gates) | ~50% extra | **~1.5×** clear opening | Cantilever vs tracked 1× |
| [AGD Systems UK](https://www.agdsystems.co.uk/home/agd-gate-systems/commercial-gates/cantilever-sliding-gates-overview/) | 30–40% | 6 m opening → 8–8.5 m space | Commercial |
| [Pentagon AU](https://pentagonfencing.com.au/service/cantilever-gates/) | 30–40% | totale **1.3–1.4×** opening | 6 m → 8–8.5 m |
| [Western Fence US](https://www.westernfencecompany.net/how-much-room-does-a-sliding-gate-need/) | ~50% + 1 ft | **~1.5×** opening | 16 ft → 24 ft |
| [America's Gate Co](https://americasgatecompany.com/how-to-select-your-cantilever-gate/) | **50% min** | totale **150%** opening | Industrial US |
| [Hoover Fence manual](https://www.hooverfence.com/mas_assets/theme/hooverfence/pdfs/cantilever-gate-installation.pdf) | **50%** counterbalance | min tail 4 ft | Chain link |
| [Richmond AU guide](https://www.richmondau.com/cantilever-buying-guide/) | **~⅓** opening | run-back ≈ opening + ⅓ | Rule of thumb |
| [SSSG UK](https://www.securitysolutionsgb.com/security-gates/sliding-gates/sssg-steel-cantilever-sliding-gate/) | custom | span up to **10.5 m** | Height std **1.8 / 2.4 m** |

### Altezze standard mercato (non Steelyes)

| Provider | Altezze tipiche |
|----------|-----------------|
| SSSG UK | **1800 / 2400 mm** standard |
| AGD commercial | bespoke, spesso **2 m+** |
| Foto Steelyes 01 | **~1800–2100 mm** (stima) |

---

## 4. Stima dimensioni da foto 01 (SteelYes install)

### Metodo di scala

Riferimento: **Ford Transit / Mercedes Sprinter** (van SteelYes)  
- Altezza totale veicolo: **~2000–2500 mm** (tetto)  
- Lunghezza wheelbase L3: **~5500–6000 mm**

### Stime visive

| Misura | Stima | Metodo |
|--------|-------|--------|
| **Altezza cancello** (finials) | **1800–2100 mm** | Allineata o sotto tetto van |
| **Clear opening** | **4000–5000 mm** | Larghezza vano ≈ lunghezza van visibile |
| **Tail counterbalance** | **1500–2000 mm** | Sezione sinistra dietro post |
| **Tail ratio** | **37–50%** | tail ÷ opening |
| **Totale gate length** | **5500–7000 mm** | opening + tail |
| **Ground clearance** | **50–100 mm** | Gap sotto bottom rail |
| **Gear rack** | full bottom rail | Automazione |

### Confronto stima foto vs catalogo cliente

| | Foto 01 | Cliente FROM | Delta |
|--|---------|--------------|-------|
| Opening | ~4–5 m | 2,5–2,6 m | **+60–90%** |
| Height | ~1,8–2,1 m | 0,9–1,0 m | **+80–110%** |

**Interpretazione:** banda FROM 2500×1000 = **entry price band minimo**, non upper bound installazioni reali. Oppure altezza catalogo = solo campo rettangolare senza finials.

---

## 5. Tabella dimensioni consigliata per configurator

Per preview **indicativa** finché Marius non conferma:

### Clear opening (widthMm in config)

| Banda | mm | Uso |
|-------|-----|-----|
| Cliente FROM min | 2500 | preset engine ✅ |
| Cliente FROM max | 2600 | slider band |
| Foto installazione Steelyes | 4000–5000 | showcase / case study |
| Web max residential UK | ~12000 | engine max 6000 |

### Altezza (heightMm)

| Banda | mm | Uso |
|-------|-----|-----|
| Cliente FROM | 900 / 1000 | preset |
| Mercato UK std | 1800 / 2400 | reference only |
| Foto Steelyes | ~1900 | case study |

### Tail length (counterbalance)

| Regola | @ 2500 mm opening | @ 4000 mm opening |
|--------|-------------------|-------------------|
| **Engine oggi** | 700 mm (28%) | 1333 mm (33%) |
| Web ⅓ rule | 833 mm | 1333 mm |
| Web 40% commercial | 1000 mm | 1600 mm |
| Web 50% industrial | 1250 mm | 2000 mm |
| **Foto Steelyes** | — | ~1500–2000 mm @ ~4–5 m |

### Run-back space (site planning)

```text
run_back_mm ≈ clear_opening_mm + tail_mm
             ≈ clear_opening_mm × (1 + tail_ratio)

Esempi @ tail 40%:
  2500 opening → 3500 mm run-back
  4000 opening → 5600 mm run-back
  5000 opening → 7000 mm run-back
```

---

## 6. Raccomandazione per Marius / prodotto

Domande da chiudere:

1. **`widthMm` nel config = clear opening o lunghezza totale gate?**
2. **Tail ratio Steelyes produzione:** 28%, 33%, 40% o variabile per span?
3. **Regola 4 m → 1/3** — solo quella apertura o formula generale sopra soglia?
4. **Altezza 900/1000** include finials sopra top rail?
5. **Foto 01** — dimensioni as-built per validare formula?

---

## 7. Riferimenti URL

- https://steelyes.co.uk/gates/cantilever
- https://drivewaydrivewaygates.co.uk/driveway-gates/sliding-driveway-gates
- https://www.agdsystems.co.uk/home/agd-gate-systems/commercial-gates/cantilever-sliding-gates-overview/
- https://www.richmondau.com/cantilever-buying-guide/
- https://www.westernfencecompany.net/how-much-room-does-a-sliding-gate-need/
- https://americasgatecompany.com/how-to-select-your-cantilever-gate/
- https://www.securitysolutionsgb.com/security-gates/sliding-gates/sssg-steel-cantilever-sliding-gate/
