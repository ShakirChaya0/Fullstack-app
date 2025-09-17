import type { PriceList } from "../interfaces/product&PriceInterfaces";
import { getCurrentDate } from "./getCurrentDate";

export function isValidPrice(preciosRegistrados: PriceList[]) {
    const todayDate = getCurrentDate()
    const index = preciosRegistrados.findIndex( price => price.fechaVigencia.slice(0,10) == todayDate)
    if (index === -1) return true
    return false
}