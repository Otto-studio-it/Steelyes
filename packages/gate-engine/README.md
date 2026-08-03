# @steelyes/gate-engine

Motore di dominio puro TypeScript per la configurazione di cancelli in acciaio. **Zero dipendenze runtime**: utilizzabile in qualsiasi contesto (Next.js, worker, CLI, embed futuri).

## Cosa contiene

| Modulo | Responsabilità |
|---|---|
| `types.ts` | Modello di dominio: 8 tipi di cancello, 2 stili, 7 opzioni, 4 finiture, preset di default |
| `validation.ts` | `normalizeGateConfig` (sanifica e clampa), `validateGateConfig` (regole strutturali + dominio) |
| `dimension-limits.ts` | Limiti dimensionali globali e per tipo (`getDimensionLimits`) — la UI importa da qui |
| `rules/compatibility.ts` | Compatibilità opzioni ↔ stile (es. opzioni vittoriane non su composite) |
| `rules/geometry.ts` | Capacità geometriche per larghezza (railheads, dog bars, decorativi) |
| `rules/cantilever.ts` | Regola del contrappeso cantilever (4m → 1/3, confermata dal cliente) |
| `pricing.ts` | Pricing indicativo GBP con catalogo iniettabile (`PricingCatalog`); `DEFAULT_PRICING_CATALOG` come fallback |
| `pricing/style-pricing.ts` | Override prezzi per stile |
| `finishes.ts` | Catalogo finiture con token schematici (2D) e materiali (3D) |
| `catalog/railheads.ts` | Catalogo varianti railhead (bloccato in attesa dati cliente) |
| `rendering.ts` | `buildGateRenderPlan` → primitive SVG dichiarative per il preview 2D |
| `mesh/` | `buildGateMeshPlan` → box schematici per il preview 3D (stesso `GateConfig`) |
| `serialization.ts` | Serializzazione versionata (`SerializedGateConfigV1`) |

## Principi

1. **Config in, piani out.** Ogni superficie (2D, 3D, pricing, share) consuma lo stesso `GateConfig` validato.
2. **Cataloghi iniettabili.** `calculateIndicativeGatePrice(config, catalog?, variantCatalog?)`: i prezzi possono arrivare da un DB admin; i default sono un fallback esplicito, non un valore nascosto.
3. **Niente dati inventati.** Le regole non confermate dal cliente restano provvisorie e marcate (`provisional`, `blocked_pending_client`). I totali non confermabili diventano `survey_required` / "Price on request".

## Uso

```ts
import {
  createGateConfig,
  createGatePreset,
  calculateIndicativeGatePrice,
  buildGateRenderPlan,
  buildGateMeshPlan,
} from '@steelyes/gate-engine'

const config = createGateConfig(createGatePreset('double_swing'))
const pricing = calculateIndicativeGatePrice(config)   // catalogo default
const plan2d = buildGateRenderPlan(config)
const plan3d = buildGateMeshPlan(config)
```

## Test

```bash
pnpm --filter @steelyes/gate-engine test
```

La suite Vitest copre pricing (inclusa la regressione preset ↔ listino), validazione, regole geometriche, cantilever, rendering, mesh, finiture e serializzazione.
