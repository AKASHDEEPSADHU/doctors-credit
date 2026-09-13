import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// V1 skips R2 incremental cache to keep infrastructure on the Workers free tier.
// Add an R2 binding later if Next.js ISR cache becomes necessary.
export default defineCloudflareConfig({});
