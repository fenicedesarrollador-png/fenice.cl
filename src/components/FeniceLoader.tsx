"use client";

// Pantalla de carga de primera visita.
//
// El overlay se renderiza en el SSR (forma parte del HTML inicial), por lo que
// cubre la pagina desde el primer pixel: no hay flash de "web -> loader -> web"
// ni espera a un iframe. La ANIMACION la controla React con useEffect + refs, de
// modo que nunca pelea con la hidratacion (el intento anterior manipulaba el DOM
// desde un <script> inline y la hidratacion dejaba la barra congelada).
//
// El "gate" por sesion (mostrar solo una vez) vive como script de servidor en el
// layout: agrega `html.fenice-loader-seen` antes del primer pintado para ocultar
// el overlay sin parpadeo en visitas repetidas. Aqui solo LEEMOS ese estado.

import { useEffect, useRef, useState } from "react";

const DURATION = 3600; // ms que tarda la barra en ir de 0 a 100

const LOADER_CSS = `
html.fenice-loader-seen #fenice-loader {
  display: none !important;
}

#fenice-loader {
  --green:#1f9c5a;
  --orange:#e8702a;
  --ink:#1c2430;
  --muted:#5a6675;
  --sky1:#eef3f8;
  --sky2:#d7e2ec;
  --sky3:#c3d3e3;
  position: fixed;
  inset: 0;
  z-index: 2147483000;
  background: linear-gradient(180deg, var(--sky1) 0%, var(--sky2) 55%, var(--sky3) 100%);
  font-family: var(--font-inter), 'Segoe UI', Roboto, Arial, sans-serif;
  opacity: 1;
  visibility: visible;
  transition: opacity 0.45s ease, visibility 0.45s ease;
  overflow: hidden;
}
#fenice-loader.is-hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}
#fenice-loader *{ box-sizing:border-box; margin:0; padding:0; }

#fenice-loader .stage{
  position:relative;
  width:100%;
  height:100%;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  overflow:hidden;
  padding:3vh 4vw;
}

#fenice-loader .backdrop{
  position:absolute;
  inset:0;
  overflow:hidden;
  pointer-events:none;
  z-index:0;
}
#fenice-loader .sun-glow{
  position:absolute;
  top:-12%;
  right:-8%;
  width:46vw;
  height:46vw;
  max-width:520px;
  max-height:520px;
  border-radius:50%;
  background:radial-gradient(circle, rgba(255,236,200,0.65) 0%, rgba(255,236,200,0) 70%);
}
#fenice-loader .skyline{
  position:absolute;
  left:-15%;
  bottom:26px;
  width:130%;
  height:90px;
  opacity:0.45;
  z-index:0;
  animation: fl-skylineMove 38s linear infinite;
}
@keyframes fl-skylineMove{ from{ transform:translateX(-12%);} to{ transform:translateX(0%);} }
#fenice-loader .cloud{
  position:absolute;
  background:#fff;
  border-radius:50px;
  opacity:0.7;
  filter:blur(1px);
  animation: fl-cloudMove linear infinite;
}
@keyframes fl-cloudMove{ from{ transform:translateX(0);} to{ transform:translateX(120vw);} }

#fenice-loader .scene{
  position:relative;
  width:min(94vw, 820px);
  margin-bottom:clamp(20px, 4vh, 40px);
  z-index:1;
}
#fenice-loader .wind-layer{
  position:absolute;
  top:8%;
  left:-6%;
  width:112%;
  height:62%;
  overflow:hidden;
  pointer-events:none;
  z-index:1;
}
#fenice-loader .wind-line{
  position:absolute;
  height:3px;
  width:70px;
  border-radius:4px;
  background:linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(120,140,160,0.6) 50%, rgba(255,255,255,0) 100%);
  left:-12%;
  animation: fl-windMove linear infinite;
}
@keyframes fl-windMove{ from{ transform:translateX(0);} to{ transform:translateX(132vw);} }

#fenice-loader .truck-stage{
  position:relative;
  width:100%;
  height:0;
  padding-top:41.366%;
  z-index:2;
}
#fenice-loader .truck-shadow{
  position:absolute;
  left:6%;
  bottom:-4%;
  width:84%;
  height:7%;
  background:radial-gradient(ellipse at center, rgba(15,20,28,0.45) 0%, rgba(15,20,28,0.22) 45%, rgba(15,20,28,0) 80%);
  border-radius:50%;
  filter:blur(2px);
  animation: fl-shadowPulse 0.5s ease-in-out infinite;
  z-index:1;
}
@keyframes fl-shadowPulse{
  0%,100%{ transform:scaleX(1) scaleY(1); opacity:0.85; }
  50%{ transform:scaleX(0.93) scaleY(0.8); opacity:0.6; }
}
#fenice-loader .truck-wrap{
  position:absolute;
  inset:0;
  transform-origin:50% 90%;
  animation: fl-truckBounce 0.5s ease-in-out infinite;
  z-index:2;
}
@keyframes fl-truckBounce{
  0%,100%{ transform:translateY(0) rotate(0deg); }
  25%{ transform:translateY(-0.6%) rotate(0.12deg); }
  50%{ transform:translateY(0) rotate(0deg); }
  75%{ transform:translateY(-0.4%) rotate(-0.1deg); }
}
#fenice-loader .truck-img{
  position:absolute;
  inset:0;
  width:100%;
  height:100%;
  display:block;
  user-select:none;
  -webkit-user-drag:none;
  filter:drop-shadow(0 6px 10px rgba(0,0,0,0.15));
}

#fenice-loader .wheel{
  position:absolute;
  width:8.9%;
  aspect-ratio:1/1;
  border-radius:50%;
  transform:translate(-50%, -50%);
  transform-origin:center;
  z-index:5;
  pointer-events:none;
  filter:drop-shadow(0 0 1px rgba(0,0,0,0.38));
}
#fenice-loader .wheel.front{ left:20.60%; top:81.60%; }
#fenice-loader .wheel.rear-one{ left:74.75%; top:81.60%; }
#fenice-loader .wheel.rear-two{ left:88.90%; top:81.60%; }
#fenice-loader .wheel-spin{
  position:absolute;
  inset:0;
  border-radius:50%;
  animation:fl-spinWheel 0.42s linear infinite;
  background:
    radial-gradient(circle at center, #262b30 0 8%, transparent 9%),
    radial-gradient(circle at center, #d9dde1 0 21%, #6d747a 22% 27%, transparent 28%),
    conic-gradient(
      from 0deg,
      #c9d0d6 0deg 22deg,
      #666e75 22deg 38deg,
      #eef1f3 38deg 72deg,
      #70787f 72deg 90deg,
      #c9d0d6 90deg 126deg,
      #666e75 126deg 146deg,
      #eef1f3 146deg 204deg,
      #70787f 204deg 226deg,
      #c9d0d6 226deg 300deg,
      #666e75 300deg 328deg,
      #eef1f3 328deg 360deg
    );
  box-shadow:
    inset 0 0 0 2px rgba(0,0,0,0.38),
    inset 0 0 0 9px rgba(255,255,255,0.20),
    0 1px 3px rgba(0,0,0,0.30);
}
#fenice-loader .wheel-spin::before{
  content:'';
  position:absolute;
  inset:18%;
  border-radius:50%;
  background:
    radial-gradient(circle at center, #30363a 0 22%, transparent 23%),
    conic-gradient(
      from 0deg,
      transparent 0deg 27deg,
      rgba(42,46,50,0.78) 27deg 43deg,
      transparent 43deg 72deg,
      rgba(42,46,50,0.78) 72deg 88deg,
      transparent 88deg 144deg,
      rgba(42,46,50,0.78) 144deg 160deg,
      transparent 160deg 216deg,
      rgba(42,46,50,0.78) 216deg 232deg,
      transparent 232deg 288deg,
      rgba(42,46,50,0.78) 288deg 304deg,
      transparent 304deg 360deg
    );
}
#fenice-loader .wheel-spin::after{
  content:'';
  position:absolute;
  inset:0;
  border-radius:50%;
  background:conic-gradient(from 0deg,
    rgba(255,255,255,0) 0deg,
    rgba(255,255,255,0.55) 18deg,
    rgba(255,255,255,0) 50deg,
    rgba(255,255,255,0) 180deg,
    rgba(255,255,255,0.35) 210deg,
    rgba(255,255,255,0) 245deg,
    rgba(255,255,255,0) 360deg);
  mix-blend-mode:soft-light;
}
@keyframes fl-spinWheel{ from{ transform:rotate(0deg);} to{ transform:rotate(-360deg);} }

#fenice-loader .smoke{
  position:absolute;
  left:28.5%;
  bottom:46%;
  width:2.2%;
  aspect-ratio:1/1;
  border-radius:50%;
  background:radial-gradient(circle, rgba(150,155,160,0.8) 0%, rgba(150,155,160,0.32) 60%, rgba(150,155,160,0) 100%);
  animation: fl-smokeRise 2s ease-out infinite;
  pointer-events:none;
  z-index:1;
}
@keyframes fl-smokeRise{
  0%{ transform:translate(0,0) scale(0.5); opacity:0.8; }
  55%{ opacity:0.5; }
  100%{ transform:translate(7vw,-9vw) scale(2.6); opacity:0; }
}
#fenice-loader .dust{
  position:absolute;
  left:90%;
  bottom:18%;
  width:0.9%;
  aspect-ratio:1/1;
  border-radius:50%;
  background:#9b8b76;
  opacity:0.7;
  animation: fl-dustFly 0.7s ease-out infinite;
  pointer-events:none;
  z-index:1;
}
@keyframes fl-dustFly{
  0%{ transform:translate(0,0) scale(1); opacity:0.75; }
  100%{ transform:translate(5vw, 1.4vw) scale(0.3); opacity:0; }
}

#fenice-loader .road{
  position:relative;
  width:100%;
  height:clamp(8px, 1.4vh, 14px);
  background:#262a30;
  border-radius:6px;
  margin-top:clamp(10px, 2vh, 22px);
  box-shadow:0 8px 16px rgba(0,0,0,0.22);
  overflow:hidden;
  z-index:2;
}
#fenice-loader .road::before{
  content:'';
  position:absolute;
  top:50%;
  left:-20%;
  width:140%;
  height:26%;
  transform:translateY(-50%);
  background-image:repeating-linear-gradient(90deg, #f4c542 0 24px, transparent 24px 50px);
  animation: fl-dashMove 0.65s linear infinite;
  opacity:0.95;
}
@keyframes fl-dashMove{
  from{ transform:translateY(-50%) translateX(0); }
  to{ transform:translateY(-50%) translateX(50px); }
}
#fenice-loader .road-fade{
  width:100%;
  height:10px;
  background:radial-gradient(ellipse at center, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0) 75%);
  margin-top:-2px;
}

#fenice-loader .panel{
  position:relative;
  width:min(92vw, 480px);
  text-align:center;
  z-index:1;
}
#fenice-loader .brand{
  display:flex;
  align-items:center;
  justify-content:center;
  gap:8px;
  margin-bottom:clamp(10px, 1.6vh, 16px);
}
#fenice-loader .brand svg{ width:22px; height:22px; flex-shrink:0; }
#fenice-loader .brand span{
  font-size:clamp(13px,2.2vw,16px);
  letter-spacing:2px;
  color:var(--green);
  font-weight:700;
  text-transform:uppercase;
}
#fenice-loader .phrase{
  font-size:clamp(15px,2.6vw,19px);
  color:var(--ink);
  font-weight:600;
  margin-bottom:clamp(12px, 2vh, 18px);
  min-height:2.8em;
  line-height:1.35;
  display:flex;
  align-items:center;
  justify-content:center;
  text-align:center;
  opacity:1;
  visibility:visible;
  transition:opacity 0.16s ease, visibility 0s linear 0.16s;
  will-change:opacity;
  backface-visibility:hidden;
}
#fenice-loader .phrase.is-hidden{ opacity:0; visibility:hidden; }
#fenice-loader .bar-outer{
  position:relative;
  width:100%;
  height:12px;
  background:rgba(20,30,40,0.08);
  border-radius:20px;
  overflow:hidden;
  box-shadow:inset 0 1px 3px rgba(0,0,0,0.15);
}
#fenice-loader .bar-inner{
  position:relative;
  height:100%;
  width:0%;
  border-radius:20px;
  background:linear-gradient(90deg, var(--green), var(--orange));
  overflow:hidden;
}
#fenice-loader .bar-inner::after{
  content:'';
  position:absolute;
  inset:0;
  background:linear-gradient(110deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 70%);
  background-size:220% 100%;
  animation:fl-shimmer 1.3s linear infinite;
}
@keyframes fl-shimmer{ from{ background-position:120% 0; } to{ background-position:-20% 0; } }
#fenice-loader .bar-meta{
  display:flex;
  justify-content:space-between;
  margin-top:8px;
  font-size:clamp(11px,1.8vw,13px);
  color:var(--muted);
  letter-spacing:0.3px;
}
#fenice-loader .pct{ font-weight:700; color:var(--ink); }

@media (max-width:768px){
  #fenice-loader .stage{ padding:max(16px, env(safe-area-inset-top)) 4.5vw max(18px, env(safe-area-inset-bottom)); }
  #fenice-loader .scene{ width:min(92vw, 620px); margin-bottom:14px; }
  #fenice-loader .skyline{ bottom:18px; height:64px; opacity:0.32; }
  #fenice-loader .panel{ width:min(90vw, 420px); }
}
@media (max-width:480px){
  #fenice-loader .stage{ padding:max(14px, env(safe-area-inset-top)) 5vw max(16px, env(safe-area-inset-bottom)); }
  #fenice-loader .scene{ width:min(94vw, 420px); margin-bottom:10px; }
  #fenice-loader .truck-stage{ padding-top:43.5%; }
  #fenice-loader .road{ width:96%; margin-inline:auto; margin-top:10px; }
  #fenice-loader .road-fade{ width:96%; margin-inline:auto; }
  #fenice-loader .panel{ width:min(92vw, 340px); }
  #fenice-loader .brand{ margin-bottom:10px; }
  #fenice-loader .brand span{ font-size:12px; letter-spacing:1.8px; }
  #fenice-loader .phrase{ font-size:clamp(14px,5.6vw,17px); margin-bottom:12px; }
  #fenice-loader .bar-outer{ height:10px; }
  #fenice-loader .bar-meta{ font-size:11px; margin-top:7px; }
}
@media (max-height:560px){
  #fenice-loader .stage{ justify-content:flex-start; padding-top:max(12px, env(safe-area-inset-top)); padding-bottom:max(12px, env(safe-area-inset-bottom)); }
  #fenice-loader .scene{ width:min(84vw, 480px); margin-bottom:8px; }
  #fenice-loader .panel{ width:min(86vw, 320px); }
  #fenice-loader .brand{ margin-bottom:8px; }
  #fenice-loader .phrase{ font-size:14px; margin-bottom:10px; }
  #fenice-loader .bar-outer{ height:10px; }
  #fenice-loader .bar-meta{ font-size:10px; margin-top:6px; }
}
@media (prefers-reduced-motion: reduce){
  #fenice-loader .truck-wrap,
  #fenice-loader .truck-shadow,
  #fenice-loader .wheel-spin,
  #fenice-loader .skyline,
  #fenice-loader .cloud,
  #fenice-loader .wind-line,
  #fenice-loader .smoke,
  #fenice-loader .dust,
  #fenice-loader .road::before,
  #fenice-loader .bar-inner::after{ animation:none !important; }
}
`;

