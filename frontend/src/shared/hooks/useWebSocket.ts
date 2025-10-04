import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import useAuth from "./useAuth";

type OrderEvent = "newOrder" | "updatedOrderStatus" | "updatedOrderLineStatus" | "addedOrderLine" | "modifiedOrderLine" | "deletedOrderLine" | "orderPaymentEvent" | "errorEvent"

type WebSocketHook = {
    connected: boolean;
    sendEvent: (event: OrderEvent, data?: any) => void;
    onEvent: (event: OrderEvent, callback: (...args: any[]) => void) => void;
    offEvent: (event: OrderEvent, callback?: (...args: any[]) => void) => void;
    socket: Socket | null;
};

export function useWebSocket(): WebSocketHook {
    const { accessToken } = useAuth();
    const socketRef = useRef<Socket | null>(null);
    const [connected, setConnected] = useState<boolean>(false);

    useEffect(() => {
        const socket = io(`${import.meta.env.VITE_WEBSOCKET_BACKEND_URL}`, {
            auth: accessToken ? { jwt: accessToken } : {},
            withCredentials: true
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("SE CONECTAAAAAAA")
            setConnected(true);
        });

        socket.on("errorEvent", ({ message }) => {
            console.error(message);
        })

        socket.on("connect_error", (err) => {
            console.error("Error de conexión:", err.message);
        });

        socket.on("disconnect", () => {
            setConnected(false);
        });

        return () => {
            socket.disconnect();
        };
    }, [accessToken]);

    const sendEvent = useCallback((event: OrderEvent, data?: any) => {
        socketRef.current?.emit(event, data);
    }, []);

    const onEvent = useCallback((event: OrderEvent, callback: (...args: any[]) => void) => {
        socketRef.current?.on(event, callback);
    }, []);

    const offEvent = useCallback((event: OrderEvent, callback?: (...args: any[]) => void) => {
        if (callback) {
            socketRef.current?.off(event, callback);
        } else {
            socketRef.current?.off(event);
        }
    }, []);

    return {
        connected,
        sendEvent,
        onEvent,
        offEvent,
        socket: socketRef.current,
    };
}