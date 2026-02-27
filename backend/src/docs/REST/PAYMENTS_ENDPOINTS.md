# 💳 Módulo: Pagos

## Descripción General
Gestiona todos los pagos del sistema. Soporta múltiples métodos de pago incluyendo MercadoPago, efectivo y tarjeta. Proporciona reportes y seguimiento de pagos.

---

## Endpoints

### 1️⃣ GET /pagos

**Descripción**: Obtiene todos los pagos registrados

| Propiedad | Valor |
|-----------|-------|
| Método | GET |
| Ruta | `/pagos` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Administrador |

#### ✅ Caso de Éxito (200 OK)
```json
[
  {
    "idPago": 1,
    "idPedido": 123,
    "metodoPago": "MercadoPago",
    "monto": 450.50,
    "fecha": "2026-02-24T19:30:00"
  },
  {
    "idPago": 2,
    "idPedido": 124,
    "metodoPago": "Efectivo",
    "monto": 320.00,
    "fecha": "2026-02-24T20:00:00"
  }
]
```

---

### 2️⃣ GET /pagos/pedido/:idPedido

**Descripción**: Obtiene el pago de un pedido específico

| Propiedad | Valor |
|-----------|-------|
| Método | GET |
| Ruta | `/pagos/pedido/:idPedido` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Administrador, Mozo |

#### ✅ Caso de Éxito (200 OK)
```json
{
  "idPago": 1,
  "idPedido": 123,
  "metodoPago": "MercadoPago",
  "monto": 450.50,
  "fecha": "2026-02-24T19:30:00"
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
  "error": "Pago no encontrado"
}
```

---

### 3️⃣ GET /pagos/fechas

**Descripción**: Obtiene pagos en un rango de fechas

| Propiedad | Valor |
|-----------|-------|
| Método | GET |
| Ruta | `/pagos/fechas` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Administrador |

#### Query Parameters (Requeridos)
```
?fechaDesde=2026-02-01&fechaHasta=2026-02-28
```

#### ✅ Caso de Éxito (200 OK)
```json
[
  {
    "idPago": 1,
    "idPedido": 123,
    "metodoPago": "MercadoPago",
    "monto": 450.50,
    "fecha": "2026-02-24T19:30:00"
  },
  {
    "idPago": 2,
    "idPedido": 124,
    "metodoPago": "Efectivo",
    "monto": 320.00,
    "fecha": "2026-02-24T20:00:00"
  }
]
```

#### ❌ Casos de Error

**400 - Bad Request**
```json
{
  "error": "Fecha Desde inválida"
}
```

---

### 4️⃣ GET /pagos/metodoPago/:metodoPago

**Descripción**: Obtiene pagos por método específico

| Propiedad | Valor |
|-----------|-------|
| Método | GET |
| Ruta | `/pagos/metodoPago/:metodoPago` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Administrador |

#### Métodos Válidos
- `MercadoPago`
- `Efectivo`
- `Debito`
- `Credito`

#### Ejemplo
```
GET /pagos/metodoPago/MercadoPago
GET /pagos/metodoPago/Efectivo
```

#### ✅ Caso de Éxito (200 OK)
```json
[
  {
    "idPago": 1,
    "idPedido": 123,
    "metodoPago": "MercadoPago",
    "monto": 450.50,
    "fecha": "2026-02-24T19:30:00"
  }
]
```

#### ❌ Casos de Error

**400 - Bad Request**
```json
{
  "error": "Método de pago inválido"
}
```

---

### 5️⃣ GET /pagos/cuenta/:id

**Descripción**: Genera y obtiene la factura de un pedido

| Propiedad | Valor |
|-----------|-------|
| Método | GET |
| Ruta | `/pagos/cuenta/:id` |
| Autenticación | 🟢 No requerida |

#### ✅ Caso de Éxito (200 OK)
```json
{
  "idPedido": 123,
  "items": [
    {
      "nombre": "Milanesa de Ternera",
      "cantidad": 2,
      "precio": 150.00,
      "subtotal": 300.00
    },
    {
      "nombre": "Coca Cola 500ml",
      "cantidad": 2,
      "precio": 75.25,
      "subtotal": 150.50
    }
  ],
  "total": 450.50,
  "fecha": "2026-02-24T19:30:00"
}
```

#### ❌ Casos de Error

**400 - Bad Request**
```json
{
  "error": "El ID enviado debe ser un número"
}
```

---

### 6️⃣ POST /pagos/mp/:id

**Descripción**: Inicia un pago mediante MercadoPago

| Propiedad | Valor |
|-----------|-------|
| Método | POST |
| Ruta | `/pagos/mp/:id` |
| Autenticación | 🟢 No requerida |
| Body | Vacío |

