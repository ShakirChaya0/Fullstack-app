# 📰 Módulo: Noticias/Novedades

## Descripción General
Gestiona las noticias y novedades del restaurante. Permite crear, publicar, modificar y eliminar noticias. Solo administradores pueden gestionar, pero cualquiera puede ver noticias activas.

---

## Endpoints

### 1️⃣ GET /novedades

**Descripción**: Obtiene todas las noticias (solo administradores)

| Propiedad | Valor |
|-----------|-------|
| Método | GET |
| Ruta | `/novedades` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Administrador |

#### Query Parameters
```
?page=1&status=Publicada
```

#### ✅ Caso de Éxito (200 OK)
```json
[
  {
    "id": 1,
    "titulo": "Especial de Fin de Semana",
    "contenido": "Disfruta de un 20% de descuento en nuestros platos principales",
    "estado": "Publicada",
    "fechaInicio": "2026-02-20",
    "fechaFin": "2026-02-28"
  },
  {
    "id": 2,
    "titulo": "Nuevo Chef en la Cocina",
    "contenido": "Bienvenido nuestro nuevo chef con experiencia internacional",
    "estado": "Borrador",
    "fechaInicio": "2026-03-01",
    "fechaFin": null
  }
]
```

---

### 2️⃣ GET /novedades/title/:newsTitle

**Descripción**: Busca una noticia por título (solo administradores)

| Propiedad | Valor |
|-----------|-------|
| Método | GET |
| Ruta | `/novedades/title/:newsTitle` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Administrador |

#### ✅ Caso de Éxito (200 OK)
```json
[
  {
    "id": 1,
    "titulo": "Especial de Fin de Semana",
    "contenido": "Disfruta de un 20% de descuento",
    "estado": "Publicada",
    "fechaInicio": "2026-02-20",
    "fechaFin": "2026-02-28"
  }
]
```

#### ❌ Casos de Error

**400 - Bad Request**
```json
{
  "error": "El Titulo ingresado debe ser un string"
}
```

---

### 3️⃣ DELETE /novedades/:newsId

**Descripción**: Elimina una noticia (solo administradores)

| Propiedad | Valor |
|-----------|-------|
| Método | DELETE |
| Ruta | `/novedades/:newsId` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Administrador |

#### ✅ Caso de Éxito (204 No Content)
Sin body - Noticia eliminada

#### ❌ Casos de Error

**400 - Bad Request**
```json
{
  "error": "El ID ingresado debe ser un número"
}
```

---

### 4️⃣ POST /novedades

**Descripción**: Crea una nueva noticia

| Propiedad | Valor |
|-----------|-------|
| Método | POST |
| Ruta | `/novedades` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Administrador |

#### Request Body
```json
{
  "titulo": "Nuevo Menú Especial",
  "contenido": "Presentamos nuestro nuevo menú de temporada con platos exclusivos",
  "estado": "Publicada",
  "fechaInicio": "2026-02-25",
  "fechaFin": "2026-03-15"
}
```

#### Estados Válidos
- `Borrador` - No publicada aún
- `Publicada` - Visible para clientes

#### ✅ Caso de Éxito (201 Created)
```json
{
  "id": 3,
  "titulo": "Nuevo Menú Especial",
  "contenido": "Presentamos nuestro nuevo menú de temporada",
  "estado": "Publicada",
  "fechaInicio": "2026-02-25",
  "fechaFin": "2026-03-15"
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

### 5️⃣ PATCH /novedades/:newsId

**Descripción**: Actualiza una noticia existente

| Propiedad | Valor |
|-----------|-------|
| Método | PATCH |
| Ruta | `/novedades/:newsId` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Administrador |

#### Request Body (Todos opcionales)
```json
{
  "titulo": "Menú Especial Actualizado",
  "contenido": "Contenido actualizado",
  "estado": "Publicada",
  "fechaFin": "2026-03-20"
}
```

#### ✅ Caso de Éxito (200 OK)
```json
{
  "id": 3,
  "titulo": "Menú Especial Actualizado",
  "contenido": "Contenido actualizado",
  "estado": "Publicada",
  "fechaInicio": "2026-02-25",
  "fechaFin": "2026-03-20"
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

---

### 6️⃣ GET /novedades/actives

**Descripción**: Obtiene todas las noticias activas/publicadas (público)

| Propiedad | Valor |
|-----------|-------|
| Método | GET |
| Ruta | `/novedades/actives` |
| Autenticación | 🟢 No requerida |

#### ✅ Caso de Éxito (200 OK)
```json
[
  {
    "id": 1,
    "titulo": "Especial de Fin de Semana",
    "contenido": "Disfruta de un 20% de descuento",
    "estado": "Publicada",
    "fechaInicio": "2026-02-20",
    "fechaFin": "2026-02-28"
  }
]
```

---

## 📊 Estados de Noticia

| Estado | Descripción |
|--------|------------|
| Borrador | Noticia en preparación, no visible para clientes |
| Publicada | Visible para clientes si está dentro del rango de fechas |

---

## 📅 Vigencia de Noticias

Una noticia está visible si:
- Estado es `Publicada` AND
- Hoy >= fechaInicio AND
- fechaFin es null OR Hoy <= fechaFin

---

## 🧪 Ejemplos

```bash
# Obtener todas las noticias (como admin)
curl http://localhost:3000/novedades \
  -H "Authorization: Bearer <token>"

# Ver noticias activas (público)
curl http://localhost:3000/novedades/actives

# Buscar noticia por título (como admin)
curl "http://localhost:3000/novedades/title/Especial" \
  -H "Authorization: Bearer <token>"

# Crear noticia
curl -X POST http://localhost:3000/novedades \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Nuevo Menú",
    "contenido": "Descripción del nuevo menú",
    "estado": "Publicada",
    "fechaInicio": "2026-02-25",
    "fechaFin": "2026-03-15"
  }'

# Actualizar noticia
curl -X PATCH http://localhost:3000/novedades/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Título actualizado",
    "fechaFin": "2026-03-20"
  }'

# Eliminar noticia
curl -X DELETE http://localhost:3000/novedades/1 \
  -H "Authorization: Bearer <token>"
```

---

## 📝 Notas Importantes

1. **Acceso público**: Endpoint `/actives` es público, otros requieren admin
2. **Vigencia automática**: Las noticias se muestran/ocultan según fechas sin intervención manual
3. **Borrador**: Útil para preparar noticias antes de publicar
4. **Sin fecha fin**: null en fechaFin significa vigencia indefinida
5. **Validación de fecha**: fechaFin debe ser después de fechaInicio

---

## 🔄 Flujo Típico

```
Admin redacta noticia
   ↓
Crea como "Borrador"
   ↓
Revisa contenido
   ↓
Cambia a "Publicada" con fechas
   ↓
Sistema muestra en /actives automáticamente
   ↓
Clientes ven en la app
   ↓
Fecha fin llega
   ↓
Sistema oculta automáticamente
```

**Última actualización**: 24 de Febrero de 2026
