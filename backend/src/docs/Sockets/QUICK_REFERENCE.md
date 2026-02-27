# 🚀 WebSocket Quick Reference Guide

## Índice de Referencia Rápida

Usa este documento como referencia rápida cuando necesites información específica.

---

## ⚡ Conectarse al WebSocket

### Desde Frontend (JavaScript/React)

```javascript
import io from 'socket.io-client';

// Con JWT (Mozo, Cocina, Admin)
const socket = io('http://localhost:3000', {
    auth: {
        jwt: localStorage.getItem('accessToken')
    },
    withCredentials: true,
    transports: ['websocket', 'polling']
});

// Con QR Token (Cliente Anónimo)
const qrToken = sessionStorage.getItem('qrToken');
const socket = io('http://localhost:3000', {
    auth: {
        qrToken: qrToken
    },
    withCredentials: true,
    transports: ['websocket', 'polling']
});

// Escuchar conexión
socket.on('connect', () => {
    console.log('✅ Conectado');
});

socket.on('errorEvent', (error) => {
    console.error('❌ Error:', error.message);
});
```

---

## 📤 Emitir Eventos

### Estado de Línea de Orden

```javascript
// Cambiar estado de una línea
socket.emit('updateLineStatus', {
    idPedido: 42,
    nroLinea: 1,
    estadoLP: 'EnPreparacion'
});

// Estados válidos:
// "Pendiente", "EnPreparacion", "Listo", "Servido", "Cancelado", "Retrasado"
```

### Agregar Línea a Orden

```javascript
socket.emit('addOrderLine', {
    orderId: 42,
    orderLines: [
        {
            productId: 'product-uuid',
            quantity: 2,
            unitPrice: 150.00,
            notes: 'Sin cebolla'
        }
    ]
});
```

### Eliminar Línea de Orden

```javascript
socket.emit('deleteOrderLine', {
    orderId: 42,
    lineNumber: 1
});
```

### Modificar Orden

```javascript
// Modificar globales
socket.emit('modifyOrder', {
    orderId: 42,
    data: {
        notes: 'Por favor servir juntos'
    }
});

// Reemplazar líneas
socket.emit('modifyOrder', {
    orderId: 42,
    lineNumbers: [1, 2],
    data: {
        items: [
            {
                productId: 'new-uuid',
                quantity: 1,
                unitPrice: 200.00
            }
        ]
    }
});
```

---

## 📥 Escuchar Eventos

### Eventos Iniciales

```javascript
// Cocina - Órdenes activas al conectarse
socket.on('activeOrders', (orders) => {
    console.log('Órdenes activas:', orders);
});

// Mozo - Sus órdenes al conectarse
socket.on('waiterOrders', (orders) => {
    console.log('Mis órdenes:', orders);
});
```

### Notificaciones en Tiempo Real

```javascript
// Nueva orden creada
socket.on('newOrder', (order) => {
    console.log('Nueva orden:', order);
});

// Estado de línea actualizado
socket.on('updatedOrderLineStatus', (order) => {
    console.log('Estado actualizado:', order);
});

// Línea agregada
socket.on('addedOrderLine', (order) => {
    console.log('Línea agregada:', order);
});

// Línea modificada
socket.on('modifiedOrderLine', (order) => {
    console.log('Línea modificada:', order);
});

// Línea eliminada
socket.on('deletedOrderLine', (order) => {
    console.log('Línea eliminada:', order);
});

// Pago procesado
socket.on('orderPaymentEvent', (event) => {
    console.log('Pago recibido:', event);
});

// Error
socket.on('errorEvent', (error) => {
    console.error(`[${error.statusCode}] ${error.message}`);
});
```

---

## 🔐 Códigos de Error

| Código | Tipo | Significado | Acción |
|--------|------|-------------|--------|
| **400** | ValidationError | Datos inválidos | Corregir y reintentar |
| **401** | UnauthorizedError | No autenticado | Hacer login |
| **403** | ForbiddenError | Sin permisos | Verificar rol |
| **404** | NotFoundError | No encontrado | Recargar datos |
| **409** | ConflictError | Conflicto de estado | Sincronizar estado |
| **503** | ServiceError | Servicio no disponible | Reintentar luego |
| **500** | ServerError | Error del servidor | Contactar soporte |

