import {
  defaultGitHubAuth,
  githubChannel,
} from "@grok/agent-sdk/channels/github";

export default githubChannel({
  botName: "craftrun-qa",
  // Issues + PRs share this channel; each delivery is a fresh session.
  continuation: "github.none/v2",
  // Pass repos at serve/deploy: --repo adegenerateinc/Craftrun
  cursorAccount: true,
  onIssue: (ctx, issue) => {
    if (issue.action !== "opened" && issue.action !== "reopened") {
      return null;
    }
    return { auth: defaultGitHubAuth(ctx) };
  },
  onPullRequest: (ctx, pr) => {
    if (pr.draft) {
      return null;
    }
    if (pr.action !== "opened" && pr.action !== "ready_for_review") {
      return null;
    }
    // Review Build Agent changes; do not implement fixes beyond text typos.
    return { auth: defaultGitHubAuth(ctx) };
  },
  onComment: (ctx, comment) => {
    if (!comment.body.includes("@craftrun-qa")) {
      return null;
    }
    return { auth: defaultGitHubAuth(ctx) };
  },
});
