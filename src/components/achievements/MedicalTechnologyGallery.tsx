import { TECHNOLOGY_CARDS } from "@/lib/india-medical-achievements";

export function MedicalTechnologyGallery() {
  return (
    <section className="ma-tech" id="advanced-technology">
      <div className="shell">
        <p className="eyebrow">Selected tertiary capability</p>
        <h2>Advanced medical technology</h2>
        <p className="section-lede">
          Depending on the institution and specialty, Indian tertiary hospitals
          now use technologies including robotic surgery, advanced radiation
          therapy, proton therapy, PET-CT, PET-MRI, cardiac intervention,
          transplantation and image-guided procedures.
        </p>
        <ul className="ma-tech-grid">
          {TECHNOLOGY_CARDS.map((card) => (
            <li key={card.title}>
              <article>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.image}
                  alt={`Representative image for ${card.title}. Not a named hospital.`}
                  style={{ objectPosition: card.position }}
                />
                <div>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                  <small>Availability varies by institution</small>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
