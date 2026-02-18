export type UserType = "Administrador" | "SectorCocina" | "Mozo" | "Cliente";

export type TableState = "Libre" | "Ocupada";

export type StateReservation = "Realizada" | "Asistida" | "No_Asistida" | "Cancelada";

export type FoodType = "Entrada" | "Plato_Principal" | "Postre";

export type ProductState = "Disponible" | "No_Disponible";

export type PaymentMethod = "MercadoPago" | "Efectivo" | "Debito" | "Credito";

export type OrderStatus = 'Solicitado' | 'En_Preparacion' | 'Completado' | 'Pendiente_De_Pago' | 'Pendiente_De_Cobro' | 'Pagado';

export type OrderLineStatus = 'Pendiente' | 'En_Preparacion' | 'Terminada';

export type stateClient = 'Habilitado' | 'Deshabilitado';

export type CheckLine = {
    nombreProducto: string,
    cantidad: number,
    montoUnitario: number,
    importe: number
}

export type PedidoCheck = {
    idPedido: number,
    lines: CheckLine[]
    subtotal: number,
    importeImpuestos: number,
    total: number
}

export type SuggSortOption = "DATE_ASC" | "DATE_DESC" | "NAME_ASC" | "NAME_DESC";
export type SuggFilterOption = "ALL" | "ACTIVES";