---

## 🧪 Ejemplos de Manejo de Errores

```javascript
socket.on('errorEvent', (error) => {
    switch (error.statusCode) {
        case 400:
            alert('❌ Datos inválidos: ' + error.message);
            break;
        case 401:
            alert('⏳ Sesión expirada. Por favor inicie sesión');
            window.location.href = '/login';
            break;
        case 403:
            alert('🚫 No tiene permisos para esto');
            break;
        case 404:
            alert('🔍 Recurso no encontrado');
            location.reload();
            break;
        case 409:
            alert('⚔️ Conflicto: ' + error.message);
            break;
        case 503:
            alert('⚠️ Servidor ocupado. Reintentando...');
            setTimeout(() => {
                // Reintentar operación
            }, 3000);
            break;
        case 500:
            alert('💥 Error del servidor. Contacte al administrador');
            break;
    }
});
```

---

## 👥 Roles y Permisos

### 👨‍🍳 Cocina (SectorCocina)

**Puede emitir**:
- ✅ `updateLineStatus` - Cambiar estado de línea

**Recibe automáticamente**:
- ✅ `activeOrders` - Al conectarse
- ✅ Todas las nuevas órdenes
- ✅ Todos los cambios en órdenes

---

### 🧑‍💼 Mozo

**Puede emitir**:
- ✅ `updateLineStatus` - Cambiar estado
- ✅ `addOrderLine` - Agregar línea
- ✅ `deleteOrderLine` - Eliminar línea
- ✅ `modifyOrder` - Modificar orden

**Recibe automáticamente**:
- ✅ `waiterOrders` - Sus órdenes al conectarse
- ✅ Cambios en sus órdenes
- ✅ Notificaciones de pago

---

### 🍽️ Comensal (QR Token)

**Puede emitir**:
- ❌ Nada (solo escucha)

**Recibe automáticamente**:
- ✅ `newOrder` - Confirmación
- ✅ Todos los cambios en su orden
- ✅ Notificación de pago

---

## 🔄 Patrones Comunes

### Validar Antes de Emitir

```javascript
function actualizarLínea(orderId, lineNum, status) {
    // Validar en cliente
    if (!Number.isInteger(orderId) || orderId <= 0) {
        alert('ID de orden no válido');
        return;
    }
    
    if (!Number.isInteger(lineNum) || lineNum <= 0) {
        alert('Número de línea no válido');
        return;
    }

    const estadosValidos = [
        'Pendiente', 'EnPreparacion', 'Listo', 
        'Servido', 'Cancelado', 'Retrasado'
    ];
    
    if (!estadosValidos.includes(status)) {
        alert('Estado no válido');
        return;
    }

    // Emitir
    socket.emit('updateLineStatus', {
        idPedido: orderId,
        nroLinea: lineNum,
        estadoLP: status
    });
}
```

### Debounce para Eventos Frecuentes

```javascript
let timeout;

function onLineStatusChange(orderId, lineNum, status) {
    clearTimeout(timeout);
    
    timeout = setTimeout(() => {
        socket.emit('updateLineStatus', {
            idPedido: orderId,
            nroLinea: lineNum,
            estadoLP: status
        });
    }, 500); // Esperar 500ms sin cambios
}
```

### Reintento Automático

```javascript
function emitWithRetry(event, data, maxRetries = 3) {
    let attempt = 0;

    const emit = () => {
        attempt++;
        socket.emit(event, data);

        // Escuchar error una sola vez
        const onError = (error) => {
            if (error.statusCode === 503 && attempt < maxRetries) {
                console.log(`Reintentando... (${attempt}/${maxRetries})`);
                socket.off('errorEvent', onError);
                setTimeout(emit, 2000);
            } else {
                socket.off('errorEvent', onError);
            }
        };

        socket.once('errorEvent', onError);
    };

    emit();
}

// Uso
emitWithRetry('updateLineStatus', {
    idPedido: 42,
    nroLinea: 1,
    estadoLP: 'EnPreparacion'
});
```

---

## 🔍 Debugging

