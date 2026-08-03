# Topologia — double swing Traditional Victorian

Riferimento: foto 02, 03, 04.

## 1. Struttura ad alto livello

```
[Palo sinistro] — [Foglio SX] — [Incontro centro] — [Foglio DX] — [Palo destro]
                      ↑ simmetrico mirror ↑
```

- **Meccanismo:** double swing, 2 fogli che pivotano sui pali esterni
- **Simmetria:** foglio destro = mirror foglio sinistro
- **Profilo top:** arco convesso (swan-neck / camelback) — altezza max al centro incontro

## 2. Gerarchia parti (assembly order)

1. **Posts** — pali in mattoni/pietra (fuori dal gate mesh, ma cerniere visibili)
2. **Outer frame per foglio** — tubolare rettangolare, più spesso delle barre infill
3. **Horizontal rails** (4 per foglio):
   - Top rail — segue curva arco
   - Upper-mid rail — delimita fascia decorativa alta
   - Lower-mid rail — delimita fascia spear + inizio zona densa
   - Bottom rail — base strutturale
4. **Vertical pickets** — barre verticali attraversano le traverse
5. **Decorative layers** — applicate su picket + tra barre
6. **Center meeting stile** — piastra scudo + latch al centro
7. **Hinges** — 2 per foglio (alto + basso) sul palo

## 3. Zone verticali (proporzioni stimate dalla foto)

| Zona | % altezza (visiva) | Contenuto |
|------|-------------------|-----------|
| A — Fascia top decorativa | ~12–15% | Anelli circolari / scrollwork tra top rail e upper-mid |
| B — Corpo principale | ~45–50% | Pickets + basket twist (~metà zona B) |
| C — Fascia spear | ~8–10% | Punte a V / spearhead tra pickets, sopra lower-mid |
| D — Kick plate / dog zone | ~25–30% | Pickets doppia densità + anelli tra lower-mid e bottom |

**Regola densità:** in zona D il numero di barre verticali **raddoppia** (barre “filler” tra picket principali).

## 4. Decorazioni mappate → opzioni engine

| Elemento visivo | Opzione engine | Match |
|-----------------|----------------|-------|
| Arco top | `arched_top` | MATCH |
| Finial fleur-de-lis su ogni picket (top) | `top_railheads` | PARZIALE — client vuole railheads ~70–80% fedeli |
| Fascia anelli alto e basso | `bushes`? | REVIEW — non è chiaro nel catalogo client |
| Basket twist su picket | `spirals`? | REVIEW — spirals in engine ≠ basket twist |
| Fascia spear central | `dog_bar_railheads`? | REVIEW — più “row of spears” che railheads su dog bar |
| Zona bassa fitta | `dog_bars` | PARZIALE — dog bars client = “double bars lower part” |
| Traverse orizzontale centrale | `middle_bar` | POSSIBILE — lower-mid rail potrebbe essere middle bar |
| Anelli / scroll | — | GAP — nessuna opzione dedicata “circle band” |

## 5. Hardware

| Parte | Descrizione |
|-------|-------------|
| Hinges | Wrap-around, 2 per lato foglio |
| Center latch plate | Piastra decorativa scudo al meeting point |
| Drop bolt | Bullone verticale su un foglio (foto 04) |
| Ground clearance | ~50–100 mm |

## 6. Come si compone (narrativa)

Il telaio perimetrale di ogni foglio definisce l’arco e le 4 traverse. I picket verticali vengono infissi tra le traverse con passo regolare. Sopra ogni picket sporge un finial che segue la curva del top rail. Tra top e upper-mid rail corre una fascia di elementi circolari ripetuti. A metà altezza, picket selezionati portano un elemento “basket twist”. Sopra la lower-mid rail, una fila di punte decorative crea una cornice orizzontale. Nella zona bassa i picket si raddoppiano e una seconda fascia ad anelli chiude verso il bottom rail. Al centro, le due ante si incontrano con piastra e chiusura.

## 7. Perché è così

- **Arco:** identità Victorian, maggiore presenza al centro ingresso
- **Finials:** decorazione classica, deterrenza visiva
- **Fascia spear:** tradizione ornamental + percezione sicurezza
- **Zona bassa densa:** impedire passaggio sotto (dogs / small gaps)
- **Double leaf:** ampiezza driveway mantenendo simmetria

## 8. Regole parametriche suggerite (per futuro geometry recipe)

```text
leaf_count = 2
top_profile = arc(height_at_post, height_at_center)
rail_count = 4
picket_spacing_mm ≈ 100–120 (center-to-center, stima visiva)
finial_every_picket = true
circle_band_zones = [top, bottom]  # tra rail 1-2 e 3-4
basket_twist_every_nth_picket = 2 or 3
spear_band_at = lower_mid_rail
kick_plate_density_multiplier = 2
symmetry = mirror_x
```

## 9. Incertezze (serve Marius)

- [ ] Profilo tubo esatto (40×40? 50×50?)
- [ ] Passo picket in mm a 1800 mm vs 3600 mm larghezza
- [ ] Basket twist = quale voce catalogo / prezzo?
- [ ] Fascia anelli = bushes, spirals, o voce nuova?
- [ ] Altezza catalogo 900/1000 mm = solo pannello rettangolo o include arco?
