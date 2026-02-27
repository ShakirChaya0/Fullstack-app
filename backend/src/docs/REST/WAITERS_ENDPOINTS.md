# 👔 Módulo: Mozos (Camareros/Waiters)

## Descripción General
Gestiona los empleados mozos del restaurante. Permite crear, consultar, actualizar y eliminar mozos. Solo administradores pueden realizar estas operaciones.

---

## Endpoints

### 1️⃣ GET /mozos

**Descripción**: Obtiene lista paginada de todos los mozos

| Propiedad | Valor |
|-----------|-------|
| Método | GET |
| Ruta | `/mozos` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Administrador |

#### Query Parameters (Opcionales)
```
?page=1
```

#### ✅ Caso de Éxito (200 OK)
```json
{
  "Waiters": [
    {
      "idMozo": "uuid-mozo-1",
      "nombreUsuario": "mozo1",
      "email": "mozo1@example.com",
      "nombre": "Carlos",
      "apellido": "Rodriguez",
      "dni": "12345678",
      "telefono": "+5491234567890"
    },
    {
      "idMozo": "uuid-mozo-2",
      "nombreUsuario": "mozo2",
      "email": "mozo2@example.com",
      "nombre": "Ana",
      "apellido": "Martinez",
      "dni": "87654321",
      "telefono": "+5491234567891"
    }
  ],
  "totalItems": 2,
  "pages": 1
}
```

---

### 2️⃣ GET /mozos/id/:idMozo

**Descripción**: Obtiene datos de un mozo específico

| Propiedad | Valor |
|-----------|-------|
| Método | GET |
| Ruta | `/mozos/id/:idMozo` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Administrador, Mozo |

#### ✅ Caso de Éxito (200 OK)
```json
{
  "nombreUsuario": "mozo1",
  "email": "mozo1@example.com",
  "nombre": "Carlos",
  "apellido": "Rodriguez",
  "dni": "12345678",
  "telefono": "+5491234567890"
}
```

#### ❌ Casos de Error

**400 - Bad Request**
```json
{
  "error": "Se ingresar un ID válido"
}
```

---

### 3️⃣ GET /mozos/nombre/:nombreUsuario

**Descripción**: Busca mozos por nombre de usuario con paginación

| Propiedad | Valor |
|-----------|-------|
| Método | GET |
| Ruta | `/mozos/nombre/:nombreUsuario` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Administrador, Mozo |

#### Query Parameters (Opcionales)
```
?page=1
```

#### ✅ Caso de Éxito (200 OK)
```json
{
  "Waiters": [
    {
      "idMozo": "uuid-mozo-1",
      "nombreUsuario": "mozo1",
      "email": "mozo1@example.com",
      "nombre": "Carlos",
      "apellido": "Rodriguez",
      "dni": "12345678",
      "telefono": "+5491234567890"
    }
  ],
  "totalItems": 1,
  "pages": 1
}
```

#### ❌ Casos de Error

**400 - Bad Request**
```json
{
  "error": "Se debe ingresar un nombre de usuario válido"
}
```

---

### 4️⃣ DELETE /mozos/id/:idMozo

**Descripción**: Elimina un mozo del sistema

| Propiedad | Valor |
|-----------|-------|
| Método | DELETE |
| Ruta | `/mozos/id/:idMozo` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Administrador |

#### ✅ Caso de Éxito (204 No Content)
Sin body - Mozo eliminado exitosamente

#### ❌ Casos de Error

**400 - Bad Request**
```json
{
  "error": "Se debe ingresar un ID válido"
}
```

---

### 5️⃣ POST /mozos

**Descripción**: Crea un nuevo mozo en el sistema

| Propiedad | Valor |
|-----------|-------|
| Método | POST |
| Ruta | `/mozos` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Administrador |

#### Request Body
```json
{
  "nombreUsuario": "mozo_nuevo",
  "email": "mozo_nuevo@example.com",
  "password": "ContraseñaSegura123",
  "nombre": "Pedro",
  "apellido": "Lopez",
  "dni": "45678901",
  "telefono": "+5491234567892"
}
```

