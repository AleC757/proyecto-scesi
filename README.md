# Calculadora de BAC - Bolivia (Sistema de Reducción de Daños)

API REST desarrollada en **Node.js + Express** que calcula el nivel de alcohol en sangre (BAC - *Blood Alcohol Content*) de un usuario según el modelo de **Widmark**, generando recomendaciones de consumo responsable, ritmo de ingesta seguro, y consejos preventivos generados por IA (Groq/Llama), en el contexto legal boliviano (límite legal: 0.50 g/L).

---

## Características

- Cálculo de BAC (alcohol en sangre) basado en peso, sexo, alimentación previa y tipo de bebida.
- Registro histórico de simulaciones en base de datos SQLite.
- CRUD completo de bebidas (crear, leer, actualizar, eliminar).
- Soporte para **bebidas mezcladas**, calculando el ABV (grado alcohólico) ponderado automáticamente.
- Endpoint de estimación de tiempo para poder conducir legalmente, basado en el último registro del historial.
- Generación de consejos preventivos personalizados usando **IA generativa (Groq API - Llama 3.1)**.
- Validación de datos de entrada con **Zod**.
- Arquitectura modular (Controller → Service → Model → Routes) inspirada en el patrón de capas usado en el curso (equivalente a FastAPI, pero adaptado a Express).


## Requisitos Previos

Antes de instalar el proyecto, asegúrate de tener:

- **Node.js** `v18` o superior (recomendado v20+). Verifica con:
  ```bash
  node -v
  ```
- **npm** (viene incluido con Node.js). Verifica con:
  ```bash
  npm -v
  ```
- Una **API Key de Groq** (gratuita) para la generación de consejos con IA. Se obtiene en: https://console.groq.com/keys
- Git (para clonar el repositorio).

---

##  Instalación

### 1. Clonar el repositorio

