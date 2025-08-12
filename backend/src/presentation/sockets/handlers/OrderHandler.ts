import { AuthenticatedSocket } from "../../../presentation/middlewares/AuthSocketMiddleware.js";
import { OrderSocketService } from "../../../application/services/OrderSocketService.js";
import { Server } from "socket.io";
import { HandleSocketError } from "./HandleSocketError.js";

export function registerOrderHandlers(io: Server, socket: AuthenticatedSocket) {
  const service = new OrderSocketService(io);

  socket.on("updateLineStatus", async ({ idPedido, nroLinea, estadoLP }) => {
    try {
        await service.updateLineStatus(idPedido, nroLinea, estadoLP);
    } catch (error: any) {
        HandleSocketError(socket, error);
    }
  });

  socket.on("addOrderLine", async ({ orderId, orderLines }) => {
    try {
        await service.addOrderLine(orderId, orderLines);
    } catch (error: any) {
        HandleSocketError(socket, error);
    }
  });

  socket.on("modifyOrder", async ({ orderId, lineNumbers, data }) => {
    try {
        await service.modifyOrder(orderId, lineNumbers, data);
    } catch (error: any) {
        HandleSocketError(socket, error);
    }
  });

  socket.on("deleteOrderLine", async ({ orderId, lineNumber }) => {
    try {
        await service.deleteOrderLine(orderId, lineNumber);
    } catch (error: any) {
        HandleSocketError(socket, error);
    }
  });
}
