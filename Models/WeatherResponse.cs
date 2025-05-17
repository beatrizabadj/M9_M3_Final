namespace WeatherApp.Models
{
    public class WeatherResponse
    {
        public required Location Location { get; set; }
        public required Current Current { get; set; }
    }

    public class Current
    {
        public double Temp_c { get; set; }
        public int Humidity { get; set; }
        public double Wind_kph { get; set; } // Add this line
        public required Condition Condition { get; set; }
    }
}