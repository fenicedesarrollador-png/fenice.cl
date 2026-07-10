"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const SHELL_CSS = `
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

const HIDE_DELAY_MS = 420;
const SAFETY_TIMEOUT_MS = 5000;

export default function FirstVisitLoader() {
  const pathname = usePathname();
  const [isActive, setIsActive] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    if (pathname.startsWith("/admin")) {
      return;
    }

    let alreadyShown = false;
    let activationFrame: number | null = null;

    try {
      alreadyShown = sessionStorage.getItem("fenice-loader-shown") === "1";
      if (!alreadyShown) {
        sessionStorage.setItem("fenice-loader-shown", "1");
      }
    } catch {}

    if (!alreadyShown) {
      activationFrame = window.requestAnimationFrame(() => {
        setIsActive(true);
      });
    }

    return () => {
      if (activationFrame !== null) {
        window.cancelAnimationFrame(activationFrame);
      }
    };
  }, [pathname]);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    let closed = false;
    let hideTimer: number | null = null;

    const cleanupBodyState = () => {
      document.documentElement.classList.remove("fenice-loader-active");
      document.body.classList.remove("fenice-loader-active");
    };

    const closeLoader = () => {
      if (closed) {
        return;
      }

      closed = true;
      setIsHidden(true);
      cleanupBodyState();
      hideTimer = window.setTimeout(() => {
        setIsActive(false);
        setIsHidden(false);
      }, HIDE_DELAY_MS);
    };

    const onMessage = (event: MessageEvent) => {
      if (
        event.data &&
        typeof event.data === "object" &&
        "type" in event.data &&
        event.data.type === "fenice-loader-complete"
      ) {
        closeLoader();
      }
    };

    document.documentElement.classList.add("fenice-loader-active");
    document.body.classList.add("fenice-loader-active");

    window.addEventListener("message", onMessage);
    const safetyTimer = window.setTimeout(closeLoader, SAFETY_TIMEOUT_MS);

    return () => {
      window.removeEventListener("message", onMessage);
      window.clearTimeout(safetyTimer);
      if (hideTimer !== null) {
        window.clearTimeout(hideTimer);
      }
      cleanupBodyState();
    };
  }, [isActive]);

  if (!isActive) {
    return null;
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: SHELL_CSS }} />
      <div
        id="fenice-loader-shell"
        aria-hidden="true"
        className={isHidden ? "is-hidden" : undefined}
      >
        <iframe
          id="fenice-loader-frame"
          title="Cargando Fenice SPA"
          src="/loader/fenice-loader.html"
        />
      </div>
    </>
  );
}
