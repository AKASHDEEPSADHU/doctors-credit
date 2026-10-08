---
name: Imported Next.js preview constraints
description: Why DCREDIT preserves its Next.js backend and how Replit's scaffolds can conflict with it.
---

Keep DCREDIT's imported Next.js app, Google OAuth and Cloudflare D1 architecture. Preserve Dodo only for historical payments; the user requested Cashfree for new Phase 1 payments after Dodo denied onboarding. The separate Vite/Express scaffold is not the application source of truth.

**Why:** the user explicitly required existing Next.js as the source of truth and prohibited architecture replacement for Phase 1.

**How to apply:** Do not implement DCREDIT features in the scaffolds or migrate its database. Make sure preview `/api` traffic reaches Next.js rather than a more-specific scaffold route.

Artifact-managed commands run from the artifact directory, not the workspace root. Imported apps outside that directory require appropriately relative commands.

**Why:** a root-relative run command failed with an artifact-local ENOENT during preview setup.

**How to apply:** Check the working directory before changing an imported app's managed command.

Disabling Next.js agent-rule generation removes its managed instruction block; it does not merely stop future rewrites.

**Why:** disabling automatic generation unexpectedly deleted the imported app's instruction file because it contained only the managed block.

**How to apply:** Preserve custom/imported agent instructions outside Next's managed markers when disabling generation.

Next.js development-origin wildcards may reject Replit preview hosts with nested subdomains. A blocked HMR connection can prevent client hydration, leaving account loading screens indefinitely even when JavaScript assets return HTTP 200.

**Why:** the proxied hostname was rejected despite the wildcard allowlist; admitting the exact runtime development hostname restored hydration and account API requests.

**How to apply:** When protected pages remain loading without calling their APIs, check development-origin rejection logs before changing authentication or persistence. Explicitly allow the current development hostname without weakening production headers.

Agent-side development-domain probes can use internal DNS routing and therefore do not establish public webhook reachability.

**Why:** Cashfree diagnostics reached the Next.js handler through an internal address, while the actual public ingress redirected to organization Replit Shield and denied unauthenticated access before Next.js. The earlier probes concealed the public access restriction.

**How to apply:** Compare workspace DNS with public DNS and verify the public ingress while preserving hostname and TLS validation. Inspect redirects without printing authentication query values. Keep signature verification intact; changes to hosting or authorized external access require approval.
