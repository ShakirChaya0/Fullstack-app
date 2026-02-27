# 🪑 Módulo: Mesas

## Descripción General
Gestiona las mesas del restaurante. Permite crear mesas, gestionar su estado (Libre/Ocupada), capacidad, y obtener información de mesas con pedidos asociados.

---

## Endpoints

### 1️⃣ GET /mesas

**Descripción**: Obtiene todas las mesas

| Propiedad | Valor |
|-----------|-------|
| Método | GET |
| Ruta | `/mesas` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Administrador, Mozo |

#### ✅ Caso de Éxito (200 OK)
```json
[
  {
    "numeroMesa": 1,
    "capacidad": 4,
    "estado": "Libre"
  },
  {
    "numeroMesa": 2,
    "capacidad": 2,
    "estado": "Ocupada"
  },
  {
    "numeroMesa": 3,
    "capacidad": 6,
    "estado": "Libre"
  }
]
```

---

### 2️⃣ GET /mesas/pedidos

**Descripción**: Obtiene todas las mesas con sus pedidos asociados

| Propiedad | Valor |
|-----------|-------|
| Método | GET |
| Ruta | `/mesas/pedidos` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Administrador, Mozo |

#### ✅ Caso de Éxito (200 OK)
```json
[
  {
    "numeroMesa": 1,
    "capacidad": 4,
    "estado": "Ocupada",
    "pedidos": [
      {
        "idPedido": 123,
        "estado": "En_Preparacion"
      }
    ]
  },
  {
    "numeroMesa": 2,
    "capacidad": 2,
    "estado": "Ocupada",
    "pedidos": [
      {
        "idPedido": 124,
        "estado": "Completado"
      },
      {
        "idPedido": 125,
        "estado": "En_Preparacion"
      }
    ]
  },
  {
    "numeroMesa": 3,
    "capacidad": 6,
    "estado": "Libre",
    "pedidos": []
  }
]
```

---

### 3️⃣ GET /mesas/capacidad/:capacity

**Descripción**: Obtiene mesas con una capacidad específica

| Propiedad | Valor |
|-----------|-------|
| Método | GET |
| Ruta | `/mesas/capacidad/:capacity` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Administrador, Mozo |

#### Ejemplo
```
GET /mesas/capacidad/4
```

#### ✅ Caso de Éxito (200 OK)
```json
[
  {
    "numeroMesa": 1,
    "capacidad": 4,
    "estado": "Libre"
  },
  {
    "numeroMesa": 5,
    "capacidad": 4,
    "estado": "Ocupada"
  }
]
```

#### ❌ Casos de Error

**400 - Bad Request**
```json
{
  "error": "La capacidad de la mesa debe ser un numero entero"
}
```

---

### 4️⃣ POST /mesas

**Descripción**: Crea una nueva mesa

| Propiedad | Valor |
|-----------|-------|
| Método | POST |
| Ruta | `/mesas` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Administrador |

#### Request Body
```json
{
  "numeroMesa": 10,
  "capacidad": 6
}
```

#### ✅ Caso de Éxito (201 Created)
```json
{
  "numeroMesa": 10,
  "capacidad": 6,
  "estado": "Libre"
}
```

#### ❌ Casos de Error

**400 - Bad Request**
```json
{
  "error": "Validation failed: numeroMesa y capacidad son obligatorios"
}
```

---

### 5️⃣ DELETE /mesas/nromesa/:numTable

**Descripción**: Elimina una mesa

| Propiedad | Valor |
|-----------|-------|
| Método | DELETE |
| Ruta | `/mesas/nromesa/:numTable` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Administrador |

#### ✅ Caso de Éxito (200 OK)
```json
{
  "message": "Mesa eliminada exitosamente"
}
```

#### ❌ Casos de Error

**400 - Bad Request**
```json
{
  "error": "El numero de la mesa debe ser un entero"
}
```

---

### 6️⃣ PATCH /mesas/cambiarEstado/:numTable

**Descripción**: Cambia el estado de una mesa (Libre/Ocupada)

| Propiedad | Valor |
|-----------|-------|
| Método | PATCH |
| Ruta | `/mesas/cambiarEstado/:numTable` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Mozo |

#### Request Body
```json
{
  "statusTable": "Ocupada"
}
```

#### Estados Válidos
- `Libre` - Mesa disponible
- `Ocupada` - Mesa ocupada

#### ✅ Caso de Éxito (200 OK)
```json
{
  "numeroMesa": 1,
  "capacidad": 4,
  "estado": "Ocupada"
}
```

#### ❌ Casos de Error

**400 - Bad Request: Mesa no proporcionada**
```json
{
  "error": "El numero de mesa es obligatorio"
}
```

**400 - Bad Request: Estado inválido**
```json
{
  "error": "El estado de la mesa ingresadó es incorrecto"
}
```

---

### 7️⃣ PATCH /mesas/actualizarCapacidad/:numTable

**Descripción**: Actualiza la capacidad de una mesa

| Propiedad | Valor |
|-----------|-------|
| Método | PATCH |
| Ruta | `/mesas/actualizarCapacidad/:numTable` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Administrador |

#### Request Body
```json
{
  "capacity": 8
}
```

#### ✅ Caso de Éxito (200 OK)
```json
{
  "numeroMesa": 1,
  "capacidad": 8,
  "estado": "Libre"
}
```

#### ❌ Casos de Error

**400 - Bad Request: Número inválido**
```json
{
  "error": "El numero de la mesa debe ser un entero"
}
```

**400 - Bad Request: Datos inválidos**
```json
{
  "error": "Validation failed: capacity debe ser un número"
}
```

---

## 📊 Estados de Mesa

| Estado | Descripción |
|--------|------------|
| Libre | Mesa disponible para nuevos clientes |
| Ocupada | Mesa con clientes atendidos |

---

## 🧪 Ejemplos Completos

```bash
# Obtener todas las mesas (como mozo)
curl http://localhost:3000/mesas \
  -H "Authorization: Bearer <token>"

# Obtener mesas con pedidos
curl http://localhost:3000/mesas/pedidos \
  -H "Authorization: Bearer <token>"

# Obtener mesas para 4 personas
curl http://localhost:3000/mesas/capacidad/4 \
  -H "Authorization: Bearer <token>"

# Crear nueva mesa (como admin)
curl -X POST http://localhost:3000/mesas \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "numeroMesa": 10,
    "capacidad": 6
  }'

# Cambiar estado de mesa (como mozo)
curl -X PATCH http://localhost:3000/mesas/cambiarEstado/5 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "statusTable": "Ocupada"
  }'

# Actualizar capacidad (como admin)
curl -X PATCH http://localhost:3000/mesas/actualizarCapacidad/5 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "capacity": 8
  }'

# Eliminar mesa (como admin)
curl -X DELETE http://localhost:3000/mesas/nromesa/10 \
  -H "Authorization: Bearer <token>"
```

---

## 📝 Notas Importantes

1. **Número de mesa**: Debe ser único
2. **Capacidad mínima**: Recomendado 2 personas
3. **Estados**: Solo Libre u Ocupada
4. **Restricción**: No se pueden eliminar mesas con pedidos activos
5. **Rol específico**: Solo mozos pueden cambiar estado

---

## 🔄 Flujo de Uso Típico

```
Admin crea mesas
   ↓
Mozo verifica mesas disponibles
   ↓
Cliente se sienta en mesa
   ↓
Mozo marca mesa como Ocupada
   ↓
Mozo crea pedido para mesa
   ↓
Al terminar, mozo marca mesa como Libre
```

**Última actualización**: 24 de Febrero de 2026
