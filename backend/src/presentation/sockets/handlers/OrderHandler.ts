import { AuthenticatedSocket } from "../../../presentation/middlewares/AuthSocketMiddleware.js";
import { Server } from "socket.io";
import { HandleSocketError } from "./HandleSocketError.js";
import { OrderController } from "../../controllers/OrderController.js";


export function registerOrderHandlers(io: Server, socket: AuthenticatedSocket) {
  const orderController = new OrderController();

  socket.on("updateLineStatus", async ({ idPedido, nroLinea, estadoLP }) => {
    try {
      await orderController.updateOrderLineStatus(idPedido, nroLinea, estadoLP);
    } catch (error: any) {
      HandleSocketError(socket, error);
    }
  });

  socket.on("addOrderLine", async ({ orderId, orderLines }) => {
    try {
      await orderController.addOrderLine(orderId, orderLines)
    } catch (error: any) {
      HandleSocketError(socket, error);
    }
  });

  socket.on("modifyOrder", async ({ orderId, lineNumbers, data }) => {
    try {
      await orderController.updateOrder(orderId, lineNumbers, data)
    } catch (error: any) {
      HandleSocketError(socket, error);
    }
  });

  socket.on("deleteOrderLine", async ({ orderId, lineNumber }) => {
    try {
      await orderController.deleteOrderLine(orderId, lineNumber)
    } catch (error: any) {
      HandleSocketError(socket, error);
    }
  });
}
