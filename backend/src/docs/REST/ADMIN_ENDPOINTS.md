# 🛡️ Módulo: Administradores y 👨‍🍳 Cocina

## ADMINISTRADORES

### 1️⃣ GET /administradores

**Descripción**: Obtiene datos del administrador

| Propiedad | Valor |
|-----------|-------|
| Método | GET |
| Ruta | `/administradores` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Administrador |

#### ✅ Caso de Éxito (200 OK)
```json
{
  "nombreUsuario": "admin",
  "email": "admin@example.com",
  "nombre": "Administrador",
  "apellido": "Principal",
  "dni": "12345678",
  "telefono": "+5491234567890"
}
```

---

### 2️⃣ PATCH /administradores/update

**Descripción**: Actualiza perfil del administrador

| Propiedad | Valor |
|-----------|-------|
| Método | PATCH |
| Ruta | `/administradores/update` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Administrador |

#### Request Body
```json
{
  "nombreUsuario": "admin_actualizado",
  "email": "nuevo_email@example.com",
  "nombre": "Admin",
  "apellido": "Actualizado",
  "dni": "12345678",
  "telefono": "+5491234567891"
}
```

---

## COCINA

### 3️⃣ GET /cocina

**Descripción**: Obtiene datos de la cuenta de cocina

| Propiedad | Valor |
|-----------|-------|
| Método | GET |
| Ruta | `/cocina` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Administrador, SectorCocina |

---

### 4️⃣ PATCH /cocina/update

**Descripción**: Actualiza datos de cocina

| Propiedad | Valor |
|-----------|-------|
| Método | PATCH |
| Ruta | `/cocina/update` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Administrador, SectorCocina |

#### Request Body
```json
{
  "nombreUsuario": "cocina",
  "email": "cocina@example.com"
}
```

**Última actualización**: 24 de Febrero de 2026
