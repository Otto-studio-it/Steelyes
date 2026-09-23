# Piano di lavoro — richieste cliente 23 settembre 2026

Decisioni chiuse in chat il 23 settembre 2026, dopo le risposte sulle pagine, i prezzi e le misure.

## Chi fa cosa

| Lavoro | Chi | Stato |
|---|---|---|
| Middle bar, alluminio £200, railing panels, via slider extension, cappucci +£75, picket collars On/Off, altezza fino a 10 m e lunghezza fino a 100 m | Codice, già nel configuratore | Fatto in questo giro |
| Circles sul composite | Tu, a mano in Figma, poi export dei master | Aperto — serve export Figma |
| 5 foto + 1 video per pagina, musica, copertine single swing e single bifold | Foto pagine fatte e servite da Spaces Londra. Restano aperti i video (file veri del cliente) | Foto: fatto. Video: aperti |
| Spaces a Londra | CDN `steelyes-foto.lon1.cdn.digitaloceanspaces.com` | Fatto |
| £100/mese di pubblicità | Commerciale, non è una modifica al sito | Annotato |

## Pagine che ricevono 5 foto e 1 video

Gates e All Gates sono la stessa pagina (`/gates`). Una sola cartella copre entrambe.

| Cartella | Pagina |
|---|---|
| `gates-all` | `/gates` |
| `double-swing` | `/gates/double-swing` |
| `single-swing` | `/gates/single-swing` |
| `tracked-sliding` | `/gates/tracked-sliding` |
| `cantilever` | `/gates/cantilever` |
| `bifold` | `/gates/bifold` |
| `single-bifold` | `/gates/single-bifold` |
| `telescopic` | `/gates/telescopic` |
| `radius` | `/gates/radius` |
| `railings` | `/services/railings` |
| `staircases` | `/services/staircases` |

Non entrano in questo giro: balconi, security, strutture, gallery.

## Come rinominare i file

Cartella pronta da riempire:

`docs/frontend/foto-da-consegnare/`

Dentro la cartella di una pagina, il numero decide il ruolo. `01` è sempre la copertina. `02`, `03`, `04` e ogni numero successivo sono le altre foto di quella stessa pagina, nell’ordine. Non c’è un tetto di 5: se una pagina ne ha 3 o 7, si numerano di seguito.

```
double-swing/01.jpg      copertina
double-swing/02.jpg      seconda foto della pagina
double-swing/03.jpg      terza foto della pagina
double-swing/video.mp4   video di quella pagina
```

- Estensione: `.jpg`, `.png` o `.webp`. Il numero non cambia.
- Il video è uno per cartella, nome `video.mp4`, senza l’audio originale.
- La musica sta in `audio/`: `track-01.mp3`, `track-02.mp3`, `track-03.mp3`.
- Telescopic: `01-cover.png` è già la copertina giusta. Non rinominarla e non sostituirla. Le altre foto di quella pagina partono da `02`.
- Single swing: `01` è il cancello grande, non il pedonale.
- Single bifold: `01` è la foto migliore al posto di quella attuale.

## Foto che il sito usa oggi

Cartella da aprire, con le foto già in uso, divise per pagina:

`docs/frontend/foto-sito-attuale/`

Sono collegamenti ai file reali in `apps/web/public/images/`. `altre-pagine/` raccoglie home, about, balconi, security, strutture e sfondi: quelle pagine non cambiano in questo giro.

Copertina telescopic da non toccare: `foto-sito-attuale/telescopic/01-cover.png`.

## Configuratore — già applicato

- **Middle bar.** «The horizontal middle bar (dog bar) allows a double row of railheads and doubles the vertical bars at the bottom of the gate.»
- **Alluminio.** Sul composite la riga è sempre £200. Niente £12,50 a pannello e niente £12 a barra.
- **Railing panels.** Lo switch è «Include railing panels». Il conteggio è «Number of railing panels».
- **Post cap.** Lo slider «Extension above gate» non c’è più. Resta il menu. Flat cap = £0. Ball, pyramid e spear = +£75 una volta nel preventivo, anche se i pali sono due. Nel menu gli altri cappucci mostrano «(+£75)». Il default del configuratore è Ball finial, quindi un preventivo nuovo include quei £75 finché non si sceglie Flat cap.
- **Picket collars.** Un interruttore On/Off. On usa il disegno di Every picket. Every 2nd non si può più scegliere.
- **Panel 1.** Altezza libera fino a 10 metri (10 000 mm). Lunghezza da 900 mm fino a 100 metri (100 000 mm).

## Ancora da te

1. Circles sui composite in Figma ([Steelyes — Decorative System 2026-08](https://www.figma.com/design/SiMiEXobtyfuHpXOs5RDRe)): sopra e sotto, poi export dei master. Restano «Unavailable on Composite» finché non arriva l’export.
2. Video veri del cliente (`video.mp4` per pagina) e, se serve, la musica in `audio/`. Le foto delle pagine e Spaces Londra sono già fatte.

## Pubblicità

£100 al mese sulle piattaforme. Non è un lavoro sul sito finché non si scelgono le piattaforme e chi carica gli annunci.
