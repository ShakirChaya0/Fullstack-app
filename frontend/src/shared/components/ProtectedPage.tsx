import { useEffect } from "react";

export function ProtectedPage({children}: {children?: React.ReactNode}) {
  useEffect(() => {
    // PASO 1: Crear colchón inicial con múltiples entradas
    for (let i = 0; i < 50; i++) {
      window.history.pushState(null, "", window.location.href);
    }

    // PASO 2: Handler más agresivo
    const handlePopState = () => {
      console.log('Intento de navegación bloqueado - Método agresivo');
      
      // A. Reemplazar la entrada actual para "resetear" la posición
      window.history.replaceState(null, "", window.location.href);
      
      // B. Agregar múltiples entradas falsas nuevas
      for (let i = 0; i < 20; i++) {
        window.history.pushState(null, "", window.location.href);
      }
      
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    }
  }, []);

  // Si se pasa children, renderizarlos, sino solo hacer la protección
  return children ? <>{children}</> : null;
}