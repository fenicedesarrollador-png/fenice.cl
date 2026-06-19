const loaderCss = `
html.loader-active,
body.loader-active {
  overflow: hidden;
}

#fenice-loader {
  position: fixed;
  inset: 0;
  z-index: 9999;
  overflow: hidden;
  background:
    radial-gradient(circle at 85% 8%, rgba(255,255,255,0.5) 0, rgba(255,255,255,0.08) 7%, transparent 8%),
    radial-gradient(circle at 72% 10%, rgba(255,255,255,0.35) 0, rgba(255,255,255,0.08) 6%, transparent 7%),
    radial-gradient(circle at 90% 5%, rgba(255,255,255,0.4) 0, rgba(255,255,255,0.08) 5%, transparent 6%),
    radial-gradient(circle at top right, rgba(255, 149, 63, 0.28) 0, transparent 24%),
    linear-gradient(180deg, #f5e8de 0%, #f4ddcc 44%, #2f3543 100%);
  opacity: 1;
  transition: opacity .38s ease, visibility .38s ease;
}

#fenice-loader.is-leaving {
  opacity: 0;
  visibility: hidden;
}

#fenice-loader * {
  box-sizing: border-box;
}

#fenice-loader .fenice-loader__stage {
  position: relative;
  width: 100%;
  min-height: 100vh;
  padding: 3vh 4vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

#fenice-loader .fenice-loader__backdrop {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

#fenice-loader .fenice-loader__sun {
  position: absolute;
  top: -12%;
  right: -8%;
  width: min(46vw, 520px);
  aspect-ratio: 1 / 1;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(255, 200, 155, 0.55) 0%, rgba(255, 200, 155, 0.0) 70%);
}

#fenice-loader .fenice-loader__cloud {
  position: absolute;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.34);
  filter: blur(1px);
  animation: feniceLoaderCloud linear infinite;
}

#fenice-loader .fenice-loader__cloud--one {
  top: 8%;
  left: 8%;
  width: 90px;
  height: 26px;
  animation-duration: 22s;
}

#fenice-loader .fenice-loader__cloud--two {
  top: 14%;
  left: 55%;
  width: 60px;
  height: 18px;
  animation-duration: 30s;
  animation-delay: -10s;
}

#fenice-loader .fenice-loader__cloud--three {
  top: 5%;
  left: 34%;
  width: 70px;
  height: 20px;
  animation-duration: 26s;
  animation-delay: -4s;
}

#fenice-loader .fenice-loader__scene {
  position: relative;
  z-index: 2;
  width: min(94vw, 880px);
  margin-bottom: clamp(20px, 4vh, 40px);
}

#fenice-loader .fenice-loader__skyline {
  position: absolute;
  left: -15%;
  bottom: 26px;
  width: 130%;
  height: 90px;
  opacity: 0.18;
  animation: feniceLoaderSkyline 38s linear infinite;
}

#fenice-loader .fenice-loader__wind {
  position: absolute;
  top: 8%;
  left: -6%;
  width: 112%;
  height: 62%;
  overflow: hidden;
  pointer-events: none;
}

#fenice-loader .fenice-loader__wind span {
  position: absolute;
  left: -12%;
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(255,255,255,0), rgba(120,140,160,0.45), rgba(255,255,255,0));
  animation: feniceLoaderWind linear infinite;
}

#fenice-loader .fenice-loader__wind span:nth-child(1) { top: 11%; width: 72px; animation-duration: 1.45s; }
#fenice-loader .fenice-loader__wind span:nth-child(2) { top: 22%; width: 58px; animation-duration: 1.2s; animation-delay: -.4s; }
#fenice-loader .fenice-loader__wind span:nth-child(3) { top: 33%; width: 84px; animation-duration: 1.55s; animation-delay: -.85s; }
#fenice-loader .fenice-loader__wind span:nth-child(4) { top: 47%; width: 68px; animation-duration: 1.1s; animation-delay: -.3s; }
#fenice-loader .fenice-loader__wind span:nth-child(5) { top: 58%; width: 76px; animation-duration: 1.3s; animation-delay: -.95s; }
#fenice-loader .fenice-loader__wind span:nth-child(6) { top: 39%; width: 51px; animation-duration: 1.22s; animation-delay: -.55s; }

#fenice-loader .fenice-loader__truck-wrap {
  position: relative;
  padding-top: 29%;
}

#fenice-loader .fenice-loader__truck-shadow {
  position: absolute;
  left: 12%;
  bottom: 7%;
  width: 76%;
  height: 7%;
  border-radius: 999px;
  background: radial-gradient(ellipse at center, rgba(15,20,28,0.28) 0%, rgba(15,20,28,0.08) 54%, rgba(15,20,28,0) 80%);
  animation: feniceLoaderShadow .55s ease-in-out infinite;
}

#fenice-loader .fenice-loader__truck {
  position: absolute;
  inset: 0;
  animation: feniceLoaderBounce .55s ease-in-out infinite;
}

#fenice-loader .fenice-loader__tank {
  position: absolute;
  left: 13%;
  top: 24%;
  width: 48%;
  height: 23%;
  border-radius: 32px;
  background: linear-gradient(180deg, #dce4ef 0%, #c6d1df 100%);
  border: 4px solid #ff6b0f;
}

#fenice-loader .fenice-loader__tank::before {
  content: "";
  position: absolute;
  left: 26%;
  top: 37%;
  width: 42%;
  height: 15%;
  border-radius: 999px;
  background: #1d2638;
}

#fenice-loader .fenice-loader__tank::after {
  content: "";
  position: absolute;
  right: 4%;
  top: 12%;
  width: 27%;
  height: 8%;
  border-radius: 999px;
  background: rgba(255,255,255,0.55);
}

#fenice-loader .fenice-loader__frame {
  position: absolute;
  left: 18%;
  top: 43%;
  width: 43%;
  height: 4%;
  border-radius: 999px;
  background: #43526c;
}

#fenice-loader .fenice-loader__cab {
  position: absolute;
  left: 69%;
  top: 27%;
  width: 18%;
  height: 20%;
  border-radius: 18px 18px 14px 14px;
  background: linear-gradient(180deg, #ff8a36 0%, #ff6108 100%);
}

#fenice-loader .fenice-loader__cab::before {
  content: "";
  position: absolute;
  left: 41%;
  top: 10%;
  width: 46%;
  height: 34%;
  border-radius: 12px;
  background: linear-gradient(180deg, #f1f8ff 0%, #d9e6f7 100%);
  box-shadow: inset 0 0 0 3px rgba(255,255,255,0.72);
}

#fenice-loader .fenice-loader__cab::after {
  content: "";
  position: absolute;
  left: -7%;
  top: 42%;
  width: 8%;
  height: 38%;
  border-radius: 6px;
  background: #d9651f;
}

#fenice-loader .fenice-loader__support {
  position: absolute;
  top: 56%;
  height: 19%;
  width: 12%;
  border-radius: 8px 8px 0 0;
  background: rgba(140, 126, 123, 0.16);
}

#fenice-loader .fenice-loader__support--one { left: 3%; }
#fenice-loader .fenice-loader__support--two { left: 24%; width: 17%; }
#fenice-loader .fenice-loader__support--three { left: 42%; width: 16%; }
#fenice-loader .fenice-loader__support--four { left: 58%; width: 22%; }
#fenice-loader .fenice-loader__support--five { left: 82%; width: 12%; }

#fenice-loader .fenice-loader__wheel {
  position: absolute;
  top: 55%;
  width: 7.4%;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  background: #262f41;
  box-shadow: 0 2px 4px rgba(0,0,0,0.22);
}

#fenice-loader .fenice-loader__wheel::before {
  content: "";
  position: absolute;
  inset: 12%;
  border-radius: 50%;
  background:
    conic-gradient(from 0deg, #edf3f8 0 18%, #4b5563 18% 22%, #edf3f8 22% 39%, #4b5563 39% 43%, #edf3f8 43% 60%, #4b5563 60% 64%, #edf3f8 64% 81%, #4b5563 81% 85%, #edf3f8 85% 100%);
  animation: feniceLoaderWheel .42s linear infinite;
}

#fenice-loader .fenice-loader__wheel::after {
  content: "";
  position: absolute;
  inset: 43%;
  border-radius: 50%;
  background: #50607a;
}

#fenice-loader .fenice-loader__wheel--one { left: 22%; }
#fenice-loader .fenice-loader__wheel--two { left: 56%; }
#fenice-loader .fenice-loader__wheel--three { left: 72%; }

#fenice-loader .fenice-loader__smoke {
  position: absolute;
  left: 66%;
  bottom: 52%;
  width: 1.2%;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(171,176,182,.55) 0%, rgba(171,176,182,.16) 62%, rgba(171,176,182,0) 100%);
  animation: feniceLoaderSmoke 2s ease-out infinite;
}

#fenice-loader .fenice-loader__smoke--two {
  animation-delay: .7s;
  left: 67.2%;
}

#fenice-loader .fenice-loader__smoke--three {
  animation-delay: 1.35s;
  left: 65.3%;
}

#fenice-loader .fenice-loader__road {
  position: relative;
  margin: 14px auto 0;
  width: 74%;
  height: 18px;
  border-radius: 999px;
  overflow: hidden;
  background: #ffc12a;
  box-shadow: 0 8px 16px rgba(0,0,0,.12);
}

#fenice-loader .fenice-loader__road::before {
  content: "";
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(90deg, #20283a 0 28px, transparent 28px 56px);
  opacity: .95;
  animation: feniceLoaderRoad .7s linear infinite;
}

#fenice-loader .fenice-loader__panel {
  position: relative;
  z-index: 2;
  width: min(92vw, 530px);
  padding: 26px 24px 20px;
  border-radius: 26px;
  background: rgba(255,255,255,0.64);
  border: 1px solid rgba(255,255,255,0.78);
  box-shadow: 0 18px 44px rgba(15, 23, 42, 0.14);
  backdrop-filter: blur(10px);
}

#fenice-loader .fenice-loader__brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

#fenice-loader .fenice-loader__brand-icon {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(180deg, #ff8331 0%, #ff6108 100%);
  color: #fff;
}

#fenice-loader .fenice-loader__brand span {
  font-size: 13px;
  font-weight: 800;
  letter-spacing: .28em;
  text-transform: uppercase;
  color: #3c4a63;
}

#fenice-loader .fenice-loader__phrase {
  margin: 0 0 16px;
  color: #1c2436;
  font-size: clamp(18px, 2vw, 22px);
  font-weight: 700;
  transition: opacity .24s ease;
}

#fenice-loader .fenice-loader__bar-shell {
  width: 100%;
  height: 14px;
  background: rgba(20,30,40,0.08);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0,0,0,.1);
}

#fenice-loader .fenice-loader__bar-fill {
  position: relative;
  height: 100%;
  width: 6%;
  border-radius: 20px;
  background: linear-gradient(90deg, #ff8f3b, #ff620a);
}

#fenice-loader .fenice-loader__bar-fill::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(110deg, rgba(255,255,255,0) 30%, rgba(255,255,255,.55) 50%, rgba(255,255,255,0) 70%);
  background-size: 220% 100%;
  animation: feniceLoaderShimmer 1.3s linear infinite;
}

#fenice-loader .fenice-loader__meta {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 13px;
  font-weight: 600;
  color: #667791;
}

#fenice-loader .fenice-loader__meta strong {
  font-size: 14px;
  color: #1c2436;
}

@keyframes feniceLoaderCloud {
  from { transform: translateX(0); }
  to { transform: translateX(120vw); }
}

@keyframes feniceLoaderSkyline {
  from { transform: translateX(-12%); }
  to { transform: translateX(0%); }
}

@keyframes feniceLoaderWind {
  from { transform: translateX(0); }
  to { transform: translateX(132vw); }
}

@keyframes feniceLoaderBounce {
  0%,100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-.6%) rotate(.12deg); }
  75% { transform: translateY(-.4%) rotate(-.1deg); }
}

@keyframes feniceLoaderShadow {
  0%,100% { transform: scaleX(1) scaleY(1); opacity: .85; }
  50% { transform: scaleX(.93) scaleY(.8); opacity: .6; }
}

@keyframes feniceLoaderWheel {
  from { transform: rotate(0deg); }
  to { transform: rotate(-360deg); }
}

@keyframes feniceLoaderSmoke {
  0% { transform: translate(0,0) scale(.5); opacity: .8; }
  55% { opacity: .5; }
  100% { transform: translate(7vw,-9vw) scale(2.6); opacity: 0; }
}

@keyframes feniceLoaderRoad {
  from { transform: translateX(0); }
  to { transform: translateX(56px); }
}

@keyframes feniceLoaderShimmer {
  from { background-position: 120% 0; }
  to { background-position: -20% 0; }
}

@media (max-width: 640px) {
  #fenice-loader .fenice-loader__scene {
    width: min(96vw, 700px);
  }

  #fenice-loader .fenice-loader__panel {
    width: min(92vw, 480px);
    padding: 22px 18px 18px;
  }

  #fenice-loader .fenice-loader__phrase {
    font-size: 17px;
  }
}
`;

