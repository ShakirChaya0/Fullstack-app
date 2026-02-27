# 💡 Módulo: Sugerencias

## Descripción General
Gestiona las sugerencias de productos especiales. Permite al sector cocina crear sugerencias de platos destacados (especiales, plato del día, etc.) con vigencia temporal.

---

## Endpoints

### 1️⃣ GET /sugerencias

**Descripción**: Obtiene todas las sugerencias con filtrado y ordenamiento

| Propiedad | Valor |
|-----------|-------|
| Método | GET |
| Ruta | `/sugerencias` |
| Autenticación | 🟢 No requerida |

#### Query Parameters
```
?page=1&filter=ACTIVES&sorted=DATE_DESC
```

**filter**: ALL | ACTIVES  
**sorted**: DATE_ASC | DATE_DESC | NAME_ASC | NAME_DESC

#### ✅ Caso de Éxito (200 OK)
```json
{
  "data": [
    {
      "idProducto": 5,
      "nombre": "Mejillones a la Marinera",
      "descripcion": "Mejillones frescos del día",
      "fechaDesde": "2026-02-20",
      "fechaHasta": "2026-02-28"
    }
  ],
  "pagination": {
    "page": 1,
    "totalItems": 1,
    "totalPages": 1
  }
}
```

---

### 2️⃣ GET /sugerencias/search

**Descripción**: Busca una sugerencia específica

| Propiedad | Valor |
|-----------|-------|
| Método | GET |
| Ruta | `/sugerencias/search` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 SectorCocina |

#### Query Parameters (Requeridos)
```
?idProducto=5&fechaDesde=2026-02-20
```

#### ✅ Caso de Éxito (200 OK)
```json
{
  "idProducto": 5,
  "nombre": "Mejillones a la Marinera",
  "descripcion": "Mejillones frescos del día",
  "fechaDesde": "2026-02-20",
  "fechaHasta": "2026-02-28"
}
```

---

### 3️⃣ POST /sugerencias

**Descripción**: Crea una nueva sugerencia

| Propiedad | Valor |
|-----------|-------|
| Método | POST |
| Ruta | `/sugerencias` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 SectorCocina |

#### Request Body
```json
{
  "idProducto": 5,
  "nombre": "Mejillones a la Marinera",
  "descripcion": "Mejillones frescos del día",
  "fechaDesde": "2026-02-20",
  "fechaHasta": "2026-02-28"
}
```

#### ✅ Caso de Éxito (201 Created)
```json
{
  "idProducto": 5,
  "nombre": "Mejillones a la Marinera",
  "descripcion": "Mejillones frescos del día",
  "fechaDesde": "2026-02-20",
  "fechaHasta": "2026-02-28"
}
```

---

### 4️⃣ PATCH /sugerencias

**Descripción**: Actualiza una sugerencia

| Propiedad | Valor |
|-----------|-------|
| Método | PATCH |
| Ruta | `/sugerencias` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 SectorCocina |

#### Query Parameters (Requeridos)
```
?idProducto=5&fechaDesde=2026-02-20
```

#### Request Body
```json
{
  "descripcion": "Descripción actualizada",
  "fechaHasta": "2026-02-28"
}
```

**Última actualización**: 24 de Febrero de 2026
