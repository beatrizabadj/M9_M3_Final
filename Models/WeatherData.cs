namespace WeatherApp.Models
{
    public class WeatherData
    {
        public int Id { get; set; }
        public string LocationName { get; set; } = string.Empty;
        public double Lat { get; set; }
        public double Lon { get; set; }
        public double CurrentTemperature { get; set; }
        public int CurrentHumidity { get; set; }
        public double CurrentWindKph { get; set; } // Add this line
        public string CurrentCondition { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}