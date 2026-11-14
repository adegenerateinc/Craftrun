# Craftrun agents

Agent SDK projects that build and QA the NeoForge 1.21.1 pack.

| Slug | Path | Role |
| --- | --- | --- |
| `craftrun-dev` | `agents/craftrun-dev` | Build Agent — implements specs from `/design/` |
| `craftrun-qa` | `agents/craftrun-qa` | QA Agent — reviews Build changes; does not implement fixes |

Each project has its own `package.json`. Install and run from that folder.

```bash
cd agents/craftrun-dev && npm install
npx --yes "@grok/agent-sdk@0.6.0" login
npx --yes "@grok/agent-sdk@0.6.0" dev --repo adegenerateinc/Craftrun

cd ../craftrun-qa && npm install
npx --yes "@grok/agent-sdk@0.6.0" dev --repo adegenerateinc/Craftrun
```

Hillclimb fixtures and freeze lines: [HILLCLIMB.md](./HILLCLIMB.md).
