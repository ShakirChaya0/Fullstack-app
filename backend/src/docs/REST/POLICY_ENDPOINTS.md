# 📋 Módulo: Política & ℹ️ Información

## Descripción Dual

Este módulo gestiona dos contextos de información del restaurante:
- **Políticas**: Términos, condiciones, políticas de cambio, etc.
- **Información**: Datos generales del restaurante (nombre, dirección, contacto)

---

## POLÍTICAS

### 1️⃣ GET /politicas

**Descripción**: Obtiene la información de políticas

| Propiedad | Valor |
|-----------|-------|
| Método | GET |
| Ruta | `/politicas` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Administrador |

#### ✅ Caso de Éxito (200 OK)
```json
{
  "idPolitica": 1,
  "contenido": "Política de cambios: Los clientes pueden cambiar su pedido dentro de 10 minutos...",
  "titulo": "Políticas de Cambio"
}
```

---

### 2️⃣ PATCH /politicas/id/:idPolitica

**Descripción**: Actualiza la política

| Propiedad | Valor |
|-----------|-------|
| Método | PATCH |
| Ruta | `/politicas/id/:idPolitica` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Administrador |

#### Request Body
```json
{
  "contenido": "Contenido actualizado",
  "titulo": "Nuevo título"
}
```

#### ✅ Caso de Éxito (200 OK)
```json
{
  "idPolitica": 1,
  "contenido": "Contenido actualizado",
  "titulo": "Nuevo título"
}
```

---

## INFORMACIÓN

### 3️⃣ GET /informacion

**Descripción**: Obtiene info general del restaurante

| Propiedad | Valor |
|-----------|-------|
| Método | GET |
| Ruta | `/informacion` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Administrador |

#### ✅ Caso de Éxito (200 OK)
```json
{
  "id": 1,
  "nombre": "Sabores Deluxe Restaurant",
  "direccion": "Calle Principal 123, Buenos Aires",
  "telefono": "+5491234567890",
  "email": "info@saboresdeluxe.com"
}
```

---

### 4️⃣ PATCH /informacion/:idInformacion

**Descripción**: Actualiza la información del restaurante

| Propiedad | Valor |
|-----------|-------|
| Método | PATCH |
| Ruta | `/informacion/:idInformacion` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Administrador |

#### Request Body
```json
{
  "nombre": "Sabores Deluxe Restaurant",
  "direccion": "Nueva calle 456",
  "telefono": "+5491234567891",
  "email": "contacto@saboresdeluxe.com"
}
```

#### ✅ Caso de Éxito (200 OK)
```json
{
  "id": 1,
  "nombre": "Sabores Deluxe Restaurant",
  "direccion": "Nueva calle 456",
  "telefono": "+5491234567891",
  "email": "contacto@saboresdeluxe.com"
}
```

**Última actualización**: 24 de Febrero de 2026
