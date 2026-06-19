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
          src="/loader/fenice-loader.html"
        />
      </div>
      <script dangerouslySetInnerHTML={{ __html: shellScript }} />
    </>
  );
}
