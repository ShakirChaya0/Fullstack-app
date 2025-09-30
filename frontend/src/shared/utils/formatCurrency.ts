export const formatCurrency = (
    amount: number,
    locale: string, // cualquier código válido: "es-AR", "en-US", etc.
    currency: NonNullable<Intl.NumberFormatOptions["currency"]> // ISO 4217, ej: "ARS", "USD", "EUR"
): string => {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
    }).format(amount);
};