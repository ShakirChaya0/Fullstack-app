import type { OrderLineStatus } from "../../KitchenOrders/types/SharedTypes";
import type { OrderStatus } from "../../Order/interfaces/Order";
import type { FoodType } from "../../Product&Price/types/product&PriceTypes";

export type LineaPedido = {
  nombreProducto: string;
  cantidad: number;
  estado: OrderLineStatus;
  nroLinea: number;
  tipo: FoodType | null
};

export type PedidoBackend = {
  idPedido: number;
  idMozo: string;
  nroMesa: number;
  comensales: number;
  horaInicio: string;
  estado: OrderStatus;
  observaciones: string;
  lineasPedido: LineaPedido[];
};