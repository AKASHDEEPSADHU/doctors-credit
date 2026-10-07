import { TECHNOLOGY_CARDS } from "@/lib/india-medical-achievements";
import { ImageTile } from "@/components/editorial/ImageTile";
import { SectionLabel } from "@/components/editorial/SectionLabel";

const GALLERY = TECHNOLOGY_CARDS.filter((card) => card.title !== "Transplantation");

export function MedicalTechnologyGallery() {
  return (
    <section className="ma-tech" id="advanced-technology">
      <div className="shell">
        <SectionLabel>Selected tertiary capability</SectionLabel>
        <h2>Advanced medical technology</h2>
        <p className="section-lede">
          Image-led notes on technologies found at selected Indian tertiary
          centres. Availability depends on the hospital, specialty and team.
        </p>
        <ul className="ed-mosaic">
          {GALLERY.map((card, index) => (
            <li key={card.title}>
              <ImageTile
                title={card.title}
                text={card.text}
                note="Availability varies by institution"
                image={card.image}
                imageAlt={`Representative image for ${card.title}. Not a named hospital.`}
                imagePosition={card.position}
                size={index === 0 ? "lg" : index < 3 ? "md" : "sm"}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
