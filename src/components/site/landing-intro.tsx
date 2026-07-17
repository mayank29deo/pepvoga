"use client";

import { useEffect, useState } from "react";

// Plays once per browser session: on an ink backdrop the PEPVOGA wordmark
// rises out of a clip mask, an orange accent line draws under it, the tagline
// fades up — then the whole panel lifts away to reveal the hero. Respects
// prefers-reduced-motion. Pure CSS (see .pv-intro in globals.css).
export function LandingIntro() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    if (sessionStorage.getItem("pv-intro-shown")) return;
    sessionStorage.setItem("pv-intro-shown", "1");
    setShow(true);
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => {
      setShow(false);
      document.body.style.overflow = "";
    }, 2750);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, []);

  if (!show) return null;

  return (
    <div className="pv-intro" aria-hidden>
      <div className="pv-intro-inner">
        <span className="pv-intro-coord">28°36′N · 77°12′E · ALT 216 M</span>
        <span className="pv-intro-mask">
          <span className="pv-intro-word">PEPVOGA</span>
        </span>
        <span className="pv-intro-line" />
        <span className="pv-intro-sub">A marketplace for the untamed</span>
      </div>
    </div>
  );
}
