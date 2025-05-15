using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;
using WeatherApp.Services;
using WeatherApp.Data;
using Microsoft.EntityFrameworkCore;

namespace WeatherApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WeatherController : ControllerBase
    {
        private readonly IWeatherService _weatherService;
        private readonly ILogger<WeatherController> _logger;
        private readonly WeatherContext _context;

        public WeatherController(
            IWeatherService weatherService,
            ILogger<WeatherController> logger,
            WeatherContext context)
        {
            _weatherService = weatherService;
            _logger = logger;
            _context = context;
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

        [HttpGet("history")]
        public async Task<IActionResult> GetWeatherHistory()
        {
            try
            {
                var history = await _context.WeatherRecords
                    .OrderByDescending(w => w.Timestamp)
                    .ToListAsync();
                return Ok(history);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching weather history");
                return StatusCode(500, $"Error fetching weather history: {ex.Message}");
            }
        }

        [HttpGet("history/{id?}")]
        public async Task<IActionResult> GetWeatherHistory(int? id = null)
        {
            try
            {
                if (id.HasValue)
                {
                    // Return single record if ID is specified
                    var record = await _context.WeatherRecords.FindAsync(id);
                    if (record == null) return NotFound();
                    return Ok(record);
                }
                else
                {
                    // Return all records if no ID specified
                    var history = await _context.WeatherRecords
                        .OrderByDescending(w => w.Timestamp)
                        .ToListAsync();
                    return Ok(history);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching weather history");
                return StatusCode(500, $"Error fetching weather history: {ex.Message}");
            }
        }
    }
}