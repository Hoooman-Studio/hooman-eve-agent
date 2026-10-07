import { defineTool } from "eve/tools";
import { z } from "zod";

/**
 * An example tool: who is asking, as Hooman's token names them. Scope
 * your own tools by the same fields, such as `workspace_id`.
 */
export default defineTool({
  description:
    "Look up the Hooman user who sent the current message and their workspace.",
  inputSchema: z.object({}),
  async execute(_input, ctx) {
    const caller = ctx.session.auth.current;
    if (!caller) return { signedIn: false };
    return {
      signedIn: true,
      userId: caller.subject ?? caller.principalId,
      name: caller.attributes.name ?? null,
      email: caller.attributes.email ?? null,
      workspaceId: caller.attributes.workspace_id ?? null,
    };
  },
});
