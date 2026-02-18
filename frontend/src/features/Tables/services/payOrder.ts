import type { PaymentMethod } from "../../Payment/types/PaymentSharedTypes";

export async function payOrder(apiCall: (url: string, options?: RequestInit) => Promise<Response>, idPedido: number, method: PaymentMethod) {
  const response = await apiCall(`pagos/pagado?idPedido=${idPedido}&metodoPago=${method}`, {
    method: "POST"
  });

  console.log(response)
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  } 

  return
}
