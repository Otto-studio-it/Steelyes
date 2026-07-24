# Repository Rules

- Prefer existing components, hooks, and engine helpers over new abstractions.
- Keep domain logic in `packages/gate-engine`; keep UI code in `apps/web`.
- Remove compatibility wrappers after imports are migrated.
- Do not duplicate validation, pricing, or geometry in the UI layer.
- Keep changes focused and reversible.
- Preserve validation, security, and accessibility when simplifying code.
