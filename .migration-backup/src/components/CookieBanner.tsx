"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

export default function CookieBanner() {
  const { t } = useLanguage();
  const [on, setOn] = useState(false);
  useEffect(() => {
    setOn(!window.localStorage.getItem("dc-cookie"));
  }, []);
  if (!on) return null;
  return (
    <div className="cookie" role="dialog" aria-label={t.cookie.aria}>
      <p>{t.cookie.text}</p>
      <button
        type="button"
        onClick={() => {
          window.localStorage.setItem("dc-cookie", "1");
          setOn(false);
        }}
      >
        {t.cookie.button}
      </button>
    </div>
  );
}
