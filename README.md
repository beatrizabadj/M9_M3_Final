# Weather App

## Justificación y motivación del proyecto

Este proyecto es una aplicación web que permite consultar el tiempo actual y la previsión meteorológica de cualquier ciudad.

## Esquema de arquitectura

La aplicación sigue la arquitectura MVC:

- **Modelo:** Gestiona los datos y la lógica de negocio (clases en la carpeta `Models` y acceso a la base de datos SQLite).
- **Vista:** Interfaz de usuario, archivos `.cshtml` en la carpeta `Views` y recursos estáticos en `wwwroot`.
- **Controlador:** Gestiona las peticiones del usuario y conecta el modelo con la vista (`Controllers/HomeController.cs` y `Controllers/WeatherController.cs`).

```
[Usuario] ⇄ [Vista] ⇄ [Controlador] ⇄ [Modelo] ⇄ [Base de datos/API]
```

## Explicación detallada del código desarrollado según la arquitectura MVC

- **Modelos:**  
  - [`WeatherData`](Models/WeatherData.cs): Representa los datos meteorológicos almacenados en la base de datos.
  - [`ForecastResponse`](Models/ForecastResponse.cs) y [`WeatherResponse`](Models/WeatherResponse.cs): Modelan la respuesta de la API externa del tiempo.

- **Controladores:**  
  - [`HomeController`](Controllers/HomeController.cs): Muestra la página principal.
  - [`WeatherController`](Controllers/WeatherController.cs): Expone endpoints API para obtener el tiempo actual y la previsión, usando [`IWeatherService`](Services/IWeatherServices.cs).

- **Vistas:**  
  - [`Views/Home/Index.cshtml`](Views/Home/Index.cshtml): Página principal con el buscador y la visualización del tiempo.
  - [`Views/Shared/_Layout.cshtml`](Views/Shared/_Layout.cshtml): Plantilla base para las vistas.

- **Servicios:**  
  - [`WeatherService`](Services/WeatherServices.cs): Lógica para consumir la API externa y gestionar la caché y la base de datos.

- **Base de datos:**  
  - [`WeatherContext`](Data/WeatherContext.cs): Contexto de Entity Framework para guardar consultas meteorológicas en SQLite.

- **Recursos estáticos:**  
  - CSS en [`wwwroot/css/styles.css`](wwwroot/css/styles.css) y JS en [`wwwroot/js/script.js`](wwwroot/js/script.js).

## Propuestas de mejora y nuevas funcionalidades

- Permitir buscar el tiempo por coordenadas GPS.
- Añadir gráficos de evolución del tiempo.
- Guardar el historial de búsquedas del usuario.
- Permitir seleccionar el idioma de la interfaz.
- Añadir autenticación de usuarios para guardar ciudades favoritas.
- Mejorar el diseño responsive y accesibilidad.
