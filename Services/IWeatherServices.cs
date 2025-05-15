using System.Threading.Tasks;
using WeatherApp.Models;

namespace WeatherApp.Services
{
    public interface IWeatherService
    {
        Task<WeatherData> GetCurrentWeatherAsync(string city);
        Task<ForecastResponse> GetForecastAsync(string city, int days = 5);
    }
}