# 🔌 WebSocket API Documentation - Sabores Deluxe Restaurante

## Índice
1. [Descripción General](#descripción-general)
2. [Arquitectura](#arquitectura)
3. [Configuración del Servidor](#configuración-del-servidor)
4. [Tipos de Usuarios](#tipos-de-usuarios)
5. [Salas (Rooms)](#salas-rooms)
6. [Flujo de Conexión](#flujo-de-conexión)

---

## Descripción General

El sistema WebSocket implementado en la API es responsable de la **comunicación en tiempo real** entre los clientes conectados (Comensales, Mozos, Cocina y Personal de Administración). 

Los WebSockets permiten:
- 📨 **Notificaciones instantáneas** de cambios en pedidos
- 🔄 **Sincronización en tiempo real** del estado de las órdenes
- 👥 **Comunicación bidireccional** entre diferentes tipos de usuarios
- 🎯 **Entrega dirigida** de notificaciones según el rol del usuario

---

## Arquitectura

### Estructura de Archivos

```
backend/src/presentation/
├── sockets/
│   ├── SocketServerConnection.ts     # Inicialización y configuración del servidor
│   └── handlers/
│       ├── OrderHandler.ts            # Registración de listeners para eventos de órdenes
│       └── HandleSocketError.ts       # Manejo centralizado de errores
├── middlewares/
│   └── AuthSocketMiddleware.ts        # Autenticación y autorización de WebSockets
└── controllers/
    └── OrderController.ts             # Lógica de negocio para eventos de órdenes
```

### Servicios Relacionados

- **OrderSocketService**: Servicio para emitir eventos relacionados con órdenes a través de WebSockets
- **AuthSocketMiddleware**: Middleware para validar y autenticar conexiones WebSocket

---

## Configuración del Servidor

### Inicialización

**Archivo**: [SocketServerConnection.ts](../../backend/src/presentation/sockets/SocketServerConnection.ts)

```typescript
ioConnection = new Server(server, {
    connectionStateRecovery: {
        maxDisconnectionDuration: 1000 * 60  // 1 minuto de recuperación de desconexión
    },
    cors: {
        origin: [
            process.env.FRONTEND_URL?.trim(),
            'https://sabores-deluxe-restaurante.vercel.app',
            'http://localhost:3000',
            'http://localhost:5173'
        ].filter(Boolean) as string[],
        credentials: true,
        methods: ['GET', 'POST']
    }
});
```

### Características Principales

| Característica | Descripción | Valor |
|---|---|---|
| **Connection State Recovery** | Recuperación automática de desconexiones | 1 minuto |
| **CORS** | Orígenes permitidos | Frontend URLs configuradas |
| **Credentials** | Permitir cookies y autenticación | Habilitado |
| **Transports** | Tipos de transporte | WebSocket y Polling |

---

## Tipos de Usuarios

El sistema diferencia entre **3 tipos principales de usuarios** que se conectan vía WebSocket:

### 1. 👨‍🍳 Personal de Cocina (`SectorCocina`)

**Propósito**: Recibir y gestionar órdenes activas

**Autenticación**: JWT Token

**Sala Asignada**: `cocina`

**Eventos que Recibe**:
- `activeOrders` - Lista de órdenes activas al conectarse
- `newOrder` - Nueva orden creada
- `addedOrderLine` - Línea de orden agregada
- `modifiedOrderLine` - Línea de orden modificada
- `updatedOrderLineStatus` - Estado de línea actualizado
- `deletedOrderLine` - Línea de orden eliminada

**Eventos que Puede Emitir**:
- `updateLineStatus` - Cambiar estado de una línea de orden

---

### 2. 🧑‍💼 Mozo (`Mozo`)

**Propósito**: Gestionar órdenes de sus mesas asignadas

**Autenticación**: JWT Token

**Sala Asignada**: `mozo:{username}` (privada)

**Eventos que Recibe**:
- `waiterOrders` - Órdenes del mozo al conectarse
- `newOrder` - Cuando el cliente de su mesa crea una orden
- `addedOrderLine` - Línea agregada a sus órdenes
- `modifiedOrderLine` - Línea modificada
- `updatedOrderLineStatus` - Estado actualizado
- `deletedOrderLine` - Línea eliminada
- `orderPaymentEvent` - Notificación de pago de orden

**Eventos que Puede Emitir**:
- `updateLineStatus` - Modificar estado de línea
- `addOrderLine` - Agregar línea a orden
- `modifyOrder` - Modificar orden
- `deleteOrderLine` - Eliminar línea de orden

---

### 3. 🍽️ Comensal/Cliente Anónimo (`qrToken`)

**Propósito**: Recibir notificaciones de su pedido

**Autenticación**: QR Token

**Sala Asignada**: `comensal:{qrToken}` (privada)

**Eventos que Recibe**:
- `newOrder` - Confirmación de su orden creada
- `updatedOrderLineStatus` - Estado de sus líneas de orden
- `addedOrderLine` - Línea agregada a su orden
- `modifiedOrderLine` - Línea modificada
- `deletedOrderLine` - Línea eliminada
- `orderPaymentEvent` - Notificación de pago

**Eventos que Puede Emitir**:
- No emite eventos directamente (es una conexión de "escucha")

---

## Salas (Rooms)

El sistema organiza a los usuarios en salas (rooms) para dirigir las notificaciones de forma eficiente:

### Salas Públicas

| Sala | Usuarios Conectados | Propósito |
|------|---|---|
| `cocina` | Personal de Cocina | Recibir todas las órdenes |

### Salas Privadas

| Estructura | Usuarios Conectados | Propósito |
|---|---|---|
| `mozo:{username}` | Un Mozo específico | Recibir órdenes de sus mesas |
| `comensal:{qrToken}` | Un Cliente con su QR | Recibir actualizaciones de su pedido |

---

## Flujo de Conexión

### Paso 1: Cliente Inicia Conexión

```
Cliente → Servidor WebSocket
  ├── Envía JWT (si es mozo/admin) O
  ├── Envía QR Token (si es cliente)
  └── Se valida en AuthSocketMiddleware
```

### Paso 2: Middleware de Autenticación

[Detalle completo en AUTHENTICATION.md](./AUTHENTICATION.md)

El middleware [AuthSocketMiddleware.ts](../../backend/src/presentation/middlewares/AuthSocketMiddleware.ts):

1. ✅ Verifica JWT si existe
2. ✅ Verifica QR Token si existe
3. ✅ Extrae información del usuario
4. ✅ Asigna propiedades al socket
5. ✅ Maneja errores de autenticación

### Paso 3: Asignación a Sala

Basado en el tipo de usuario, se asigna automáticamente a la sala correspondiente:

```typescript
if (socket.user?.tipoUsuario === "SectorCocina") {
    socket.join("cocina");
    // Recibe lista de órdenes activas
}
else if (socket.user?.tipoUsuario === "Mozo") {
    socket.join(`mozo:${socket.user.username}`);
    // Recibe órdenes de sus mesas
}
else if (socket.qrToken) {
    socket.join(`comensal:${socket.qrToken}`);
    // Recibe actualizaciones de su pedido
}
```

### Paso 4: Registración de Handlers

Se registran los listeners de eventos específicos para el usuario:

```typescript
registerOrderHandlers(ioConnection, socket);
```

---

## Ciclo de Vida de la Conexión

```
┌─────────────────────────────────────────────────────┐
│  1. Cliente inicia conexión WebSocket               │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│  2. AuthSocketMiddleware valida credenciales        │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│  3. Servidor asigna socket a sala según tipo       │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│  4. Registra listeners de eventos                   │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│  5. Emite datos iniciales (órdenes activas, etc)   │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│  6. Socket en estado "listo" para recibir eventos   │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│  7. Cliente desconecta o cierra navegador           │
│     → Automáticamente sale de todas las salas       │
└─────────────────────────────────────────────────────┘
```

---

## Logging y Debugging

El sistema incluye logging extensivo para facilitar el debugging:

### Niveles de Log

```
🔌 Nueva conexión - Socket ID: socket_id
👤 Usuario: username_or_undefined
🎫 QR Token: token_or_undefined

📝 Registrando handlers para socket: socket_id
🧑‍🍳 Socket unido a sala: cocina
🧑‍💼 Socket unido a sala: mozo:username
🍽️ Socket unido a sala: comensal:qrtoken

📥 Evento recibido: eventName
🔄 Ejecutando orderController.methodName...
✅ Completado exitosamente

❌ Error: error_message
```

---

## Referencias

- [Eventos Detallados](./EVENTS.md)
- [Manejo de Errores](./ERROR_HANDLING.md)
- [Autenticación WebSocket](./AUTHENTICATION.md)
- [Socket.io Documentation](https://socket.io/docs/)
