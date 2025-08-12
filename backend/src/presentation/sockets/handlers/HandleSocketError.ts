import { Socket } from "socket.io";

type SocketErrors = Error & {
    statusCode: number,
    message: string
}

export function HandleSocketError(socket: Socket, error: SocketErrors) {
    socket.emit("errorEvent", { statusCode: error.statusCode, name: error.name, message: error.message })
}