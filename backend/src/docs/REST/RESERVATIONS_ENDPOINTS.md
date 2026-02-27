# 📅 Módulo: Reservas

## Descripción General
Gestiona las reservas de clientes en el restaurante. Permite a los clientes hacer reservas, a mozos consultar reservas del día, y actualizar estados de reservas.

---

## Endpoints

### 1️⃣ GET /reservas/clienteReserva

**Descripción**: Busca una reserva por nombre y apellido (solo mozos)

| Propiedad | Valor |
|-----------|-------|
| Método | GET |
| Ruta | `/reservas/clienteReserva` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Mozo |

#### Query Parameters (Requeridos)
```
?nombre=Juan&apellido=Perez
```

#### ✅ Caso de Éxito (200 OK)
```json
[
  {
    "idReserva": 1,
    "cliente": "Juan Perez",
    "fecha": "2026-02-24",
    "hora": "19:30",
    "cantidadPersonas": 4,
    "estado": "Confirmada"
  }
]
```

#### ❌ Casos de Error

**400 - Bad Request**
```json
{
  "error": "Debe enviar un nombre y apellido valido"
}
```

---

### 2️⃣ GET /reservas/:idReserva

**Descripción**: Obtiene detalles de una reserva específica

| Propiedad | Valor |
|-----------|-------|
| Método | GET |
| Ruta | `/reservas/:idReserva` |
| Autenticación | 🟢 No requerida |

#### ✅ Caso de Éxito (200 OK)
```json
{
  "idReserva": 1,
  "idCliente": "uuid-cliente",
  "fecha": "2026-02-24",
  "hora": "19:30",
  "cantidadPersonas": 4,
  "estado": "Confirmada",
  "comentarios": "Mesa cerca de la ventana"
}
```

#### ❌ Casos de Error

**400 - Bad Request**
```json
{
  "error": "El ID ingresado debe ser un número"
}
```

---

### 3️⃣ GET /reservas/mozo/reservaDelDia

**Descripción**: Obtiene reservas del día con paginación (solo mozos)

| Propiedad | Valor |
|-----------|-------|
| Método | GET |
| Ruta | `/reservas/mozo/reservaDelDia` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Mozo |

#### Query Parameters
```
?today=2026-02-24&page=1&pageSize=10
```

#### ✅ Caso de Éxito (200 OK)
```json
{
  "reservas": [
    {
      "idReserva": 1,
      "cliente": "Juan Perez",
      "hora": "19:30",
      "cantidadPersonas": 4,
      "estado": "Confirmada"
    },
    {
      "idReserva": 2,
      "cliente": "María García",
      "hora": "20:00",
      "cantidadPersonas": 2,
      "estado": "Confirmada"
    }
  ],
  "pagination": {
    "page": 1,
    "totalItems": 2
  }
}
```

#### ❌ Casos de Error

**400 - Bad Request**
```json
{
  "error": "Debe proporcionar una fecha válida"
}
```

---

### 4️⃣ GET /reservas/cliente/historial

**Descripción**: Obtiene el historial de reservas del cliente autenticado

| Propiedad | Valor |
|-----------|-------|
| Método | GET |
| Ruta | `/reservas/cliente/historial` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Cliente |

#### Query Parameters (Opcionales)
```
?page=1&pageSize=10
```

#### ✅ Caso de Éxito (200 OK)
```json
{
  "reservas": [
    {
      "idReserva": 1,
      "fecha": "2026-02-24",
      "hora": "19:30",
      "cantidadPersonas": 4,
      "estado": "Confirmada"
    }
  ],
  "pagination": {
    "page": 1,
    "totalItems": 1
  }
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

### 5️⃣ POST /reservas

**Descripción**: Crea una nueva reserva (solo clientes)

| Propiedad | Valor |
|-----------|-------|
| Método | POST |
| Ruta | `/reservas` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Cliente |

#### Request Body
```json
{
  "fecha": "2026-02-25",
  "hora": "19:30",
  "cantidadPersonas": 4,
  "comentarios": "Mesa cerca de la ventana, sin ajo por favor"
}
```

#### ✅ Caso de Éxito (201 Created)
```json
{
  "idReserva": 3,
  "idCliente": "uuid-cliente",
  "fecha": "2026-02-25",
  "hora": "19:30",
  "cantidadPersonas": 4,
  "estado": "Confirmada",
  "comentarios": "Mesa cerca de la ventana, sin ajo por favor"
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

### 6️⃣ PATCH /reservas/estado/:idReserva

**Descripción**: Actualiza el estado de una reserva

| Propiedad | Valor |
|-----------|-------|
| Método | PATCH |
| Ruta | `/reservas/estado/:idReserva` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Mozo, Cliente |

#### Request Body
```json
{
  "estado": "Asistida"
}
```

#### Estados Válidos
- `Realizada` - Reserva realizada/en proceso
- `Asistida` - Cliente asistió
- `No_Asistida` - Cliente no asistió
- `Cancelada` - Reserva cancelada

#### ✅ Caso de Éxito (204 No Content)
Sin body

#### ❌ Casos de Error

**400 - Bad Request: ID inválido**
```json
{
  "error": "El ID ingresado debe ser un número"
}
```

**400 - Bad Request: Estado inválido**
```json
{
  "error": "Debe proporcionar un estado válido"
}
```

---

## 📝 Estados de Reserva

| Estado | Descripción |
|--------|-------------|
| Realizada | Reserva confirmada y en proceso |
| Asistida | Cliente confirmó su asistencia |
| No_Asistida | Cliente no se presentó |
| Cancelada | Reserva cancelada por cliente |

---

## 🧪 Ejemplos

```bash
# Buscar reserva por cliente (como mozo)
curl -X GET "http://localhost:3000/reservas/clienteReserva?nombre=Juan&apellido=Perez" \
  -H "Authorization: Bearer <token>"

# Obtener detalle de reserva (público)
curl http://localhost:3000/reservas/1

# Ver reservas del día (como mozo)
curl "http://localhost:3000/reservas/mozo/reservaDelDia?today=2026-02-24" \
  -H "Authorization: Bearer <token>"

# Ver historial de reservas (como cliente)
curl http://localhost:3000/reservas/cliente/historial \
  -H "Authorization: Bearer <token>"

# Crear reserva (como cliente)
curl -X POST http://localhost:3000/reservas \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "fecha": "2026-02-25",
    "hora": "20:00",
    "cantidadPersonas": 4,
    "comentarios": "Preferencia por mesa tranquila"
  }'

# Actualizar estado (como mozo o cliente autenticado)
curl -X PATCH http://localhost:3000/reservas/estado/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "estado": "Asistida"
  }'
```

---

## 📝 Notas Importantes

1. **Validación de fecha**: Usar formato YYYY-MM-DD
2. **Validación de hora**: Usar formato HH:mm
3. **Cantidad mínima**: Debe ser mayor a 0
4. **Historial reciente**: Los clientes solo ven sus propias reservas

**Última actualización**: 24 de Febrero de 2026
