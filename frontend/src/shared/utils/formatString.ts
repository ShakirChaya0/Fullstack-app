export const formatStatus = (status: string): string => {
    // Reemplaza todas las ocurrencias de '_' por un espacio ' '
    return status.replace(/_/g, ' ');
};