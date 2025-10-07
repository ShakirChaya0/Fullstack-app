import { useEffect } from "react";

export function useLockBackNavigation() {
    console.log('Entre  al useLock')
    useEffect(() => {
    console.log('Entre  al useLock dentro del useEffect')
        const preventBack = () => {
            window.history.forward();
        };

        // Agrega una entrada al historial
        window.history.pushState(null, "", window.location.href);

        // Escucha cuando el usuario intenta ir atrás
        window.addEventListener("popstate", preventBack);

        // Corre inmediatamente para “sellar” la página
        preventBack();

        // Limpia el listener al desmontar
        return () => {
            window.removeEventListener("popstate", preventBack);
        };
    }, []);
}