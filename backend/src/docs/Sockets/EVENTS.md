# 📨 WebSocket Events - Documentación Detallada

## Tabla de Contenidos
1. [Resumen de Eventos](#resumen-de-eventos)
2. [Eventos del Cliente → Servidor](#eventos-del-cliente--servidor)
3. [Eventos del Servidor → Cliente](#eventos-del-servidor--cliente)
4. [Flujos Completos](#flujos-completos)

---

## Resumen de Eventos

### Eventos Emitidos por el Cliente

| Evento | Usuario | Descripción |
|--------|---------|------------|
| `updateLineStatus` | Cocina, Mozo | Cambiar estado de una línea de orden |
| `addOrderLine` | Cocina, Mozo | Agregar línea a una orden existente |
| `deleteOrderLine` | Cocina, Mozo | Eliminar línea de una orden |
| `modifyOrder` | Cocina, Mozo | Modificar datos de orden o líneas |

### Eventos Emitidos por el Servidor

| Evento | Destinatarios | Descripción |
|--------|---|------------|
| `activeOrders` | Cocina | Lista inicial de órdenes activas |
| `waiterOrders` | Mozo | Lista inicial de órdenes del mozo |
| `newOrder` | Cocina, Mozo, Comensal | Nueva orden creada |
| `updatedOrderLineStatus` | Cocina, Mozo, Comensal | Estado de línea actualizado |
| `addedOrderLine` | Cocina, Mozo, Comensal | Línea agregada |
| `modifiedOrderLine` | Cocina, Mozo, Comensal | Línea modificada |
| `deletedOrderLine` | Cocina, Mozo, Comensal | Línea eliminada |
| `orderPaymentEvent` | Cocina, Mozo, Comensal | Evento de pago |
| `errorEvent` | Cliente | Error en el servidor |

---

## Eventos del Cliente → Servidor

Estos eventos son emitidos por el cliente (Cocina, Mozo) y procesados por el servidor.

**Archivo**: [OrderHandler.ts](../../backend/src/presentation/sockets/handlers/OrderHandler.ts)

---

### 1️⃣ `updateLineStatus`

#### Descripción
Cambia el estado de una línea específica dentro de una orden.

**Usuarios que pueden emitir**: 
- 👨‍🍳 Personal de Cocina
- 🧑‍💼 Mozo

#### Parámetros

```typescript
{
    idPedido: number;      // ID de la orden
    nroLinea: number;      // Número de línea dentro de la orden
    estadoLP: OrderLineStatus;  // Nuevo estado
}
```

#### Valores válidos para `OrderLineStatus`

```typescript
type OrderLineStatus = 
    | "Pendiente"          // Estado inicial
    | "EnPreparacion"      // Se está preparando
    | "Listo"              // Listo para servir
    | "Servido"            // Ya fue servido
    | "Cancelado"          // Cancelado
    | "Retrasado";         // Retrasado
```

#### Ejemplo de Uso

```javascript
// Cliente (Cocina)
socket.emit('updateLineStatus', {
    idPedido: 42,
    nroLinea: 1,
    estadoLP: "EnPreparacion"
});
```

#### ✅ Caso de Éxito

**Validaciones**:
- ✅ `idPedido` es un número válido
- ✅ `nroLinea` es un número válido
- ✅ `estadoLP` es un estado válido
- ✅ La orden existe en base de datos
- ✅ La línea existe en la orden

**Operación**:
1. Se actualiza el estado de la línea en BD
2. Se emite `updatedOrderLineStatus` a:
   - 📝 Cocina (sala `cocina`)
   - 🧑‍💼 Mozo de la orden (sala `mozo:{username}`)
   - 🍽️ Comensal (sala `comensal:{qrToken}`)

**Respuesta del Servidor**:
```typescript
// Evento emitido a los abonados:
socket.emit('updatedOrderLineStatus', {
    idPedido: 42,
    orderLines: [
        {
            lineNumber: 1,
            status: "EnPreparacion",
            // ... otros datos de la línea
        }
    ]
    // ... resto de datos de la orden
});
```

#### ❌ Casos de Error

**1. Validación - Número de Línea Inválido**
```json
{
    "statusCode": 400,
    "name": "ValidationError",
    "message": "El número de Línea debe ser válido"
}
```

**2. Validación - Número de Orden Inválido**
```json
{
    "statusCode": 400,
    "name": "ValidationError",
    "message": "El número de Pedido debe ser válido"
}
```

**3. Recurso No Encontrado - Orden no existe**
```json
{
    "statusCode": 404,
    "name": "NotFoundError",
    "message": "Orden con ID {idPedido} no encontrada"
}
```

**4. Recurso No Encontrado - Línea no existe**
```json
{
    "statusCode": 404,
    "name": "NotFoundError",
    "message": "Línea #nroLinea no encontrada en la orden"
}
```

**5. Servicio no disponible**
```json
{
    "statusCode": 503,
    "name": "ServiceError",
    "message": "Error al actualizar estado en BD"
}
```

#### Logging

```
📥 Evento recibido: updateLineStatus
   - Socket ID: socket_abc123
   - Usuario: JoseB_2004
   - QR Token: Sin token
   - Datos: { idPedido: 42, nroLinea: 1, estadoLP: 'EnPreparacion' }

🔄 Ejecutando updateOrderLineStatus...
  updateOrderLineStatus completado exitosamente
```

---

### 2️⃣ `addOrderLine`

#### Descripción
Agrega una nueva línea de item a una orden existente.

**Usuarios que pueden emitir**:
- 👨‍🍳 Personal de Cocina
- 🧑‍💼 Mozo

#### Parámetros

```typescript
{
    orderId: number;           // ID de la orden
    orderLines: OrderLineSchema[];  // Array de líneas a agregar
}
```

#### Estructura de `OrderLineSchema`

```typescript
interface OrderLineSchema {
    productId: string;      // UUID del producto
    quantity: number;       // Cantidad de items
    unitPrice: number;      // Precio unitario
    notes?: string;         // Notas especiales (ej: sin picante)
    selectedOptions?: Array<{
        optionId: string;
        value: string;
    }>;
}
```

#### Ejemplo de Uso

```javascript
socket.emit('addOrderLine', {
    orderId: 42,
    orderLines: [
        {
            productId: "product-uuid-123",
            quantity: 2,
            unitPrice: 150.00,
            notes: "Sin cebolla"
        },
        {
            productId: "product-uuid-456",
            quantity: 1,
            unitPrice: 200.00
        }
    ]
});
```

#### ✅ Caso de Éxito

**Validaciones**:
- ✅ `orderId` es un número válido
- ✅ `orderLines` es un array válido
- ✅ Cada línea contiene campos requeridos
- ✅ `quantity` es un número positivo
- ✅ `unitPrice` es un número válido
- ✅ La orden existe en BD
- ✅ Los productos existen en BD

**Operación**:
1. Se valida cada línea contra el schema Zod
2. Se insertan las líneas en la BD
3. Se calcula el nuevo total de la orden
4. Se emite `addedOrderLine` a:
   - 📝 Cocina
   - 🧑‍💼 Mozo responsable
   - 🍽️ Comensal

**Respuesta del Servidor**:
```typescript
socket.emit('addedOrderLine', {
    idPedido: 42,
    orderLines: [
        // ... líneas existentes
        {
            lineNumber: 3,
            productId: "product-uuid-123",
            quantity: 2,
            unitPrice: 150.00,
            notes: "Sin cebolla",
            status: "Pendiente"
        }
    ],
    totalPrice: 850.00
    // ... resto de datos
});
```

#### ❌ Casos de Error

**1. Validación - Order ID inválido**
```json
{
    "statusCode": 400,
    "name": "ValidationError",
    "message": "El número de Pedido debe ser válido"
}
```

**2. Validación - Schema incorrecto**
```json
{
    "statusCode": 400,
    "name": "ValidationError",
    "message": "Validation failed: Expected number, received NaN"
}
```

**3. Validación - Cantidad negativa**
```json
{
    "statusCode": 400,
    "name": "ValidationError",
    "message": "Validation failed: Number must be greater than 0"
}
```

**4. Orden no encontrada**
```json
{
    "statusCode": 404,
    "name": "NotFoundError",
    "message": "Orden con ID 42 no encontrada"
}
```

**5. Producto no encontrado**
```json
{
    "statusCode": 404,
    "name": "NotFoundError",
    "message": "Producto con ID 'product-uuid-123' no disponible"
}
```

---

### 3️⃣ `deleteOrderLine`

#### Descripción
Elimina una línea específica de una orden.

**Usuarios que pueden emitir**:
- 👨‍🍳 Personal de Cocina
- 🧑‍💼 Mozo

#### Parámetros

```typescript
{
    orderId: number;      // ID de la orden
    lineNumber: number;   // Número de línea a eliminar
}
```

#### Ejemplo de Uso

```javascript
socket.emit('deleteOrderLine', {
    orderId: 42,
    lineNumber: 2
});
```

#### ✅ Caso de Éxito

**Validaciones**:
- ✅ `orderId` es un número válido
- ✅ `lineNumber` es un número válido
- ✅ La orden existe en BD
- ✅ La línea existe en la orden

**Operación**:
1. Se elimina la línea de la BD
2. Se recalcula el total de la orden
3. Se emite `deletedOrderLine` a:
   - 📝 Cocina
   - 🧑‍💼 Mozo
   - 🍽️ Comensal

**Respuesta del Servidor**:
```typescript
socket.emit('deletedOrderLine', {
    idPedido: 42,
    orderLines: [
        // Línea #2 ya no aparece aquí
        {
            lineNumber: 1,
            // ...
        },
        {
            lineNumber: 3,
            // ...
        }
    ],
    totalPrice: 650.00
});
```

#### ❌ Casos de Error

**1. Validación - Order ID inválido**
```json
{
    "statusCode": 400,
    "name": "ValidationError",
    "message": "El número de Pedido debe ser válido"
}
```

**2. Validación - Line Number inválido**
```json
{
    "statusCode": 400,
    "name": "ValidationError",
    "message": "El número de Línea debe ser válido"
}
```

**3. Orden no encontrada**
```json
{
    "statusCode": 404,
    "name": "NotFoundError",
    "message": "Orden con ID 42 no encontrada"
}
```

**4. Línea no encontrada**
```json
{
    "statusCode": 404,
    "name": "NotFoundError",
    "message": "Línea #2 no encontrada en la orden"
}
```

---

### 4️⃣ `modifyOrder`

#### Descripción
Modifica datos de una orden y/o reemplaza líneas específicas.

**Usuarios que pueden emitir**:
- 👨‍🍳 Personal de Cocina
- 🧑‍💼 Mozo

#### Parámetros

```typescript
{
    orderId: number;          // ID de la orden
    lineNumbers?: number[];   // Líneas a modificar (si se modifica items)
    data: {
        items?: OrderLineSchema[],  // Nuevas líneas
        notes?: string,             // Notas de la orden
        specialRequests?: string,   // Solicitudes especiales
        // ... otros campos opcionales
    }
}
```

#### Ejemplo de Uso

**Ejemplo 1: Modificar globales de la orden**
```javascript
socket.emit('modifyOrder', {
    orderId: 42,
    data: {
        notes: "Por favor servir juntos"
    }
});
```

**Ejemplo 2: Reemplazar líneas específicas**
```javascript
socket.emit('modifyOrder', {
    orderId: 42,
    lineNumbers: [1, 2],
    data: {
        items: [
            {
                productId: "new-product-uuid",
                quantity: 3,
                unitPrice: 180.00
            }
        ]
    }
});
```

#### ✅ Caso de Éxito

**Validaciones**:
- ✅ `orderId` es un número válido
- ✅ Si se envía `items`, se requiere `lineNumbers`
- ✅ Si se envía `lineNumbers`, se requiere `items`
- ✅ Datos cumple con schema de validación
- ✅ Orden existe en BD
- ✅ Todas las líneas existen

**Operación**:
1. Se valida el schema de datos
2. Se actualizan los campos indicados
3. Se emite `modifiedOrderLine` a los abonados

**Respuesta del Servidor**:
```typescript
socket.emit('modifiedOrderLine', {
    idPedido: 42,
    notes: "Por favor servir juntos",
    orderLines: [
        // ... líneas actualizadas
    ],
    // ... resto de datos
});
```

#### ❌ Casos de Error

**1. Validación - Inconsistencia en parámetros**
```json
{
    "statusCode": 400,
    "name": "ValidationError",
    "message": "Para modificar lineas, se requieren los números de las líneas y los items a modificar en conjunto"
}
```

**2. Validación - Order ID inválido**
```json
{
    "statusCode": 400,
    "name": "ValidationError",
    "message": "El número de Pedido debe ser válido"
}
```

**3. Validación - Schema incorrecto**
```json
{
    "statusCode": 400,
    "name": "ValidationError",
    "message": "Validation failed: Expected string, received number"
}
```

**4. Orden no encontrada**
```json
{
    "statusCode": 404,
    "name": "NotFoundError",
    "message": "Orden con ID 42 no encontrada"
}
```

---

## Eventos del Servidor → Cliente

Estos eventos son emitidos por el servidor hacia los clientes conectados.

---

### 📊 `activeOrders`

#### Descripción
Emitido al Personal de Cocina cuando se conectan, contiene todas las órdenes activas.

**Emitido a**: 👨‍🍳 Personal de Cocina (sala `cocina`)

**Timing**: Al conectarse

#### Estructura de Respuesta

```typescript
Array<{
    idPedido: number;
    nroMesa: number;
    estado: "Activo" | "Completado" | "Cancelado";
    fechaCreacion: Date;
    orderLines: Array<{
        lineNumber: number;
        productName: string;
        quantity: number;
        status: OrderLineStatus;
        notes?: string;
    }>;
    totalPrice: number;
}>
```

#### Ejemplo

```javascript
socket.on('activeOrders', (orders) => {
    console.log('Órdenes activas:', orders);
    // [
    //     {
    //         idPedido: 42,
    //         nroMesa: 5,
    //         estado: "Activo",
    //         orderLines: [
    //             {
    //                 lineNumber: 1,
    //                 productName: "Milanesa",
    //                 quantity: 2,
    //                 status: "Pendiente"
    //             }
    //         ]
    //     }
    // ]
});
```

---

### 👨‍💼 `waiterOrders`

#### Descripción
Emitido al Mozo cuando se conecta, contiene sus órdenes.

**Emitido a**: 🧑‍💼 Mozo (sala `mozo:{username}`)

**Timing**: Al conectarse

#### Estructura de Respuesta

```typescript
Array<{
    idPedido: number;
    nroMesa: number;
    estado: "Activo" | "Completado" | "Cancelado";
    mozo: {
        idUsuario: string;
        username: string;
    };
    orderLines: Array<{
        lineNumber: number;
        productName: string;
        quantity: number;
        status: OrderLineStatus;
    }>;
    totalPrice: number;
}>
```

---

### 🆕 `newOrder`

#### Descripción
Se emite cuando se crea una nueva orden. Se envía a:
- 👨‍🍳 Personal de Cocina (para que vea el pedido)
- 🧑‍💼 Mozo de la mesa (si aplica)
- 🍽️ Comensal (confirmación de su pedido)

**Emitido a**:
- Sala `cocina` (todos los cocineros)
- Sala `mozo:{username}` (mozo responsable)
- Sala `comensal:{qrToken}` (el cliente)

**Timing**: Inmediatamente después de crear la orden

#### Estructura de Respuesta

```typescript
{
    idPedido: number;
    nroMesa: number;
    estado: "Activo";
    fechaCreacion: Date;
    mozo?: {
        idUsuario: string;
        username: string;
    };
    orderLines: Array<{
        lineNumber: number;
        productId: string;
        productName: string;
        quantity: number;
        unitPrice: number;
        status: "Pendiente";
        notes?: string;
    }>;
    totalPrice: number;
}
```

#### Ejemplo

```javascript
socket.on('newOrder', (order) => {
    console.log('Nueva orden creada:', order);
    // Actualizar UI con la nueva orden
});
```

---

### ⚡ `updatedOrderLineStatus`

#### Descripción
Se emite cuando cambia el estado de una línea de orden.

**Emitido a**:
- Sala `cocina`
- Sala `mozo:{username}`
- Sala `comensal:{qrToken}`

**Timing**: Después de ejecutar `updateLineStatus`

#### Estructura

```typescript
{
    idPedido: number;
    orderLines: Array<{
        lineNumber: number;
        status: OrderLineStatus;
        // ... resto de datos de la línea
    }>;
    // ... resto de datos de la orden
}
```

---

### ➕ `addedOrderLine`

#### Descripción
Se emite cuando se agrega una línea a una orden.

**Emitido a**:
- Sala `cocina`
- Sala `mozo:{username}`
- Sala `comensal:{qrToken}`

**Timing**: Después de ejecutar `addOrderLine`

#### Estructura

```typescript
{
    idPedido: number;
    orderLines: Array<{
        lineNumber: number;
        productId: string;
        productName: string;
        quantity: number;
        status: "Pendiente";
    }>;
    totalPrice: number;
}
```

---

### 🔄 `modifiedOrderLine`

#### Descripción
Se emite cuando se modifican líneas de una orden.

**Emitido a**:
- Sala `cocina`
- Sala `mozo:{username}`
- Sala `comensal:{qrToken}`

**Timing**: Después de ejecutar `modifyOrder`

---

### ❌ `deletedOrderLine`

#### Descripción
Se emite cuando se elimina una línea de una orden.

**Emitido a**:
- Sala `cocina`
- Sala `mozo:{username}`
- Sala `comensal:{qrToken}`

**Timing**: Después de ejecutar `deleteOrderLine`

#### Estructura

```typescript
{
    idPedido: number;
    orderLines: Array<{
        lineNumber: number;
        // ... nota: la línea eliminada ya no aparece aquí
    }>;
    totalPrice: number;
}
```

---

### 💳 `orderPaymentEvent`

#### Descripción
Se emite cuando se procesa un pago de una orden.

**Emitido a**:
- Sala `cocina`
- Sala `mozo:{username}`
- Sala `comensal:{qrToken}`

**Timing**: Después de procesar pago

#### Estructura

```typescript
{
    idPedido: number;
    estado: "Pagado";
    metodoPago: string;
    monto: number;
    fecha: Date;
}
```

---

### ⚠️ `errorEvent`

#### Descripción
Se emite cuando ocurre un error en el servidor.

**Emitido a**: Cliente que causó el error

**Timing**: Inmediatamente después del error

#### Estructura

```typescript
{
    statusCode: number;      // Código HTTP equivalente
    name: string;            // Nombre del error (ej: ValidationError)
    message: string;         // Mensaje descriptivo
}
```

#### Ejemplo

```javascript
socket.on('errorEvent', (error) => {
    console.error(`Error [${error.statusCode}]: ${error.message}`);
    // Mostrar notificación al usuario
});
```

---

## Flujos Completos

### Flujo 1: Cocina Prepara un Pedido

```
1. Comensal crea orden
   Client → emit('createOrder')
   
   ↓
   
2. Servidor emite confirmación
   Server → emit('newOrder') a salas:
   - cocina
   - mozo:{username}
   - comensal:{qrToken}

   ↓

3. Cocinero marca como "En Preparación"
   Cocina → emit('updateLineStatus', {
       idPedido: 42,
       nroLinea: 1,
       estadoLP: 'EnPreparacion'
   })

   ↓

4. Servidor notifica a todos
   Server → emit('updatedOrderLineStatus') a:
   - cocina
   - mozo:{username}
   - comensal:{qrToken}

   ↓

5. Cocinero marca como "Listo"
   Cocina → emit('updateLineStatus', {
       ...
       estadoLP: 'Listo'
   })

   ↓

6. Mozo ve que está listo y lo sirve
   Mozo → emit('updateLineStatus', {
       ...
       estadoLP: 'Servido'
   })

   ↓

7. Notificación final
   Server → emit('updatedOrderLineStatus') a comensal
```

### Flujo 2: Mozo Agrega Items a una Orden

```
1. Mozo solicita agregar items
   Mozo → emit('addOrderLine', {
       orderId: 42,
       orderLines: [{...}]
   })

   ↓

2. Servidor valida y agrega
   - Valida items
   - Inserta en BD
   - Recalcula total

   ↓

3. Servidor notifica a todos
   Server → emit('addedOrderLine') a:
   - cocina (nuevo item para preparar)
   - mozo:{username}
   - comensal:{qrToken} (se agregan items a su orden)

   ↓

4. Cocinero comienza a preparar
```

### Flujo 3: Error en Validación

```
1. Cliente envía evento con datos inválidos
   Client → emit('updateLineStatus', {
       idPedido: "abc",  // ❌ Debe ser número
       nroLinea: 1,
       estadoLP: 'EnPreparacion'
   })

   ↓

2. Middleware valida
   if(isNaN(+nroLinea)) throw ValidationError

   ↓

3. Manejador de errores captura excepción
   catch (error) {
       HandleSocketError(socket, error);
   }

   ↓

4. Cliente recibe notificación de error
   Client → on('errorEvent', {
       statusCode: 400,
       name: 'ValidationError',
       message: 'El número de Pedido debe ser válido'
   })
```

---

## Referencias

- [Sockets Overview](./SOCKETS_OVERVIEW.md)
- [Authentication](./AUTHENTICATION.md)
- [Error Handling](./ERROR_HANDLING.md)
- [OrderHandler Source](../../backend/src/presentation/sockets/handlers/OrderHandler.ts)
