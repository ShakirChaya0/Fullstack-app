# 📱 Módulo: QR

## Descripción General
Gestiona la generación y validación de códigos QR para acceso a mesas. Permite a clientes escanear QR para acceder al menú y hacer pedidos, y a mozos generar nuevos QR para asignar a mesas.

---

## Endpoints

### 1️⃣ GET /qr

**Descripción**: Obtiene un token QR para una mesa específica

| Propiedad | Valor |
|-----------|-------|
| Método | GET |
| Ruta | `/qr` |
| Autenticación | 🟢 No requerida |

#### Query Parameters (Requeridos)
```
?qrToken=TOKEN_DEL_QR&mesa=5
```

#### Propósito
Cuando un cliente escanea un código QR (que contiene el token), accede a este endpoint para validar el token y establecer una cookie de sesión.

#### ✅ Caso de Éxito (204 No Content)
```
Cookie establecida: qrToken=TOKEN_DEL_QR
```

No retorna body, solo establece la cookie para que funcione en requests posteriores.

#### ❌ Casos de Error

**400 - Bad Request: Número de mesa inválido**
```json
{
  "error": "El número de Mesa debe ser un número"
}
```

**400 - Bad Request: Token no proporcionado**
```json
{
  "error": "El QR Token es obligatorio"
}
```

---

### 2️⃣ POST /qr

**Descripción**: Crea o actualiza un token QR para una mesa

| Propiedad | Valor |
|-----------|-------|
| Método | POST |
| Ruta | `/qr` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Mozo |

#### Request Body
```json
{
  "tableNumber": 5
}
```

#### ✅ Caso de Éxito (201 Created)
```json
{
  "QrToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0YWJsZU51bWJlciI6NSwiY3JlYXRlZEF0IjoxNzI5NzY3MjAwfQ.abc123def456"
}
```

Este token debe ser codificado en un código QR que los clientes escanearán. El QR debe apuntar a:
```
http://localhost:3000/qr?qrToken={QR_TOKEN}&mesa={TABLE_NUMBER}
```

#### ❌ Casos de Error

**400 - Bad Request: Tipo de dato inválido**
```json
{
  "error": "El nro de Mesa ingresado debe ser un número"
}
```

**404 - Not Found: Mozo no existe**
```json
{
  "error": "No se encontro el mozo"
}
```

---

## 🔐 Flujo de Autenticación con QR

### Para Clientes (Cliente Anónimo)

```
1. Cliente escanea código QR en la mesa
   ↓
2. QR redirige a: GET /qr?qrToken=TOKEN&mesa=5
   ↓
3. Se establece cookie qrToken automáticamente
   ↓
4. Cliente puede ahora hacer POST /pedidos
   ↓
5. Crear pedido sin autenticación (usa cookie)
```

### Para Mozos (Generar QR)

```
1. Mozo hace login: POST /auth/login
   ↓
2. Mozo genera QR: POST /qr
   - Proporciona: tableNumber
   - Recibe: QrToken
   ↓
3. Mozo codifica token en código QR
   ↓
4. Coloca código QR en la mesa
   ↓
5. Clientes pueden escanear y acceder
```

---

## 📝 Generación de Código QR

El token devuelto debe codificarse en un código QR. Típicamente:

```
Datos del QR:
http://localhost:3000/qr?qrToken=<token_aqui>&mesa=<numero_mesa>

O en frontend:
Usar librería como qrcode.js para generar
```

#### Ejemplo de Generación (JavaScript)
```javascript
import QRCode from 'qrcode';

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
const tableNumber = 5;
const qrUrl = `http://localhost:3000/qr?qrToken=${token}&mesa=${tableNumber}`;

QRCode.toCanvas(document.getElementById('qr-canvas'), qrUrl, (error) => {
  if (error) console.error(error);
  else console.log('QR generado exitosamente');
});
```

---

## 🧪 Ejemplos Completos

### Flujo Cliente (Escanear QR)

```bash
# 1. Cliente escanea QR y accede al endpoint
# El QR contiene: http://localhost:3000/qr?qrToken=TOKEN&mesa=5

curl "http://localhost:3000/qr?qrToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...&mesa=5" \
  -c cookies.txt

# Respuesta: 204 No Content
# Se establece cookie qrToken

# 2. Ahora puede hacer pedidos
curl -X POST http://localhost:3000/pedidos \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "order": {
      "items": [
        { "idProducto": 1, "cantidad": 2 }
      ]
    }
  }'
```

### Flujo Mozo (Generar QR)

```bash
# 1. Mozo hace login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "mozo@example.com",
    "password": "password123"
  }'

# Obtiene: { "token": "..." }

# 2. Mozo genera QR para mesa 5
curl -X POST http://localhost:3000/qr \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "tableNumber": 5
  }'

# Respuesta:
# {
#   "QrToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
# }

# 3. Mozo codifica token en QR
# URL del QR: http://localhost:3000/qr?qrToken=<TOKEN>&mesa=5

# 4. Mozo imprime/coloca QR en la mesa
```

---

## 🔗 Integración con Pedidos

Una vez que el cliente tiene el qrToken en la cookie:

```bash
# Hacer pedido como cliente anónimo con QR
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
        }
      ]
    }
  }'
```

---

## 📊 Estados del Flujo

| Etapa | Estado | Actor |
|-------|--------|-------|
| 1 | Generación | Mozo (POST /qr) |
| 2 | Impresión | Admin/Mozo (fuera del sistema) |
| 3 | Colocación | Mozo (en la mesa) |
| 4 | Escaneo | Cliente (escanea QR) |
| 5 | Validación | Sistema (GET /qr) |
| 6 | Sesión | Cliente (tiene qrToken en cookie) |
| 7 | Pedidos | Cliente (POST /pedidos con cookie) |

---

## 🔒 Seguridad

1. **Tokens únicos**: Cada token es único y vinculado a una mesa
2. **Expiración**: Los tokens deben expirar después de Xhoras
3. **One-time use**: Un token se puede usar múltiples veces pero siempre para la misma mesa
4. **Sin datos sensibles**: El token no contiene información sensible

---

## 📋 Parámetros Requeridos

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| qrToken | string | Token codificado en QR |
| mesa/tableNumber | number | Número de mesa (1-N) |

---

## 📝 Notas Importantes

1. **Una mesa = un QR**: Cada mesa tiene su propio código QR único
2. **Reutilización**: Un QR puede ser escanea por múltiples clientes de la misma mesa en el mismo día
3. **Número de mesa**: Debe coincidir entre POST y GET
4. **Codificación**: El QR debe codificar una URL completa válida
5. **Soporte móvil**: Works on any device with QR scanner

---

## 🎯 Caso de Uso Típico

```
Mesa vacía
  ↓
Mozo genera QR: POST /qr (tableNumber: 5)
  ↓
Sistema retorna token
  ↓
Mozo imprime código QR
  ↓
Mozo coloca código en la mesa
  ↓
Cliente se sienta
  ↓
Cliente abre navegador y escanea QR
  ↓
Redirige a: /qr?qrToken=...&mesa=5
  ↓
Cookie qrToken establecida
  ↓
Cliente accede al menú
  ↓
Cliente hace pedido con POST /pedidos
```

**Última actualización**: 24 de Febrero de 2026
