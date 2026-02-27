# 🍽️ Módulo: Productos

## Descripción General
Gestiona el catálogo de productos (comidas, bebidas, etc.) del restaurante. Permite consultar productos públicamente, filtrar por tipo e id, y administrar el catálogo.

---

## Endpoints

### 1️⃣ GET /productos

**Descripción**: Obtiene todos los productos con paginación opcional

| Propiedad | Valor |
|-----------|-------|
| Método | GET |
| Ruta | `/productos` |
| Autenticación | 🟢 No requerida |
| Paginación | Opcional (query params) |

#### Query Parameters (Opcionales)
```
?page=1&limit=10
```

#### ✅ Caso de Éxito (200 OK)
```json
[
  {
    "id": 1,
    "nombre": "Milanesa de Ternera",
    "descripcion": "Milanesa jugosa acompañada de puré",
    "tipoProducto": "Comida",
    "estado": "Activo",
    "categorizacion": "Platos Principales"
  },
  {
    "id": 2,
    "nombre": "Agua Mineral",
    "descripcion": "Agua sin gas",
    "tipoProducto": "Bebida",
    "estado": "Activo",
    "categorizacion": "Bebidas"
  }
]
```

---

### 2️⃣ GET /productos/id/:idProducto

**Descripción**: Obtiene un producto específico por ID

| Propiedad | Valor |
|-----------|-------|
| Método | GET |
| Ruta | `/productos/id/:idProducto` |
| Autenticación | 🟢 No requerida |

#### ✅ Caso de Éxito (200 OK)
```json
{
  "id": 1,
  "nombre": "Milanesa de Ternera",
  "descripcion": "Milanesa jugosa acompañada de puré",
  "tipoProducto": "Comida",
  "estado": "Activo",
  "categorizacion": "Platos Principales"
}
```

#### ❌ Casos de Error

**400 - Bad Request**
```json
{
  "error": "El ID ingresado debe ser un número"
}
```

**404 - Not Found**
```json
{
  "error": "Producto no encontrado"
}
```

---

### 3️⃣ GET /productos/nombre/:nombreProducto

**Descripción**: Busca productos por nombre (reemplaza _ con espacios)

| Propiedad | Valor |
|-----------|-------|
| Método | GET |
| Ruta | `/productos/nombre/:nombreProducto` |
| Autenticación | 🟢 No requerida |

#### Ejemplo
```
GET /productos/nombre/Milanesa_de_Ternera
GET /productos/nombre/Agua?page=1&limit=5
```

#### ✅ Caso de Éxito (200 OK)
```json
[
  {
    "id": 1,
    "nombre": "Milanesa de Ternera",
    "descripcion": "Milanesa jugosa acompañada de puré",
    "tipoProducto": "Comida",
    "estado": "Activo",
    "categorizacion": "Platos Principales"
  }
]
```

#### ❌ Casos de Error

**400 - Bad Request**
```json
{
  "error": "El nombre del producto es requerido"
}
```

**404 - Not Found**
```json
{
  "error": "Producto no encontrado"
}
```

---

### 4️⃣ GET /productos/tipoProducto/:tipoProducto

**Descripción**: Obtiene todos los productos de un tipo específico

| Propiedad | Valor |
|-----------|-------|
| Método | GET |
| Ruta | `/productos/tipoProducto/:tipoProducto` |
| Autenticación | 🟢 No requerida |

#### Tipos Válidos
- `Comida`
- `Bebida`

#### ✅ Caso de Éxito (200 OK)
```json
[
  {
    "id": 1,
    "nombre": "Milanesa de Ternera",
    "descripcion": "Milanesa",
    "tipoProducto": "Comida",
    "estado": "Activo",
    "categorizacion": "Platos Principales"
  }
]
```

#### ❌ Casos de Error

**404 - Not Found**
```json
{
  "error": "Producto no encontrado"
}
```

---

### 5️⃣ POST /productos

**Descripción**: Crea un nuevo producto (solo administradores)

| Propiedad | Valor |
|-----------|-------|
| Método | POST |
| Ruta | `/productos` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Administrador |

#### Request Body
```json
{
  "nombre": "Nuevo Producto",
  "descripcion": "Descripción del producto",
  "tipoProducto": "Comida",
  "estado": "Activo",
  "categorizacion": "Platos Principales"
}
```

#### ✅ Caso de Éxito (201 Created)
```json
{
  "id": 3,
  "nombre": "Nuevo Producto",
  "descripcion": "Descripción del producto",
  "tipoProducto": "Comida",
  "estado": "Activo",
  "categorizacion": "Platos Principales"
}
```

#### ❌ Casos de Error

**400 - Bad Request**
```json
{
  "error": "Validation failed: todos los campos son obligatorios"
}
```

**401 - Unauthorized**
```json
{
  "error": "Usuario no autenticado"
}
```

**403 - Forbidden**
```json
{
  "error": "Permiso denegado"
}
```

---

### 6️⃣ PATCH /productos/id/:idProducto

**Descripción**: Actualiza un producto (solo administradores)

| Propiedad | Valor |
|-----------|-------|
| Método | PATCH |
| Ruta | `/productos/id/:idProducto` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Administrador |

#### Request Body (Todos los campos opcionales)
```json
{
  "nombre": "Nombre Actualizado",
  "descripcion": "Nueva descripción",
  "tipoProducto": "Bebida",
  "estado": "Inactivo",
  "categorizacion": "Bebidas"
}
```

#### ✅ Caso de Éxito (200 OK)
```json
{
  "id": 1,
  "nombre": "Nombre Actualizado",
  "descripcion": "Nueva descripción",
  "tipoProducto": "Bebida",
  "estado": "Inactivo",
  "categorizacion": "Bebidas"
}
```

#### ❌ Casos de Error

**400 - Bad Request: ID inválido**
```json
{
  "error": "El ID ingresado debe ser un número"
}
```

**400 - Bad Request: Datos inválidos**
```json
{
  "error": "Validation failed: campos no válidos"
}
```

**404 - Not Found**
```json
{
  "error": "Producto no encontrado"
}
```

---

## 📊 Estados Válidos

| Estado | Significado |
|--------|------------|
| Activo | Producto disponible para venta |
| Inactivo | Producto no disponible |

---

## 📝 Notas Importantes

1. **Búsqueda por nombre**: Usa espacios como guiones bajos en la URL
2. **Paginación**: Page (default 1), Limit (default all)
3. **Acceso público**: Todos los GET son públicos
4. **Administración**: POST y PATCH requieren rol Administrador

---

## 🧪 Ejemplos

```bash
# Obtener todos los productos
curl http://localhost:3000/productos

# Obtener producto por ID
curl http://localhost:3000/productos/id/1

# Buscar por nombre
curl http://localhost:3000/productos/nombre/Milanesa_Ternera

# Buscar por tipo
curl http://localhost:3000/productos/tipoProducto/Comida

# Crear producto (requiere token)
curl -X POST http://localhost:3000/productos \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Nuevo Plato",
    "descripcion": "Descripción",
    "tipoProducto": "Comida",
    "estado": "Activo",
    "categorizacion": "Platos Principales"
  }'

# Actualizar producto
curl -X PATCH http://localhost:3000/productos/id/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Nombre actualizado",
    "estado": "Inactivo"
  }'
```

**Última actualización**: 24 de Febrero de 2026
