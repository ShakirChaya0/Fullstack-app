import type { KitchenOrder } from "../interfaces/KitchenOrder";

// --- DICCIONARIOS DE ESTILO (Con la nueva paleta de colores) ---
export const statusColors = {
    Pendiente: { bg: 'bg-[#E0E0E0]', text: 'text-[#6B6B6B]', border: 'border-[#B0B0B0]' },
    En_Preparacion: { bg: 'bg-[#FFEFE5]', text: 'text-[#FF6600]', border: 'border-[#FF983F]' },
    Terminada: { bg: 'bg-[#E6F4F3]', text: 'text-[#0F766E]', border: 'border-[#149E90]' },
};

// --- DATOS DE EJEMPLO (Simulando la respuesta del backend) ---
export const initialOrders: KitchenOrder[] = [
    {
        idPedido: 101,
        horaInicio: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // Hace 2 minutos
        lineasPedido: [
            { nombreProducto: 'Provoleta a la Parrilla', tipoComida: 'Entrada', cantidad: 1, estado: 'Pendiente' },
            { nombreProducto: 'Bife de Chorizo', tipoComida: 'Plato_Principal', cantidad: 1, estado: 'Pendiente' },
            { nombreProducto: 'Papas Fritas', tipoComida: 'Plato_Principal', cantidad: 1, estado: 'Pendiente' },
        ],
        estado: 'Solicitado',
        observaciones: 'El bife bien cocido, por favor.'
    },
    {
        idPedido: 102,
        horaInicio: new Date(Date.now() - 8 * 60 * 1000).toISOString(), // Hace 8 minutos
        lineasPedido: [
            { nombreProducto: 'Milanesa Napolitana', tipoComida: 'Plato_Principal', cantidad: 2, estado: 'En_Preparacion' },
            { nombreProducto: 'Flan con Dulce de Leche', tipoComida: 'Postre', cantidad: 1, estado: 'Pendiente' },
            { nombreProducto: 'Agua sin Gas', tipoComida: "Bebida", cantidad: 2, estado: 'Terminada' },
        ],
        estado: 'En_Preparacion',
        observaciones: ''
    },
    {
        idPedido: 103,
        horaInicio: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // Hace 15 minutos
        lineasPedido: [
            { nombreProducto: 'Ravioles de Ricota', tipoComida: 'Plato_Principal', cantidad: 1, estado: 'En_Preparacion' },
            { nombreProducto: 'Ensalada Caesar', tipoComida: 'Entrada', cantidad: 1, estado: 'Terminada' },
        ],
        estado: 'En_Preparacion',
        observaciones: 'Sin croutons en la ensalada.'
    },
     {
        idPedido: 104,
        horaInicio: new Date(Date.now() - 1 * 60 * 1000).toISOString(), // Hace 1 minuto
        lineasPedido: [
            { nombreProducto: 'Pizza Margherita', tipoComida: 'Plato_Principal', cantidad: 1, estado: 'Pendiente' },
            { nombreProducto: 'Pizza Fugazzeta', tipoComida: 'Plato_Principal', cantidad: 1, estado: 'Pendiente' },
            { nombreProducto: 'Empanada de Carne', tipoComida: 'Entrada', cantidad: 2, estado: 'Pendiente' },
            { nombreProducto: 'Empanada de Jamón y Queso', tipoComida: 'Entrada', cantidad: 2, estado: 'Pendiente' },
        ],
        estado: 'Solicitado',
        observaciones: 'Masa fina y crocante.'
    }
];