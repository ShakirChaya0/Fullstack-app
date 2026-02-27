# 🔌 WebSocket API - Complete Documentation

## 📚 Documentación Completa de WebSockets

Bienvenido a la documentación completa del sistema WebSocket de **Sabores Deluxe Restaurante**. 

Esta documentación cubre toda la comunicación en tiempo real entre clientes (Comensales, Mozos, Personal de Cocina) y el servidor.

---

## 📖 Índice de Documentación

### 1. 📋 [SOCKETS_OVERVIEW.md](./SOCKETS_OVERVIEW.md)
**Descripción General de la Arquitectura WebSocket**

Comienza aquí si quieres entender:
- ✅ Qué es el sistema WebSocket
- ✅ Cómo funciona la arquitectura
- ✅ Los 3 tipos de usuarios (Cocina, Mozo, Comensal)
- ✅ Las salas (rooms) y cómo se organizan
- ✅ El flujo de conexión paso a paso
- ✅ Configuración del servidor

**Para**: Desarrolladores que necesitan entender cómo funciona el sistema

---

### 2. 🔐 [AUTHENTICATION.md](./AUTHENTICATION.md)
**Autenticación y Autorización en WebSockets**

Lee esto para entender:
- ✅ Dos métodos de autenticación (JWT y QR Token)
- ✅ Cómo se validan las credenciales
- ✅ Casos de éxito de autenticación
- ✅ Errores de autenticación y cómo manejarlos
- ✅ Mejores prácticas de seguridad

**Para**: Desarrolladores que compilen o mantengan el código de autenticación

---

### 3. 📨 [EVENTS.md](./EVENTS.md)
**Documentación Detallada de Todos los Eventos**

La guía más importante. Aquí encontrarás:
- ✅ Cada evento que puede emitir un cliente
- ✅ Cada evento que emite el servidor
- ✅ Parámetros y estructura de datos
- ✅ Casos de éxito para cada evento
- ✅ Casos de error para cada evento
- ✅ Ejemplos de uso en JavaScript
- ✅ Flujos completos de interacción

**Para**: Desarrolladores frontend/backend integrando WebSockets

---

### 4. ❌ [ERROR_HANDLING.md](./ERROR_HANDLING.md)
**Manejo Comprehensivo de Errores**

Aprende sobre:
- ✅ 7 tipos de excepciones diferentes
- ✅ Códigos HTTP equivalentes (400, 401, 403, 404, 409, 503, 500)
- ✅ Cómo se genera cada tipo de error
- ✅ Cómo manejar errores en el cliente
- ✅ Patrones de reintento y recuperación
- ✅ Logging y debugging
- ✅ Ejemplos prácticos

**Para**: Desarrolladores que necesitan manejar errores correctamente

---

## 🎯 Guía Rápida por Rol

### 👨‍💻 Si eres Desarrollador Frontend

1. Leer: [SOCKETS_OVERVIEW.md](./SOCKETS_OVERVIEW.md) - Entiende la arquitectura
2. Leer: [EVENTS.md](./EVENTS.md) - Todos los eventos disponibles
3. Leer: [AUTHENTICATION.md](./AUTHENTICATION.md) - Cómo autenticarse
4. Leer: [ERROR_HANDLING.md](./ERROR_HANDLING.md) - Cómo manejar errores
5. Consultar: [EVENTS.md](./EVENTS.md) cuando necesites detalles de un evento específico

**Tareas comunes**:
- Conectar con JWT/QR Token
- Escuchar eventos del servidor
- Emitir eventos al servidor
- Manejar errores

---

### 👨‍💼 Si eres Desarrollador Backend

1. Leer: [SOCKETS_OVERVIEW.md](./SOCKETS_OVERVIEW.md) - Entiende la arquitectura
2. Leer: [AUTHENTICATION.md](./AUTHENTICATION.md) - Cómo funciona la validación
3. Leer: [EVENTS.md](./EVENTS.md) - Estructura de datos de eventos
4. Leer: [ERROR_HANDLING.md](./ERROR_HANDLING.md) - Cómo se manejan errores
5. Consultar: Código fuente en `/backend/src/presentation/sockets/`

