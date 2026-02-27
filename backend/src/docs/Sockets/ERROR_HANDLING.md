# ❌ WebSocket Error Handling

## Tabla de Contenidos
1. [Introducción](#introducción)
2. [Tipos de Errores](#tipos-de-errores)
3. [Tipos de Excepciones](#tipos-de-excepciones)
4. [Manejo Centralizado](#manejo-centralizado)
5. [Recuperación de Errores](#recuperación-de-errores)
6. [Logging y Debugging](#logging-y-debugging)

---

## Introducción

El sistema WebSocket implementa un manejo robusto de errores con:

✅ **Centralización**: Todos los errores pasan por `HandleSocketError`  
✅ **Tipificación**: Excepciones personalizadas con códigos HTTP  
✅ **Notificación**: Envío automático al cliente vía evento `errorEvent`  
✅ **Logging**: Registro detallado de errores para debugging  

---

## Tipos de Errores

### 1. 🔴 Errores de Validación (400)

**Clase**: `ValidationError`

**HTTP Status**: `400 Bad Request`

**Qué significa**: Los datos enviados por el cliente no cumplen con las reglas de validación

**Causas comunes**:
- Parámetros no son números cuando deberían serlo
- Campos obligatorios están missing
- Valores fuera de rango permitido
- Schema Zod no pasa validación

#### Ejemplos

```json
{
    "statusCode": 400,
    "name": "ValidationError",
    "message": "El número de Línea debe ser válido"
}
```

```json
{
    "statusCode": 400,
    "name": "ValidationError",
    "message": "El número de Pedido debe ser válido"
}
```

```json
{
    "statusCode": 400,
    "name": "ValidationError",
    "message": "Validation failed: Expected number, received NaN"
}
```

**Cómo se produce** (Código):

```typescript
// En OrderController
if(isNaN(+nroLinea)) {
    throw new ValidationError("El número de Línea debe ser válido");
}

if(isNaN(+idPedido)) {
    throw new ValidationError("El número de Pedido debe ser válido");
}
```

**Cómo manejarlo en Frontend**:

```javascript
socket.on('errorEvent', (error) => {
    if (error.statusCode === 400) {
        // Mostrar alerta al usuario
        alert(`Datos inválidos: ${error.message}`);
        
        // Permitir al usuario corregir y reintentar
        // Form sigue visible para edición
    }
});
```

---

### 2. 🔐 Errores de Autenticación (401)

**Clase**: `UnauthorizedError`

**HTTP Status**: `401 Unauthorized`

**Qué significa**: El cliente no está autenticado o su sesión es inválida

**Causas comunes**:
- JWT expirado
- JWT inválido o malformado
- QR Token inválido
- Sin credenciales en la solicitud

#### Ejemplos

```json
{
    "statusCode": 401,
    "name": "UnauthorizedError",
    "message": "Token no proporcionado"
}
```

```json
{
    "statusCode": 401,
    "name": "UnauthorizedError",
    "message": "Token expirado"
}
```

```json
{
    "statusCode": 401,
    "name": "UnauthorizedError",
    "message": "No se encontro el token del QR y el usuario no esta logeado"
}
```

**Cómo se produce**:

```typescript
// En AuthSocketMiddleware
if (!jwt && !qrToken) {
    throw new UnauthorizedError('...');
}

// En JWTService
if (decoded.exp < now) {
    throw new UnauthorizedError("Token expirado");
}
```

**Cómo manejarlo en Frontend**:

```javascript
socket.on('errorEvent', (error) => {
    if (error.statusCode === 401) {
        // Redirigir a login
        window.location.href = '/login';
        
        // O limpiar sesión
        localStorage.removeItem('accessToken');
        sessionStorage.removeItem('qrToken');
    }
});
```

---

### 3. 🚫 Errores de Autorización (403)

**Clase**: `ForbiddenError`

**HTTP Status**: `403 Forbidden`

**Qué significa**: El cliente está autenticado pero no tiene permisos para esta acción

**Causas comunes**:
- Usuario intenta acceder a recurso de otra persona
- Rol de usuario no tiene permisos
- Token QR está revocado

#### Ejemplos

```json
{
    "statusCode": 403,
    "name": "ForbiddenError",
    "message": "Un Mozo no debe tener un token del QR"
}
```

```json
{
    "statusCode": 403,
    "name": "ForbiddenError",
    "message": "El token QR ha sido revocado"
}
```

**Cómo manejarlo en Frontend**:

```javascript
socket.on('errorEvent', (error) => {
    if (error.statusCode === 403) {
        alert(`Acceso denegado: ${error.message}`);
        // Mostrar opción de volver atrás
    }
});
```

---

### 4. 🔍 Errores de Recurso No Encontrado (404)

**Clase**: `NotFoundError`

**HTTP Status**: `404 Not Found`

**Qué significa**: El recurso solicitado no existe en la base de datos

**Causas comunes**:
- Orden con ID especificado no existe
- Línea de orden no existe
- Producto no existe
- Usuario no encontrado

#### Ejemplos

```json
{
    "statusCode": 404,
    "name": "NotFoundError",
    "message": "Orden con ID 42 no encontrada"
}
```

```json
{
    "statusCode": 404,
    "name": "NotFoundError",
    "message": "Línea #2 no encontrada en la orden"
}
```

```json
{
    "statusCode": 404,
    "name": "NotFoundError",
    "message": "Producto con ID 'product-uuid' no disponible"
}
```

**Cómo manejarlo en Frontend**:

```javascript
socket.on('errorEvent', (error) => {
    if (error.statusCode === 404) {
        alert(`Recurso no encontrado: ${error.message}`);
        // Recargar lista de órdenes
        location.reload();
    }
});
```

---

### 5. ⚔️ Errores de Conflicto (409)

**Clase**: `ConflictError`

**HTTP Status**: `409 Conflict`

**Qué significa**: El estado actual del recurso está en conflicto con la operación solicitada

**Causas comunes**:
- Intentar agregar línea a orden completada
- Intentar modificar orden cancelada
- Estado es incompatible con la acción

#### Ejemplos

```json
{
    "statusCode": 409,
    "name": "ConflictError",
    "message": "No se puede modificar una orden completada"
}
```

```json
{
    "statusCode": 409,
    "name": "ConflictError",
    "message": "La orden ya ha sido cancelada"
}
```

**Cómo manejarlo en Frontend**:

```javascript
socket.on('errorEvent', (error) => {
    if (error.statusCode === 409) {
        alert(`Conflicto: ${error.message}`);
        // Recargar estado de la orden
        socket.emit('getOrderDetails', { orderId });
    }
});
```

---

### 6. 🔧 Errores de Servicio /503)

**Clase**: `ServiceError`

**HTTP Status**: `503 Service Unavailable`

**Qué significa**: Un servicio externo o la base de datos no está disponible

**Causas comunes**:
- Base de datos no responde
- API externa (Mercado Pago, etc.) está caída
- Servidor sobrecargado

#### Ejemplos

```json
{
    "statusCode": 503,
    "name": "ServiceError",
    "message": "Error al actualizar estado en la base de datos"
}
```

```json
{
    "statusCode": 503,
    "name": "ServiceError",
    "message": "El servicio de pagos no está disponible"
}
```

**Cómo manejarlo en Frontend**:

```javascript
socket.on('errorEvent', (error) => {
    if (error.statusCode === 503) {
        alert(`Servicio no disponible: ${error.message}\nIntente más tarde`);
        // Permitir reintento después de esperar
        setTimeout(() => {
            socket.emit('retryLastOperation');
        }, 5000);
    }
});
```

---

### 7. 💥 Errores del Servidor (500)

**Clase**: `ServerError`

**HTTP Status**: `500 Internal Server Error`

**Qué significa**: Error no previsto en el servidor

#### Ejemplos

```json
{
    "statusCode": 500,
    "name": "ServerError",
    "message": "Error interno del servidor"
}
```

**Cómo manejarlo en Frontend**:

```javascript
socket.on('errorEvent', (error) => {
    if (error.statusCode === 500) {
        alert(`Error del servidor. Informe al administrador.`);
        // Registrar el error para debugging
        console.error('Server error:', error);
    }
});
```

---

## Tipos de Excepciones

### Jerarquía de Excepciones en el Código

```
Error (clase nativa JS)
├── ValidationError (400)
├── UnauthorizedError (401)
├── ForbiddenError (403)
├── NotFoundError (404)
├── ConflictError (409)
├── ServiceError (503)
└── ServerError (500)
```

**Archivo**: [backend/src/shared/exceptions/](../../backend/src/shared/exceptions/)

### Estructura General de una Excepción

```typescript
export class ValidationError extends Error {
    public readonly statusCode = 400;

    constructor(message: string) {
        super(message);
        this.name = "ValidationError";
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}
```

**Propiedades**:
- `statusCode`: HTTP status code equivalente
- `name`: Nombre de la excepción
- `message`: Mensaje descriptivo del error

---

## Manejo Centralizado

### Función `HandleSocketError`

**Archivo**: [HandleSocketError.ts](../../backend/src/presentation/sockets/handlers/HandleSocketError.ts)

```typescript
import { Socket } from "socket.io";

type SocketErrors = Error & {
    statusCode: number,
    message: string
}

export function HandleSocketError(socket: Socket, error: SocketErrors) {
    socket.emit("errorEvent", { 
        statusCode: error.statusCode, 
        name: error.name, 
        message: error.message 
    })
}
```

### Cómo se Usa

**En el registro de eventos** (OrderHandler.ts):

```typescript
socket.on("updateLineStatus", async ({ idPedido, nroLinea, estadoLP }) => {
    try {
        console.log(`🔄 Ejecutando updateOrderLineStatus...`);
        await orderController.updateOrderLineStatus(
            idPedido, 
            nroLinea, 
            estadoLP
        );
        console.log(`  updateOrderLineStatus completado exitosamente`);
    } catch (error: any) {
        console.error(`❌ Error en updateLineStatus:`, error.message);
        console.error(`   Stack:`, error.stack);
        
        // Manejador centralizado
        HandleSocketError(socket, error);
    }
});
```

### Flujo de Manejo

```
┌──────────────────────────────┐
│ Evento recibido del cliente  │
└──────────┬───────────────────┘
           │
┌──────────▼────────────────────┐
│ Try: Ejecutar lógica de       │
│      negocio                  │
└──────────┬──────────────────┬─┘
           │                  │
        ✅ │                  │ ❌ Error
           │          ┌───────▼──────┐
           │          │ Catch        │
           │          │ error: any   │
           │          └───────┬──────┘
           │                  │
      Éxito                    │
                               │ Validar tipo de excepción
                               │ (ValidationError, 
                               │  NotFoundError, etc)
                               │
                          ┌────▼──────────────────┐
                          │ HandleSocketError()   │
                          │ - Extrae statusCode   │
                          │ - Extrae name         │
                          │ - Extrae message      │
                          └────┬───────────────────┘
                               │
                               │ Emite evento 'errorEvent'
                               │
                          ┌────▼──────────────────┐
                          │ Cliente recibe error  │
                          │ en evento 'errorEvent'│
                          └───────────────────────┘
```

---

## Recuperación de Errores

### Patrón de Reintento (Retry Pattern)

```javascript
function emitWithRetry(eventName, data, maxRetries = 3) {
    let attempts = 0;

    const attempt = () => {
        socket.emit(eventName, data);
        attempts++;
    };

    socket.on('errorEvent', (error) => {
        if (error.statusCode === 503 && attempts < maxRetries) {
            console.log(`Reintentando... (${attempts}/${maxRetries})`);
            // Esperar 2 segundos antes de reintentar
            setTimeout(attempt, 2000);
        } else {
            console.error(`Falló después de ${attempts} intentos`);
        }
    });

    attempt(); // Primer intento
}

// Uso
emitWithRetry('updateLineStatus', {
    idPedido: 42,
    nroLinea: 1,
    estadoLP: 'EnPreparacion'
});
```

### Patrón de Estado (State Pattern)

```javascript
class OrderStateManager {
    constructor(socket) {
        this.socket = socket;
        this.pendingOperations = [];
    }

    addOperation(operation) {
        this.pendingOperations.push(operation);
    }

    processQueue() {
        while (this.pendingOperations.length > 0) {
            const op = this.pendingOperations.shift();
            this.socket.emit(op.event, op.data);
        }
    }

    handleError(error) {
        if (error.statusCode === 503) {
            // Reintenta más tarde
            setTimeout(() => this.processQueue(), 5000);
        } else if (error.statusCode === 401) {
            // Redirigir a login
            window.location.href = '/login';
        } else {
            // Otro error
            alert(error.message);
        }
    }
}
```

---

## Logging y Debugging

### Sistema de Logging en el Servidor

El servidor emite logs detallados para cada evento:

#### Formato de Log

```
📥 Evento recibido: updateLineStatus
   - Socket ID: socket_abc123
   - Usuario: JoseB_2004
   - QR Token: Sin token
   - Datos: { idPedido: 42, nroLinea: 1, estadoLP: 'EnPreparacion' }

🔄 Ejecutando updateOrderLineStatus...
  updateOrderLineStatus completado exitosamente

// En caso de error:

❌ Error en updateLineStatus: El número de Línea debe ser válido
   Stack: ValidationError: El número de Línea debe ser válido
       at OrderController.updateOrderLineStatus
       ...
```

### Lectura de Logs

**En Desarrollo**:
```bash
# Terminal donde corre el servidor
tail -f ./logs/application.log | grep "errorEvent"
```

**En Base de Datos** (si se registran):
```sql
SELECT * FROM socket_errors 
WHERE created_at > NOW() - INTERVAL 1 HOUR
ORDER BY created_at DESC;
```

### Debugging en Frontend

```javascript
// Activar logs de todos los eventos
socket.onAny((event, ...args) => {
    console.log(`📨 Evento: ${event}`, args);
});

// Monitorear errores específicamente
socket.on('errorEvent', (error) => {
    console.error('🔴 Error Socket:', error);
    
    // Enviar a servicio de logging
    logErrorToServer({
        type: 'socket_error',
        error: error,
        timestamp: new Date(),
        user: getCurrentUser()
    });
});

// Monitorear desconexiones
socket.on('disconnect', (reason) => {
    console.warn('⚠️ Socket desconectado:', reason);
    // Intentar reconectar
});

socket.on('connect_error', (error) => {
    console.error('🔌 Error de conexión:', error);
});
```

### Tabla de Códigos de Error

| Código | Clase | Significado | Acción Recomendada |
|--------|-------|-------------|-------------------|
| 400 | ValidationError | Datos inválidos | Corregir y reintentar |
| 401 | UnauthorizedError | No autenticado | Login nuevamente |
| 403 | ForbiddenError | Sin permisos | Verificar rol/permisos |
| 404 | NotFoundError | Recurso no existe | Recargar datos |
| 409 | ConflictError | Conflicto de estado | Sincronizar estado |
| 503 | ServiceError | Servicio no disponible | Reintentar después |
| 500 | ServerError | Error del servidor | Reportar error |

---

## Ejemplos Prácticos

### Ejemplo 1: Validar entrada antes de enviar

```javascript
function updateLineStatus(orderId, lineNum, status) {
    // Validación en cliente antes de emitir
    if (!Number.isInteger(orderId) || orderId <= 0) {
        return alert('ID de orden inválido');
    }
    
    if (!Number.isInteger(lineNum) || lineNum <= 0) {
        return alert('Número de línea inválido');
    }

    socket.emit('updateLineStatus', {
        idPedido: orderId,
        nroLinea: lineNum,
        estadoLP: status
    });
}
```

### Ejemplo 2: Manejar todos los errores globalmente

```javascript
socket.on('errorEvent', (error) => {
    const handlers = {
        400: () => showAlert('error', `Validación falló: ${error.message}`),
        401: () => {
            showAlert('warning', 'Su sesión expiró');
            redirectTo('/login');
        },
        403: () => showAlert('error', `No tiene permisos: ${error.message}`),
        404: () => showAlert('error', `No encontrado: ${error.message}`),
        409: () => showAlert('warning', `Conflicto: ${error.message}`),
        503: () => showAlert('warning', 'Servidor no disponible. Reintentando...'),
        500: () => showAlert('error', 'Error del servidor. Contacte soporte.')
    };

    const handler = handlers[error.statusCode] || 
                    (() => showAlert('error', error.message));
    
    handler();
});
```

### Ejemplo 3: Logging centralizado

```javascript
class SocketLogger {
    constructor(socket) {
        this.socket = socket;
        this.setupLogging();
    }

    setupLogging() {
        this.socket.onAny((event, ...args) => {
            this.logEvent(event, args);
        });

        this.socket.on('errorEvent', (error) => {
            this.logError(error);
        });
    }

    logEvent(event, args) {
        console.log(`[SOCKET] ${event}:`, args);
        // Enviar a servidor de logging
    }

    logError(error) {
        console.error(`[SOCKET ERROR] ${error.statusCode}: ${error.message}`);
        // Enviar a servidor de logging con stack trace
    }
}

// Uso
const logger = new SocketLogger(socket);
```

---

## Checklist para Manejo de Errores

- ✅ Todos los eventos tienen try/catch
- ✅ Los errores siempre se pasan a `HandleSocketError`
- ✅ Los clientes escuchan el evento `errorEvent`
- ✅ Los errores se loguean correctamente
- ✅ Los errores 503 tienen política de reintento
- ✅ Los errores 401 redirigen a login
- ✅ Se validan datos en cliente antes de enviar
- ✅ Se muestran mensajes claros al usuario

---

## Referencias

- [Sockets Overview](./SOCKETS_OVERVIEW.md)
- [Events Documentation](./EVENTS.md)
- [Authentication](./AUTHENTICATION.md)
- [Exception Classes](../../backend/src/shared/exceptions/)
- [Order Handler](../../backend/src/presentation/sockets/handlers/OrderHandler.ts)
