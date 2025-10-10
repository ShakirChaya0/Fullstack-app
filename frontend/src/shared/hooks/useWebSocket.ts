import { useEffect, useRef, useState, useCallback } from "react";
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
            withCredentials: true
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            setConnected(true);
            setConnecting(false);
        });

        socket.on("errorEvent", ({ message }) => {
            console.error(message);
        })

        socket.on("connect_error", (err) => {
            console.error("Error de conexión:", err.message);
            setConnecting(false);
        });

        socket.on("disconnect", () => {
            setConnected(false);
        });

        return () => {
            socket.disconnect();
        };
    }, [accessToken]);

    const sendEvent = useCallback((event: OrderEmitEvent, data?: any) => {
        socketRef.current?.emit(event, data);
    }, []);

    const onEvent = useCallback((event: OrderOnEvent, callback: (...args: any[]) => void) => {
        socketRef.current?.on(event, callback);
    }, []);

    const offEvent = useCallback((event: OrderOnEvent, callback?: (...args: any[]) => void) => {
        if (callback) {
            socketRef.current?.off(event, callback);
        } else {
            socketRef.current?.off(event);
        }
    }, []);

    return {
        connected,
        connecting,
        sendEvent,
        onEvent,
        offEvent,
        socket: socketRef.current,
    };
}