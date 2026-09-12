"use client";

import { SITE } from "@/lib/contact";

function Frame({
  src,
  name,
  role,
  initials,
  note,
}: {
  src: string;
  name: string;
  role: string;
  initials: string;
  note?: string;
}) {
  return (
    <figure className="portrait">
      <div className="portrait-frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <span className="portrait-initials">{initials}</span>
      </div>
      <figcaption>
        <strong>{name}</strong>
        <em>{role}</em>
        {note ? <span>{note}</span> : null}
      </figcaption>
    </figure>
  );
}

export default function Founders() {
  const { him, her } = SITE.founders;
  return (
    <div className="founders">
      <Frame
        src={him.image}
        name={him.name}
        role={him.role}
        initials={him.initials}
      />
      <Frame
        src={her.image}
        name={her.name}
        role={her.role}
        initials={her.initials}
        note={her.note}
      />
    </div>
  );
}
