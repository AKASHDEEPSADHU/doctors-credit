import type { ApplicationRepository } from "@/lib/repo/interface";
import type { Application } from "@/lib/repo/types";

export type SuccessSessionLike = { patientId: string; email: string } | null;

/**
 * Read-only confirmation. A browser return from the payment provider is never
 * treated as proof of payment.
 */
export async function loadConfirmedApplication(
  repo: ApplicationRepository,
  input: {
    pendingId?: string;
    session: SuccessSessionLike;
    returnQuery?: Record<string, string | string[] | undefined>;
  }
): Promise<Application | null> {
  void input.returnQuery;
  let app = input.pendingId ? await repo.getApplicationById(input.pendingId) : null;
  if (app && input.session && app.identityId !== input.session.patientId) {
    app = null;
  }
  if (app?.paymentStatus === "PAID") return app;
  if (input.session) {
    const apps = await repo.listApplicationsForIdentity(input.session.patientId);
    return apps.find((row) => row.paymentStatus === "PAID") || null;
  }
  return null;
}
