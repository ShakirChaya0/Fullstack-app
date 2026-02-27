# 👥 Módulo: Clientes

## Descripción General
Gestiona el registro, consulta y actualización de información de clientes. Permite clientes autenticarse, actualizar su perfil, y administradores consultar datos de clientes.

---

## Endpoints

### 1️⃣ GET /clientes

**Descripción**: Obtiene lista de todos los clientes

| Propiedad | Valor |
|-----------|-------|
| Método | GET |
| Ruta | `/clientes` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Administrador |

#### ✅ Caso de Éxito (200 OK)
```json
[
  {
    "nombreUsuario": "juan_perez",
    "email": "juan@example.com",
    "nombre": "Juan",
    "apellido": "Perez",
    "telefono": "+5491234567890",
    "fechaNacimiento": "1990-05-15",
    "estados": []
  },
  {
    "nombreUsuario": "maria_garcia",
    "email": "maria@example.com",
    "nombre": "María",
    "apellido": "García",
    "telefono": "+5491234567891",
    "fechaNacimiento": "1995-03-20",
    "estados": ["Activo"]
  }
]
```

---

### 2️⃣ GET /clientes/id/:idUsuario

**Descripción**: Obtiene datos de un cliente específico por ID

| Propiedad | Valor |
|-----------|-------|
| Método | GET |
| Ruta | `/clientes/id/:idUsuario` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Administrador, Cliente |

#### ✅ Caso de Éxito (200 OK)
```json
{
  "nombreUsuario": "juan_perez",
  "email": "juan@example.com",
  "nombre": "Juan",
  "apellido": "Perez",
  "fechaNacimiento": "1990-05-15",
  "telefono": "+5491234567890",
  "estadoCliente": ["Activo"]
}
```

#### ❌ Casos de Error

**400 - Bad Request**
```json
{
  "error": "Se ingreso un ID válido"
}
```

---

### 3️⃣ GET /clientes/nombreUsuario/:nombreUsuario

**Descripción**: Busca un cliente por nombre de usuario

| Propiedad | Valor |
|-----------|-------|
| Método | GET |
| Ruta | `/clientes/nombreUsuario/:nombreUsuario` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Administrador, Cliente |

#### ✅ Caso de Éxito (200 OK)
```json
{
  "nombreUsuario": "juan_perez",
  "email": "juan@example.com",
  "nombre": "Juan",
  "apellido": "Perez",
  "fechaNacimiento": "1990-05-15",
  "telefono": "+5491234567890"
}
```

#### ❌ Casos de Error

**400 - Bad Request**
```json
{
  "error": "El nombre de usuario es incorrecto"
}
```

---

### 4️⃣ POST /clientes

**Descripción**: Registra un nuevo cliente en el sistema

| Propiedad | Valor |
|-----------|-------|
| Método | POST |
| Ruta | `/clientes` |
| Autenticación | 🟢 No requerida |

#### Request Body
```json
{
  "nombreUsuario": "juan_perez",
  "email": "juan@example.com",
  "password": "ContraseñaSegura123",
  "nombre": "Juan",
  "apellido": "Perez",
  "fechaNacimiento": "1990-05-15",
  "telefono": "+5491234567890"
}
```

#### ✅ Caso de Éxito (201 Created)
```json
{
  "nombreUsuario": "juan_perez",
  "email": "juan@example.com",
  "nombre": "Juan",
  "apellido": "Perez",
  "fechaNacimiento": "1990-05-15",
  "telefono": "+5491234567890"
}
```

#### ❌ Casos de Error

**400 - Bad Request: Validación**
```json
{
  "error": "Validation failed: todos los campos son obligatorios"
}
```

---

### 5️⃣ PATCH /clientes/update

**Descripción**: Actualiza la información del cliente autenticado

| Propiedad | Valor |
|-----------|-------|
| Método | PATCH |
| Ruta | `/clientes/update` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Cliente |

#### Request Body (Todos opcionales)
```json
{
  "nombreUsuario": "juan_perez_nuevo",
  "email": "juan_nuevo@example.com",
  "nombre": "Juan Carlos",
  "apellido": "Perez López",
  "fechaNacimiento": "1990-05-15",
  "telefono": "+5491234567890"
}
```

#### ✅ Caso de Éxito (200 OK)
```json
{
  "nombreUsuario": "juan_perez_nuevo",
  "email": "juan_nuevo@example.com",
  "nombre": "Juan Carlos",
  "apellido": "Perez López",
  "fechaNacimiento": "1990-05-15",
  "telefono": "+5491234567890",
  "emailVerificado": true
}
```

#### ❌ Casos de Error

**400 - Bad Request: No autenticado**
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
| password | Mínimo 8 caracteres, debe contener mayúscula, número |
| nombre | Mínimo 2 caracteres |
| apellido | Mínimo 2 caracteres |
| fechaNacimiento | Formato YYYY-MM-DD |
| telefono | Formato válido |

---

## 🧪 Ejemplos

```bash
# Registrar nuevo cliente (público)
curl -X POST http://localhost:3000/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "nombreUsuario": "juan_perez",
    "email": "juan@example.com",
    "password": "Password123",
    "nombre": "Juan",
    "apellido": "Perez",
    "fechaNacimiento": "1990-05-15",
    "telefono": "+5491234567890"
  }'

# Obtener todos los clientes (como admin)
curl http://localhost:3000/clientes \
  -H "Authorization: Bearer <token>"

# Obtener cliente por ID
curl http://localhost:3000/clientes/id/uuid-cliente \
  -H "Authorization: Bearer <token>"

# Buscar cliente por nombre de usuario
curl http://localhost:3000/clientes/nombreUsuario/juan_perez \
  -H "Authorization: Bearer <token>"

# Actualizar perfil (cliente autenticado)
curl -X PATCH http://localhost:3000/clientes/update \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Carlos",
    "telefono": "+5491234567891"
  }'
```

---

## 📝 Notas Importantes

1. **Registro público**: Cualquiera puede registrarse sin autenticación
2. **Email único**: No puede registrarse con email ya usado
3. **Actualización propia**: Los clientes solo pueden actualizar su propio perfil
4. **Verificación de email**: Se envía email de verificación al registrarse
5. **Estados**: Puede tener múltiples estados (Activo, Suspendido, etc.)

---

## 🔐 Flujo de Registro

```
1. Usuario completa formulario
   ↓
2. POST /clientes con datos
   ↓
3. Sistema valida datos
   ↓
4. Crea usuario en BD
   ↓
5. Envía email de verificación
   ↓
6. Usuario puede hacer login
```

**Última actualización**: 24 de Febrero de 2026
