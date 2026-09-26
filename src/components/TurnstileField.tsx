"use client";

import { useEffect, useRef } from "react";

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  remove?: (id: string) => void;
};

export default function TurnstileField({ siteKey }: { siteKey?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const key = siteKey?.trim() || "";

  useEffect(() => {
    const el = ref.current;
    if (!key || !el) return;
    let cancelled = false;

    const render = () => {
      const api = (window as unknown as { turnstile?: TurnstileApi }).turnstile;
      if (cancelled || !ref.current || !api || widgetId.current) return Boolean(widgetId.current);
      ref.current.innerHTML = "";
      widgetId.current = api.render(ref.current, {
        sitekey: key,
        theme: "light",
      });
      return true;
    };

    const scriptId = "cf-turnstile";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      document.head.appendChild(script);
    }
    script.addEventListener("load", render);
    const timer = window.setInterval(() => {
      if (render()) window.clearInterval(timer);
    }, 200);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
      script?.removeEventListener("load", render);
      const api = (window as unknown as { turnstile?: TurnstileApi }).turnstile;
      if (widgetId.current && api?.remove) api.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [key]);

  if (!key) {
    return (
      <p className="enroll-error">
        The verification check did not load. Refresh the page and try again.
      </p>
    );
  }

  return <div className="turnstile" ref={ref} />;
}
