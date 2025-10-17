// hooks/useBlockNavigation.ts
import { useEffect } from "react";

export function useBlockNavigation(enabled: boolean = true, message?: string) {
  useEffect(() => {
    if (!enabled) return;

    let isBlocking = true;

    // 1. Confirm dialog para navegación
    const showConfirmation = () => {
      if (message) {
        const shouldNavigate = window.confirm(message);
        if (shouldNavigate) {
          isBlocking = false;
          return true;
        }
        return false;
      }
      return false; // Bloquear sin mensaje
    };

    // 2. Beforeunload
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isBlocking) {
        e.preventDefault();
      }
    };

    // 3. Popstate (tu método actual pero mejorado)
    const handlePopState = () => {
      if (isBlocking) {
        if (message) {
          const confirmed = showConfirmation();
          if (!confirmed) {
            window.history.pushState(null, "", window.location.href);
            return;
          }
        } else {
          // Sin mensaje - bloqueo silencioso
          window.history.pushState(null, "", window.location.href);
          return;
        }
      }
    };

    // 4. Interceptar React Router navigate
    const originalPushState = window.history.pushState;
    window.history.pushState = function(state, title, url) {
      if (isBlocking && url !== window.location.href) {
        if (message) {
          const confirmed = showConfirmation();
          if (!confirmed) return;
        } else {
          return; // Bloquear silenciosamente
        }
      }
      return originalPushState.call(this, state, title, url);
    };

    // Setup inicial del colchón
    window.history.pushState(null, "", window.location.href);

    // Registrar eventos
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
      window.history.pushState = originalPushState;
    };
  }, [enabled, message]);
}