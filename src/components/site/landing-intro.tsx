"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// A cinematic, session-once intro: a fast montage of adventure niches
// (TREK → SURF → DIVE → CLIMB → FLY → RIDE) with full-bleed imagery flashes by,
// then resolves into the PEPVOGA wordmark + tagline, and the panel lifts away to
// the hero. Skippable (button or Esc). Respects reduced-motion.
const REEL = [
  { word: "TREK", place: "Himalayas", img: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1600&q=75" },
  { word: "SURF", place: "Uluwatu", img: "https://images.unsplash.com/photo-1455264745730-cb3b76250ae8?auto=format&fit=crop&w=1600&q=75" },
  { word: "DIVE", place: "Raja Ampat", img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=75" },
  { word: "CLIMB", place: "Yosemite", img: "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=1600&q=75" },
  { word: "FLY", place: "Bir Billing", img: "https://images.unsplash.com/photo-1471247511763-88a722fc9919?auto=format&fit=crop&w=1600&q=75" },
  { word: "RIDE", place: "Karakoram", img: "https://images.unsplash.com/photo-1471506480208-91b3a4cc78be?auto=format&fit=crop&w=1600&q=75" },
];

export function LandingIntro() {
  const [show, setShow] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setShow(false);
    document.body.style.overflow = "";
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    if (sessionStorage.getItem("pv-intro-shown")) return;
    sessionStorage.setItem("pv-intro-shown", "1");
    setShow(true);
    document.body.style.overflow = "hidden";
    timer.current = setTimeout(dismiss, 8550);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      if (timer.current) clearTimeout(timer.current);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [dismiss]);

  if (!show) return null;

  return (
    <div className="pv-intro">
      <div className="pv-reel" aria-hidden>
        {REEL.map((f, i) => (
          <div
            key={f.word}
            className="pv-frame"
            style={{ "--d": `${(0.3 + i * 0.8).toFixed(2)}s` } as React.CSSProperties}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={f.img} alt="" className="pv-frame-img" draggable={false} />
            <div className="pv-frame-shade" />
            <div className="pv-frame-text">
              <span className="pv-frame-place">{f.place}</span>
              <span className="pv-frame-word">{f.word}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="pv-intro-inner" aria-hidden>
        <span className="pv-intro-coord">28°36′N · 77°12′E · ALT 216 M</span>
        <span className="pv-intro-mask">
          <span className="pv-intro-word">PEPVOGA</span>
        </span>
        <span className="pv-intro-line" />
        <span className="pv-intro-sub">Every adventure. One home for the untamed.</span>
      </div>

      <button type="button" onClick={dismiss} className="pv-intro-skip" aria-label="Skip intro">
        Skip <span aria-hidden>→</span>
      </button>
    </div>
  );
}
