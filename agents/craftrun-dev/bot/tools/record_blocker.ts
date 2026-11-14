import { prompt } from "@grok/agent-sdk";
import { defineTool } from "@grok/agent-sdk/tools";
import * as z from "zod/v4";

const kindSchema = z.enum(["missing", "vague", "world_bible_conflict", "infeasible"]);

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
    Stop work on a design item that is missing, vague, conflicts with
    world_bible.md, or is infeasible. Call this before writing
    /design/blockers.md. Never invent design to work around the gap.
  `,
  execution: "server",
  effect: "idempotent",
  inputSchema: z.object({
    specPath: z
      .string()
      .describe(
        "Path under /design/ (or world_bible.md) that blocks work, e.g. /design/features/void-rift.md",
      ),
    kind: kindSchema.describe("Why work must stop on this item."),
    reason: z
      .string()
      .describe("Concrete question or conflict for the Design agent."),
    suggestedQuestion: z
      .string()
      .optional()
      .describe("One question that would unblock this item."),
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
    await ctx.host.kv.put(`blocker:${specPath}`, {
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
    `- From: Build Agent`,
  ];
  if (input.suggestedQuestion) {
    lines.push(`- Question for Designer: ${input.suggestedQuestion}`);
  }
  lines.push("");
  return lines.join("\n");
}