**Tareas comunes**:
- Agregar nuevos eventos
- Modificar validación
- Cambiar estructura de respuestas
- Actualizar manejo de errores

---

### 🚀 Si necesitas Agregar una Nueva Funcionalidad

1. Leer: [EVENTS.md](./EVENTS.md) - Ver patrones existentes
2. Leer: [ERROR_HANDLING.md](./ERROR_HANDLING.md) - Qué errores lanzar
3. Implementar:
   - Agregar listener en [OrderHandler.ts](../../backend/src/presentation/sockets/handlers/OrderHandler.ts)
   - Agregar método en [OrderController.ts](../../backend/src/presentation/controllers/OrderController.ts)
   - Definir use case si es necesario
   - Usar `HandleSocketError` en catch blocks
   - Emitir evento de respuesta via `OrderSocketService`

---

## 📊 Matriz de Eventos

### Eventos por Tipo de Usuario

#### 👨‍🍳 Personal de Cocina (SectorCocina)

**Recibe**:
```
✅ activeOrders        - Al conectarse
✅ newOrder            - Nuevas órdenes
✅ addedOrderLine      - Líneas agregadas
✅ updatedOrderLineStatus - Estados actualizados
✅ modifiedOrderLine   - Líneas modificadas
✅ deletedOrderLine    - Líneas eliminadas
```

**Emite**:
```
✅ updateLineStatus    - Cambiar estado de línea
```

---

#### 🧑‍💼 Mozo

**Recibe**:
```
✅ waiterOrders        - Al conectarse
✅ newOrder            - Nuevas órdenes de sus mesas
✅ addedOrderLine      - Líneas agregadas
✅ updatedOrderLineStatus - Estados actualizados
✅ modifiedOrderLine   - Líneas modificadas
✅ deletedOrderLine    - Líneas eliminadas
✅ orderPaymentEvent   - Notificaciones de pago
```

**Emite**:
```
✅ updateLineStatus    - Cambiar estado de línea
✅ addOrderLine        - Agregar línea a orden
✅ modifyOrder         - Modificar orden
✅ deleteOrderLine     - Eliminar línea
```

---

#### 🍽️ Comensal (Cliente con QR)

**Recibe**:
```
✅ newOrder            - Confirmación de su orden
✅ updatedOrderLineStatus - Estados actualizados
✅ addedOrderLine      - Líneas agregadas
✅ modifiedOrderLine   - Líneas modificadas
✅ deletedOrderLine    - Líneas eliminadas
✅ orderPaymentEvent   - Notificación de pago
```

**Emite**:
```
❌ No emite eventos (solo escucha)
```

---

## 🔄 Flujos de Ejemplo

### Ejemplo 1: Crear y Preparar un Pedido

```
Comensal                Server              Cocina
    │                     │                   │
    ├──createOrder───────→│                   │
    │                     ├──newOrder────────→│
    │                     │                   │
    │                     │← updateLineStatus ├─
    │                     │                   ├──(cambiar a "EnPreparacion")
    │                     │                   │
    │←──orderStatus──────│                   │
    │                     │                   │
    │                     │← updateLineStatus ├─
    │                     │                   ├──(cambiar a "Listo")
    │                     │                   │
    │←──orderReady──────┤                   │
    │                     │                   │
```

---

### Ejemplo 2: Manejo de Error

```
Cliente                 Server              Handler
    │                     │                   │
    ├──evento inválido───→│                   │
    │                     ├──validar────────→│
    │                     │←──error─────────┤
    │                     │   (ValidationError)
    │←──errorEvent───────│                   │
    │   {400, message}    │                   │
    │                     │                   │
```

---

## 🛠️ Archivos de Código Fuente

