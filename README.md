# Weather App

## 📌 Justificación y Motivación del Proyecto

Este proyecto es una aplicación web que permite consultar el tiempo actual y la previsión meteorológica de cualquier ciudad de forma rápida e intuitiva. Útil para usuarios que necesitan información precisa para planificar actividades diarias, viajes o quedadas al aire libre. En este proyecto implementamos una arquitectura MVC en .NET Core, integramos APIs REST externas, hacemos uso de SQLite y desplegamos la aplicación en diferentes entornos.

### La aplicación permite:
- Buscar el clima actual de cualquier ciudad
- Ver pronósticos de 5 días
- Mantener un historial de búsquedas
- Gestionar (ver/eliminar) registros históricos

## 🏗️ Esquema de arquitectura

La aplicación sigue la arquitectura MVC:

- **Modelo:** Gestiona los datos y la lógica de negocio (clases en la carpeta `Models` y acceso a la base de datos SQLite).
- **Vista:** Interfaz de usuario, archivos `.cshtml` en la carpeta `Views` y recursos estáticos en `wwwroot`.
- **Controlador:** Gestiona las peticiones del usuario y conecta el modelo con la vista (`Controllers/HomeController.cs` y `Controllers/WeatherController.cs`).

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

- **Modelos:**  
  - WeatherData: Representa los datos climáticos almacenados en la base de datos
  - WeatherResponse: Estructura para la respuesta de la API (clima actual)
  - ForecastResponse: Estructura para el pronóstico extendido


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

docker build -t weatherapp .
docker run -p 8080:80 weatherapp

```

## Puesta en producción

Docker nos permite desplegar la aplicación web en distintos entornos manteniendo la misma configuración.

