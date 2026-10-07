import {
  ACHIEVEMENT_SOURCES,
  LIBRARY_GROUPS,
} from "@/lib/india-medical-achievements";

export function SourceLibrary() {
  return (
    <section className="ma-sources" id="sources">
      <div className="shell">
        <p className="ed-label">Research library</p>
        <h2>Sources &amp; methodology</h2>
        <p className="section-lede">
          Every statistic and historical milestone on this page is tied to a
          source. Institutional or hospital-reported milestones are identified
          as such.
        </p>
        <p className="ma-source-count">
          <strong>{ACHIEVEMENT_SOURCES.length}</strong>
          <span>Cited sources across government, research, institutions and quality systems.</span>
        </p>
        {LIBRARY_GROUPS.map((group) => {
          const items = ACHIEVEMENT_SOURCES.filter((source) => source.libraryGroup === group);
          if (!items.length) return null;
          return (
            <div key={group} className="ma-source-group">
              <h3>{group}</h3>
              <ul className="ma-source-grid">
                {items.map((source) => (
                  <li key={source.id}>
                    <article>
                      <p className="ma-source-type">{source.badge}</p>
                      <h4>{source.title}</h4>
                      <p>{source.publisher}</p>
                      <p className="ma-source-meta">
                        <span>{source.year}</span>
                        <span>Verified {source.verified}</span>
                      </p>
                      {source.note ? <p className="ma-source-note">{source.note}</p> : null}
                      <a href={source.href} rel="noreferrer noopener" target="_blank">
                        Read source
                        <span aria-hidden="true"> →</span>
                      </a>
                    </article>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
