export default function PrivacyPage() {
  return (
    <main id="main" className="legal">
      <p className="eyebrow">Privacy</p>
      <h1>How we hold what you tell us.</h1>
      <p>
        DCredit is a care-coordination platform, not a hospital. We collect what
        an assessment needs: name, email, optional phone and country, and the
        records you choose to send.
      </p>
      <h2>What we collect</h2>
      <p>
        Google sign-in (name and email), package payments processed by Stripe,
        order history, and messages you send. We do not put medical records in
        URLs. We do not log medical details unnecessarily.
      </p>
      <h2>HIPAA</h2>
      <p>
        This website does not claim HIPAA compliance unless and until that
        program is fully implemented and maintained for the relevant workflows.
      </p>
      <h2>Your file</h2>
      <p>
        After the $5 assessment you may see payments, a patient ID and a
        verification code at /account. Ask us to close the file and we will stop
        using it for coordination.
      </p>
    </main>
  );
}
