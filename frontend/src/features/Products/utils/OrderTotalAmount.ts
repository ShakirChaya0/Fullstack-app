import type { LineaPedido } from "../../Order/interfaces/Order"

export function OrderTotalAmount(orderLines: LineaPedido[]): number {
  let aux = 0
  orderLines.forEach(line => {
    aux += line.subtotal
  })
  return aux
}