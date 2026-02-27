# 🕐 Módulo: Horarios

## Descripción General
Gestiona los horarios de atención del restaurante. Permite ver, crear y modificar los horarios de cada día de la semana.

---

## Endpoints

### 1️⃣ GET /horarios

**Descripción**: Obtiene todos los horarios de la semana

| Propiedad | Valor |
|-----------|-------|
| Método | GET |
| Ruta | `/horarios` |
| Autenticación | 🟢 No requerida |

#### ✅ Caso de Éxito (200 OK)
```json
[
  {
    "diaSemana": 0,
    "horaApertura": "12:00:00",
    "horaCierre": "23:00:00"
  },
  {
    "diaSemana": 1,
    "horaApertura": "12:00:00",
    "horaCierre": "23:00:00"
  },
  {
    "diaSemana": 5,
    "horaApertura": "12:00:00",
    "horaCierre": "23:30:00"
  },
  {
    "diaSemana": 6,
    "horaApertura": "12:00:00",
    "horaCierre": "23:30:00"
  }
]
```

#### ❌ Casos de Error

**404 - Not Found**
```json
{
  "error": "No hay horarios cargados"
}
```

---

### 2️⃣ GET /horarios/id/:diaSemana

**Descripción**: Obtiene el horario de un día específico

| Propiedad | Valor |
|-----------|-------|
| Método | GET |
| Ruta | `/horarios/id/:diaSemana` |
| Autenticación | 🟢 No requerida |

#### Días de la Semana
```
0 = Lunes
1 = Martes
2 = Miércoles
3 = Jueves
4 = Viernes
5 = Sábado
6 = Domingo
```

#### ✅ Caso de Éxito (200 OK)
```json
{
  "diaSemana": 5,
  "horaApertura": "12:00:00",
  "horaCierre": "23:30:00"
}
```

#### ❌ Casos de Error

**400 - Bad Request**
```json
{
  "error": "El ID debe ser un número"
}
```

---

### 3️⃣ POST /horarios

**Descripción**: Crea un nuevo horario para un día

| Propiedad | Valor |
|-----------|-------|
| Método | POST |
| Ruta | `/horarios` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Administrador |

#### Request Body
```json
{
  "diaSemana": 0,
  "horaApertura": "12:00:00",
  "horaCierre": "23:00:00"
}
```

#### ✅ Caso de Éxito (201 Created)
```json
{
  "diaSemana": 0,
  "horaApertura": "12:00:00",
  "horaCierre": "23:00:00"
}
```

#### ❌ Casos de Error

**400 - Bad Request**
```json
{
  "error": "Todos los campos son obligatorios"
}
```

---

### 4️⃣ PATCH /horarios/update/:diaSemana

**Descripción**: Actualiza el horario de un día

| Propiedad | Valor |
|-----------|-------|
| Método | PATCH |
| Ruta | `/horarios/update/:diaSemana` |
| Autenticación | 🔵 Requerida |
| Rol | 🔴 Administrador |

#### Request Body
```json
{
  "horaApertura": "13:00:00",
  "horaCierre": "00:00:00"
}
```

#### ✅ Caso de Éxito (200 OK)
```json
{
  "diaSemana": 5,
  "horaApertura": "13:00:00",
  "horaCierre": "00:00:00"
}
```

#### ❌ Casos de Error

**400 - Bad Request**
```json
{
  "error": "El día de la semana es obligatorio"
}
```

---

## 📝 Formatos

| Campo | Formato |
|-------|---------|
| diaSemana | 0-6 (Lunes-Domingo) |
| horaApertura | HH:mm:ss |
| horaCierre | HH:mm:ss |

---

## 🧪 Ejemplos

```bash
# Ver todos los horarios
curl http://localhost:3000/horarios

# Ver horario de un día (sábado = 5)
curl http://localhost:3000/horarios/id/5

# Crear horario (como admin)
curl -X POST http://localhost:3000/horarios \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "diaSemana": 0,
    "horaApertura": "12:00:00",
    "horaCierre": "23:00:00"
  }'

# Actualizar horario
curl -X PATCH http://localhost:3000/horarios/update/5 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "horaApertura": "13:00:00"
  }'
```

**Última actualización**: 24 de Febrero de 2026
