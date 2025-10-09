import { AuthenticatedSocket } from "../../../presentation/middlewares/AuthSocketMiddleware.js";
import { Server } from "socket.io";
import { HandleSocketError } from "./HandleSocketError.js";
import { OrderController } from "../../controllers/OrderController.js";


export function registerOrderHandlers(io: Server, socket: AuthenticatedSocket) {
  const orderController = new OrderController();

  console.log(`📝 Registrando handlers para socket: ${socket.id}`);

  socket.on("updateLineStatus", async ({ idPedido, nroLinea, estadoLP }) => {
    console.log(`📥 Evento recibido: updateLineStatus`);
    console.log(`   - Socket ID: ${socket.id}`);
    console.log(`   - Usuario: ${socket.user?.username || 'No autenticado'}`);
    console.log(`   - QR Token: ${socket.qrToken || 'Sin token'}`);
    console.log(`   - Datos:`, { idPedido, nroLinea, estadoLP });

    try {
      console.log(`🔄 Ejecutando updateOrderLineStatus...`);
      await orderController.updateOrderLineStatus(idPedido, nroLinea, estadoLP);
      console.log(`✅ updateOrderLineStatus completado exitosamente`);
    } catch (error: any) {
      console.error(`❌ Error en updateLineStatus:`, error.message);
      console.error(`   Stack:`, error.stack);
      HandleSocketError(socket, error);
    }
  });

  socket.on("addOrderLine", async ({ orderId, orderLines }) => {
    console.log(`📥 Evento recibido: addOrderLine - Order: ${orderId}`);
    try {
      await orderController.addOrderLine(orderId, orderLines);
      console.log(`✅ addOrderLine completado`);
    } catch (error: any) {
      console.error(`❌ Error en addOrderLine:`, error.message);
      HandleSocketError(socket, error);
    }
  });

  socket.on("modifyOrder", async ({ orderId, lineNumbers, data }) => {
    console.log(`📥 Evento recibido: modifyOrder - Order: ${orderId}`);
    try {
      await orderController.updateOrder(orderId, lineNumbers, data);
      console.log(`✅ modifyOrder completado`);
    } catch (error: any) {
      console.error(`❌ Error en modifyOrder:`, error.message);
      HandleSocketError(socket, error);
    }
  });

  socket.on("deleteOrderLine", async ({ orderId, lineNumber }) => {
    console.log(`📥 Evento recibido: deleteOrderLine - Order: ${orderId}, Line: ${lineNumber}`);
    try {
      await orderController.deleteOrderLine(orderId, lineNumber);
      console.log(`✅ deleteOrderLine completado`);
    } catch (error: any) {
      console.error(`❌ Error en deleteOrderLine:`, error.message);
      HandleSocketError(socket, error);
    }
  });

  console.log(`✅ Handlers registrados para socket: ${socket.id}`);
}