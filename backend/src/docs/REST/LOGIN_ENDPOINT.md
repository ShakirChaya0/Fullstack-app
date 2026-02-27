# Documentación: Endpoint POST /auth/login

## 📋 Descripción General
El endpoint `/login` es responsable de **autenticar usuarios** del sistema verificando sus credenciales (email y contraseña). Retorna un JWT (JSON Web Token) de acceso que permite al usuario realizar acciones autenticadas en la aplicación, además de un token de refresco almacenado en una cookie segura.

---

## 🔑 Información Técnica

| Propiedad | Valor |
|-----------|-------|
| **Método HTTP** | POST |
| **Ruta** | `/auth/login` |
| **Autenticación** | No requerida |
| **Content-Type** | `application/json` |
| **Respuesta de éxito** | HTTP 200 OK |

---

## 📥 Request Body

### Estructura esperada:
```json
{
  "email": "usuario@example.com",
  "password": "ContraseñaSegura123"
}
```

### Validaciones de campos:

| Campo | Tipo | Validación | Obligatorio |
|-------|------|-----------|------------|
| `email` | string | Debe ser un email válido con formato correcto | ✅ Sí |
| `password` | string | No puede estar vacía | ✅ Sí |

---

## ✅ Casos de Éxito

### 1. Login Exitoso
**Condición**: Email y contraseña válidos coinciden con un usuario registrado

**Código de estado**: `200 OK`

**Response esperado**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzdWFyaW8iOiI1NDMzZTZmYi02ZjY2LTQwMDAtODc5Yi04NzhhOTBkZjZkYjAiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwidGlwb1VzdWFyaW8iOiJBZG1pbmlzdHJhZG9yIiwidXNlcm5hbWUiOiJhZG1pbjEyMyIsImlhdCI6MTcwOTc2NzIwMCwiZXhwIjoxNzA5NzcwODAwfQ.abc123defgh456"
}
```

**Cookies establecidas**:
- `refreshToken`: Token JWT de refresco (httpOnly, secure, sameSite)
  - Duración: 7 días
  - No accesible desde JavaScript (httpOnly: true)
  - Solo se envía en conexiones HTTPS en producción

**Información contenida en el token**:
- `idUsuario`: UUID del usuario
- `email`: Email del usuario
- `tipoUsuario`: Tipo de usuario (Administrador, Mozo, Cliente, SectorCocina)
- `username`: Nombre de usuario
- `iat`: Timestamp de emisión
- `exp`: Timestamp de expiración (15 minutos)

---

## ❌ Casos de Error

### 1. Email o Contraseña Faltantes
**Condición**: No se proporciona uno o ambos campos en el request body

**Código de estado**: `400 Bad Request`

**Response de error**:
```json
{
  "error": "No se ingresaron todos los campos obligatorios"
}
```

**Ejemplos de requests que generan este error**:
```json
// Falta la contraseña
{
  "email": "usuario@example.com"
}

// Falta el email
{
  "password": "ContraseñaSegura123"
}

// Body vacío
{}
```

---

### 2. Email con Formato Inválido
**Condición**: El email no cumple con el formato estándar de email

**Código de estado**: `400 Bad Request`

**Response de error**:
```json
{
  "error": "Validation failed: El email debe ser válido"
}
```

**Ejemplos de requests que generan este error**:
```json
// Email sin @
{
  "email": "usuarioexample.com",
  "password": "ContraseñaSegura123"
}

// Email incompleto
{
  "email": "usuario@",
  "password": "ContraseñaSegura123"
}

// Email con dominio inválido
{
  "email": "usuario@.com",
  "password": "ContraseñaSegura123"
}
```

---

### 3. Email Vacío
**Condición**: Se envía el campo email pero está vacío

**Código de estado**: `400 Bad Request`

**Response de error**:
```json
{
  "error": "Validation failed: El email no puede estar vacía"
}
```

**Ejemplo**:
```json
{
  "email": "",
  "password": "ContraseñaSegura123"
}
```

---

### 4. Contraseña Vacía
**Condición**: Se envía el campo password pero está vacío

**Código de estado**: `400 Bad Request`

**Response de error**:
```json
{
  "error": "Validation failed: La contraseña no puede estar vacía"
}
```

**Ejemplo**:
```json
{
  "email": "usuario@example.com",
  "password": ""
}
```

---

### 5. Email no Encontrado o Contraseña Incorrecta
**Condición**: 
- El email no existe en la base de datos, O
- El email existe pero la contraseña es incorrecta

**Código de estado**: `401 Unauthorized`

**Response de error**:
```json
{
  "error": "Email o contraseña incorrectos"
}
```

> ⚠️ **Nota de seguridad**: Se utiliza el mismo mensaje de error para email inexistente y contraseña incorrecta para evitar revelar qué emails están registrados en el sistema.

**Ejemplos**:
```json
// Email no registrado
{
  "email": "noexiste@example.com",
  "password": "ContraseñaSegura123"
}

// Contraseña incorrecta
{
  "email": "usuario@example.com",
  "password": "ContraseñaIncorrecta123"
}
```

---

## 🔄 Flujo de Autenticación Posterior

Una vez autenticado exitosamente, el usuario recibe:

1. **Access Token**: Debe incluirse en las peticiones subsecuentes en el header:
   ```
   Authorization: Bearer <access_token>
   ```

2. **Refresh Token**: Se almacena automáticamente en la cookie y tiene duración de 7 días:
   - Cuando el access token expire (15 minutos), se usa el refresh token en el endpoint `/auth/refresh`
   - El refresh token genera un nuevo access token sin requerir login nuevamente

---

## 📝 Notas Importantes

1. **Validación de estado de cliente**: Si el usuario autenticado es de tipo "Cliente", el sistema verifica automáticamente su estado en la base de datos.

2. **Seguridad de cookies**: 
   - La cookie `refreshToken` es **httpOnly** (no accesible desde JavaScript)
   - En producción, la cookie se marca como **secure** (solo HTTPS) y **sameSite=none**
   - En desarrollo, es menos restrictiva (**sameSite=lax**)

3. **Vencimiento de tokens**:
   - Access Token: 15 minutos
   - Refresh Token: 7 días

4. **Manejo de errores**: Todos los errores no capturados específicamente se pasan al middleware de manejo de errores global.

---

## 🧪 Ejemplo de uso completo

### Request:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "AdminPassword123"
  }' \
  -c cookies.txt
```

### Response exitosa:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Request subsecuente autenticado:
```bash
curl -X GET http://localhost:3000/api/protected-route \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -b cookies.txt
```
