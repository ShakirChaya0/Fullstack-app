import { Server } from "socket.io";

export class SocketIOEventEmitter {
    private readonly ioConnection: Server;

    constructor(io: Server) {
        this.ioConnection = io;
    }

    emitToRoom(room: string, event: string, payload: object) {
        this.ioConnection.to(room).emit(event, payload);
    }
}