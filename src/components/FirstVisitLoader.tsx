import { readFileSync } from "fs";

const loaderDocPath =
  "/Users/isaacavila/.codex/attachments/a917cbf5-af1e-4ab8-98e4-6cc50668dbaf/pasted-text.txt";

const fallbackHtml = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Cargando - Fenice SPA</title>
<style>
  html,body{width:100%;height:100%;margin:0}
  body{
    display:grid;
    place-items:center;
    background:linear-gradient(180deg,#eef3f8 0%,#d7e2ec 55%,#c3d3e3 100%);
    font-family:'Segoe UI',Roboto,Arial,sans-serif;
    color:#1c2430;
  }
  .card{
    width:min(92vw,420px);
    padding:28px;
    border-radius:28px;
    background:rgba(255,255,255,0.84);
    box-shadow:0 24px 60px rgba(28,36,48,0.16);
    border:1px solid rgba(255,255,255,0.7);
  }
  .brand{
    letter-spacing:3px;
    font-size:13px;
    font-weight:700;
    text-transform:uppercase;
    color:#1f9c5a;
    margin-bottom:16px;
  }
  .title{
    font-size:28px;
    font-weight:700;
    margin:0 0 14px;
  }
  .bar{
    height:12px;
    border-radius:999px;
    overflow:hidden;
    background:rgba(28,36,48,0.1);
  }
  .bar span{
    display:block;
    height:100%;
    width:6%;
    border-radius:999px;
    background:linear-gradient(90deg,#1f9c5a 0%,#e8702a 100%);
    animation:load 2.8s linear forwards;
  }
  @keyframes load{
    from{width:6%}
    to{width:100%}
  }
</style>
</head>
<body>
  <div class="card">
    <div class="brand">Sociedad Fenice SPA</div>
    <h1 class="title">Estamos preparando tu camion...</h1>
    <div class="bar"><span></span></div>
  </div>
  <script>
    setTimeout(function(){
      if(window.parent !== window){
        window.parent.postMessage({ type: 'fenice-loader-complete' }, '*');
      }
    }, 2800);
  </script>
</body>
</html>`;

function buildLoaderHtml() {
  try {
    const raw = readFileSync(loaderDocPath, "utf8");

    return raw
      .replace(
        "  setInterval(tick, 220);",
        "  const progressTimer = setInterval(tick, 220);",
      )
      .replace(
        /    if\(progress >= 100\)\{\n      barInner\.style\.width = '100%';\n      pctText\.textContent = '100%';\n      setTimeout\(\(\)=>\{\n        progress = 6;\n        barInner\.style\.width = progress \+ '%';\n        pctText\.textContent = Math\.round\(progress\) \+ '%';\n      \}, 700\);\n      return;\n    \}/,
        `    if(progress >= 100){
      progress = 100;
      barInner.style.width = '100%';
      pctText.textContent = '100%';
      clearInterval(progressTimer);
      setTimeout(()=>{
        if(window.parent !== window){
          window.parent.postMessage({ type: 'fenice-loader-complete' }, '*');
        }
      }, 450);
      return;
    }`,
      );
  } catch {
    return fallbackHtml;
  }
}

const loaderHtml = buildLoaderHtml();

const shellCss = `
html.fenice-loader-active,
body.fenice-loader-active {
  overflow: hidden;
}

#fenice-loader-shell {
  position: fixed;
  inset: 0;
  z-index: 9999;
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transition: opacity 0.35s ease, visibility 0.35s ease;
  background: #eef3f8;
}

#fenice-loader-shell.is-hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

#fenice-loader-frame {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}
`;

const shellScript = `
(function () {
  var shell = document.getElementById('fenice-loader-shell');
  if (!shell) return;

  var closed = false;

  document.documentElement.classList.add('fenice-loader-active');
  document.body.classList.add('fenice-loader-active');

  function closeLoader() {
    if (closed) return;
    closed = true;
    shell.classList.add('is-hidden');
    document.documentElement.classList.remove('fenice-loader-active');
    document.body.classList.remove('fenice-loader-active');
    window.removeEventListener('message', onMessage);
    window.setTimeout(function () {
      shell.remove();
    }, 380);
  }

  function onMessage(event) {
    if (event && event.data && event.data.type === 'fenice-loader-complete') {
      closeLoader();
    }
  }

  window.addEventListener('message', onMessage);
  window.setTimeout(closeLoader, 9000);
})();
`;

export default function FirstVisitLoader() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: shellCss }} />
      <div id="fenice-loader-shell" aria-hidden="true">
        <iframe
          id="fenice-loader-frame"
          title="Cargando Fenice SPA"
          srcDoc={loaderHtml}
        />
      </div>
      <script dangerouslySetInnerHTML={{ __html: shellScript }} />
    </>
  );
}
