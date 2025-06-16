interface Producto {
    readonly idProducto: number,
    nombre: string,
    descripcion: string,
    estado: EstadoComida
}

export type TipoComida = "Entrada" | "Plato Principal" | "Postre"
type EstadoComida = "Disponible" | "No Disponible"
type Categoria = "Comida" | "Bebida"


export interface Comida extends Producto {
    tipo: TipoComida,
    esSinGluten?: boolean,
    esVegana?: boolean,
    esVegetariana?: boolean
}

export interface Bebida extends Producto {
    esAlcoholica?: boolean
}


export interface Update {
    categoria: Categoria,
    datos: UpdateComida | UpdateBebida
}

interface UpdateComida {
    nombre?: string,
    descripcion?: string,
    estado?: EstadoComida,
    tipo?: TipoComida
    esSinGluten?: boolean,
    esVegana?: boolean,
    esVegetariana?: boolean,
} 

interface UpdateBebida {
    nombre?: string,
    descripcion?: string,
    estado?: EstadoComida,
    esAlcoholica?: boolean
}



// {   
//     "categoria": "Comida",
//     "datos": {
//         "esSinGluten": true,
//         "esVegana": true
//     }
// }


// {
//     "idProducto": 1,
//     "nombre": "Hamburguesa clásica",
//     "descripcion": "Con carne, lechuga y tomate",
//     "categoria": "Comida",
//     "tipo": "Plato principal",
//     "esSinGluten": false,
//     "esVegana": false,
//     "esVegetariana": false
//   },