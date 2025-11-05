import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import useAuth from "./useAuth";
import { toast } from "react-toastify";

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
    const { accessToken, refreshAccessToken, logout } = useAuth();
    const socketRef = useRef<Socket | null>(null);
    const [connected, setConnected] = useState(false);
    const [connecting, setConnecting] = useState(true);
    const refreshAttemptedRef = useRef(false);
    const isInitializedRef = useRef(false);

    useEffect(() => {
        if (isInitializedRef.current) return;
        isInitializedRef.current = true;

        setConnecting(true);
        
        const socket = io(`${import.meta.env.VITE_WEBSOCKET_BACKEND_URL}`, {
            auth: accessToken ? { jwt: accessToken } : {},
            withCredentials: true,  
            transports: ['websocket', 'polling'],
            autoConnect: false
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            setConnected(true);
            setConnecting(false);
            refreshAttemptedRef.current = false;
        });

        socket.on("errorEvent", ({ message }) => {
            console.error("Error del servidor:", message);
        });

        socket.on("connect_error", async (err: any) => {            
            let errorData;
            try {
                errorData = JSON.parse(err.message);
            } catch (e) {
                errorData = { message: err.message };
            }

            if (errorData.statusCode === 401 && !refreshAttemptedRef.current) {
                refreshAttemptedRef.current = true;
                
                try {
                    const newAccessToken = await refreshAccessToken(); 

                    if (newAccessToken) {
                        socket.auth = { jwt: newAccessToken };
                        socket.connect();
                    } else {
                        setConnecting(false);
                        logout();
                        toast.warn('Sesión expirada. Por favor, inicie sesión de nuevo.');
                    }
                } catch (error) {
                    console.error("Error al refrescar token:", error);
                    setConnecting(false);
                    logout();
                    toast.error('Error de autenticación.');
                }
            } else if (errorData.statusCode !== 401) {
                console.error("Error de conexión:", errorData.message, errorData.name, errorData.statusCode);
                setConnecting(false);
            }
        });

        socket.on("disconnect", () => {
            setConnected(false);
        });

        if (accessToken) socket.connect();
        
        return () => {
            socket.disconnect();
            socket.removeAllListeners();
        };
    }, []);

    useEffect(() => {
        if (!socketRef.current || !isInitializedRef.current) return;

        const socket = socketRef.current;

        if (accessToken) {
            socket.auth = { jwt: accessToken };
            
            if (!socket.connected) {
                refreshAttemptedRef.current = false;
                socket.connect();
            }
        } else {
            if (socket.connected) {
                socket.disconnect();
            }
        }
    }, [accessToken]);

    const sendEvent = (event: OrderEmitEvent, data?: any) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit(event, data);
        } else {
            console.warn("Socket no conectado, no se puede emitir:", event);
        }
    };

    const onEvent = (event: OrderOnEvent, callback: (...args: any[]) => void) => {
        if (socketRef.current) {
            socketRef.current.on(event, callback);
        }
    };

    const offEvent = (event: OrderOnEvent, callback?: (...args: any[]) => void) => {
        if (socketRef.current) {
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