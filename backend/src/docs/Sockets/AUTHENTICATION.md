# 🔐 WebSocket Authentication

## Tabla de Contenidos
1. [Introducción](#introducción)
2. [Métodos de Autenticación](#métodos-de-autenticación)
3. [Flujo de Validación](#flujo-de-validación)
4. [Casos de Éxito](#casos-de-éxito)
5. [Casos de Error](#casos-de-error)

---

## Introducción

El middleware [AuthSocketMiddleware.ts](../../backend/src/presentation/middlewares/AuthSocketMiddleware.ts) valida y autoriza todas las conexiones WebSocket.

**Soporta 2 métodos de autenticación**:

1. **JWT Token** - Para Mozos, Personal de Cocina y Administradores
2. **QR Token** - Para Clientes Anónimos de Mesas

---

## Métodos de Autenticación

### 1. Autenticación con JWT

#### Caso de Uso
- 📋 Personal de Cocina
- 🧑‍💼 Mozos
- 👨‍💼 Administradores

#### Cómo Conectarse

```javascript
// Frontend - useWebSocket hook
const socket = io(`${WEBSOCKET_URL}`, {
    auth: {
        jwt: accessToken  // JWT obtenido del login
    },
    withCredentials: true,
    transports: ['websocket', 'polling']
});
```

#### Estructura del JWT

El JWT contiene el payload:

```typescript
interface JwtPayloadInterface {
    idUsuario: string;           // UUID del usuario
    email: string;               // Email del usuario
    tipoUsuario: "Mozo" | "SectorCocina" | "Administrador";
    username: string;            // Nombre de usuario
    iat: number;                 // Issued At (timestamp)
    exp: number;                 // Expiration (timestamp)
}
```

#### Validación de JWT

1. Se extrae el token del header `Authorization: Bearer {JWT}`
2. Se verifica con la clave secreta de la aplicación
3. Se valida que no esté expirado
4. Se extrae el payload y se asigna a `socket.user`

---

### 2. Autenticación con QR Token

#### Caso de Uso
- 🍽️ Clientes Anónimos que escanearon un QR en la mesa

#### Cómo Obtener el QR Token

```
1. Cliente escanea código QR en la mesa
   ↓
2. QR redirige a: GET /qr?qrToken=TOKEN&mesa=5
   ↓
3. Se establece cookie 'QrToken' automáticamente
   ↓
4. QR Token almacenado en sessionStorage del cliente
```

#### Cómo Conectarse

```javascript
// Frontend
const qrToken = sessionStorage.getItem('qrToken');

const socket = io(`${WEBSOCKET_URL}`, {
    auth: {
        qrToken: qrToken  // Token del QR
    },
    withCredentials: true,
    transports: ['websocket', 'polling']
});
```

#### Estructura del QR Token

```typescript
interface QRTokenInterface {
    nroMesa: number;        // Número de mesa (1-N)
    idMozo: string;         // UUID del mozo que generó el QR
    tokenQR: string;        // Token único
    fechaCreacion: Date;    // Fecha de creación
    revocado: boolean;      // Si el token fue revocado
}
```

---

## Flujo de Validación

### Paso a Paso del Middleware

```typescript
export async function AuthSocketMiddleware(socket: Socket, next: (err?: Error) => void) {
```

#### 1. Extracción de Credenciales

```typescript
const jwt = socket.handshake.auth.jwt;
let qrToken = socket.handshake.auth.qrToken;

// Si no está en auth, intentar leerlo desde cookies
if (!qrToken) {
    const cookies = socket.handshake.headers.cookie;
    // Buscar cookie 'QrToken'
    const qrCookie = cookieArray.find(cookie => 
        cookie.trim().startsWith('QrToken=')
    );
    qrToken = qrCookie?.split('=')[1];
}
```

**Prioridad de búsqueda del QR Token**:
1. `socket.handshake.auth.qrToken` 
2. Cookie `QrToken` en headers

---

#### 2. Validación de JWT

Si existe JWT:

```typescript
try {
    const payload = jwtService.verifyAccessToken(jwt);
    (socket as AuthenticatedSocket).user = payload as JwtPayloadInterface;
    (socket as AuthenticatedSocket).qrToken = qrToken;
} catch (error: any) {
    // Error de validación de JWT
    HandleSocketError(socket, error);
}
```

---

#### 3. Asignación de Propiedades

Después de validación exitosa:

```typescript
interface AuthenticatedSocket extends Socket {
    user?: JwtPayloadInterface;      // Datos del usuario (si JWT)
    qrToken?: string;                // Token del QR (si existe)
}
```

---

#### 4. Llamada al Next Middleware

```typescript
next();  // Continúa al siguiente middleware/handler
```

---

## Casos de Éxito

### ✅ Caso 1: Mozo se Conecta con JWT

**Entrada**:
```javascript
auth: {
    jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Validación Realizada**:
- ✅ JWT válido y no expirado
- ✅ Estructura de payload correcta
- ✅ Contiene campos obligatorios (idUsuario, email, tipoUsuario, username)

**Estado del Socket después de Autenticación**:
```typescript
socket.user = {
    idUsuario: "382e6c8a-da53-4d1c-a187-74adb2231c97",
    email: "josepp@gmail.com",
    tipoUsuario: "Mozo",
    username: "JoseB_2004",
    iat: 1759343527,
    exp: 1759430000
}
socket.qrToken = undefined
```

**Acción Siguiente**:
- Socket unido a sala: `mozo:JoseB_2004`
- Recibe órdenes de sus mesas

---

### ✅ Caso 2: Comensal se Conecta con QR Token

**Entrada**:
```javascript
auth: {
    qrToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
// O en cookie QrToken
```

**Validación Realizada**:
- ✅ QR Token existe
- ✅ Token no está revocado
- ✅ Token corresponde a una mesa válida

**Estado del Socket después de Autenticación**:
```typescript
socket.user = undefined
socket.qrToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Acción Siguiente**:
- Socket unido a sala: `comensal:{qrToken}`
- Recibe actualizaciones de su pedido

---

### ✅ Caso 3: Personal Cocina se Conecta

**Entrada**:
```javascript
auth: {
    jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Validación Realizada**:
- ✅ JWT válido
- ✅ `tipoUsuario === "SectorCocina"`

**Estado del Socket después de Autenticación**:
```typescript
socket.user = {
    idUsuario: "...",
    email: "cocina@restaurante.com",
    tipoUsuario: "SectorCocina",
    username: "Cocina_Chef",
    iat: 1759343527,
    exp: 1759430000
}
socket.qrToken = undefined
```

**Acción Siguiente**:
- Socket unido a sala: `cocina`
- Recibe todas las órdenes activas

---

## Casos de Error

### ❌ Error 1: Sin Credenciales

**Descripción**: El cliente no envía ni JWT ni QR Token

**Código del Middleware**:
```typescript
if (!jwt && !qrToken) {
    // Continúa sin autenticación
    next();
}
```

**Comportamiento**:
- ⚠️ Socket se conecta sin autenticación
- ❌ No puede acceder a salas privadas
- ⚠️ Puede recibir errores cuando intente emitir eventos

**Ejemplo de Error posterior**:
```json
{
    "statusCode": 401,
    "name": "UnauthorizedError",
    "message": "No se encontro el token del QR y el usuario no esta logeado"
}
```

---

### ❌ Error 2: JWT Inválido o Expirado

**Descripción**: El JWT está malformado o su firma no es válida

**Entrada**:
```javascript
auth: {
    jwt: "token.invalido.aqui"
}
```

**Validación Fallida**:
```typescript
jwtService.verifyAccessToken(jwt)  // Lanza excepción
```

**Manejador de Error**:
```typescript
catch (error: any) {
    HandleSocketError(socket, error);
    // Emite evento 'errorEvent' al cliente
}
```

**Respuesta Enviada al Cliente**:
```javascript
socket.on("errorEvent", (error) => {
    error = {
        statusCode: 401,
        name: "UnauthorizedError",
        message: "Token inválido o expirado"
    }
});
```

---

### ❌ Error 3: JWT Expirado

**Descripción**: El token JWT es válido pero su timestamp `exp` ha pasado

**Entrada**:
```javascript
auth: {
    jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...." // exp: 1759343527 (pasado)
}
```

**Validación en JWTService**:
```typescript
const now = Math.floor(Date.now() / 1000);
if (decoded.exp < now) {
    throw new UnauthorizedError("Token expirado");
}
```

**Error Emitido**:
```json
{
    "statusCode": 401,
    "name": "UnauthorizedError",
    "message": "Token expirado"
}
```

**Acción del Cliente**:
- ❌ Debe hacer login nuevamente
- ❌ Debe obtener un nuevo JWT

---

### ❌ Error 4: QR Token Revocado

**Descripción**: El token QR corresponde a una mesa deactivada o revocada

**Entrada**:
```javascript
auth: {
    qrToken: "token.del.qr"
}
```

**Verificación en Base de Datos**:
```typescript
const qrData = qrTokenRepository.getQRDataByToken(qrToken);
if (qrData?.revocado === true) {
    // Token revocado
}
```

**Comportamiento**:
- ⚠️ Socket se conecta pero no puede acceder a datos de la mesa
- ❌ Emite `errorEvent` cuando intenta crear/modificar pedidos

**Error Posterior**:
```json
{
    "statusCode": 403,
    "name": "ForbiddenError",
    "message": "El token QR ha sido revocado"
}
```

---

### ❌ Error 5: JWT con Rol No Autorizado para WebSocket

**Descripción**: El usuario autenticado no tiene permisos para usar WebSocket

**Entrada**:
```javascript
auth: {
    jwt: "token_de_usuario_sin_permisos"
}
```

**Validación**:
```typescript
// El acesso a WebSocket es permitido para todos los roles autenticados
// Pero ciertas acciones pueden estar restringidas por rol
```

**Restricción en Eventos**:
```typescript
if (socket.user?.tipoUsuario !== "SectorCocina" && 
    socket.user?.tipoUsuario !== "Mozo") {
    throw new ForbiddenError("No tienes permiso para esta acción");
}
```

---

## Tabla de Referencia Rápida

| Método | Usuario | Validación | Duración | Almacenamiento |
|--------|---------|-----------|----------|-----------------|
| **JWT** | Mozo, Cocina, Admin | Firma + Expiración | Limitada (ej: 24h) | Navegador (localStorage) |
| **QR Token** | Cliente Anónimo | Token único en DB | Indefinida | Cookie + sessionStorage |

---

## Resumen del Flujo

```
┌─────────────────────────────────────────┐
│ Cliente Inicia Conexión WebSocket       │
└────────────┬────────────────────────────┘
             │
      ┌──────▼──────┐
      │ Tiene JWT?  │
      └──┬───────┬──┘
         │       │
      SÍ │       │ NO
         │       │
         │   ┌───▼──────────┐
         │   │ Tiene QR?    │
         │   └─┬─────────┬──┘
         │  SÍ │         │ NO
         │   ├─▼─────┐   │
         │   │       │   │
   ┌─────▼───▼─┐    │┌───▼────────┐
   │Valida JWT ◄────┘│Valida QR   │
   └─────┬───┬┘      └┬───────────┘
         │   └─────┬──┘
         │         │
      ✅ │         │ ✅
         │         │
   ┌─────▼─────────▼─────┐
   │Socket Autenticado   │
   │socket.user definido │ O
   │socket.qrToken def.  │
   └─────┬───────────────┘
         │
         ├─► Asigna a Sala
         ├─► Registra Handlers
         └─► Emite datos iniciales

         ❌ En caso de error
         └─► Emite 'errorEvent'
```

---

## Mejores Prácticas

### ✅ Para el Frontend

1. **Almacenar JWT seguramente**:
   ```javascript
   localStorage.setItem('accessToken', jwtToken);
   // No guardar en variables globales inseguras
   ```

2. **Renovar JWT antes de expirar**:
   ```javascript
   const timeToRefresh = (exp - iat) * 0.8;
   setTimeout(() => refreshToken(), timeToRefresh * 1000);
   ```

3. **Pasar QR Token en la conexión**:
   ```javascript
   const qrToken = sessionStorage.getItem('qrToken');
   socket.auth = { qrToken };
   ```

4. **Manejar desconexiones por autenticación**:
   ```javascript
   socket.on('errorEvent', (error) => {
       if (error.statusCode === 401) {
           // Redirigir a login
       }
   });
   ```

### ✅ Para el Backend

1. **Validar en cada evento**:
   ```typescript
   if (!socket.user && !socket.qrToken) {
       throw new UnauthorizedError('Not authenticated');
   }
   ```

2. **Verificar rol en operaciones sensibles**:
   ```typescript
   if (socket.user?.tipoUsuario !== "SectorCocina") {
       throw new ForbiddenError('Only kitchen can perform this action');
   }
   ```

3. **Registrar intentos de acceso no autorizado**:
   ```typescript
   console.warn(`Unauthorized access attempt: ${socket.user?.username || 'Anonymous'}`);
   ```

---

## Referencias

- [Sockets Overview](./SOCKETS_OVERVIEW.md)
- [Events Documentation](./EVENTS.md)
- [Error Handling](./ERROR_HANDLING.md)
- [AuthSocketMiddleware Source](../../backend/src/presentation/middlewares/AuthSocketMiddleware.ts)
