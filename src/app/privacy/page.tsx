export const metadata = { title: "Privacy | Doctor's Credit" };

export default function PrivacyPage() {
  return (
    <main id="main" className="legal">
      <p className="eyebrow">Privacy</p>
      <h1>How we hold what you tell us.</h1>
      <p>
        DCredit is an international planned-care decision and coordination
        platform, not a hospital or diagnostic service. The $5 Initial
        Assessment collects operational details a coordinator needs: name,
        email, phone, location, procedure category, healthcare coverage or
        funding status and timeline. It is not a medical-record intake.
      </p>
      <h2>What we collect</h2>
      <p>
        Google sign-in (name and email), the $5 Initial Assessment payment
        processed by Dodo Payments (we never store card numbers, CVV or banking
        passwords), application status, and messages you send. Payment is marked
        paid only after Dodo confirms it on the server. Operational fields may
        be copied to a private Google Sheet used as a temporary CRM. That sheet
        is not public and is not a healthcare database. We do not store full
        medical history, imaging, prescriptions or detailed diagnoses there.
      </p>
      <h2>What we do not provide in V1</h2>
      <p>
        DCredit does not currently operate a medical-record vault, secure
        document-upload service, or account-gated clinical files. Please do not
        send MRI scans, CT scans, prescriptions, diagnoses or other sensitive
        clinical documents through this website, the contact form or WhatsApp.
      </p>
      <h2>Healthcare privacy laws</h2>
      <p>
        For example, in the United States, this website does not claim HIPAA
        compliance. We do not claim a medical-record security program that is
        not in place.
      </p>
      <h2>Your file</h2>
      <p>
        After payment is confirmed you receive an Application ID and a
        Conversation Verification ID. Those identifiers are for genuine DCredit
        communication. They are not passwords, OTPs or banking PINs. Ask us to
        close the file and we will stop using it for coordination.
      </p>
    </main>
  );
}
