import { SITE, whatsappHref } from "@/lib/contact";

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
        . WhatsApp is available for non-emergency coordination.
      </p>
      <p>
        US business hours and a toll-free number will be published when the line
        is staffed. Until then, the $5 assessment is the reliable way to open a
        file.
      </p>
      <p>
        India support hours follow the coordination team once a journey package
        is active.
      </p>
      <p>
        <a className="btn-ghost" href={whatsappHref()}>
          WhatsApp DCredit
        </a>
      </p>
      <p>
        DCredit is not an emergency medical service. If you are experiencing an
        emergency, call 911 or seek immediate local emergency care.
      </p>
    </main>
  );
}
