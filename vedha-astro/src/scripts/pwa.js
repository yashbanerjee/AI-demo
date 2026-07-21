(() => {
  if (!("serviceWorker" in navigator)) return;

  const register = async () => {
    try {
      const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });

      // Auto-activate updated workers for a fresher mobile experience
      reg.addEventListener("updatefound", () => {
        const worker = reg.installing;
        if (!worker) return;
        worker.addEventListener("statechange", () => {
          if (worker.state === "installed" && navigator.serviceWorker.controller) {
            worker.postMessage({ type: "SKIP_WAITING" });
          }
        });
      });

      // Reload once when the new SW takes control (avoid loops)
      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (refreshing) return;
        refreshing = true;
        // Soft refresh only if the tab is visible — less jarring on mobile
        if (document.visibilityState === "visible") window.location.reload();
      });
    } catch {
      // Registration can fail on insecure origins outside localhost — ignore
    }
  };

  // Defer registration until the page is idle so first paint stays fast
  if ("requestIdleCallback" in window) {
    requestIdleCallback(() => register(), { timeout: 3000 });
  } else {
    window.addEventListener("load", () => setTimeout(register, 1200), { once: true });
  }
})();
