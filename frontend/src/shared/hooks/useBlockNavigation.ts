import { useEffect } from "react";

export function useBlockNavigation(enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    // 1. INTERCEPTAR CAMBIOS DE URL SILENCIOSAMENTE
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    // Bloquear pushState (navigate, link clicks, etc.)
    window.history.pushState = function(state, title, url) {
      if (url && url !== window.location.href) {
        return; // Bloquear silenciosamente - no ejecutar navegación
      }
      return originalPushState.call(this, state, title, url);
    };

    // Bloquear replaceState
    window.history.replaceState = function(state, title, url) {
      if (url && url !== window.location.href) {
        return; // Bloquear silenciosamente
      }
      return originalReplaceState.call(this, state, title, url);
    };

    // 2. COLCHÓN PARA BOTÓN ATRÁS
    // Crear colchón inicial
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      // Siempre bloquear - restaurar posición silenciosamente
      window.history.pushState(null, "", window.location.href);
    };

    // Registrar evento
    window.addEventListener("popstate", handlePopState);

    return () => {
      // Cleanup
      window.removeEventListener("popstate", handlePopState);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, [enabled]);
}