import { createCashfreeProvider } from "./cashfree";

// Only NEW Phase 1 assessments use this factory. Historical Dodo processing
// remains separate; the browser cannot select a payment provider.
export function assessmentProvider() {
  return createCashfreeProvider();
}