#### ✅ Caso de Éxito (201 Created)
```json
{
  "nombreUsuario": "mozo_nuevo",
  "email": "mozo_nuevo@example.com",
  "nombre": "Pedro",
  "apellido": "Lopez",
  "dni": "45678901",
  "telefono": "+5491234567892"
}
```

#### ❌ Casos de Error

**400 - Bad Request**
```json
{
  "error": "Validation failed: todos los campos son obligatorios"
}
```

---

### 6️⃣ PATCH /mozos/update/:idMozo

**Descripción**: Actualiza la información de un mozo

| Propiedad | Valor |
|-----------|-------|
| Método | PATCH |
| Ruta | `/mozos/update/:idMozo` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Administrador, Mozo |

#### Request Body (Todos opcionales)
```json
{
  "nombreUsuario": "mozo_actualizado",
  "email": "mozo_nuevo@example.com",
  "nombre": "Pedro Roman",
  "apellido": "Lopez García",
  "dni": "45678901",
  "telefono": "+5491234567893"
}
```

#### ✅ Caso de Éxito (200 OK)
```json
{
  "nombreUsuario": "mozo_actualizado",
  "email": "mozo_nuevo@example.com",
  "nombre": "Pedro Roman",
  "apellido": "Lopez García",
  "dni": "45678901",
  "telefono": "+5491234567893"
}
```

#### ❌ Casos de Error

**400 - Bad Request: ID no válido**
```json
{
  "error": "No se ingreso un ID válido"
}
```

**400 - Bad Request: Datos inválidos**
```json
{
  "error": "Validation failed: el email debe ser válido"
}
```

---

## 📋 Validaciones

| Campo | Validación |
|-------|-----------|
| nombreUsuario | Mínimo 3 caracteres, único |
| email | Formato válido, único |
| password | Mínimo 8 caracteres |
| nombre | Mínimo 2 caracteres |
| apellido | Mínimo 2 caracteres |
| dni | Formato válido |
| telefono | Formato válido |

---

## 🧪 Ejemplos

```bash
# Obtener todos los mozos (como admin)
curl http://localhost:3000/mozos \
  -H "Authorization: Bearer <token>"

# Obtener mozo por ID
curl http://localhost:3000/mozos/id/uuid-mozo \
  -H "Authorization: Bearer <token>"

# Buscar mozo por nombre
curl "http://localhost:3000/mozos/nombre/mozo1?page=1" \
  -H "Authorization: Bearer <token>"

# Crear nuevo mozo (como admin)
curl -X POST http://localhost:3000/mozos \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "nombreUsuario": "mozo_nuevo",
    "email": "mozo@example.com",
    "password": "Password123",
    "nombre": "Pedro",
    "apellido": "Lopez",
    "dni": "45678901",
    "telefono": "+5491234567890"
  }'

# Actualizar mozo
curl -X PATCH http://localhost:3000/mozos/update/uuid-mozo \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Pedro Roman",
    "telefono": "+5491234567891"
  }'

# Eliminar mozo
curl -X DELETE http://localhost:3000/mozos/id/uuid-mozo \
  -H "Authorization: Bearer <token>"
```

---

## 📝 Notas Importantes

1. **Rol específico**: Solo administradores pueden crear/editar/eliminar mozos
2. **Email único**: Cada mozo debe tener un email único
3. **Nombreusuario único**: Los nombres de usuario deben ser únicos
4. **Autenticación**: Los mozos pueden hacer login como usuarios normales
5. **Paginación**: Por defecto 10 mozos por página
6. **Restricción de eliminación**: No se pueden eliminar mozos con pedidos pendientes

---

## 🔐 Rol de Mozo

Los mozos pueden:
- ✅ Ver todas las mesas
- ✅ Cambiar estado de mesas
- ✅ Crear pedidos
- ✅ Generar tokens QR
- ✅ Buscar reservas de clientes
- ✅ Ver pagos de pedidos
- ❌ No pueden acceder a gestión general de sistema

---

## 🔄 Flujo Típico

```
Admin crea nuevo mozo
   ↓
Sistema genera credenciales
   ↓
Mozo recibe credenciales
   ↓
Mozo hace login
   ↓
Mozo accede a dashboard
   ↓
Mozo gestiona mesas y pedidos
```

**Última actualización**: 24 de Febrero de 2026
