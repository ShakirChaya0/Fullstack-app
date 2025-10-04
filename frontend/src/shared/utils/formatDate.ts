export const formatDate = (
    date: Date,
    locale: string, // cualquier código válido: "es-AR", "en-US", etc.
) => {
    return new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
};