#### ✅ Caso de Éxito (200 OK)
```json
{
  "redirect_url": "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=..."
}
```

El cliente debe ser redirigido a la URL de MercadoPago para completar el pago.

#### ❌ Casos de Error

**400 - Bad Request**
```json
{
  "error": "El ID enviado debe ser un número"
}
```

---

### 7️⃣ POST /pagos/efectivo/:id

**Descripción**: Marca un pedido como listo para pago en efectivo

| Propiedad | Valor |
|-----------|-------|
| Método | POST |
| Ruta | `/pagos/efectivo/:id` |
| Autenticación | 🟢 No requerida |
| Body | Vacío |

#### ✅ Caso de Éxito (204 No Content)
Sin body - Pedido marcado como listo para pagar

#### ❌ Casos de Error

**400 - Bad Request**
```json
{
  "error": "El ID enviado debe ser un número"
}
```

---

### 8️⃣ POST /pagos/tarjeta/:id

**Descripción**: Marca un pedido como listo para pago con tarjeta

| Propiedad | Valor |
|-----------|-------|
| Método | POST |
| Ruta | `/pagos/tarjeta/:id` |
| Autenticación | 🟢 No requerida |
| Body | Vacío |

#### ✅ Caso de Éxito (204 No Content)
Sin body - Pedido marcado como listo para pagar

#### ❌ Casos de Error

**400 - Bad Request**
```json
{
  "error": "El ID enviado debe ser un número"
}
```

---

### 9️⃣ POST /pagos/pagado

**Descripción**: Registra un pago completado (webhook o manual)

| Propiedad | Valor |
|-----------|-------|
| Método | POST |
| Ruta | `/pagos/pagado` |
| Autenticación | 🟢 No requerida |

#### Para Webhook de MercadoPago
```
Query Parameters:
?id=<payment_id>&topic=payment
```

#### Para Registro Manual
```json
{
  "idPedido": 123,
  "metodoPago": "Efectivo"
}
```

#### ✅ Caso de Éxito (204 No Content)
Sin body - Pago registrado exitosamente

#### ❌ Casos de Error

**400 - Bad Request: ID inválido**
```json
{
  "error": "El ID enviado debe ser un número"
}
```

**400 - Bad Request: Método inválido**
```json
{
  "error": "Método de pago inválido"
}
```

---

## 💰 Métodos de Pago

| Método | Descripción | Integración |
|--------|-------------|------------|
| MercadoPago | Pago online | Externa (webhook) |
| Efectivo | Pago en caja | Manual |
| Debito | Tarjeta de débito | Manual |
| Credito | Tarjeta de crédito | Manual |

---

## 🧪 Flujo de Pago Completo

```bash
# 1. Obtener cuenta/factura
curl http://localhost:3000/pagos/cuenta/123

# 2. Elegir método de pago

# Opción A: MercadoPago
curl -X POST http://localhost:3000/pagos/mp/123
# Redirigir a URL devuelta
# MercadoPago hace webhook a /pagos/pagado

# Opción B: Efectivo
curl -X POST http://localhost:3000/pagos/efectivo/123
curl -X POST http://localhost:3000/pagos/pagado \
  -H "Content-Type: application/json" \
  -d '{
    "idPedido": 123,
    "metodoPago": "Efectivo"
  }'

# Opción C: Tarjeta
curl -X POST http://localhost:3000/pagos/tarjeta/123
curl -X POST http://localhost:3000/pagos/pagado \
  -H "Content-Type: application/json" \
  -d '{
    "idPedido": 123,
    "metodoPago": "Credito"
  }'

# 3. Verificar pago
curl http://localhost:3000/pagos/pedido/123 \
  -H "Authorization: Bearer <token>"

# 4. Reportes
curl "http://localhost:3000/pagos/fechas?fechaDesde=2026-02-01&fechaHasta=2026-02-28" \
  -H "Authorization: Bearer <token>"
```

---

## 📇 Webhook de MercadoPago

Cuando se completa un pago en MercadoPago, se recibe:

```
POST /pagos/pagado?id={payment_id}&topic=payment
```

El sistema procesa automáticamente el pago y:
1. Verifica el estado en MercadoPago
2. Registra el pago en la BD
3. Actualiza el estado del pedido

---

## 📝 Notas Importantes

1. **Formato de fecha**: YYYY-MM-DD
2. **Seguridad**: Los pagos manual deben validarse en la caja
3. **MercadoPago**: Requiere configuración de webhook
4. **Reportes**: Solo para administradores autenticados

**Última actualización**: 24 de Febrero de 2026
