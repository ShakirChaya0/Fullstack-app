import type { LineaPedido } from "../interfaces/Order";

export interface SplitModificationResult {
    toDelete: number[]; // lineNumbers a eliminar
    toModify: number[]; // lineNumbers a mantener y modificar
    newQuantity: number; // cantidad para los lineNumbers a mantener
}

/**
 * Cuando líneas consolidadas se modifican en cantidad, deduce cuáles lineNumbers
 * deben eliminarse y cuál cantidad mantener en los restantes.
 *
 * Ej: lineNumbers [3,4] con cantidad 3 → cantidad 2
 *     Resultado: delete [4], modify [3] con cantidad 2
 */
export const splitConsolidatedModification = (
    original: LineaPedido,
    modified: LineaPedido,
): SplitModificationResult => {
    const lineNumbers = original.lineNumbers || [];
    const quantityDifference = original.cantidad - modified.cantidad;

    if (quantityDifference === 0) {
        // Sin cambio de cantidad, retornar solo los lineNumbers a mantener
        return {
            toDelete: [],
            toModify: lineNumbers,
            newQuantity: modified.cantidad,
        };
    }

    if (quantityDifference < 0) {
        // Aumentó cantidad (no hay que eliminar lineNumbers)
        return {
            toDelete: [],
            toModify: lineNumbers,
            newQuantity: modified.cantidad,
        };
    }

    // Cantidad disminuyó: eliminar los últimos N lineNumbers
    const lineNumbersToDelete = lineNumbers.slice(-quantityDifference);
    const lineNumbersToKeep = lineNumbers.slice(0, -quantityDifference);

    return {
        toDelete: lineNumbersToDelete,
        toModify:
            lineNumbersToKeep.length > 0 ? lineNumbersToKeep : [lineNumbers[0]],
        newQuantity:
            lineNumbersToKeep.length > 0
                ? modified.cantidad
                : Math.max(1, modified.cantidad),
    };
};
