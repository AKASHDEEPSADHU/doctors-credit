---
name: Imported Next.js preview constraints
description: Why DCREDIT preserves its Next.js backend and how Replit's scaffolds can conflict with it.
---

Keep DCREDIT's imported Next.js app, Google OAuth, Dodo and Cloudflare D1 architecture. The separate Vite/Express scaffold is not the application source of truth.

**Why:** the user explicitly required existing Next.js as the source of truth and prohibited architecture replacement for Phase 1.

**How to apply:** Do not implement DCREDIT features in the scaffolds or migrate its database. Make sure preview `/api` traffic reaches Next.js rather than a more-specific scaffold route.

Artifact-managed commands run from the artifact directory, not the workspace root. Imported apps outside that directory require appropriately relative commands.

**Why:** a root-relative run command failed with an artifact-local ENOENT during preview setup.

**How to apply:** Check the working directory before changing an imported app's managed command.

Disabling Next.js agent-rule generation removes its managed instruction block; it does not merely stop future rewrites.

**Why:** disabling automatic generation unexpectedly deleted the imported app's instruction file because it contained only the managed block.

**How to apply:** Preserve custom/imported agent instructions outside Next's managed markers when disabling generation.
