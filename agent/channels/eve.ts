import {
  type AuthFn,
  extractBearerToken,
  localDev,
  verifyOidc,
} from "eve/channels/auth";
import { eveChannel } from "eve/channels/eve";

/**
 * Accepts only requests Hooman signed for this agent. Hooman sends a
 * short-lived token naming the Hooman user (`sub`) and workspace
 * (`workspace_id`), with this agent's id as its audience. Tools read the
 * caller from `ctx.session.auth.current`.
 */
function hooman(): AuthFn<Request> {
  const issuer = process.env.HOOMAN_ISSUER ?? "https://gateway.hooman.com";
  const agentId = process.env.HOOMAN_AGENT_ID;
  if (!agentId) console.warn("HOOMAN_AGENT_ID is not set: Hooman cannot reach this agent.");
  return async (request) => {
    if (!agentId) return null;
    const token = extractBearerToken(request.headers.get("authorization"));
    const result = await verifyOidc(token, { issuer, audiences: [agentId] });
    // A person, so user-scoped connections can sign in as them.
    return result.ok ? { ...result.sessionAuth, principalType: "user" } : null;
  };
}

export default eveChannel({
  // localDev() only opens `eve dev`; a deployment accepts Hooman alone.
  auth: [hooman(), localDev()],
});
