// Data/WeatherContext.cs
using Microsoft.EntityFrameworkCore;
using WeatherApp.Models;  // Changed from WeatherApi.Models

namespace WeatherApp.Data  // Changed from WeatherApi.Data
{
    public class WeatherContext : DbContext
    {
        public WeatherContext(DbContextOptions<WeatherContext> options)
            : base(options)
        {
        }

        public DbSet<WeatherData> WeatherRecords { get; set; }
    }
}