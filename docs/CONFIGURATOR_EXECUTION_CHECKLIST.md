# Steelyes - Configurator Execution Checklist

This checklist turns the client brief into an execution order for the rebuild.

## 1. Do now

These items can be built without waiting for missing client data.

| Area | Task | Why it matters |
|---|---|---|
| Data model | Keep the core product fields only: `gateType`, `style`, `operationMode`, `widthMm`, `heightMm`, `decorativeOptions[]`, `railingPanels[]`, `siteSurveyRequested` | This is the minimum viable quote model. |
| Data model | Mark every uncertain value as `provisional` or `derived` | Prevents assumptions from becoming product truth. |
| Pricing | Keep `FROM GBP` pricing with a clear breakdown | Matches the client brief and avoids fake final quotes. |
| Pricing | Use admin-editable base prices and option prices | Lets the catalogue change without code churn. |
| Validation | Enforce one gate type per configuration | Keeps the flow simple and avoids invalid mixes. |
| Validation | Enforce non-negative, integer railing panel quantities | Stops broken payloads early. |
| Validation | Keep option dependency checks in the engine | Centralizes rules instead of duplicating them in the UI. |
| UI | Build a mobile-first flow with a short decision path | The first release must work on small screens first. |
| UI | Show only the fields needed to choose a product and estimate price | Reduces noise and improves conversion. |
| UI | Keep the preview schematic, not final-3D | Enough to validate structure now. |
| Docs | Keep the field map and baseline docs in sync | Avoids drift between product, pricing, and UI. |
| Tests | Add regression coverage for pricing and validation | Protects the current behaviour while the model changes. |

## 2. Do when the client sends the missing data

These items should be ready in structure, but not finalized until the client confirms them.

| Area | Task | Needed from client |
|---|---|---|
| Dimensions | Final min/max width and height for each gate type | Exact technical ranges |
| Dimensions | Exact step increments for width and height | Step table or rule |
| Swing / bifold | Default opening direction and hinge side per type | Technical direction rules |
| Sliding | Real rule for track, cantilever, and telescopic movement | Motion and overlap rules |
| Radius sliding | Confirm whether it is curved path, curved top, or both | One clear definition |
| Composite Boards | Exact board build-up and reinforcement structure | Section, thickness, layout |
| Railheads | Final catalog of variants and prices | Reference images and price list |
| Railheads | Quantity formulas for top row and dog-bar row | Count logic |
| Dog bars | Final count formula and pricing interpretation | Per gate or per leaf |
| Circles | Count formula and placement pattern | Width rule |
| Bushes | Size catalog and count rule | Variant list and placement |
| Spirals | Size catalog and count rule | Variant list and placement |
| Railing panels | Base price and sizing logic | List price or rule |
| 2D / 3D | Reference images per gate and per decorative option | Visual baseline |
| 2D / 3D | Final compatibility matrix by gate type | Allowed and disallowed combinations |

## 3. Block until confirmed

These should not be hardcoded as final truth now.

| Area | Blocked item | Reason |
|---|---|---|
| Pricing | Final width and height uplift formula | No confirmed math yet. |
| Pricing | Final railhead unit prices | Catalog not closed. |
| Pricing | Final bushes and spirals unit prices | Variants not closed. |
| Pricing | Final fence panel pricing | Not supplied in the brief. |
| Geometry | Exact swing clearance envelopes | Could create invalid UX if guessed. |
| Geometry | Exact sliding runback and counterbalance rules | Mechanical truth is still open. |
| Geometry | Exact telescopic overlap ordering | Needs product sign-off. |
| Geometry | Final radius sliding kinematics | Current definition is ambiguous. |
| 3D | Final mesh and motion fidelity | Too early before rules are locked. |
| Compatibility | Any rigid option lock that is not confirmed | Risk of blocking valid products. |

## 4. Suggested build order

1. Keep the shared data model lean.
2. Move pricing and compatibility into engine-owned rules.
3. Rebuild the UI around the mobile-first flow.
4. Keep preview 2D and technical.
5. Put admin controls on all values that can still move.
6. Delay 3D fidelity until the client confirms geometry and decoration rules.

## 5. Working rule

If a field changes price, validation, or preview, it can be built now.

If a field exists only to make the final product more precise, it stays provisional.

If a field depends on unconfirmed client data, it is blocked from final implementation.