// Frases cortas y claras. Rotan lento (ver PHRASE_INTERVAL) para poder leerse.
const PHRASES = [
  "Preparando tu despacho",
  "Cargando combustible",
  "Ya casi listo",
];
const PHRASE_INTERVAL = 1600; // ms que cada frase permanece visible

export default function FeniceLoader() {
  const [active, setActive] = useState(true);
  const [leaving, setLeaving] = useState(false);

  const barRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const phraseRef = useRef<HTMLDivElement>(null);
  const windRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Gate: solo una vez por sesion. El script del layout ya oculto el overlay
    // (via CSS) en visitas repetidas; aqui simplemente lo desmontamos.
    let seen = false;
    try {
      seen = sessionStorage.getItem("fenice-loader-shown") === "1";
    } catch {}
    if (seen) {
      setActive(false);
      return;
    }
    try {
      sessionStorage.setItem("fenice-loader-shown", "1");
    } catch {}

    const html = document.documentElement;
    const body = document.body;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    const restoreScroll = () => {
      html.style.overflow = "";
      body.style.overflow = "";
    };

    // Lineas de viento
    const wl = windRef.current;
    if (wl) {
      for (let i = 0; i < 8; i++) {
        const line = document.createElement("div");
        line.className = "wind-line";
        line.style.top = Math.random() * 100 + "%";
        line.style.width = 50 + Math.random() * 70 + "px";
        line.style.animationDuration = 0.8 + Math.random() * 0.9 + "s";
        line.style.animationDelay = "-" + Math.random() * 1.6 + "s";
        wl.appendChild(line);
      }
    }

    // Frases rotativas
    let pIdx = 0;
    let phraseBusy = false;
    const phraseTimer = window.setInterval(() => {
      const el = phraseRef.current;
      if (!el || phraseBusy) return;
      phraseBusy = true;
      el.classList.add("is-hidden");
      window.setTimeout(() => {
        pIdx = (pIdx + 1) % PHRASES.length;
        el.textContent = PHRASES[pIdx];
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            el.classList.remove("is-hidden");
            window.setTimeout(() => {
              phraseBusy = false;
            }, 180);
          }),
        );
      }, 180);
    }, PHRASE_INTERVAL);

    // Barra 0 -> 100 con easing sinusoidal (suave al iniciar y al terminar)
    let start: number | null = null;
    let raf = 0;
    let done = false;
    let holdTimer = 0;
    let fadeTimer = 0;

    const finish = () => {
      if (done) return;
      done = true;
      window.clearInterval(phraseTimer);
      cancelAnimationFrame(raf);
      if (barRef.current) barRef.current.style.width = "100%";
      if (pctRef.current) pctRef.current.textContent = "100%";
      holdTimer = window.setTimeout(() => {
        setLeaving(true);
        fadeTimer = window.setTimeout(() => {
          restoreScroll();
          setActive(false);
        }, 480);
      }, 260);
    };

    const frame = (ts: number) => {
      if (start === null) start = ts;
      const t = Math.min((ts - start) / DURATION, 1);
      const eased = 0.5 - 0.5 * Math.cos(Math.PI * t); // easeInOutSine
      const value = Math.round(eased * 100);
      if (barRef.current) barRef.current.style.width = value + "%";
      if (pctRef.current) pctRef.current.textContent = value + "%";
      if (t < 1) {
        raf = requestAnimationFrame(frame);
      } else {
        finish();
      }
    };
    raf = requestAnimationFrame(frame);

    // Red de seguridad: nunca quedarse mas de ~6s
    const safetyTimer = window.setTimeout(finish, DURATION + 2400);

    return () => {
      window.clearInterval(phraseTimer);
      cancelAnimationFrame(raf);
      window.clearTimeout(holdTimer);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(safetyTimer);
      restoreScroll();
    };
  }, []);

  if (!active) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: LOADER_CSS }} />
      <noscript>
        {/* Sin JS (crawlers/no-script): no ocultar el contenido tras la superposicion. */}
        <style dangerouslySetInnerHTML={{ __html: "#fenice-loader{display:none !important;}" }} />
      </noscript>

      <div
        id="fenice-loader"
        role="status"
        aria-live="polite"
        aria-label="Cargando Fenice SPA"
        className={leaving ? "is-hidden" : undefined}
      >
        <div className="stage">
          <div className="backdrop">
            <div className="sun-glow" />
            <div className="cloud" style={{ top: "8%", left: "10%", width: "90px", height: "26px", animationDuration: "22s" }} />
            <div className="cloud" style={{ top: "14%", left: "55%", width: "60px", height: "18px", animationDuration: "30s", animationDelay: "-10s" }} />
            <div className="cloud" style={{ top: "5%", left: "35%", width: "70px", height: "20px", animationDuration: "26s", animationDelay: "-4s" }} />
          </div>

          <div className="scene">
            <svg className="skyline" viewBox="0 0 1600 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="120" width="90" height="80" fill="#9fb3c8" />
              <rect x="110" y="80" width="60" height="120" fill="#a9bdce" />
              <rect x="190" y="140" width="120" height="60" fill="#9fb3c8" />
              <rect x="340" y="60" width="50" height="140" fill="#b1c3d2" />
              <rect x="420" y="110" width="90" height="90" fill="#9fb3c8" />
              <rect x="540" y="90" width="70" height="110" fill="#a9bdce" />
              <rect x="650" y="130" width="100" height="70" fill="#9fb3c8" />
              <rect x="800" y="120" width="90" height="80" fill="#9fb3c8" />
              <rect x="910" y="80" width="60" height="120" fill="#a9bdce" />
              <rect x="990" y="140" width="120" height="60" fill="#9fb3c8" />
              <rect x="1140" y="60" width="50" height="140" fill="#b1c3d2" />
              <rect x="1220" y="110" width="90" height="90" fill="#9fb3c8" />
              <rect x="1340" y="90" width="70" height="110" fill="#a9bdce" />
              <rect x="1450" y="130" width="100" height="70" fill="#9fb3c8" />
            </svg>

            <div className="wind-layer" ref={windRef} />

            <div className="truck-stage">
              <div className="truck-shadow" />
              <div className="truck-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="truck-img" src="/loader/truck.webp" alt="Camion cisterna Sociedad Fenice SPA" />
                <div className="wheel front"><div className="wheel-spin" /></div>
                <div className="wheel rear-one"><div className="wheel-spin" /></div>
                <div className="wheel rear-two"><div className="wheel-spin" /></div>
                <div className="smoke" style={{ animationDelay: "0s" }} />
                <div className="smoke" style={{ animationDelay: "0.7s", left: "29.5%" }} />
                <div className="smoke" style={{ animationDelay: "1.4s", left: "27.5%" }} />
                <div className="dust" style={{ animationDelay: "0s" }} />
                <div className="dust" style={{ animationDelay: "0.25s", left: "91.5%" }} />
                <div className="dust" style={{ animationDelay: "0.45s", left: "89%" }} />
              </div>
            </div>

            <div className="road" />
            <div className="road-fade" />
          </div>

          <div className="panel">
            <div className="brand">
              <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="fl-dropG" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#1f9c5a" />
                    <stop offset="100%" stopColor="#e8702a" />
                  </linearGradient>
                </defs>
                <path d="M16 2 C16 2 6 14 6 21 a10 10 0 0 0 20 0 C26 14 16 2 16 2 Z" fill="url(#fl-dropG)" />
              </svg>
              <span>Sociedad Fenice SPA</span>
            </div>
            <div className="phrase" ref={phraseRef}>Preparando tu despacho</div>
            <div className="bar-outer">
              <div className="bar-inner" ref={barRef} />
            </div>
            <div className="bar-meta">
              <span>Cargando</span>
              <span className="pct" ref={pctRef}>0%</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
