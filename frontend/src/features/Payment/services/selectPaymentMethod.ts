import type { PaymentMethod } from "../types/PaymentSharedTypes";

export async function selectPaymentMethod(orderId: number, method: PaymentMethod, apiCall: (url: string, options?: RequestInit) => Promise<Response>) {
    let endpoint = "pagos/";
    endpoint += method === "MercadoPago" ? `mp/${orderId}`
        : method === "Credito/Debito" ? `tarjeta/${orderId}`
        : `efectivo/${orderId}`;

    const res = await apiCall(endpoint, {
        method: "POST"
    });

    if (res.status !== 204) {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data
    }

    return
}