```bash
git clone <URL_DE_TU_REPOSITORIO>
cd <nombre-del-proyecto>
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Dependencias principales utilizadas en el proyecto

Si el `package.json` no trae las dependencias (o estás iniciando el proyecto desde cero), instálalas manualmente con:

```bash
npm install express better-sqlite3 dotenv groq-sdk zod
```

| Paquete | Versión sugerida | Uso |
|---|---|---|
| `express` | ^4.x | Framework del servidor HTTP |
| `better-sqlite3` | ^11.x | Driver síncrono de SQLite |
| `dotenv` | ^16.x | Carga de variables de entorno desde `.env` |
| `groq-sdk` | ^0.x | Cliente de la API de Groq (LLM Llama 3.1 8B) |
| `zod` | ^3.x | Validación de esquemas de entrada (equivalente a Pydantic) |

---

## Ejecución

### Modo desarrollo

```bash
node server.js
```

Si tienes `nodemon` instalado (recomendado para desarrollo):

```bash
npm install -g nodemon
nodemon server.js
```

Al iniciar correctamente, deberías ver en consola:

```
Bebidas insertadas correctamente
Servidor ejecutándose en puerto 3000
```

La API quedará disponible en:
```
http://localhost:3000
```

### Verificación rápida

```bash
curl http://localhost:3000/
```
Debería responder: `Hola mundo`

---

##  Estructura de Carpetas

```
proyecto-scesi/
├── src/
│   ├── core/
│   │   ├── api.js                 # Agrupa todos los routers de los módulos
│   │   ├── config.js              # Configuración centralizada (dotenv, puerto, API keys)
│   │   ├── database.js            # Conexión a better-sqlite3 (solo conexión)
│   │   └── mapping_database.js    # Importa todos los model.js para registrar tablas
│   ├── modules/
│   │   ├── bebidas/
│   │   │   ├── controller.js
│   │   │   ├── services.js
│   │   │   ├── schemas.js         # Validaciones Zod (Create, Patch, Mezcla)
│   │   │   ├── model.js           # DDL tabla `bebidas` + seeds
│   │   │   └── routes.js
│   │   ├── calculo/
│   │   │   ├── controller.js
│   │   │   ├── services.js
│   │   │   ├── schemas.js         # Validación Zod del cálculo de BAC
│   │   │   ├── widmark.js         # Fórmulas del modelo de Widmark
│   │   │   ├── llm.js             # Integración con Groq (consejos IA)
│   │   │   └── routes.js
│   │   ├── conducir/
│   │   │   ├── controller.js
│   │   │   ├── services.js
│   │   │   └── routes.js
│   │   └── historial/
│   │       ├── controller.js
│   │       ├── services.js
│   │       ├── model.js           # DDL tabla `historial`
│   │       └── routes.js
├── Alcohol.db                     # Base de datos SQLite (se genera automáticamente)
├── server.js                      # Entry point del servidor
├── .env                           # Variables de entorno (NO subir a git)
├── .env.example                   # Plantilla de variables de entorno
├── .gitignore
├── package.json
└── README.md
```

---

## Documentación de Endpoints

### Módulo `bebidas`

| Método | Ruta | Descripción | Body |
|---|---|---|---|
| `GET` | `/bebidas` | Lista todas las bebidas registradas | — |
| `GET` | `/bebidas/:id` | Obtiene una bebida por su ID | — |
| `POST` | `/bebidas` | Crea una bebida simple | `{ nombre, graduacion, volumen_ml }` |
| `POST` | `/bebidas/mezcla` | Crea una bebida mezclando 2 o más ingredientes, calculando el ABV ponderado automáticamente | `{ nombre, ingredientes: [{ graduacion, volumen_ml }, ...] }` |
| `PATCH` | `/bebidas/:id` | Edita parcialmente una bebida (nombre, graduación y/o volumen) | `{ nombre?, graduacion?, volumen_ml? }` |
| `DELETE` | `/bebidas/:id` | Elimina una bebida y **reindexa** los IDs subsecuentes (shift hacia abajo) | — |

**Ejemplo - Crear bebida simple:**
```bash
curl -X POST http://localhost:3000/bebidas \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Vino Tinto", "graduacion": 13, "volumen_ml": 150}'
```

**Ejemplo - Crear mezcla (ej. Cuba Libre: Ron + Coca Cola):**
```bash
curl -X POST http://localhost:3000/bebidas/mezcla \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Cuba Libre",
    "ingredientes": [
      { "graduacion": 37.5, "volumen_ml": 50 },
      { "graduacion": 0, "volumen_ml": 200 }
    ]
  }'
```

**Ejemplo - Editar bebida (PATCH parcial):**
```bash
curl -X PATCH http://localhost:3000/bebidas/3 \
  -H "Content-Type: application/json" \
  -d '{"volumen_ml": 500}'
```

**Ejemplo - Eliminar bebida:**
```bash
curl -X DELETE http://localhost:3000/bebidas/5
```

---

###  Módulo `calculo`

| Método | Ruta | Descripción | Body |
|---|---|---|---|
| `POST` | `/calcular` | Calcula el BAC estimado, el ritmo seguro de consumo y genera un consejo con IA. Guarda el resultado en el historial. | `{ peso, sexo, comio_antes, horasEvento, vasos_planificados, bebida_id }` |

**Ejemplo:**
```bash
curl -X POST http://localhost:3000/calcular \
  -H "Content-Type: application/json" \
  -d '{
    "peso": 70,
    "sexo": "M",
    "comio_antes": "SI",
    "horasEvento": 4,
    "vasos_planificados": 3,
    "bebida_id": 1
  }'
