// Models/ForecastResponse.cs
using System;
using System.Collections.Generic;

namespace WeatherApp.Models
{
    public class ForecastResponse
    {
        public required Location Location { get; set; }
        public required Forecast Forecast { get; set; }
    }

    public class Location
    {
    public required string Name { get; set; }
    public required string Country { get; set; }
    public double Lat { get; set; }  // Changed from Latitude
    public double Lon { get; set; }  // Changed from Longitude
    }

    public class Forecast
    {
        public required List<ForecastDay> Forecastday { get; set; }
    }

    public class ForecastDay
    {
        public required string Date { get; set; }
        public required Day Day { get; set; }
    }

    public class Day
    {
        public double Maxtemp_c { get; set; }
        public double Mintemp_c { get; set; }
        public double Avgtemp_c { get; set; }
        public required Condition Condition { get; set; }
    }

    public class Condition
    {
        public required string Text { get; set; }
    }
}
