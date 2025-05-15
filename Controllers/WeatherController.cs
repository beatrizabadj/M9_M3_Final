using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;
using WeatherApp.Services;

namespace WeatherApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WeatherController : ControllerBase
    {
        private readonly IWeatherService _weatherService;
        private readonly ILogger<WeatherController> _logger;

        public WeatherController(
            IWeatherService weatherService,
            ILogger<WeatherController> logger)
        {
            _weatherService = weatherService;
            _logger = logger;
        }

        [HttpGet("current")]
        public async Task<IActionResult> GetCurrentWeather(string city)
        {
            if (string.IsNullOrEmpty(city))
            {
                return BadRequest("City parameter is required");
            }

            try
            {
                var weatherData = await _weatherService.GetCurrentWeatherAsync(city);
                return Ok(weatherData);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching current weather for {City}", city);
                return StatusCode(500, $"Error fetching weather data: {ex.Message}");
            }
        }

        [HttpGet("forecast")]
        public async Task<IActionResult> GetForecast(string city, int days = 5)
        {
            if (string.IsNullOrEmpty(city))
            {
                return BadRequest("City parameter is required");
            }

            if (days < 1 || days > 10)
            {
                return BadRequest("Days must be between 1 and 10");
            }

            try
            {
                var forecastData = await _weatherService.GetForecastAsync(city, days);
                return Ok(forecastData);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching forecast for {City}", city);
                return StatusCode(500, $"Error fetching forecast: {ex.Message}");
            }
        }
    }
}