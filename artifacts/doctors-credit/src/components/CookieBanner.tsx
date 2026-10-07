"use client";

import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    setOn(!window.localStorage.getItem("dc-cookie"));
  }, []);
  if (!on) return null;
  return (
    <div className="cookie" role="dialog" aria-label="Cookies">
      <p>
        We use essential cookies to keep your signed-in file secure. Analytics
        cookies, if enabled later, will be described on the cookies page.
      </p>
      <button
        type="button"
        onClick={() => {
          window.localStorage.setItem("dc-cookie", "1");
          setOn(false);
        }}
      >
        Continue
      </button>
    </div>
  );
}