const loaderScript = `
(() => {
  const loader = document.getElementById('fenice-loader');
  const phrase = document.getElementById('fenice-loader-phrase');
  const meta = document.getElementById('fenice-loader-meta');
  const pct = document.getElementById('fenice-loader-pct');
  const bar = document.getElementById('fenice-loader-bar');
  if (!loader || !phrase || !meta || !pct || !bar) return;

  const phrases = [
    'Estamos preparando tu camion...',
    'Verificando niveles de combustible...',
    'Cargando ruta y permisos...',
    'Revisando presion de neumaticos...',
    'Sincronizando datos de despacho...',
    'Ya casi esta listo...'
  ];

  document.documentElement.classList.add('loader-active');
  document.body.classList.add('loader-active');

  let progress = 6;
  let phraseIndex = 0;

  const progressLabel = (value) => {
    if (value >= 100) return 'Ingreso confirmado';
    if (value >= 82) return 'Preparando panel visual';
    if (value >= 60) return 'Sincronizando informacion';
    if (value >= 36) return 'Validando operacion';
    return 'Cargando datos del despacho';
  };

  const phraseTimer = window.setInterval(() => {
    phraseIndex = (phraseIndex + 1) % phrases.length;
    phrase.style.opacity = '0';
    window.setTimeout(() => {
      phrase.textContent = phrases[phraseIndex];
      phrase.style.opacity = '1';
    }, 170);
  }, 2400);

  const progressTimer = window.setInterval(() => {
    const increment = progress < 84 ? (Math.random() * 4 + 1) : (Math.random() * 1.2 + 0.3);
    progress = Math.min(100, progress + increment);
    const rounded = Math.round(progress);
    bar.style.width = progress + '%';
    pct.textContent = rounded + '%';
    meta.textContent = progressLabel(rounded);

    if (progress >= 100) {
      window.clearInterval(progressTimer);
      window.clearInterval(phraseTimer);
      window.setTimeout(() => {
        loader.classList.add('is-leaving');
        document.documentElement.classList.remove('loader-active');
        document.body.classList.remove('loader-active');
        window.setTimeout(() => loader.remove(), 420);
      }, 280);
    }
  }, 95);
})();
`;

