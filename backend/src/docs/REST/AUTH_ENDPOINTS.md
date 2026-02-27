# 🔐 Módulo: Autenticación (Auth)

## Descripción General
El módulo de autenticación gestiona el acceso de usuarios al sistema, generación de tokens JWT, recuperación de contraseña y verificación de email.

---

## Endpoints

### 1️⃣ POST /auth/login

**Descripción**: Autentica un usuario con email y contraseña

| Propiedad | Valor |
|-----------|-------|
| Método | POST |
| Ruta | `/auth/login` |
| Autenticación | 🟢 No requerida |
| Rol Requerido | Ninguno |

#### Request Body
```json
{
  "email": "usuario@example.com",
  "password": "ContraseñaSegura123"
}
```

#### ✅ Caso de Éxito (200 OK)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzdWFyaW8iOiI1NDMzZTZmYi02ZjY2LTQwMDAtODc5Yi04NzhhOTBkZjZkYjAiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwidGlwb1VzdWFyaW8iOiJBZG1pbmlzdHJhZG9yIiwidXNlcm5hbWUiOiJhZG1pbjEyMyIsImlhdCI6MTcwOTc2NzIwMCwiZXhwIjoxNzA5NzcwODAwfQ.abc123"
}
```

**Cookies**:
- `refreshToken` (httpOnly, secure, 7 días)

#### ❌ Casos de Error

**400 - Bad Request: Campos faltantes**
```json
{
  "error": "No se ingresaron todos los campos obligatorios"
}
```

**400 - Bad Request: Email inválido**
```json
{
  "error": "Validation failed: El email debe ser válido"
}
```

**401 - Unauthorized: Credenciales inválidas**
```json
{
  "error": "Email o contraseña incorrectos"
}
```

---

### 2️⃣ POST /auth/refresh

**Descripción**: Refresca el token de acceso usando el refreshToken

| Propiedad | Valor |
|-----------|-------|
| Método | POST |
| Ruta | `/auth/refresh` |
| Autenticación | 🔵 Cookie: refreshToken |
| Body | Vacío |

#### ✅ Caso de Éxito (200 OK)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### ❌ Casos de Error

**400 - Bad Request: Token no proporcionado**
```json
{
  "error": "No se proporcionó un token de actualización"
}
```

---

### 3️⃣ POST /auth/logout

**Descripción**: Revoca el refreshToken y limpia la sesión

| Propiedad | Valor |
|-----------|-------|
| Método | POST |
| Ruta | `/auth/logout` |
| Autenticación | 🔵 Cookie: refreshToken |
| Body | Vacío |

#### ✅ Caso de Éxito (204 No Content)
Sin body

#### ❌ Casos de Error

**400 - Bad Request: Token no proporcionado**
```json
{
  "error": "No se proporcionó un token a revocar"
}
```

---

### 4️⃣ POST /auth/forgotPassword

**Descripción**: Envía email de recuperación de contraseña

| Propiedad | Valor |
|-----------|-------|
| Método | POST |
| Ruta | `/auth/forgotPassword` |
| Autenticación | 🟢 No requerida |

#### Request Body
```json
{
  "email": "usuario@example.com"
}
```

#### ✅ Caso de Éxito (204 No Content)
Email enviado exitosamente

#### ❌ Casos de Error

**400 - Bad Request: Email faltante**
```json
{
  "error": "No se ingresaron todos los campos obligatorios"
}
```

**404 - Not Found: Email no existe**
```json
{
  "error": "Usuario no encontrado"
}
```

---

### 5️⃣ POST /auth/resetPassword

**Descripción**: Resetea la contraseña usando token de recuperación

| Propiedad | Valor |
|-----------|-------|
| Método | POST |
| Ruta | `/auth/resetPassword` |
| Autenticación | 🟢 No requerida |

#### Request Body
```json
{
  "token": "token_de_recuperacion_aqui",
  "newPassword": "NuevaContraseña123"
}
```

#### ✅ Caso de Éxito (204 No Content)
Contraseña actualizada exitosamente

#### ❌ Casos de Error

**400 - Bad Request: Campos faltantes**
```json
{
  "error": "No se ingresaron todos los campos obligatorios"
}
```

**400 - Bad Request: Token inválido**
```json
{
  "error": "Token inválido o expirado"
}
```

---

### 6️⃣ POST /auth/verifyEmail

**Descripción**: Verifica la dirección email del usuario

| Propiedad | Valor |
|-----------|-------|
| Método | POST |
| Ruta | `/auth/verifyEmail` |
| Autenticación | 🟢 No requerida |

#### Request Body
```json
{
  "token": "token_de_verificacion_aqui"
}
```

#### ✅ Caso de Éxito (204 No Content)
Email verificado exitosamente

#### ❌ Casos de Error

**400 - Bad Request: Token no proporcionado**
```json
{
  "error": "No se recibió el token de validación"
}
```

**400 - Bad Request: Token inválido**
```json
{
  "error": "Token inválido o expirado"
}
```

---

### 7️⃣ POST /auth/resendEmail

**Descripción**: Reenvía el email de verificación

| Propiedad | Valor |
|-----------|-------|
| Método | POST |
| Ruta | `/auth/resendEmail` |
| Autenticación | 🟢 No requerida |

#### Request Body
```json
{
  "token": "token_de_usuario_aqui"
}
```

#### ✅ Caso de Éxito (204 No Content)
Email reenviado exitosamente

#### ❌ Casos de Error

**400 - Bad Request: Token no proporcionado**
```json
{
  "error": "No se recibió el token de validación"
}
```

---

## 🔐 Seguridad y Tokens

### Access Token
- **Duración**: 15 minutos
- **Ubicación**: Response body + Header Authorization
- **Formato**: JWT (JSON Web Token)
- **Uso**: `Authorization: Bearer <access_token>`

### Refresh Token
- **Duración**: 7 días
- **Ubicación**: Cookie httpOnly
- **Formato**: JWT
- **Propósito**: Generar nuevo access token sin volver a ingresar credenciales

### Payload del Token
```json
{
  "idUsuario": "UUID",
  "email": "string",
  "tipoUsuario": "Administrador|Mozo|Cliente|SectorCocina",
  "username": "string",
  "iat": "número (timestamp emisión)",
  "exp": "número (timestamp expiración)"
}
```

---

## 📝 Notas Importantes

1. **Validación de Estado**: Si el usuario es "Cliente", se verifica automáticamente su estado en la base de datos
2. **Seguridad de Cookies**: En producción, las cookies son httpOnly, secure y sameSite=none
3. **Mensajes de Error Genéricos**: Se usa el mismo mensaje para email inexistente y contraseña incorrecta por seguridad
4. **Vencimiento Automático**: Los tokens se validan automáticamente en cada request protegido

---

## 🧪 Ejemplo Completo de Login

```bash
# 1. Hacer login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "admin@example.com",
    "password": "AdminPassword123"
  }'

# Respuesta:
# {
#   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
# }

# 2. Usar token en request protegido
curl -X GET http://localhost:3000/clientes \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -b cookies.txt

# 3. Refrescar token (cuando expire los 15 minutos)
curl -X POST http://localhost:3000/auth/refresh \
  -b cookies.txt

# 4. Logout (revoca el refreshToken)
curl -X POST http://localhost:3000/auth/logout \
  -b cookies.txt
```

---

## 🔄 Flujo de Autenticación Recomendado

```
1. Usuario ingresa credenciales
   ↓
2. POST /auth/login
   ↓
3. Guardar token en estado de la aplicación
4. Guardar refreshToken (automático en cookie)
   ↓
5. Incluir token en header Authorization de requests
   ↓
6. Si recibe 401 (token expirado):
   → POST /auth/refresh
   → Obtener nuevo token
   → Reintentar request original
   ↓
7. Si usuario cierra sesión:
   → POST /auth/logout
   → Limpiar estado local
```

**Última actualización**: 24 de Febrero de 2026
