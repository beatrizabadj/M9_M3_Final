using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using System;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using WeatherApp.Data;
using WeatherApp.Models;

namespace WeatherApp.Services
{
    public class WeatherService : IWeatherService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IMemoryCache _memoryCache;
        private readonly WeatherApp.Data.WeatherContext _context;
        private readonly string _apiKey;
        private readonly JsonSerializerOptions _jsonOptions;

        public WeatherService(
            IHttpClientFactory httpClientFactory,
            IMemoryCache memoryCache,
            IConfiguration configuration,
            WeatherApp.Data.WeatherContext context)
        {
            _httpClientFactory = httpClientFactory ?? throw new ArgumentNullException(nameof(httpClientFactory));
            _memoryCache = memoryCache ?? throw new ArgumentNullException(nameof(memoryCache));
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _apiKey = configuration["WeatherApi:ApiKey"]
                ?? throw new InvalidOperationException("Weather API key not found in configuration");

            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };
        }

        public async Task<WeatherData> GetCurrentWeatherAsync(string city)
        {
            if (string.IsNullOrWhiteSpace(city))
            {
                throw new ArgumentException("City name cannot be empty", nameof(city));
            }

            string cacheKey = $"current_weather_{city.ToLowerInvariant()}";

            // Using non-nullable version of TryGetValue
            if (_memoryCache.TryGetValue<WeatherData>(cacheKey, out var cachedData) && cachedData != null)
            {
                return cachedData;
            }

            try
            {
                var client = _httpClientFactory.CreateClient("WeatherAPI");
                var response = await client.GetAsync($"current.json?key={_apiKey}&q={Uri.EscapeDataString(city)}&aqi=no");

                response.EnsureSuccessStatusCode();

                var content = await response.Content.ReadAsStringAsync();
                var apiResponse = JsonSerializer.Deserialize<WeatherResponse>(content, _jsonOptions);

                if (apiResponse == null)
                {
                    throw new InvalidOperationException("Failed to deserialize weather response");
                }

                if (apiResponse?.Location == null || apiResponse.Current == null || apiResponse.Current.Condition == null)
                {
                    throw new InvalidOperationException("API returned incomplete or null response");
                }

                var weatherData = new WeatherData
                {
                    LocationName = apiResponse.Location.Name ?? string.Empty,
                    Lat = apiResponse.Location.Lat,
                    Lon = apiResponse.Location.Lon,
                    CurrentTemperature = apiResponse.Current.Temp_c,
                    CurrentHumidity = apiResponse.Current.Humidity,
                    CurrentCondition = apiResponse.Current.Condition?.Text ?? "Unknown",
                    Timestamp = DateTime.UtcNow
                };

                // Save to database
                _context.WeatherRecords.Add(weatherData);
                await _context.SaveChangesAsync();

                // Cache for 30 minutes
                _memoryCache.Set(cacheKey, weatherData, TimeSpan.FromMinutes(30));

                return weatherData;
            }
            catch (HttpRequestException ex)
            {
                throw new ApplicationException($"Weather API request failed for '{city}': {ex.Message}", ex);
            }
            catch (JsonException ex)
            {
                throw new ApplicationException($"Failed to parse weather data for '{city}': {ex.Message}", ex);
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"Failed to get weather for '{city}': {ex.Message}", ex);
            }
        }

        public async Task<ForecastResponse> GetForecastAsync(string city, int days = 5)
        {
            if (string.IsNullOrWhiteSpace(city))
            {
                throw new ArgumentException("City name cannot be empty", nameof(city));
            }

            if (days < 1 || days > 10)
            {
                throw new ArgumentOutOfRangeException(nameof(days), "Forecast days must be between 1 and 10");
            }

            string cacheKey = $"forecast_{city.ToLowerInvariant()}_{days}";

            // Using non-nullable version of TryGetValue
            if (_memoryCache.TryGetValue<ForecastResponse>(cacheKey, out var cachedData) && cachedData != null)
            {
                return cachedData;
            }

            try
            {
                var client = _httpClientFactory.CreateClient("WeatherAPI");
                var response = await client.GetAsync($"forecast.json?key={_apiKey}&q={Uri.EscapeDataString(city)}&days={days}&aqi=no");

                response.EnsureSuccessStatusCode();

                var content = await response.Content.ReadAsStringAsync();
                var forecastData = JsonSerializer.Deserialize<ForecastResponse>(content, _jsonOptions);

                if (forecastData == null)
                {
                    throw new InvalidOperationException("Failed to deserialize forecast response");
                }

                if (forecastData?.Location == null || forecastData.Forecast == null)
                {
                    throw new InvalidOperationException("API returned incomplete or null forecast data");
                }

                // Cache for 1 hour
                _memoryCache.Set(cacheKey, forecastData, TimeSpan.FromHours(1));

                return forecastData;
            }
            catch (HttpRequestException ex)
            {
                throw new ApplicationException($"Weather API forecast request failed for '{city}': {ex.Message}", ex);
            }
            catch (JsonException ex)
            {
                throw new ApplicationException($"Failed to parse forecast data for '{city}': {ex.Message}", ex);
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"Failed to get forecast for '{city}': {ex.Message}", ex);
            }
        }
    }
}