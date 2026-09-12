import { Suspense } from "react";
import AccountClient from "@/components/AccountClient";

export default function AccountPage() {
  return (
    <main className="account-wrap">
      <Suspense fallback={<p className="account-muted">Opening your file…</p>}>
        <AccountClient />
      </Suspense>
    </main>
  );
}
