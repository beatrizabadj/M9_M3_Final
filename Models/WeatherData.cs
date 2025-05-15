namespace WeatherApp.Models
{
    public class WeatherData
    {
        public int Id { get; set; } // Primary key for database storage
        public string LocationName { get; set; } = string.Empty;
        public double Lat { get; set; } // Latitude
        public double Lon { get; set; } // Longitude
        public double CurrentTemperature { get; set; }
        public int CurrentHumidity { get; set; }
        public string CurrentCondition { get; set; } = string.Empty;
        public DateTime RetrievedAt { get; set; } = DateTime.UtcNow; // Timestamp for when the data was retrieved
        public DateTime Timestamp { get; internal set; }
    }
}
