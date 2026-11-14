import { prompt } from "@grok/agent-sdk";
import { defineTool } from "@grok/agent-sdk/tools";
import * as z from "zod/v4";

const kindSchema = z.enum(["missing", "vague", "world_bible_conflict", "ambiguous"]);

type BlockerRecord = {
  recorded: true;
  path: "/design/blockers.md";
  markdown: string;
  specPath: string;
  kind: z.infer<typeof kindSchema>;
  reason: string;
};

export default defineTool({
  description: prompt`
    Stop QA guessing when a change is ambiguous or conflicts with
    world_bible.md. Call this before writing /design/blockers.md.
    Do not invent design or lore to force a PASS.
  `,
  execution: "server",
  effect: "idempotent",
  inputSchema: z.object({
    specPath: z
      .string()
      .describe(
        "Path under /design/ or world_bible.md related to the ambiguity, e.g. /design/world_bible.md",
      ),
    kind: kindSchema.describe("Why QA cannot finish without Design input."),
    reason: z
      .string()
      .describe("Concrete question or conflict. Include the change under review."),
    suggestedQuestion: z
      .string()
      .optional()
      .describe("One question for the Design agent that would unblock QA."),
  }),
  dryRunResult: ({ specPath, kind, reason, suggestedQuestion }): BlockerRecord => ({
    recorded: true,
    path: "/design/blockers.md",
    markdown: formatBlocker({ specPath, kind, reason, suggestedQuestion }),
    specPath,
    kind,
    reason,
  }),
  async execute({ specPath, kind, reason, suggestedQuestion }, ctx): Promise<BlockerRecord> {
    const markdown = formatBlocker({
      specPath,
      kind,
      reason,
      suggestedQuestion,
    });
    await ctx.host.kv.put(`qa-blocker:${specPath}`, {
      specPath,
      kind,
      reason,
      suggestedQuestion: suggestedQuestion ?? "",
      at: new Date().toISOString(),
    });
    return {
      recorded: true,
      path: "/design/blockers.md",
      markdown,
      specPath,
      kind,
      reason,
    };
  },
});

function formatBlocker(input: {
  specPath: string;
  kind: z.infer<typeof kindSchema>;
  reason: string;
  suggestedQuestion?: string;
}): string {
  const lines = [
    `## Blocker: ${input.specPath}`,
    "",
    `- Kind: ${input.kind}`,
    `- Reason: ${input.reason}`,
    `- From: QA Agent`,
  ];
  if (input.suggestedQuestion) {
    lines.push(`- Question for Designer: ${input.suggestedQuestion}`);
  }
  lines.push("");
  return lines.join("\n");
}
