# 💰 Módulo: Precios

## Descripción General
Gestiona los precios de los productos en el sistema. Soporta histórico de precios, permitiendo cambios de precio a lo largo del tiempo con fechas de vigencia.

---

## Endpoints

### 1️⃣ GET /precios

**Descripción**: Obtiene todos los precios de productos

| Propiedad | Valor |
|-----------|-------|
| Método | GET |
| Ruta | `/precios` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Administrador |

#### ✅ Caso de Éxito (200 OK)
```json
[
  {
    "idPrecio": 1,
    "idProducto": 1,
    "precio": 150.50,
    "fechaDesde": "2026-01-01",
    "fechaHasta": "2026-02-28"
  },
  {
    "idPrecio": 2,
    "idProducto": 1,
    "precio": 165.00,
    "fechaDesde": "2026-03-01",
    "fechaHasta": null
  },
  {
    "idPrecio": 3,
    "idProducto": 2,
    "precio": 75.25,
    "fechaDesde": "2026-02-01",
    "fechaHasta": null
  }
]
```

---

### 2️⃣ GET /precios/search

**Descripción**: Busca el precio de un producto en una fecha específica

| Propiedad | Valor |
|-----------|-------|
| Método | GET |
| Ruta | `/precios/search` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Administrador |

#### Query Parameters (Requeridos)
```
?idProducto=1&fechaActual=2026-02-24
```

#### ✅ Caso de Éxito (200 OK)
```json
{
  "idPrecio": 1,
  "idProducto": 1,
  "precio": 150.50,
  "fechaDesde": "2026-01-01",
  "fechaHasta": "2026-02-28"
}
```

#### ❌ Casos de Error

**400 - Bad Request: Producto inválido**
```json
{
  "error": "El ID enviado debe ser un número"
}
```

**400 - Bad Request: Fecha faltante**
```json
{
  "error": "La fecha desde es requerida"
}
```

**400 - Bad Request: Fecha inválida**
```json
{
  "error": "Fecha inválida"
}
```

**404 - Not Found**
```json
{
  "error": "Precio no encontrado"
}
```

---

### 3️⃣ GET /precios/producto/:id

**Descripción**: Obtiene todos los precios históricos de un producto

| Propiedad | Valor |
|-----------|-------|
| Método | GET |
| Ruta | `/precios/producto/:id` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Administrador |

#### ✅ Caso de Éxito (200 OK)
```json
[
  {
    "idPrecio": 1,
    "idProducto": 1,
    "precio": 120.00,
    "fechaDesde": "2025-01-01",
    "fechaHasta": "2025-12-31"
  },
  {
    "idPrecio": 2,
    "idProducto": 1,
    "precio": 150.50,
    "fechaDesde": "2026-01-01",
    "fechaHasta": "2026-02-28"
  },
  {
    "idPrecio": 3,
    "idProducto": 1,
    "precio": 165.00,
    "fechaDesde": "2026-03-01",
    "fechaHasta": null
  }
]
```

#### ❌ Casos de Error

**400 - Bad Request**
```json
{
  "error": "El ID enviado debe ser un número"
}
```

---

### 4️⃣ GET /precios/actual/:id

**Descripción**: Obtiene el precio actual (vigente hoy) de un producto

| Propiedad | Valor |
|-----------|-------|
| Método | GET |
| Ruta | `/precios/actual/:id` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Administrador |

#### ✅ Caso de Éxito (200 OK)
```json
{
  "idPrecio": 3,
  "idProducto": 1,
  "precio": 165.00,
  "fechaDesde": "2026-03-01",
  "fechaHasta": null
}
```

#### ❌ Casos de Error

**400 - Bad Request**
```json
{
  "error": "El ID enviado debe ser un número"
}
```

**404 - Not Found**
```json
{
  "error": "Precio no encontrado"
}
```

---

### 5️⃣ POST /precios

**Descripción**: Crea un nuevo precio para un producto

| Propiedad | Valor |
|-----------|-------|
| Método | POST |
| Ruta | `/precios` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Administrador |

#### Request Body
```json
{
  "idProducto": 1,
  "precio": 180.00,
  "fechaDesde": "2026-04-01",
  "fechaHasta": null
}
```

#### ✅ Caso de Éxito (201 Created)
```json
{
  "idPrecio": 4,
  "idProducto": 1,
  "precio": 180.00,
  "fechaDesde": "2026-04-01",
  "fechaHasta": null
}
```

#### ❌ Casos de Error

