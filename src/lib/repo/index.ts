import { appEnv, isDeployed, sheetsWriteAllowed } from "@/lib/env";
import type { D1Like } from "@/lib/repo/d1";
import type { ApplicationRepository } from "@/lib/repo/interface";
import { upsertCrmRow } from "@/lib/repo/sheets";
import type { Application } from "@/lib/repo/types";

async function getD1(): Promise<D1Like | null> {
  try {
    const mod = await import("@opennextjs/cloudflare");
    const ctx = await mod.getCloudflareContext({ async: true });
    const db = (ctx.env as { DB?: D1Like }).DB;
    return db || null;
  } catch {
    return null;
  }
}

async function projectToSheets(app: Application) {
  if (!sheetsWriteAllowed()) return;
  await upsertCrmRow(app);
}

let cached: ApplicationRepository | null = null;

export async function getRepository(): Promise<ApplicationRepository> {
  if (cached && typeof cached.listPaidSlotOccupancy === "function") {
    return cached;
  }
  cached = null;
  const d1 = await getD1();
  if (d1) {
    const { createD1Repository } = await import("@/lib/repo/d1");
    cached = createD1Repository(d1, projectToSheets);
    return cached;
  }
  if (isDeployed()) {
    throw new Error("Server configuration is incomplete.");
  }
  const { createJsonRepository } = await import("@/lib/repo/json");
  cached = createJsonRepository(`data/${appEnv()}-store.json`, projectToSheets);
  return cached;
}

export function resetRepositoryCache() {
  cached = null;
}

