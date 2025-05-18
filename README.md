# Weather App

## 📌 Justificación y Motivación del Proyecto

Este proyecto es una aplicación web que permite consultar el tiempo actual y la previsión meteorológica de cualquier ciudad de forma rápida e intuitiva. Útil para usuarios que necesitan información precisa para planificar actividades diarias, viajes o quedadas al aire libre. En este proyecto implementamos una arquitectura MVC en .NET Core, integramos APIs REST externas, hacemos uso de SQLite y desplegamos la aplicación en diferentes entornos.

### La aplicación permite:
- Buscar el clima actual de cualquier ciudad
- Ver pronósticos de 5 días
- Mantener un historial de búsquedas
- Gestionar (ver/eliminar) registros históricos

## 🏗️ Esquema de arquitectura

```
WeatherApp (Arquitectura MVC)
│
├── Controllers/        (Lógica de negocio)
│   ├── HomeController.cs
│   └── WeatherController.cs
│
├── Data/               (Acceso a datos)
│   └── WeatherContext.cs
│
├── Models/             (Estructuras de datos)
│   ├── WeatherData.cs
│   ├── WeatherResponse.cs
│   └── ForecastResponse.cs
│
├── Services/           (Servicios externos)
│   ├── IWeatherService.cs
│   └── WeatherService.cs
│
├── Views/              (Interfaz de usuario)
│   └── Home/Index.cshtml
│
├── wwwroot/            (Recursos estáticos)
│   ├── css/styles.css
│   └── js/script.js
│
└── Program.cs          (Configuración)

```
## 🧠 Explicación del Código (MVC)

### 1. Modelos (`Models/`)
- **WeatherData**: Representa los datos climáticos almacenados en la base de datos (ciudad, temperatura, humedad, viento, etc.)
- **WeatherResponse**: Estructura para parsear la respuesta JSON de la API (clima actual)
- **ForecastResponse**: Estructura para parsear el pronóstico extendido (5 días)

### 2. Vistas (`Views/Home/Index.cshtml`)
- Interfaz única con tres secciones dinámicas:
  - **Clima actual**: Muestra temperatura, humedad, velocidad del viento e icono descriptivo
  - **Pronóstico 5 días**: Tarjetas con temperatura promedio y condiciones
  - **Historial**: Lista interactiva de búsquedas anteriores (con botones View/Delete)
- Diseño responsive usando CSS Grid/Flexbox
- Interactividad con JavaScript puro (sin frameworks)

### 3. Controladores (`Controllers/`)
- **HomeController.cs**:
  - Maneja la página principal (Index)
  - Vista simple sin lógica compleja

- **WeatherController.cs** (API REST):
  - `GET /api/weather/current`: Obtiene clima actual (usa WeatherService)
  - `GET /api/weather/forecast`: Devuelve pronóstico 5 días
  - `GET /api/weather/history`: Lista todo el historial
  - `DELETE /api/weather/history/{id}`: Elimina registro específico

### 4. Servicios (`Services/`)
- **IWeatherService.cs** (Interfaz):
  - Define contratos para `GetCurrentWeatherAsync` y `GetForecastAsync`

- **WeatherService.cs** (Implementación):
  - Consulta WeatherAPI.com via HTTP
  - Cachea respuestas en memoria (30 mins para clima actual, 1h para pronóstico)
  - Almacena automáticamente en SQLite cada búsqueda
  - Manejo robusto de errores (API no disponible, ciudad no encontrada, etc.)

### 5. Data Access (`Data/WeatherContext.cs`)
- Configuración de Entity Framework Core para SQLite
- Define `WeatherRecords` como tabla única
- Migraciones automáticas al iniciar la aplicación

- **Tecnologías utilizadas:**
  - Lenguajes: C# para el backend y JS, HTML5 y CSS3 para el frontend
  - Frameworks: .NET Core MVC, Entity Framework Core
  - Base de datos: SQLite
  - API Externa: WeatherApi.com via HTTPClient
  - Serialización JSON: Newtonsoft.Json para las respuestas de la api

- **Funcionamiento de la aplicación:**
  - El usuario introduce una ciudad y el controlador WeatherController llama a a IWeatherController para obtener datos de la API. Los datos se guardan localmente en SQLite y se muestran en la vista mediante AJAX. 
  - Se usa IMemoryCache para evitar consultas redundantes. Los datos se actualizan cada 30 minutos (actual) o 1h (previsión).
  - Entity Framework Core gestiona las tablas WeatherRecords y las migraciones se aplican autmáticamente al iniciar la aplicación.

## 🚀 Mejoras y Nuevas Funcionalidades Propuestas

- Autenticación de Usuarios: Registrar usuarios
- Mapas interactivos para seleccionar ubicación
- Comparación climática entre ciudades
- Internacionalización (multiidioma)

## 🛠️ Requisitos Técnicos
.NET 8.0

SQLite

Cuenta en WeatherAPI.com (API key)

## ▶️ Ejecución

```bash

docker build
docker run

```

## Puesta en producción

Docker nos permite desplegar la aplicación web en distintos entornos manteniendo la misma configuración.

Mediante Railway: https://m9m3final-production.up.railway.app/