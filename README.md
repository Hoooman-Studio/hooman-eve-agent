# Hooman eve agent

A starter [eve](https://eve.dev/docs) agent you can connect to your Hooman Studio workspace. Build your own agent on it, host it on your own Vercel account, and your team starts threads with it from the threads page in Hooman.

## How it works

Hooman's Gateway talks to your agent over eve's normal HTTP session API. Every request carries a short-lived token that Hooman signs. It names the Hooman user (`sub`) and their workspace (`workspace_id`), and its audience is your agent's id. `agent/channels/eve.ts` accepts only those tokens, so nobody else can call your agent. Your tools read the caller from `ctx.session.auth.current` (see `agent/tools/hooman_caller.ts`).

Hooman stores only your agent's name and address. Your tools, secrets and data stay in your project.

## Connect it

1. Create a repository from this template, then deploy it to Vercel (`vercel deploy --prod`, or import the repository in Vercel). The agent uses Vercel AI Gateway for its model, so it needs no API key on Vercel.
2. In Hooman, open **Settings → Helpers → Agents** and click **Connect agent**. Give it a name and your deployment's address, such as `https://my-agent.vercel.app`. Only workspace admins and owners can do this.
3. Hooman shows two environment variables. Add them to your Vercel project and redeploy:

   ```
   HOOMAN_AGENT_ID=<shown in Hooman>
   HOOMAN_ISSUER=https://gateway.hooman.com
   ```

4. Start a thread: click **+** on the threads page and pick your agent under **Agents**.

Check that it is locked: `curl -X POST https://my-agent.vercel.app/eve/v1/session` should answer `401`.

## Build on it

- `agent/instructions.md`: what the agent is for.
- `agent/agent.ts`: the model.
- `agent/tools/`: one file per tool. Read the caller from `ctx.session.auth.current.attributes.workspace_id` to keep data per workspace.
- `agent/tools/ask_question.ts`: lets the agent ask the user a question. Hooman shows it with its options.

Run it locally with `npm run dev`. Locally, eve skips the Hooman check, so you can chat in the terminal.

## What Hooman shows

Text messages, tool calls, questions and approvals. Attachments are not sent to agents yet.