export default function FirstVisitLoader() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: loaderCss }} />

      <div id="fenice-loader" aria-hidden="true">
        <div className="fenice-loader__stage">
          <div className="fenice-loader__backdrop">
            <div className="fenice-loader__sun" />
            <div className="fenice-loader__cloud fenice-loader__cloud--one" />
            <div className="fenice-loader__cloud fenice-loader__cloud--two" />
            <div className="fenice-loader__cloud fenice-loader__cloud--three" />
          </div>

          <div className="fenice-loader__scene">
            <svg className="fenice-loader__skyline" viewBox="0 0 1600 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
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

            <div className="fenice-loader__wind">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>

            <div className="fenice-loader__truck-wrap">
              <div className="fenice-loader__truck-shadow" />
              <div className="fenice-loader__truck">
                <div className="fenice-loader__tank" />
                <div className="fenice-loader__frame" />
                <div className="fenice-loader__cab" />

                <div className="fenice-loader__support fenice-loader__support--one" />
                <div className="fenice-loader__support fenice-loader__support--two" />
                <div className="fenice-loader__support fenice-loader__support--three" />
                <div className="fenice-loader__support fenice-loader__support--four" />
                <div className="fenice-loader__support fenice-loader__support--five" />

                <div className="fenice-loader__wheel fenice-loader__wheel--one" />
                <div className="fenice-loader__wheel fenice-loader__wheel--two" />
                <div className="fenice-loader__wheel fenice-loader__wheel--three" />

                <div className="fenice-loader__smoke fenice-loader__smoke--one" />
                <div className="fenice-loader__smoke fenice-loader__smoke--two" />
                <div className="fenice-loader__smoke fenice-loader__smoke--three" />
              </div>
            </div>

            <div className="fenice-loader__road" />
          </div>

          <div className="fenice-loader__panel">
            <div className="fenice-loader__brand">
              <div className="fenice-loader__brand-icon">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 4 0v-6.998a2 2 0 0 0-.59-1.42L18 5" />
                  <path d="M14 21V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v16" />
                  <path d="M2 21h13" />
                  <path d="M3 9h11" />
                </svg>
              </div>
              <span>Fenice SPA</span>
            </div>

            <p id="fenice-loader-phrase" className="fenice-loader__phrase">
              Estamos preparando tu camion...
            </p>

            <div className="fenice-loader__bar-shell">
              <div id="fenice-loader-bar" className="fenice-loader__bar-fill" style={{ width: "6%" }} />
            </div>

            <div className="fenice-loader__meta">
              <span id="fenice-loader-meta">Cargando datos del despacho</span>
              <strong id="fenice-loader-pct">6%</strong>
            </div>
          </div>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{ __html: loaderScript }} />
    </>
  );
}
