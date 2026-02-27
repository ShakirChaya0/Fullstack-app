# 📚 Documentación Completa de la API - Restaurante Sabores Deluxe

## Índice General

Bienvenido a la documentación completa de todos los endpoints de la API REST del restaurante. Encontrarás 87 endpoints organizados en 17 módulos diferentes.

### 📑 Módulos

1. **[🔐 Autenticación (Auth)](#módulo-autenticación)** - 7 endpoints
2. **[🍽️ Productos](#módulo-productos)** - 6 endpoints
3. **[📰 Noticias/Novedades](#módulo-noticias)** - 6 endpoints
4. **[📋 Políticas](#módulo-políticas)** - 2 endpoints
5. **[ℹ️ Información](#módulo-información)** - 2 endpoints
6. **[🕐 Horarios](#módulo-horarios)** - 4 endpoints
7. **[💡 Sugerencias](#módulo-sugerencias)** - 4 endpoints
8. **[👔 Mozos](#módulo-mozos)** - 6 endpoints
9. **[🪑 Mesas](#módulo-mesas)** - 7 endpoints
10. **[💰 Precios](#módulo-precios)** - 6 endpoints
11. **[👥 Clientes](#módulo-clientes)** - 5 endpoints
12. **[🛡️ Administradores](#módulo-administradores)** - 2 endpoints
13. **[👨‍🍳 Cocina](#módulo-cocina)** - 2 endpoints
14. **[💳 Pagos](#módulo-pagos)** - 9 endpoints
15. **[🛒 Pedidos](#módulo-pedidos)** - 1 endpoint
16. **[📱 QR](#módulo-qr)** - 2 endpoints
17. **[📅 Reservas](#módulo-reservas)** - 6 endpoints

---

## 📊 Estadísticas de la API

| Métrica | Valor |
|---------|-------|
| **Total de Endpoints** | 87 |
| **Endpoints Públicos** | 14 |
| **Endpoints Protegidos (Auth)** | 60 |
| **Endpoints Protegidos (Auth + Rol)** | 13 |
| **GET** | 41 |
| **POST** | 24 |
| **PATCH** | 18 |
| **DELETE** | 4 |

---

## 🔑 Convenciones de Seguridad

### Tipos de Protección

- **🟢 Pública**: Sin autenticación requerida
- **🔵 Autenticada**: Requiere JWT en header `Authorization: Bearer <token>`
- **🔴 Autenticada + Rol**: Requiere autenticación y un rol específico

### Roles Disponibles

- `Administrador` - Acceso completo al sistema
- `Mozo` - Gestión de mesas y pedidos
- `Cliente` - Gestión de reservas y pedidos personales
- `SectorCocina` - Gestión de cocina y sugerencias

---

## 📄 Documentación por Módulo

Ver los archivos individuales para documentación detallada:

- [AUTH_ENDPOINTS.md](AUTH_ENDPOINTS.md)
- [PRODUCTS_ENDPOINTS.md](PRODUCTS_ENDPOINTS.md)
- [NEWS_ENDPOINTS.md](NEWS_ENDPOINTS.md)
- [POLICY_ENDPOINTS.md](POLICY_ENDPOINTS.md)
- [INFORMATION_ENDPOINTS.md](INFORMATION_ENDPOINTS.md)
- [SCHEDULES_ENDPOINTS.md](SCHEDULES_ENDPOINTS.md)
- [SUGGESTIONS_ENDPOINTS.md](SUGGESTIONS_ENDPOINTS.md)
- [WAITERS_ENDPOINTS.md](WAITERS_ENDPOINTS.md)
- [TABLES_ENDPOINTS.md](TABLES_ENDPOINTS.md)
- [PRICES_ENDPOINTS.md](PRICES_ENDPOINTS.md)
- [CLIENTS_ENDPOINTS.md](CLIENTS_ENDPOINTS.md)
- [ADMIN_ENDPOINTS.md](ADMIN_ENDPOINTS.md)
- [KITCHEN_ENDPOINTS.md](KITCHEN_ENDPOINTS.md)
- [PAYMENTS_ENDPOINTS.md](PAYMENTS_ENDPOINTS.md)
- [ORDERS_ENDPOINTS.md](ORDERS_ENDPOINTS.md)
- [QR_ENDPOINTS.md](QR_ENDPOINTS.md)
- [RESERVATIONS_ENDPOINTS.md](RESERVATIONS_ENDPOINTS.md)

---

## 🚀 Inicio Rápido

### 1. Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "password123"
  }'
```

### 2. Usar Token en Requests Autenticados
```bash
curl -X GET http://localhost:3000/clientes \
  -H "Authorization: Bearer <tu_token_aqui>"
```

### 3. Refrescar Token Expirado
```bash
curl -X POST http://localhost:3000/auth/refresh \
  -H "Cookie: refreshToken=<refresh_token_aqui>"
```

---

## 💡 Ejemplos de Flujos Comunes

### Flujo de Compra (Cliente)

1. **Obtener QR** (sin autenticación)
   ```
   GET /qr?qrToken=TOKEN&mesa=1
   ```

2. **Crear Pedido** (con QR token en cookie)
   ```
   POST /pedidos
   {
     "order": {
       "items": [
         { "idProducto": 1, "cantidad": 2 }
       ]
     }
   }
   ```

3. **Generar Cuenta**
   ```
   GET /pagos/cuenta/:id
   ```

4. **Procesar Pago**
   ```
   POST /pagos/mp/:id (MercadoPago)
   POST /pagos/efectivo/:id (Efectivo)
   POST /pagos/tarjeta/:id (Tarjeta)
   ```

### Flujo de Administración

1. **Login como Admin**
   ```
   POST /auth/login
   ```

2. **Gestionar Productos**
   ```
   POST /productos (Crear)
   PATCH /productos/id/:id (Editar)
   ```

3. **Ver Reportes**
   ```
   GET /pagos/fechas (Por rango de fechas)
   GET /pagos/metodoPago/:metodo (Por método)
   ```

---

## ⚠️ Códigos de Error Comunes

| Código | Significado | Causa |
|--------|-------------|-------|
| 400 | Bad Request | Datos inválidos o incompletos |
| 401 | Unauthorized | Token inválido o expirado, sin autenticación |
| 403 | Forbidden | Usuario sin permisos para esa acción |
| 404 | Not Found | Recurso no existe |
| 500 | Server Error | Error interno del servidor |

---

## 📞 Soporte

Para más información sobre un endpoint específico, consulta el archivo de documentación de su módulo correspondiente.

**Modificado**: 24 de Febrero de 2026
