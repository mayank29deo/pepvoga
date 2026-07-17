"use client";

import { useEffect, useState } from "react";

// A cinematic, session-once intro: a fast montage of adventure niches
// (TREK → SURF → DIVE → CLIMB → FLY → RIDE) with full-bleed imagery flashes by,
// then resolves into the PEPVOGA wordmark + tagline, and the panel lifts away to
// the hero. "One home for every kind of adventure." Respects reduced-motion.
const REEL = [
  { word: "TREK", place: "Himalayas", img: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1600&q=75" },
  { word: "SURF", place: "Uluwatu", img: "https://images.unsplash.com/photo-1455264745730-cb3b76250ae8?auto=format&fit=crop&w=1600&q=75" },
  { word: "DIVE", place: "Raja Ampat", img: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1600&q=75" },
  { word: "CLIMB", place: "Yosemite", img: "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=1600&q=75" },
  { word: "FLY", place: "Bir Billing", img: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=1600&q=75" },
  { word: "RIDE", place: "Karakoram", img: "https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=1600&q=75" },
];

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
    }, 6650);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, []);

  if (!show) return null;

  return (
    <div className="pv-intro" aria-hidden>
      <div className="pv-reel">
        {REEL.map((f, i) => (
          <div
            key={f.word}
            className="pv-frame"
            style={{ "--d": `${(0.3 + i * 0.52).toFixed(2)}s` } as React.CSSProperties}
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

      <div className="pv-intro-inner">
        <span className="pv-intro-coord">28°36′N · 77°12′E · ALT 216 M</span>
        <span className="pv-intro-mask">
          <span className="pv-intro-word">PEPVOGA</span>
        </span>
        <span className="pv-intro-line" />
        <span className="pv-intro-sub">Every adventure. One home for the untamed.</span>
      </div>
    </div>
  );
}
