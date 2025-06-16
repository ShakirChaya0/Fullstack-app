import { ProductModel } from "../models/productModel.js";
import { esComida, esUpdateComida } from "./esComida.js";
export function productUpdateValidation(data, id) {
    const Producto = ProductModel.getById(id);
    // Faltaria validar en caso de atributos invalidos ej: datos: {"tieneHarina": true}
    if (Producto == undefined) {
        return false;
    }
    else if (!esComida(Producto)) {
        if (!esUpdateComida(data, data.datos)) {
            if (("esVegana" in data.datos || "esVegetariana" in data.datos || "esSinGluten" in data.datos) || !("esAlcoholica" in data.datos)) {
                return false;
            }
            else {
                return true;
            }
        }
    }
    else if (esComida(Producto)) {
        if (esUpdateComida(data, data.datos)) {
            if (!("esVegana" in data.datos || "esVegetariana" in data.datos || "esSinGluten" in data.datos) || ("esAlcoholica" in data.datos)) {
                return false;
            }
            else {
                return true;
            }
        }
    }
    return false;
}
