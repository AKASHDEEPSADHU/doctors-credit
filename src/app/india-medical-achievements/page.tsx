import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { ACHIEVEMENT_SOURCES, SOURCE_GROUPS, sourceById } from "@/lib/india-medical-achievements";

export const metadata: Metadata = {
  title: "India's Medical Achievements | Doctor's Credit",
  description:
    "Explore India's medical achievements in complex surgery, transplantation, cancer care, pharmaceuticals, vaccines, medical technology and digital health, and understand what those achievements mean for an international patient considering whether India is worth investigating.",
  keywords: [
    "India medical achievements",
    "medical treatment in India",
    "India healthcare",
    "India medical tourism",
    "Indian hospitals",
    "medical care in India",
    "India healthcare capabilities",
    "India transplant medicine",
    "India cancer treatment",
    "India robotic surgery",
    "India pharmaceutical industry",
  ],
};

function Cite({ id }: { id: string }) {
  const source = sourceById(id);
  return (
    <p className="source">
      Source{source.note ? ` (${source.note})` : ""}:{" "}
      <a href={source.href} rel="noreferrer noopener">
        {source.label}
      </a>
    </p>
  );
}

export default function IndiaMedicalAchievementsPage() {
  return (
    <main id="main" className="achievements-page">
      <section className="ach-hero">
        <div className="shell ach-narrow">
          <p className="eyebrow">Research note</p>
          <h1>India&apos;s Medical Achievements</h1>
          <p className="lede">
            A closer look at the healthcare capabilities behind India&apos;s growing
            role in global care.
          </p>
          <p>
            India&apos;s healthcare system has evolved from pioneering surgical
            programs in the mid-20th century to a broad ecosystem spanning
            complex surgery, organ transplantation, cancer care, robotic
            procedures, medical devices, pharmaceuticals, vaccines and digital
            health.
          </p>
          <p>
            For someone considering treatment in India, the important question is
            not simply: “Is India cheaper?”
          </p>
          <p>
            It is: “Can India offer the expertise, technology, infrastructure and
            continuity of care appropriate for the treatment I am considering,
            and does that make sense for me?”
          </p>
            <p>DCredit believes that question deserves facts, not hype.</p>
            <figure className="ach-figure">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/editorial/innovation-imaging.jpg"
                alt="Brain imaging slices illustrating diagnostic technology that should be evaluated at a specific hospital, not assumed from a country."
              />
              <figcaption>
                Selected tertiary centres offer advanced diagnostics and
                treatment technology. Capability is institution-specific.
              </figcaption>
            </figure>
        </div>
      </section>

      <section className="band-soft">
        <div className="shell">
          <Reveal>
            <p className="eyebrow">Scale, with sources</p>
            <h2>India at a glance</h2>
            <p className="section-lede">
              National statistics describe India&apos;s healthcare ecosystem at
              scale. They do not establish the suitability or quality of a
              specific hospital, physician or treatment for an individual
              patient.
            </p>
            <ul className="ach-stats">
              <li>
                <article>
                  <p className="ach-stat-number">500,000+</p>
                  <p>
                    Foreign nationals arrived in India specifically for medical
                    treatment in 2025, according to Government of India data.
                  </p>
                  <Cite id="pib-medical-arrivals-2025" />
                </article>
              </li>
              <li>
                <article>
                  <p className="ach-stat-number">~20,000</p>
                  <p>
                    Organ transplants were performed in India in 2025,
                    representing roughly a fourfold increase from fewer than
                    5,000 in 2013.
                  </p>
                  <Cite id="pib-transplants-2025" />
                </article>
              </li>
              <li>
                <article>
                  <p className="ach-stat-number">~60%</p>
                  <p>
                    India accounts for approximately 60% of global vaccine
                    production by volume, according to Indian government sources.
                  </p>
                  <Cite id="pib-vaccines" />
                </article>
              </li>
              <li>
                <article>
                  <p className="ach-stat-number">~20%</p>
                  <p>
                    India supplies approximately 20% of the world&apos;s generic
                    medicines and exports pharmaceuticals to around 200 countries
                    and territories.
                  </p>
                  <Cite id="pib-pharma" />
                </article>
              </li>
              <li>
                <article>
                  <p className="ach-stat-number">94.87 crore</p>
                  <p>
                    ABHA digital health IDs had been created in India by 20 July
                    2026, alongside approximately 5.36 lakh registered health
                    facilities and 10.09 lakh healthcare professionals in
                    national digital-health registries. In international units,
                    those official figures are about 948.7 million IDs, 536,000
                    facilities and 1.01 million professionals.
                  </p>
                  <Cite id="pib-abdm-2026" />
                </article>
              </li>
              <li>
                <article>
                  <p className="ach-stat-label">Global pharmaceutical footprint</p>
                  <p>
                    India has the highest number of USFDA-approved pharmaceutical
                    manufacturing plants outside the United States, according to
                    Government of India material.
                  </p>
                  <Cite id="pib-usfda-plants" />
                </article>
              </li>
            </ul>
            <p className="ach-note">
              National statistics describe India&apos;s healthcare ecosystem at
              scale. They do not establish the suitability or quality of a
              specific hospital, physician or treatment for an individual
              patient.
            </p>
          </Reveal>
        </div>
      </section>

      <section>
        <div className="shell">
          <Reveal>
            <p className="eyebrow">Selected milestones</p>
            <h2>A history of medical firsts</h2>
            <p className="section-lede">
              These dates mark documented developments at specific institutions.
              They are not a ranking of Indian healthcare, and they do not mean
              every hospital later developed equivalent programs.
            </p>
            <ol className="ach-timeline">
              <li>
                <p className="ach-year">1961</p>
                <div>
                  <h3>Open-heart surgery</h3>
                  <p>
                    In May 1961, Dr. N. Gopinath and his team at Christian
                    Medical College, Vellore, performed an open-heart operation
                    using a pump-oxygenator to close a ventricular septal defect.
                  </p>
                  <p>
                    This was a landmark in the development of open-heart surgery
                    in India and illustrates the development of the specialist
                    surgical infrastructure required for complex cardiac care.
                  </p>
                  <Cite id="pmc-gopinath-1961" />
                </div>
              </li>
              <li>
                <p className="ach-year">1971</p>
                <div>
                  <h3>Kidney transplantation</h3>
                  <p>
                    The first successful kidney transplant in India was performed
                    at Christian Medical College, Vellore, on 2 February 1971.
                  </p>
                  <p>
                    The milestone marked the beginning of sustained development
                    of kidney-transplant programs across India.
                  </p>
                  <Cite id="ijn-kidney-1971" />
                </div>
              </li>
              <li>
                <p className="ach-year">1994</p>
                <div>
                  <h3>First successful heart transplant in India</h3>
                  <p>
                    On 3 August 1994, AIIMS New Delhi performed India&apos;s
                    first successful heart transplant.
                  </p>
                  <p>
                    Heart transplantation requires much more than an operation.
                    It depends on transplant medicine, intensive care,
                    immunosuppression, organ procurement, tissue matching and
                    long-term follow-up. This milestone does not mean that all
                    cardiac programs in India later developed equivalent
                    capabilities.
                  </p>
                  <Cite id="aiims-patient-care" />
                </div>
              </li>
              <li>
                <p className="ach-year">1998</p>
                <div>
                  <h3>Liver transplantation</h3>
                  <p>
                    Apollo Hospitals reports that India&apos;s first successful
                    pediatric and adult liver transplant procedures were
                    performed at Indraprastha Apollo Hospitals in New Delhi in
                    1998.
                  </p>
                  <p>
                    Liver transplantation represents highly multidisciplinary
                    care involving hepatology, transplant surgery, anesthesia,
                    intensive care, infectious disease management and long-term
                    follow-up.
                  </p>
                  <Cite id="apollo-transplant-milestones" />
                </div>
              </li>
              <li>
                <p className="ach-year">2006</p>
                <div>
                  <h3>Robotic surgery</h3>
                  <p>
                    Institutional accounts describe the introduction of
                    robotic-assisted surgery in India, including a successful
                    robotic radical prostatectomy at AIIMS in 2006.
                  </p>
                  <p>
                    Robotic surgery subsequently expanded into specialties such
                    as urology, gynecology, thoracic surgery, cardiac surgery and
                    others. Robotic surgery does not mean a robot performs
                    surgery independently. The surgeon controls the robotic
                    system.
                  </p>
                  <Cite id="apollo-robotic-urology" />
                </div>
              </li>
              <li>
                <p className="ach-year">2019</p>
                <div>
                  <h3>Proton therapy</h3>
                  <p>
                    Apollo Proton Cancer Centre in Chennai became India&apos;s
                    first proton therapy centre, with the facility inaugurated in
                    2019.
                  </p>
                  <p>
                    Proton therapy is an advanced form of radiation treatment
                    that can be useful in selected cancers where limiting
                    radiation exposure to surrounding tissues is important. That
                    does not mean proton therapy is automatically better than
                    other radiation treatments.
                  </p>
                  <Cite id="apollo-proton-2019" />
                </div>
              </li>
              <li>
                <p className="ach-year">2026</p>
                <div>
                  <h3>Continuing advances in highly specialized care</h3>
                  <p>
                    In February 2026, the Government of India reported a
                    first-in-India tandem autologous stem-cell transplant for a
                    rare pediatric brain tumor at Homi Bhabha Cancer Hospital and
                    Research Centre, a Tata Memorial Centre unit.
                  </p>
                  <p>
                    This illustrates that Indian tertiary-care medicine continues
                    to expand into highly specialized and technically demanding
                    areas. It is an institution-specific development, not a
                    statement about every cancer centre.
                  </p>
                  <Cite id="pib-tandem-asct-2026" />
                </div>
              </li>
            </ol>
          </Reveal>
        </div>
      </section>

      <section className="band-soft">
        <div className="shell ach-narrow">
          <Reveal>
            <p className="eyebrow">Beyond the operating theatre</p>
            <h2>India&apos;s medical achievements beyond surgery</h2>
            <p>
              Surgery is only one part of the picture. India has also developed
              capability in pharmaceuticals, vaccines, medical devices, selected
              advanced technologies, organ transplantation at national scale and
              digital-health infrastructure. The sections below describe those
              areas with sources. None of them, taken alone, tells a patient
              which hospital or physician is appropriate.
            </p>
          </Reveal>
        </div>
      </section>

      <section>
        <div className="shell ach-narrow">
          <Reveal>
            <h2>Pharmaceuticals: medicines at global scale</h2>
            <p>
              India&apos;s pharmaceutical industry is one of its most significant
              contributions to global healthcare.
            </p>
            <p>
              The Government of India describes India as the third-largest
              pharmaceutical industry in the world by volume and the largest
              supplier of generic medicines, with Indian pharmaceutical exports
              reaching roughly 200 countries and territories. Government data
              also states that India supplies more than 70% of global
              antiretroviral medicines.
            </p>
            <Cite id="pib-pharma" />
            <p>
              This does not mean every medicine made in India is automatically
              equivalent, nor that every manufacturer has identical standards. It
              means India has developed a large pharmaceutical manufacturing,
              research and export ecosystem.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="band-soft">
        <div className="shell ach-narrow">
          <Reveal>
            <h2>Vaccines: a global manufacturing powerhouse</h2>
            <p>
              India has become one of the world&apos;s major vaccine
              manufacturing centres. Government sources estimate that India
              accounts for approximately 60% of global vaccine production by
              volume. Indian manufacturers also supply vaccines to international
              procurement systems and global health programs.
            </p>
            <Cite id="pib-vaccines" />
            <h3>Indigenous vaccine development</h3>
            <p>
              The ICMR-National Institute of Virology played a major role in
              development of Covaxin, India&apos;s indigenous COVID-19 vaccine.
              That is a documented development role. It is not a comparative
              claim about effectiveness or safety versus other vaccines.
            </p>
            <Cite id="niv-covaxin" />
          </Reveal>
        </div>
      </section>

      <section>
        <div className="shell ach-narrow">
          <Reveal>
            <h2>Medical-device innovation</h2>
            <p>
              India&apos;s healthcare achievements also include development of
              indigenous medical technologies. Sree Chitra Tirunal Institute for
              Medical Sciences and Technology has developed and commercialized
              technologies including artificial heart valves, blood bags,
              membrane oxygenators, hydrocephalus shunts, biomedical composites,
              diagnostic technologies and respiratory devices.
            </p>
            <Cite id="sctimst" />
            <p>
              One example is the Sree Chitra heart valve, developed as an
              indigenous cardiac device and cited by India&apos;s Department of
              Science &amp; Technology as an example of frugal medical
              innovation.
            </p>
            <Cite id="dst-chitra-valve" />
            <p>
              These examples illustrate India&apos;s history of combining
              clinical medicine, engineering and cost-conscious medical-device
              innovation. They do not mean every device used in India is
              indigenous, or that every centre uses the same equipment.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="band-soft">
        <div className="shell ach-narrow">
          <Reveal>
            <h2>Advanced medical technology</h2>
            <p>
              Depending on the institution and specialty, Indian tertiary
              hospitals now use technologies including robotic surgery, advanced
              radiation therapy, proton therapy, PET-CT, PET-MRI, advanced
              cardiac catheterization, transcatheter valve procedures, complex
              transplantation, image-guided procedures, and advanced neurological
              and spine surgery.
            </p>
            <aside className="ach-callout" aria-label="Technology availability">
              <p>
                Availability is hospital- and specialty-specific. The presence of
                a technology somewhere in India does not mean that every hospital
                offers it, or that it is appropriate for every patient.
              </p>
              <p>
                For an individual patient, the relevant question is whether the
                specific hospital and physician have the appropriate technology
                and experience for the specific procedure being considered.
              </p>
            </aside>
          </Reveal>
        </div>
      </section>

      <section>
        <div className="shell ach-narrow">
          <Reveal>
            <h2>Organ transplantation at national scale</h2>
            <p>
              Government data reports annual organ transplantation increasing
              from 4,990 transplants in 2013 to 18,911 in 2024. Deceased-donor
              transplants rose from 837 to 3,403 over the same period.
            </p>
            <Cite id="notto-annual-2025-26" />
            <p>
              A February 2026 Government of India update reported that annual
              transplantation reached nearly 20,000 in 2025, around four times
              the 2013 level.
            </p>
            <Cite id="pib-transplants-2025" />
            <p>
              The National Organ and Tissue Transplant Organization, together
              with regional and state organizations, provides a national
              framework for organ procurement, allocation and transplantation.
            </p>
            <Cite id="notto-home" />
            <p>
              National volume describes activity at scale. It does not tell a
              patient which transplant centre, wait-list rules or follow-up
              arrangements apply to a specific case.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="band-soft">
        <div className="shell ach-narrow">
          <Reveal>
            <h2>Digital health at national scale</h2>
            <p>
              Under the Ayushman Bharat Digital Mission, more than 94.87 crore
              ABHA IDs, 5.36 lakh health facilities and 10.09 lakh healthcare
              professionals had been registered as of 20 July 2026.
            </p>
            <Cite id="pib-abdm-2026" />
            <p>
              The Healthcare Professionals Registry provides verified
              professional identities, while the Health Facility Registry
              provides a national digital directory of healthcare facilities.
            </p>
            <Cite id="abdm-hpr" />
            <p>
              ABDM registration is not, by itself, a verification of clinical
              quality or a guarantee that a provider is suitable for a particular
              patient or procedure.
            </p>
          </Reveal>
        </div>
      </section>

      <section>
        <div className="shell ach-narrow">
          <Reveal>
            <h2>Quality and accreditation</h2>
            <p>
              India has developed formal healthcare accreditation mechanisms. The
              National Accreditation Board for Hospitals &amp; Healthcare
              Providers (NABH), a constituent board of the Quality Council of
              India, establishes healthcare standards intended to promote quality
              and patient safety.
            </p>
            <Cite id="nabh-find" />
            <p>
              For an international patient, this matters because India should not
              be evaluated as though every hospital is identical. The relevant
              question is: “Which hospital, which department, which physician and
              which accreditation or quality standards apply to my specific
              treatment?”
            </p>
            <p>
              NABH accreditation alone does not guarantee a good outcome. It is
              one quality signal among others that should be independently
              evaluated.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="band-soft">
        <div className="shell">
          <Reveal>
            <p className="eyebrow">For international patients</p>
            <h2>What this means if you are considering care in India</h2>
            <p className="section-lede">
              India&apos;s medical achievements do not automatically mean that
              treatment in India is the right choice. They do mean something more
              useful: there is a healthcare ecosystem worth investigating.
            </p>
            <div className="ach-narrow">
              <p>
                India has developed expertise in areas ranging from cardiac
                surgery and transplantation to oncology, reproductive medicine,
                minimally invasive surgery, robotic surgery, pharmaceuticals and
                medical technology. Technology is not the only question.
              </p>
            </div>
            <h3>Questions worth asking</h3>
            <ul className="ach-questions">
              <li>How frequently does the team perform the procedure?</li>
              <li>Who will actually perform it?</li>
              <li>What are the hospital&apos;s relevant accreditations?</li>
              <li>What are the physician and centre&apos;s outcomes for the specific procedure?</li>
              <li>What happens if something unexpected occurs?</li>
              <li>What happens after the patient returns home?</li>
            </ul>
            <div className="ach-narrow">
              <p>Cost alone should never decide a medical journey.</p>
              <p>
                A lower quoted procedure price can become much less attractive
                after considering travel, accommodation, companion expenses,
                recovery time, complications, repeat procedures and follow-up
                care.
              </p>
              <p>
                The correct comparison is not a home-country sticker price versus
                an India sticker price. It is total expected cost at home versus
                the total expected India journey, together with quality, clinical
                suitability, risk and continuity of care.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section>
        <div className="shell ach-narrow">
          <Reveal>
            <p className="eyebrow">What this does not mean</p>
            <h2>India&apos;s medical achievements are not a guarantee</h2>
            <p>
              A national record of capability is not the same as a recommendation
              for any one patient. These achievements do not mean India is the
              right setting for every procedure, that every hospital or physician
              has equivalent expertise, or that a technology used at some tertiary
              centres is appropriate in a specific case.
            </p>
            <p>
              They also do not mean cost should decide the journey, or that
              follow-up care after returning home will be simple.
              Those questions should be independently evaluated.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="band-navy">
        <div className="shell ach-narrow">
          <p className="eyebrow">Limits of the record</p>
          <h2>Medical achievements are not medical guarantees</h2>
          <p>
            India&apos;s national healthcare achievements demonstrate capability,
            innovation and scale.
          </p>
          <p>They do not guarantee an outcome for any individual patient.</p>
          <p>
            A patient&apos;s medical suitability, expected outcome, risks and
            treatment plan must be determined by appropriately qualified
            healthcare professionals.
          </p>
          <p>
            DCredit&apos;s role is to help patients explore the financial,
            practical and coordination questions surrounding planned
            international care. It is not a substitute for a physician, hospital
            evaluation or independent medical advice.
          </p>
        </div>
      </section>

      <section>
        <div className="shell ach-narrow">
          <Reveal>
            <h2>
              India has achievements worth knowing about. That does not mean
              India is right for everyone.
            </h2>
            <p>
              India has major tertiary-care hospitals, specialized centres,
              advanced technology in selected institutions, and a significant
              pharmaceutical and medical-device ecosystem.
            </p>
            <p>
              It also contains enormous variation in healthcare quality,
              infrastructure and expertise.
            </p>
            <p>We believe that distinction matters.</p>
            <p>
              DCredit does not ask a patient to trust India simply because India
              has impressive medical achievements. We believe patients should
              investigate the specific hospital, specific physician, specific
              procedure, expected economics and plan for care after returning
              home.
            </p>
            <p>
              Sometimes India may make sense. Sometimes it may not. The point is
              to make the decision with better information.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="band-soft">
        <div className="shell ach-narrow">
          <h2>Medical achievements are not medical advice.</h2>
          <p>
            India&apos;s healthcare achievements are presented for informational
            and educational purposes only. Nothing on this page constitutes a
            diagnosis, treatment recommendation, medical clearance, or guarantee
            of outcome.
          </p>
          <p>
            DCredit does not determine whether a patient is medically suitable
            for treatment in India. Patients should consult appropriately
            qualified healthcare professionals and independently evaluate
            hospitals, physicians, procedures, risks, costs and follow-up
            arrangements.
          </p>
        </div>
      </section>

      <section>
        <div className="shell">
          <p className="eyebrow">How this page was assembled</p>
          <h2>Sources &amp; methodology</h2>
          <p className="section-lede">
            Every statistic, milestone and institution-specific achievement on
            this page is tied to a cited source. Hospital websites are labeled as
            hospital-reported or institutional accounts, not as independent
            government findings. DCredit is not a source.
          </p>
          {SOURCE_GROUPS.map((group) => {
            const items = ACHIEVEMENT_SOURCES.filter((source) => source.group === group);
            if (!items.length) return null;
            return (
              <div key={group} className="ach-source-group">
                <h3>{group}</h3>
                <ul>
                  {items.map((source) => (
                    <li key={source.id}>
                      <a href={source.href} rel="noreferrer noopener">
                        {source.label}
                      </a>
                      {source.note ? ` (${source.note})` : ""}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section className="ach-cta">
        <div className="shell ach-narrow">
          <p className="eyebrow">Your first step is a conversation</p>
          <h2>Wondering whether India may make sense for your situation?</h2>
          <p>
            Talk with a DCredit care coordinator about planned treatment, your
            goals, timing and whether exploring care in India may make sense
            for you. Completing it does not mean a patient is medically
            approved for treatment in India.
          </p>
          <Link className="btn-solid" href="/enroll">
            Talk to a care coordinator
          </Link>
        </div>
      </section>
    </main>
  );
}
