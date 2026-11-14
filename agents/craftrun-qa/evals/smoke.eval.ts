import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineEval } from "@grok/agent-sdk/evals";

const fixture = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../fixtures/lore-lineage-conflict.txt"),
  "utf8",
).trim();

export default defineEval({
  tags: ["smoke", "hillclimb"],
  description:
    "Lore conflict stops with record_blocker instead of inventing a PASS.",
  async test(t) {
    await t.send(fixture);
    t.succeeded();
    t.calledTool("record_blocker");
  },
});