**400 - Bad Request: Validación**
```json
{
  "error": "Validation failed: todos los campos requeridos son obligatorios"
}
```

---

### 6️⃣ DELETE /precios

**Descripción**: Elimina un precio específico

| Propiedad | Valor |
|-----------|-------|
| Método | DELETE |
| Ruta | `/precios` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Administrador |

#### Query Parameters (Requeridos)
```
?idProducto=1&fechaActual=2026-04-01
```

#### ✅ Caso de Éxito (204 No Content)
Sin body - Precio eliminado exitosamente

#### ❌ Casos de Error

**400 - Bad Request: Producto inválido**
```json
{
  "error": "El ID enviado debe ser un número"
}
```

**400 - Bad Request: Fecha faltante**
```json
{
  "error": "La fecha desde es requerida"
}
```

---

## 📊 Gestión de Historiales

El sistema mantiene un histórico completo de precios. Ejemplo de evolución:

```
Producto "Milanesa de Ternera" (ID: 1)

Precio 1:
- Valor: $120.00
- Desde: 2025-01-01
- Hasta: 2025-12-31

Precio 2:
- Valor: $150.50
- Desde: 2026-01-01
- Hasta: 2026-02-28

Precio 3 (Actual):
- Valor: $165.00
- Desde: 2026-03-01
- Hasta: null (vigente indefinidamente)
```

---

## 🧪 Ejemplos

```bash
# Obtener todos los precios (como admin)
curl http://localhost:3000/precios \
  -H "Authorization: Bearer <token>"

# Buscar precio en fecha específica
curl "http://localhost:3000/precios/search?idProducto=1&fechaActual=2026-02-24" \
  -H "Authorization: Bearer <token>"

# Ver histórico de precios de un producto
curl http://localhost:3000/precios/producto/1 \
  -H "Authorization: Bearer <token>"

# Obtener precio actual de un producto
curl http://localhost:3000/precios/actual/1 \
  -H "Authorization: Bearer <token>"

# Crear nuevo precio
curl -X POST http://localhost:3000/precios \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "idProducto": 1,
    "precio": 180.00,
    "fechaDesde": "2026-04-01",
    "fechaHasta": null
  }'

# Eliminar un precio
curl -X DELETE "http://localhost:3000/precios?idProducto=1&fechaActual=2026-04-01" \
  -H "Authorization: Bearer <token>"
```

---

## 📝 Validaciones

| Campo | Validación |
|-------|-----------|
| idProducto | Debe ser un número > 0 |
| precio | Debe ser número > 0 |
| fechaDesde | Formato YYYY-MM-DD, obligatorio |
| fechaHasta | Formato YYYY-MM-DD o null (opcional) |

---

## ⚠️ Notas Importantes

1. **Fechas sin superposición**: No se permiten dos precios activos simultáneamente para el mismo producto
2. **Null en fechaHasta**: Significa que el precio es vigente indefinidamente
3. **Histórico completo**: Siempre se mantiene un registro histórico
4. **Búsqueda inteligente**: El endpoint `/search` encuentra automáticamente el precio vigente en la fecha
5. **Precio actual**: Se calcula como el precio cuya fecha_desde <= hoy <= fecha_hasta

---

## 🔄 Flujo Típico de Cambio de Precio

```
Admin identifica cambio de precio necesario
   ↓
Admin crea nuevo precio con fechaDesde futura
   ↓
Admin edita precio actual y establece fechaHasta en fecha anterior
   ↓
En la fecha efectiva, nuevo precio entra en vigor
   ↓
Facturas usan automáticamente el precio vigente en esa fecha
```

---

## 💡 Caso de Uso: Aumento de Precios

```bash
# Precio actual: $150 desde 2026-01-01 (sin fecha fin)
# Decidimos aumentar a $165 desde 2026-03-01

# 1. Editar precio actual para establecer fin en 2026-02-28
curl -X DELETE "http://localhost:3000/precios?idProducto=1&fechaActual=2026-01-01" \
  -H "Authorization: Bearer <token>"

curl -X POST http://localhost:3000/precios \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "idProducto": 1,
    "precio": 150.00,
    "fechaDesde": "2026-01-01",
    "fechaHasta": "2026-02-28"
  }'

# 2. Crear nuevo precio a partir de 2026-03-01
curl -X POST http://localhost:3000/precios \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "idProducto": 1,
    "precio": 165.00,
    "fechaDesde": "2026-03-01",
    "fechaHasta": null
  }'
```

**Última actualización**: 24 de Febrero de 2026
