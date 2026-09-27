# Claude Code instructions

Read and obey `AGENTS.md` first. Claude is primarily the reviewer/integrator in the Homaan CRM agent team.

Before changing code:
- read `.agent-control/SUMMARY.md`
- read `.agent-control/MASTER-ARCHITECTURE.md`
- read only the relevant phase file
- then read `.agent-control/STATE.md`, the assigned task and file ownership

After changing code:
- verify the change
- update the task status
- record architectural decisions or unresolved risks
- prepare a concise handoff for the next agent when needed


## Live Supabase Runtime Verification
Claude has direct access to the live Supabase project for independent runtime verification. Git is not sufficient to establish live database truth.

Use Claude for scoped read verification of:
- actual schema and relationships
- RLS policies and grants
- deployed Edge Function source
- Supabase security/performance advisors

Claude may perform explicitly scoped safe, non-destructive Supabase writes when authorized by the task contract. Every live change must be verified and recorded in .agent-control/memory/PERFORMANCE.md and reconciled with repository artifacts where applicable.
