import type { LineaPedido } from "../interfaces/Order";
import type { LineaPedido as LineaPedidoBackend } from "../../Tables/interfaces/OrderTable";

/**
 * Orden de visualización de los tipos de producto.
 * Comida: Entrada → Plato Principal → Postre, luego Bebida, y finalmente Otros.
 */
export const TYPE_ORDER = ["Entrada", "Plato_Principal", "Postre", "Bebida", "Otros"] as const;

/**
 * Formatea el nombre del tipo reemplazando guiones bajos por espacios.
 */
export function formatTypeName(type: string): string {
    return type.replace("_", " ");
}

/**
 * Determina el tipo de una línea de pedido del cliente.
 * - Comida: usa `lp.tipo` (Entrada | Plato_Principal | Postre)
 * - Bebida: detecta por `_isAlcoholic` en el producto
 * - Otros: fallback
 */
export function getClientLineType(lp: LineaPedido): string {
    if (lp.tipo) return lp.tipo;
    if ("_isAlcoholic" in lp.producto) return "Bebida";
    return "Otros";
}

/**
 * Determina el tipo de una línea de pedido del backend (mozo).
 * - `tipo` es FoodType | null; null indica Bebida.
 */
export function getBackendLineType(lp: LineaPedidoBackend): string {
    return lp.tipo ?? "Bebida";
}

/**
 * Agrupa un array de líneas por tipo usando una función extractora.
 */
export function groupLines<T>(lines: T[], getType: (line: T) => string): Record<string, T[]> {
    return lines.reduce<Record<string, T[]>>((acc, line) => {
        const type = getType(line);
        if (!acc[type]) acc[type] = [];
        acc[type].push(line);
        return acc;
    }, {});
}
