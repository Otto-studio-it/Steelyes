---
title: Architecture Decision Records
description: Index and policy for ADRs (Architectural Decision Records)
owner: Ruben (project lead)
status: Active
last_updated: 2026-04-22
---

# Architecture Decision Records (ADRs)

Locked policy for documenting architectural decisions, trade-offs, and deviations from locked rules.

---

## Policy

### When to Write an ADR

**Mandatory** (write before implementation):
- Deviation from docs/ARCHITECTURE_RULES.md, docs/STACK_RULES.md, or docs/DESIGN_RULES.md
- Trade-off decisions (choose between two valid approaches)
- New technology or significant dependency changes
- Breaking changes to API, schema, or component contracts
- Security or performance trade-offs

**Optional** (document for clarity):
- Unusual design patterns adopted for this project
- Constraints that shaped a decision
- Complex state management flows

**Not needed:**
- Routine feature implementation (follows existing patterns)
- Bug fixes (unless they change architecture)
- Code refactoring (unless it changes module boundaries)

### Approval Process

- **Author:** Developer or AI agent proposing the decision
- **Status:**
  - `Proposed` — awaiting review (initial state)
  - `Accepted` — approved by project lead (Ruben) and ready for implementation
  - `Superseded` — replaced by a later ADR (link to successor)
  - `Rejected` — not accepted; rationale documented
- **Self-approval:** Ruben (project lead) auto-approves ADRs for documented decisions already locked in `docs/ARCHITECTURE_RULES.md`, `docs/STACK_RULES.md`, etc. (e.g., Supabase EU region is in ARCHITECTURE_RULES.md, so 001-supabase-eu-region.md is accepted automatically)
- **Review gate:** If uncertain, escalate to project owner before merging

### Numbering Scheme

- Sequential: 001, 002, 003, …
- Format: `docs/adr/NNN-kebab-case-title.md`
- Do NOT reuse numbers
- Do NOT sort by importance or date (sequential only)

---

## Template

```markdown
---
adr_number: NNN
title: <Short decision title>
status: Accepted | Proposed | Rejected | Superseded
date_proposed: YYYY-MM-DD
date_accepted: YYYY-MM-DD
author: <Name or AI Agent>
supersedes: <ADR number if applicable>
superseded_by: <ADR number if applicable>
---

# NNN. <Decision Title>

## Status

<Accepted | Proposed | Rejected | Superseded by ADR NNN>

## Context

<What problem or opportunity prompted this decision? What constraints exist?
Include relevant business or technical context.>

**Example:**
> We serve customers in the EU and must comply with GDPR data residency requirements.
> We evaluated Supabase (managed) vs. self-hosted Postgres. Supabase reduces DevOps burden
> and offers EU region support. Latency is slightly higher (+10ms) than US-east, but acceptable
> for our configurator workload.

## Decision

<What are we deciding to do, and why?
Be specific and concrete.>

**Example:**
> We will use Supabase with EU region (Frankfurt) for all Steelyes environments.
> All database.env files will specify the EU region connection string.
> This replaces any previous consideration of US-region Supabase.

## Consequences

### Positive
- <benefit>
- <benefit>

### Negative
- <trade-off or cost>
- <trade-off or cost>

### Effort Required
- <implementation effort>
- <ongoing maintenance burden>

**Example:**
#### Positive
- GDPR compliant by default (data residency in EU)
- Managed service (no database patching or backup responsibility)
- Realtime subscriptions reduce API latency

#### Negative
- Latency +10ms from UK (Frankfurt → UK ~10ms round-trip)
- Cannot easily migrate to US region without full data export/import
- EU region has fewer API replicas (higher failure impact)

#### Effort Required
- 1 day: update .env files, test connection
- Ongoing: monitor latency in production, alert if Supabase EU has incidents

## Alternatives Considered

### Option 1: US-region Supabase
- **Pros:** Lower latency, more infrastructure resilience
- **Cons:** GDPR violation (data must stay in EU), extra compliance work
- **Why rejected:** Non-negotiable GDPR requirement

### Option 2: Self-hosted Postgres (on AWS RDS EU)
- **Pros:** Full control, no vendor lock-in, GDPR compliant
- **Cons:** DevOps burden (patching, backups, scaling), slower to deploy
- **Why rejected:** Team lacks Postgres DBA expertise; Supabase managed service better fit for 13-week timeline

### Option 3: Multi-region Supabase (EU + US failover)
- **Pros:** Compliance + low latency + resilience
- **Cons:** Significantly more complex replication logic, cost 2x
- **Why rejected:** Early stage; overengineered until we have multi-region demand

## Implementation Notes

- Update `.env.local`, `.env.staging`, `.env.production` to use EU connection string
- Run `npx supabase link` with EU region parameter
- All future migrations run against EU region
- Staging and production use same EU region (no region drift)
- Monitor Supabase status page (https://status.supabase.com) for EU-specific incidents

## Related Documents

- docs/STACK_RULES.md (Supabase EU requirement)
- docs/ARCHITECTURE_RULES.md (database layer, auth, RLS)
- STEELYES_ARCHITECTURE.md (original decision source)

## Revision History

| Date       | Author | Change                           |
| ---------- | ------ | -------------------------------- |
| 2026-04-22 | Ruben  | Initial: document EU region decision |
```

---

## Index of Decisions

| # | Title | Status | Date Accepted | Supersedes | Notes |
|---|-------|--------|---------------|------------|-------|
| [001](./001-supabase-eu-region.md) | Supabase EU Region | Accepted | 2026-04-22 | — | GDPR compliance, data residency requirement |

---

## How to Add an ADR

1. **Write:** Create `docs/adr/NNN-title.md` using the template above
2. **Number:** Increment from the last ADR (next number = last + 1)
3. **Fill frontmatter:** adr_number, title, status, date_proposed, author
4. **Sections:** Status, Context, Decision, Consequences (Positive/Negative/Effort), Alternatives, Implementation Notes, Related Documents
5. **Review:** If status=Proposed, notify Ruben. If Accepted (self-approved), move to step 6
6. **Commit:** `git commit -m "docs(adr): NNN title"` (separate commit, not bundled with code)
7. **Update index:** Add row to table above
8. **PR:** Include ADR commit in feature PR if it blocks implementation; otherwise standalone PR

---

## Querying ADRs

**Find decisions about [topic]:**
```bash
grep -r "Context" docs/adr/ | grep -i "<keyword>"
```

**See all Accepted decisions:**
```bash
grep "status: Accepted" docs/adr/*.md
```

**See all Proposed (pending):**
```bash
grep "status: Proposed" docs/adr/*.md
```

---

## Linking from Code

In code comments or docs, reference ADRs like:
```
// See ADR-001 for why we use Supabase EU region
// Rationale: GDPR data residency requirement
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
```

---

**Last reviewed:** 2026-04-22
**Next review:** Quarterly or when ADR count >10
**Owner:** Ruben (approver)
