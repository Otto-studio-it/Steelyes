# Gate photo audit

Analyze real gate reference photos and compare them with the Steelyes configurator rules in `packages/gate-engine`.

Two modes:

| Mode | When to use | API key |
|------|-------------|---------|
| **Cursor / agent handoff** (recommended) | Deeper analysis, you want Composer/Claude in the IDE | None |
| **API** (`--mode api`) | Batch runs, CI, quick solo pass | `ANTHROPIC_API_KEY` |

## Quick start (Cursor handoff)

### 1. Install

```bash
cd tools/gate-photo-audit
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 2. Add photos for one gate type

```bash
mkdir -p inputs/double_swing
cp /path/to/your/front.jpg inputs/double_swing/
cp inputs/_example/manifest.yaml.example inputs/double_swing/manifest.yaml
# Edit manifest.yaml — set gate_type, dimensions if known
```

### 3. Prepare handoff bundle

```bash
python audit.py prepare double_swing
```

Creates `handoff/double_swing/` with:

- `ANALYSIS_REQUEST.md` — instructions for the AI
- copied photos
- `observed.template.json`
- `engine_rules.snapshot.json`

### 4. Analyze in Cursor (this is where “you” help)

In Cursor chat:

1. Open `handoff/double_swing/ANALYSIS_REQUEST.md`
2. Attach the photos in that folder (`@front.jpg`, etc.)
3. Prompt:

   > Read ANALYSIS_REQUEST.md and the attached gate photos. Write a complete `observed.json` in `handoff/double_swing/` following the schema. Be detailed about topology, how parts connect, and renderer recommendations.

4. The agent saves `handoff/double_swing/observed.json`

### 5. Generate report

```bash
python audit.py report double_swing
```

Output: `reports/double_swing_audit.md` — diff vs engine, recommendations, open questions.

---

## Optional: API mode (no Cursor)

```bash
export ANTHROPIC_API_KEY=sk-...
python audit.py analyze double_swing --mode api
```

Runs vision + writes report in one step. Good for batch; Cursor mode is usually richer for configurator work.

---

## Batch all gate types

```bash
for t in double_swing single_swing tracked_sliding cantilever_sliding; do
  python audit.py prepare "$t" 2>/dev/null || echo "skip $t (no inputs)"
done
```

Then analyze each handoff folder in Cursor, then:

```bash
for t in double_swing single_swing tracked_sliding cantilever_sliding; do
  python audit.py report "$t" 2>/dev/null || true
done
```

---

## Folder layout

```
tools/gate-photo-audit/
├── audit.py                 # CLI
├── gate_audit/              # Python package
├── schema/
│   ├── engine_rules.json    # Snapshot of gate-engine rules
│   └── observed_gate.schema.json
├── prompts/gate_analysis.md
├── templates/audit_report.md.j2
├── inputs/{gate_type}/      # Your photos (gitignored)
├── handoff/{gate_type}/     # Agent bundle (gitignored)
└── reports/                 # Markdown audits (commit if useful)
```

## Updating engine rules

When `gate-engine` changes, edit `schema/engine_rules.json` or re-export formulas from:

- `packages/gate-engine/src/types.ts`
- `packages/gate-engine/src/rules/geometry.ts`
- `packages/gate-engine/src/validation.ts`

---

## What this tool does NOT do

- Extract exact mm from photos without scale reference
- Replace Marius sign-off on fabrication rules
- Auto-fix the renderer — it produces the **brief** for that work

---

## Related docs

- `docs/frontend/CONFIGURATOR_PHASES_1_3_EXECUTION_PLAN_2026-05-19.md` — Phase 3 2D fidelity
- `docs/frontend/CLIENT_GATE_REQUIREMENTS_REFERENCE.md` — client categories and FROM prices
- `docs/adr/002-configurator-2d-first-on-demand-3d-ar.md` — 2D first, 3D later