```
backend/src/
├── presentation/
│   ├── sockets/
│   │   ├── SocketServerConnection.ts    ← Inicialización
│   │   └── handlers/
│   │       ├── OrderHandler.ts          ← Listeners de eventos
│   │       └── HandleSocketError.ts     ← Manejo de errores
│   ├── middlewares/
│   │   └── AuthSocketMiddleware.ts      ← Validación
│   └── controllers/
│       └── OrderController.ts           ← Lógica de negocio
│
├── application/
│   └── services/
│       └── OrderSocketService.ts        ← Emisor de eventos
│
└── shared/
    └── exceptions/                      ← Tipos de errores
        ├── ValidationError.ts
        ├── UnauthorizedError.ts
        ├── ForbiddenError.ts
        ├── NotFoundError.ts
        ├── ConflictError.ts
        ├── ServiceError.ts
        └── ServerError.ts
```

---

## 🧪 Testing

Para probar los WebSockets, puedes usar:

### Cliente HTTP/WebSocket
```bash
# Usar herramientas como Postman, Insomnia con soporte WebSocket
# O herramientas CLI como wscat
npm install -g wscat
wscat -c "ws://localhost:3000" --header "Authorization: Bearer YOUR_JWT"
```

### Testing Automatizado
```bash
# Ejecutar tests de integración
npm run test:integration

# Ver archivo de pruebas en:
backend/src/tests/
```

---

## 🔗 Enlaces Rápidos

- [SocketServerConnection.ts](../../backend/src/presentation/sockets/SocketServerConnection.ts) - Configuración
- [OrderHandler.ts](../../backend/src/presentation/sockets/handlers/OrderHandler.ts) - Listeners
- [OrderController.ts](../../backend/src/presentation/controllers/OrderController.ts) - Lógica
- [AuthSocketMiddleware.ts](../../backend/src/presentation/middlewares/AuthSocketMiddleware.ts) - Autenticación
- [HandleSocketError.ts](../../backend/src/presentation/sockets/handlers/HandleSocketError.ts) - Errores
- [Exception Classes](../../backend/src/shared/exceptions/) - Tipos de error

---

## 📞 Preguntas Frecuentes

**P: ¿Cómo me conecto como Cocina?**
> R: Usar JWT obtenido en login con tipo de usuario "SectorCocina". Ver [AUTHENTICATION.md](./AUTHENTICATION.md)

**P: ¿Cómo me conecto como Cliente (Comensal)?**
> R: Usar QR Token obtenido escaneando código QR. Ver [AUTHENTICATION.md](./AUTHENTICATION.md)

**P: ¿Qué hacer cuando recibo un error?**
> R: Consultar [ERROR_HANDLING.md](./ERROR_HANDLING.md) para ver el tipo de error y cómo manejarlo.

**P: ¿Puedo emitir este evento desde mi rol?**
> R: Ver matriz de eventos arriba o consultar [EVENTS.md](./EVENTS.md)

**P: ¿Cuáles son los parámetros de un evento?**
> R: Buscar el evento en [EVENTS.md](./EVENTS.md) para ver parámetros exactos y ejemplos.

**P: ¿Cómo agrego un nuevo evento?**
> R: Consultar [EVENTS.md](./EVENTS.md) para ver patrones y luego modificar [OrderHandler.ts](../../backend/src/presentation/sockets/handlers/OrderHandler.ts)

---

## 📋 Última Actualización

- **Fecha**: Febrero 2026
- **Versión del Sistema**: 1.0
- **Socket.io Version**: 4.x+

---

## ✅ Checklist de Implementación

- ✅ Entender autenticación
- ✅ Entender estructura de eventos
- ✅ Manejar errores correctamente
- ✅ Validar datos en cliente
- ✅ Escuchar eventos del servidor
- ✅ Emitir eventos al servidor
- ✅ Recuperarse de errores
- ✅ Registrar logs para debugging

---

**¡Ya estás listo para trabajar con WebSockets! 🚀**

Para comenzar, lee [SOCKETS_OVERVIEW.md](./SOCKETS_OVERVIEW.md) primero.