```

**Respuesta esperada (ejemplo):**
```json
{
  "bebida": "Paceña",
  "plan_usuario": {
    "vasos_planificados": 3,
    "plan_es_seguro": true,
    "vasos_maximos_recomendados": 5
  },
  "estrategia_ritmo": {
    "minutos_entre_vasos": 45,
    "descripcion": "Toma un vaso cada 45 minutos para metabolizar correctamente"
  },
  "simulacion_plan": {
    "bac_pico_estimado": 0.335,
    "bac_estimado_final": 0,
    "horas_totales_para_sobriedad": 4,
    "bajo_limite_legal": true
  },
  "consejo": "Toma con calma, como buen cochabambino: hidrátate entre trago y trago..."
}
```

---

###  Módulo `conducir`

| Método | Ruta | Descripción | Body |
|---|---|---|---|
| `GET` | `/tiempo-para-conducir` | Calcula cuánto tiempo falta para poder conducir legalmente, tomando el **último registro** del historial | — |

**Ejemplo:**
```bash
curl http://localhost:3000/tiempo-para-conducir
```

**Respuesta esperada:**
```json
{
  "bac_actual": 0.65,
  "puede_conducir": false,
  "horas_necesarias": 1.0,
  "mensaje": "Debes esperar 1.00 horas antes de conducir legalmente en Bolivia"
}
```

Si no hay registros en el historial, responde `404`:
```json
{ "error": "no hay registros en el historial" }
```

---

###  Módulo `historial`

| Método | Ruta | Descripción | Body |
|---|---|---|---|
| `GET` | `/historial` | Lista todos los cálculos realizados, ordenados del más reciente al más antiguo | — |

**Ejemplo:**
```bash
curl http://localhost:3000/historial
```

---

##  Modelo de Cálculo (Fórmula de Widmark)

El cálculo del BAC se basa en la **fórmula de Widmark**, ampliamente utilizada en toxicología forense para estimar la concentración de alcohol en sangre:

```
BAC = (gramos_de_alcohol × factor_comida) / (peso_kg × r)
```

Donde:
- **gramos_de_alcohol** = `volumen_ml × (graduación / 100) × 0.789` (0.789 g/ml es la densidad del etanol puro)
- **r** = constante de distribución corporal del agua: `0.68` para hombres, `0.55` para mujeres
- **factor_comida** = `0.70` si comió antes (reduce la absorción), `1` si no comió

La **tasa de metabolización** utilizada es de `0.15 ‰/hora` (gramos de alcohol por litro de sangre eliminados por hora), un valor promedio estándar utilizado en estos modelos.

**Límite legal en Bolivia:** `0.50 g/L` (0.50 ‰).

> **Disclaimer:** Este modelo es una **simplificación estadística** con fines educativos y de concientización. No reemplaza una prueba real de alcoholemia (alcoholímetro) ni debe usarse como única referencia para decidir si es seguro conducir.

---

## Base de Datos

El proyecto utiliza **SQLite** a través de `better-sqlite3` (driver síncrono, sin ORM). El archivo de base de datos (`Alcohol.db`) se genera automáticamente en la raíz del proyecto la primera vez que se ejecuta `server.js`.

### Tabla `bebidas`

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | INTEGER (PK, autoincrement) | Identificador único |
| `nombre` | TEXT | Nombre de la bebida |
| `graduacion` | REAL | Grado alcohólico (% ABV) |
| `volumen_ml` | INTEGER | Volumen en mililitros |

**Bebidas precargadas (seeds):** Paceña, Singani, Fernet, Chicha, Sucumbé, Four Loko.

### Tabla `historial`

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | INTEGER (PK, autoincrement) | Identificador único |
| `peso` | REAL | Peso del usuario (kg) |
| `sexo` | TEXT | `M` o `F` |
| `comio_antes` | TEXT | `SI` o `NO` |
| `horas_evento` | REAL | Duración del evento en horas |
| `bebida_nombre` | TEXT | Nombre de la bebida consumida |
| `vasos_planificados` | INTEGER | Cantidad de vasos planeados |
| `bac_final` | REAL | BAC estimado al finalizar el evento |
| `plan_es_seguro` | INTEGER (0/1) | Si el plan respeta el límite legal |
| `fecha` | TEXT | Fecha/hora del registro (auto) |

> Las tablas se crean automáticamente mediante `src/core/mapping_database.js`, que importa cada `model.js` de los módulos `bebidas` e `historial`, replicando el patrón de registro centralizado usado por el profesor (`mapping_database.py`).
