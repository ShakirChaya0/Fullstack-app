# **Sistema de Gestión de Restaurantes**

Este sistema permite gestionar de forma integral la experiencia del cliente y la operativa interna de un restaurante.  
Los clientes pueden escanear un QR único por mesa para acceder al menú, realizar pedidos, pagar y ver novedades desde su dispositivo móvil.  
También pueden hacer reservas anticipadas. El personal del restaurante —mozos, cocina y administradores— cuenta con herramientas para gestionar pedidos, productos, pagos, sugerencias, disponibilidad de mesas y la relación con los clientes.  
El sistema contempla distintos roles de usuario y automatiza procesos clave, optimizando tiempos y recursos.

---

## Integrantes

- **53190** - José Sebastián Alberto Barragán Landriel  
- **53210** - Shakir Chaya  
- **53187** - Santiago Kellemberger  
- **52984** - Nicolás Mazzaglia  
- **53116** - Franco Nicolás Sussi

---

## Resumen del Proyecto

**Tipo:** Proyecto fullstack con carpetas separadas `frontend/` y `backend/`.

**Frontend:** React + TypeScript, React Query, Redux, React Router, MUI.  
**Backend:** TypeScript (Node), arquitectura por capas / DDD.  

**Ejecución en Desarrollo:** Ejecutar backend y frontend en consolas separadas.

---

## Requisitos Previos

- Node.js (16+ recomendado)  
- pnpm o npm/yarn  
- PostgreSQL + pgAdmin  
- Variables de entorno configuradas (`.env`)

---

## Instalación

Abrir PowerShell o CMD en la raíz del repo:

```bash
cd ../Fullstack-app
```

### Instalar dependencias:

```bash
cd frontend
npm install
cd ..\backend
npm install
```

---

## Base de datos (PostgreSQL) — Importante

Este proyecto usa PostgreSQL. Se recomienda instalar PostgreSQL y pgAdmin para gestión visual.  
Crear la base de datos y configurar las credenciales en `backend/.env` (o variables de entorno).

### Variables Típicas a Definir en `backend/.env`:

```
DATABASE_URL=postgres://user:pass@localhost:5432/dbname
ACCESS_TOKEN_SECRET="your_access_token_secret"
REFRESH_TOKEN_SECRET="your_refresh_token_secret"
MP_ACCESS_TOKEN="your_mp_access_token"
EMAIL_USER="yourmail@gmail.com"
EMAIL_PASS="secret_assword"
CONFIRM_EMAIL_TOKEN_SECRET="secret_token"
FRONTEND_URL="http://localhost:5173"
RESET_PASSWORD_TOKEN_SECRET="secret_token"
```

### Variables de Entorno del Frontend en `frontend/.env`:

```
VITE_BACKEND_URL="http://localhost:3000"
VITE_WEBSOCKET_BACKEND_URL="ws://localhost:3000"
```

---

## Pagos — Mercado Pago (Sandbox)

Para la sección de pago de pedidos se requiere configurar Mercado Pago en modo desarrollador.

### Pasos:

1. Crear una cuenta en [Mercado Pago Developers](https://www.mercadopago.com.ar/developers) y obtener el `access_token` (sandbox).  
2. Crear dos cuentas de prueba (sandbox): una como **vendedor/merchant** y otra como **comprador/buyer**.  
3. Usar las credenciales sandbox (`access_token`) en el backend (`backend/.env`).  
4. Probar flujos de pago con las tarjetas de prueba que Mercado Pago provee en su documentación.

### Notas sobre Mercado Pago:

- Usar **sandbox** evita movimientos reales de dinero.  
- Revisar logs del backend para respuestas de Mercado Pago durante el checkout.  
- Si se necesita **Webhook**, configurar la URL pública (ngrok u otro túnel) y setearla en el Dashboard de Mercado Pago sandbox.

---

## Ejecución en Desarrollo

### Backend:

```bash
cd backend
npm run dev
```

### Frontend:

```bash
cd frontend
npm run dev   # abre el puerto (Vite por defecto 5173)
```

---

## Nota sobre Envío de Mails / Antivirus

En entornos de desarrollo el envío de mails por SMTP puede bloquearse por el antivirus o el firewall local.  
Si experimentás problemas con el envío de correos (ver logs del backend o errores SMTP), puede ser necesario:

- Permitir la aplicación/puerto en el antivirus/firewall.  
- Temporalmente desactivar el antivirus para pruebas de envío (solo en entornos controlados).  
- Alternativa: usar servicios de sandbox/SMTP de desarrollo (Mailtrap, Ethereal).

---

## Estructura de Carpetas (Resumen)

```
frontend/
 ├── src/
 │   ├── features/ (News, Products, Login, Reservation, Payment, Profile, ...)
 │   ├── routes/
 │   ├── shared/ (hooks, components, contexts)
 │   └── store/ (redux slices)

backend/
 ├── src/
 │   ├── application/ (services, use_cases)
 │   ├── domain/ (entities, repositories, interfaces)
 │   ├── infrastructure/ (config, database, external services)
 │   ├── presentation/ (controllers, routes, middlewares)
 │   └── scripts/ (initializeApp.ts, setup)
 ├── shared/
 ├── .env
 └── package.json
```

---

## Siguientes Pasos Recomendados

- Comprobar en **pgAdmin** que las tablas y los datos precargados existen (restaurant info, admin, policies).  
- Si hay problemas con el envío de mails, revisar logs SMTP y considerar permitir la app en el antivirus o usar un servicio de mock SMTP.
