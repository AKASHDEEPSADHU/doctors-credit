"use client";

import { useEffect, useRef } from "react";

export default function TurnstileField() {
  const ref = useRef<HTMLDivElement>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey || !ref.current) return;
    const scriptId = "cf-turnstile";
    const render = () => {
      const w = window as unknown as {
        turnstile?: { render: (el: HTMLElement, opts: Record<string, string>) => void };
      };
      if (!ref.current || !w.turnstile) return;
      ref.current.innerHTML = "";
      w.turnstile.render(ref.current, {
        sitekey: siteKey,
        theme: "light",
      });
    };
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.onload = render;
      document.head.appendChild(script);
    } else {
      render();
    }
  }, [siteKey]);

  if (!siteKey) return null;
  return <div className="turnstile" ref={ref} />;
}
