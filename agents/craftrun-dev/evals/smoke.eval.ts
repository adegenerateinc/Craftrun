import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineEval } from "@grok/agent-sdk/evals";

const fixture = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../fixtures/vague-void-rift.txt"),
  "utf8",
).trim();

export default defineEval({
  tags: ["smoke", "hillclimb"],
  description:
    "Vague design stops with record_blocker instead of inventing features.",
  async test(t) {
    await t.send(fixture);
    t.succeeded();
    t.calledTool("record_blocker");
  },
});
