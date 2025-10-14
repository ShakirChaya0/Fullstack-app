import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import useAuth from "./useAuth";

type OrderOnEvent = "activeOrders" | "waiterOrders" | "newOrder" | "updatedOrderStatus" | "updatedOrderLineStatus" | "addedOrderLine" | "modifiedOrderLine" | "deletedOrderLine" | "orderPaymentEvent" | "errorEvent"
type OrderEmitEvent = "updateLineStatus" | "addOrderLine" | "modifyOrder" | "deleteOrderLine";

type WebSocketHook = {
    connected: boolean;
    connecting: boolean;
    sendEvent: (event: OrderEmitEvent, data?: any) => void;
    onEvent: (event: OrderOnEvent, callback: (...args: any[]) => void) => void;
    offEvent: (event: OrderOnEvent, callback?: (...args: any[]) => void) => void;
    socket: Socket | null;
};

export function useWebSocket(): WebSocketHook {
    const { accessToken } = useAuth();
    const socketRef = useRef<Socket | null>(null);
    const [connected, setConnected] = useState(false);
    const [connecting, setConnecting] = useState(true);

    useEffect(() => {
        setConnecting(true);
        
        const socket = io(`${import.meta.env.VITE_WEBSOCKET_BACKEND_URL}`, {
            auth: accessToken ? { jwt: accessToken } : {},
            withCredentials: true,  // ✅ Esto ya estaba bien
            transports: ['websocket', 'polling'], // ✅ Asegura transporte correcto
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("✅ WebSocket conectado - ID:", socket.id);
            setConnected(true);
            setConnecting(false);
        });

        socket.on("errorEvent", ({ message }) => {
            console.error("❌ Error del servidor:", message);
        });

        socket.on("connect_error", (err) => {
            console.error("Error de conexión:", err.message);
            setConnecting(false);
        });

        socket.on("disconnect", () => {
            console.log("🔌 WebSocket desconectado");
            setConnected(false);
        });

        return () => {
            console.log("🧹 Limpiando conexión WebSocket");
            socket.disconnect();
        };
    }, [accessToken]);

    // ✅ NO usar useCallback - mantener referencias estables usando el ref
    const sendEvent = (event: OrderEmitEvent, data?: any) => {
        if (socketRef.current?.connected) {
            console.log(`📤 Emitiendo evento: ${event}`, data);
            socketRef.current.emit(event, data);
        } else {
            console.warn("⚠️ Socket no conectado, no se puede emitir:", event);
        }
    };

    const onEvent = (event: OrderOnEvent, callback: (...args: any[]) => void) => {
        if (socketRef.current) {
            console.log(`👂 Escuchando evento: ${event}`);
            socketRef.current.on(event, callback);
        }
    };

    const offEvent = (event: OrderOnEvent, callback?: (...args: any[]) => void) => {
        if (socketRef.current) {
            console.log(`🔇 Dejando de escuchar: ${event}`);
            if (callback) {
                socketRef.current.off(event, callback);
            } else {
                socketRef.current.off(event);
            }
        }
    };

    return {
        connected,
        connecting,
        sendEvent,
        onEvent,
        offEvent,
        socket: socketRef.current,
    };
}