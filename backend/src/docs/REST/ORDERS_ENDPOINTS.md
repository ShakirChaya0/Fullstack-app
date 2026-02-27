# 🛒 Módulo: Pedidos

## Descripción General
Gestiona los pedidos del restaurante. Permite crear, actualizar y consultar pedidos. Los pedidos pueden ser creados por clientes autenticados, mozos o clientes anónimos con QR.

---

## Endpoints

### 1️⃣ POST /pedidos

**Descripción**: Crea un nuevo pedido

| Propiedad | Valor |
|-----------|-------|
| Método | POST |
| Ruta | `/pedidos` |
| Autenticación | 🔵 Opcional (Auth o QR Token) |

#### Request Body
```json
{
  "tableNumber": 5,
  "order": {
    "items": [
      {
        "idProducto": 1,
        "cantidad": 2,
        "comentarios": "Sin cebolla"
      },
      {
        "idProducto": 5,
        "cantidad": 1,
        "comentarios": ""
      }
    ]
  }
}
```

#### Casos Válidos de Uso

**1. Cliente con QR (sin autenticación)**
- Requiere: `qrToken` en cookie (obtenido de `/qr`)
- Parámetro `tableNumber`: NO se incluye
- Rol detectado: Cliente automáticamente

**2. Mozo (autenticado)**
- Requiere: Token de autenticación
- Parámetro `tableNumber`: OBLIGATORIO
- Rol detectado: Mozo

**3. Cliente autenticado**
- Requiere: Token de autenticación
- Parámetro `tableNumber`: NO se incluye
- Rol detectado: Cliente

#### ✅ Caso de Éxito (201 Created)
```json
{
  "idPedido": 123,
  "numeroMesa": 5,
  "usuario": "nombre_usuario",
  "items": [
    {
      "lineNumber": 1,
      "idProducto": 1,
      "cantidad": 2,
      "estado": "Pendiente",
      "comentarios": "Sin cebolla"
    },
    {
      "lineNumber": 2,
      "idProducto": 5,
      "cantidad": 1,
      "estado": "Pendiente",
      "comentarios": ""
    }
  ],
  "estado": "Activo",
  "fechaCreacion": "2026-02-24T19:30:00"
}
```

#### ❌ Casos de Error

**401 - Unauthorized: Sin autenticación ni QR**
```json
{
  "error": "No se encontro el token del QR y el usuario no esta logeado"
}
```

**401 - Unauthorized: Sin QR y usuario no es Mozo**
```json
{
  "error": "No se encontro el token del QR y el usuario no es un Mozo"
}
```

**400 - Bad Request: Mozo sin número de mesa**
```json
{
  "error": "Número de mesa es requerido"
}
```

**401 - Unauthorized: Mozo con QR token**
```json
{
  "error": "Un Mozo no debe tener un token del QR"
}
```

**401 - Unauthorized: Cliente ingresando número de mesa**
```json
{
  "error": "Un Comensal no debe ingresar número de Mesa"
}
```

**400 - Bad Request: Número de mesa inválido**
```json
{
  "error": "El número de mesa debe ser número entero"
}
```

**400 - Bad Request: Datos de orden inválidos**
```json
{
  "error": "Validation failed: items es obligatorio"
}
```

---

## 📋 Estados de Pedidos

| Estado | Significado |
|--------|------------|
| Activo | Pedido en preparación |
| Completado | Pedido listo para entregar |
| Pagado | Pago realizado |
| Cancelado | Pedido cancelado |

---

## 📝 Estados de Línea de Pedido

| Estado | Significado |
|--------|------------|
| Pendiente | Esperando ser preparado |
| En_Preparacion | Se está preparando |
| Listo | Listo para servir |
| Servido | Entregado al cliente |

---

## 🧪 Ejemplos Completos

### Flujo de Cliente Anónimo con QR

```bash
# 1. Cliente escanea QR y obtiene token
curl "http://localhost:3000/qr?qrToken=TOKEN_DEL_QR&mesa=5" \
  -c cookies.txt

# La respuesta establece cookie qrToken automáticamente

# 2. Cliente crea pedido usando cookie
curl -X POST http://localhost:3000/pedidos \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "order": {
      "items": [
        {
          "idProducto": 1,
          "cantidad": 2,
          "comentarios": "Sin cebolla"
        },
        {
          "idProducto": 5,
          "cantidad": 1,
          "comentarios": ""
        }
      ]
    }
  }'

# Respuesta: idPedido: 123
```

### Flujo de Mozo

```bash
# 1. Mozo hace login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "mozo@example.com",
    "password": "password123"
  }'

# Obtiene: token

# 2. Mozo crea pedido para mesa 5
curl -X POST http://localhost:3000/pedidos \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "tableNumber": 5,
    "order": {
      "items": [
        {
          "idProducto": 1,
          "cantidad": 2
        }
      ]
    }
  }'

# Respuesta: idPedido: 123
```

### Flujo de Cliente Autenticado

```bash
# 1. Cliente hace login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "cliente@example.com",
    "password": "password123"
  }'

# 2. Cliente crea pedido (sin número de mesa)
curl -X POST http://localhost:3000/pedidos \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "order": {
      "items": [
        {
          "idProducto": 1,
          "cantidad": 2,
          "comentarios": "Sin sal"
        }
      ]
    }
  }'
```

---

## 🔒 Reglas de Seguridad

1. **Mozos**: Solo pueden crear pedidos si incluyen `tableNumber`
2. **Clientes autenticados**: NO pueden incluir `tableNumber`
3. **Clientes anónimos**: Necesitan `qrToken` en cookie
4. **Validación de productos**: Todos los `idProducto` deben existir
5. **Cantidad mínima**: Debe ser number > 0

---

## 📝 Notas Importantes

1. **Comentarios opcionales**: Pueden incluirse para aclaraciones especiales
2. **Un pedido = múltiples items**: Se pueden agregar varios productos
3. **Actualizaciones posteriores**: Ver otros endpoints de pedidos para modificar
4. **Integración con pagos**: Un pedido activo puede tener múltiples líneas

---

## 🔗 Flujo Completo Sugerido

```
1. Cliente con QR
   ↓
2. POST /qr (obtener token)
   ↓
3. POST /pedidos (crear pedido)
   ↓
4. GET /pagos/cuenta/:id (obtener factura)
   ↓
5. POST /pagos/mp/:id (iniciar pago)
   ↓
6. Pago completado
```

**Última actualización**: 24 de Febrero de 2026
