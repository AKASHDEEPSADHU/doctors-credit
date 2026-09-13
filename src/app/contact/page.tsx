import { SITE, whatsappEnabled, whatsappHref } from "@/lib/contact";
import ContactForm from "@/components/ContactForm";

export const metadata = { title: "Contact — Doctor's Credit" };

export default function ContactPage() {
  return (
    <main id="main" className="legal">
      <p className="eyebrow">Contact</p>
      <h1>A conversation, not a booking desk.</h1>
      <p>
        Email{" "}
        <a href={`mailto:${SITE.email}`}>
          {SITE.email}
        </a>
        {whatsappEnabled() ? ". WhatsApp is available for general, non-emergency contact." : ""}
      </p>
      <p>
        Please do not submit medical records, diagnoses, prescriptions, imaging
        or other sensitive clinical documents through this form, email we have
        not requested, or WhatsApp.
      </p>
      <p>
        US business hours and a toll-free number will be published when the line
        is staffed. Until then, the $5 Initial Assessment is the reliable way to
        open a file.
      </p>
      <ContactForm />
      {whatsappEnabled() ? (
        <>
          <p>
            <a className="btn-ghost" href={whatsappHref()}>
              WhatsApp DCredit
            </a>
          </p>
          <p className="fine">
            Please do not send medical records or other sensitive clinical documents
            through WhatsApp.
          </p>
        </>
      ) : null}
      <p>
        DCredit is not an emergency medical service. If you are experiencing an
        emergency, call 911 or seek immediate local emergency care.
      </p>
    </main>
  );
}