```javascript
// Ver todos los eventos
socket.onAny((event, ...args) => {
    console.log(`📨 ${event}:`, args);
});

// Ver solo errores
socket.on('errorEvent', (error) => {
    console.error('🔴 Error:', error);
});

// Ver estado de conexión
socket.on('connect', () => console.log('✅ Conectado'));
socket.on('disconnect', (reason) => {
    console.warn('⚠️ Desconectado:', reason);
});
socket.on('connect_error', (error) => {
    console.error('🔌 Error de conexión:', error);
});

// Ver autenticación
socket.on('auth-fail', (error) => {
    console.error('🔐 Error de autenticación:', error);
});
```

---

## 📊 Cheat Sheet - Estados de Línea

```javascript
const LineStatus = {
    PENDING: 'Pendiente',           // Creada, sin preparar
    IN_PROGRESS: 'EnPreparacion',   // Se está preparando
    READY: 'Listo',                 // Lista para servir
    SERVED: 'Servido',              // Ya fue servida
    CANCELLED: 'Cancelado',         // Cancelada
    DELAYED: 'Retrasado'            // Retrasada
};

// Flujo típico
// Pendiente → EnPreparacion → Listo → Servido
```

---

## 🧠 Estructura de Orden (Full)

```typescript
interface Order {
    idPedido: number;
    nroMesa: number;
    estado: "Activo" | "Completado" | "Cancelado";
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
        status: "Pendiente" | "EnPreparacion" | "Listo" | "Servido" | "Cancelado" | "Retrasado";
        notes?: string;
    }>;
    totalPrice: number;
    metodoPago?: string;
    novedades?: string;
    solicitudesEspeciales?: string;
}
```

---

## 🐛 Errores Comunes

### Error: `El número de Línea debe ser válido`

**Causa**: Parámetro `nroLinea` o `lineNumber` no es un número entero válido

**Solución**:
```javascript
// ❌ Mal
socket.emit('updateLineStatus', {
    idPedido: 42,
    nroLinea: "1",  // String, no número
    estadoLP: 'EnPreparacion'
});

// ✅ Bien
socket.emit('updateLineStatus', {
    idPedido: 42,
    nroLinea: 1,  // Número entero
    estadoLP: 'EnPreparacion'
});
```

---

### Error: `Token no proporcionado`

**Causa**: No enviaste JWT ni QR Token

**Solución**:
```javascript
// Verificar que tienes el token
const token = localStorage.getItem('accessToken');
console.log('Tengo token:', !!token);

// Reconectar con token
socket = io('http://localhost:3000', {
    auth: { jwt: token },
    withCredentials: true
});
```

---

### Error: `Token expirado`

**Causa**: Tu JWT expiró

**Solución**:
```javascript
socket.on('errorEvent', (error) => {
    if (error.statusCode === 401) {
        // Obtener nuevo token (login)
        const newToken = await login(username, password);
        localStorage.setItem('accessToken', newToken);
        
        // Reconectar
        socket.disconnect();
        socket.connect();
    }
});
```

---

### Error: `Para modificar lineas, se requieren los números de las líneas...`

**Causa**: Mandaste `items` sin `lineNumbers` o viceversa

**Solución**:
```javascript
// ❌ Mal
socket.emit('modifyOrder', {
    orderId: 42,
    data: {
        items: [{...}]  // Falta lineNumbers
    }
});

// ✅ Bien
socket.emit('modifyOrder', {
    orderId: 42,
    lineNumbers: [1, 2],
    data: {
        items: [{...}]
    }
});
```

---

## 📚 Documentación Completa

Para información más detallada:
- [SOCKETS_OVERVIEW.md](./SOCKETS_OVERVIEW.md) - Arquitectura general
- [AUTHENTICATION.md](./AUTHENTICATION.md) - Autenticación
- [EVENTS.md](./EVENTS.md) - Eventos detallados
- [ERROR_HANDLING.md](./ERROR_HANDLING.md) - Manejo de errores

---

## ✅ Pre-check Antes de Producción

- ✅ ¿Validas datos antes de emitir?
- ✅ ¿Manejas el evento `errorEvent`?
- ✅ ✅ ¿Tienes reintentos para errores 503?
- ✅ ¿Redirige a login en errores 401?
- ✅ ¿Loggueas errores para debugging?
- ✅ ¿Desuscribes listeners cuando desmontas componentes?

---

**Última actualización**: Febrero 2026  
**Versión**: 1.0
