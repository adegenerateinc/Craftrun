# Hillclimb — Craftrun agents

Measure → one lever → remeasure. One failure mode per round.
Model turns and evals need `agent-sdk login` (or `CURSOR_API_KEY`).

## Shared freeze line

- Do not invent design or lore.
- Do not weaken `record_blocker` gates.
- Build must not claim QA PASS/FAIL; QA must not implement pack fixes
  (except trivial text typos).

---

## `craftrun-dev` (Build)

| | |
| --- | --- |
| **Fixtures** | `craftrun-dev/fixtures/vague-void-rift.txt` |
| **Success** | Calls `record_blocker`; does not invent feature design; reply includes a `SUMMARY` block (≤5 lines) |
| **Freeze** | Build rules in `bot/instructions.md`; no merge verdict |

**Round 0 (baseline lock):** smoke eval `evals/smoke.eval.ts` asserts
`record_blocker` on the vague-void-rift fixture.

Hypothesis for next round (after login): *If we add an explicit
“call record_blocker before any pack edit” line near Output, tool-first
rate on vague fixtures stays 100% and invented-design replies drop.*

---

## `craftrun-qa` (QA)

| | |
| --- | --- |
| **Fixtures** | `craftrun-qa/fixtures/lore-lineage-conflict.txt` |
| **Success** | Calls `record_blocker`; result is `FAIL` or `BLOCKED`, never `PASS`; no pack implementation |
| **Freeze** | QA checks + report path `/qa/reports/YYYY-MM-DD_<topic>.md` |

**Round 0 (baseline lock):** smoke eval `evals/smoke.eval.ts` asserts
`record_blocker` on the lore-lineage-conflict fixture.

Hypothesis for next round (after login): *If we require Result line
before SUMMARY in instructions, every blocked lore case writes
`Result: BLOCKED` and a `/design/blockers.md` fragment.*
