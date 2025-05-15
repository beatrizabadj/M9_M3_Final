document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const cityElement = document.getElementById('city');
    const dateElement = document.getElementById('date');
    const tempElement = document.getElementById('temperature');
    const descElement = document.getElementById('description');
    const weatherImg = document.getElementById('weather-img');
    const humidityElement = document.querySelector('.humidity');
    const windElement = document.querySelector('.wind');
    
    // Set current date
    const today = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    dateElement.textContent = today.toLocaleDateString('en-US', options);
    
    // Search functionality
    searchBtn.addEventListener('click', function() {
        searchWeather();
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchWeather();
        }
    });
    
    function searchWeather() {
        const city = searchInput.value.trim();
        
        if (city === '') {
            alert('Please enter a city name');
            return;
        }
        
        // Show loading state
        cityElement.textContent = 'Loading...';
        tempElement.textContent = '--°C';
        descElement.textContent = '';
        
        // Fetch current weather data
        fetch(`/api/weather/current?city=${encodeURIComponent(city)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Weather data not found');
                }
                return response.json();
            })
            .then(data => {
                updateCurrentWeather(data);
                
                // After getting current weather, fetch forecast
                return fetch(`/api/weather/forecast?city=${encodeURIComponent(city)}`);
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Forecast data not found');
                }
                return response.json();
            })
            .then(data => {
                updateForecast(data);
            })
            .catch(error => {
                alert(`Error: ${error.message}`);
                console.error('Error:', error);
            });
        
        searchInput.value = '';
    }
    
    function updateCurrentWeather(data) {
        // Update current weather
        cityElement.textContent = `${data.location.name}, ${data.location.country}`;
        tempElement.textContent = `${Math.round(data.current.temp_c)}°C`;
        descElement.textContent = data.current.condition.text;
        
        // Update weather icon - convert from WeatherAPI format to our icon format
        const iconUrl = getIconUrl(data.current.condition.text.toLowerCase());
        weatherImg.src = iconUrl;
        
        humidityElement.textContent = `${data.current.humidity}%`;
        windElement.textContent = `${Math.round(data.current.wind_kph)} km/h`;
        
        // Change background based on weather
        updateBackground(data.current.condition.text.toLowerCase());
    }
    
    function updateForecast(data) {
        // Update forecast
        const forecastDays = document.querySelectorAll('.forecast-day');
        const forecast = data.forecast.forecastday;
        
        forecast.forEach((day, index) => {
            if (index < 5 && forecastDays[index]) {
                const date = new Date(day.date);
                const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
                
                forecastDays[index].querySelector('p:first-child').textContent = dayOfWeek;
                
                const iconUrl = getIconUrl(day.day.condition.text.toLowerCase());
                forecastDays[index].querySelector('img').src = iconUrl;
                
                forecastDays[index].querySelector('p:last-child').textContent = 
                    `${Math.round(day.day.maxtemp_c)}°C`;
            }
        });
    }
    
    function getIconUrl(condition) {
        // Map WeatherAPI condition text to our icon URLs
        if (condition.includes('sunny') || condition.includes('clear')) {
            return 'https://cdn-icons-png.flaticon.com/512/6974/6974833.png';
        } else if (condition.includes('partly cloudy')) {
            return 'https://cdn-icons-png.flaticon.com/512/3222/3222800.png';
        } else if (condition.includes('cloudy') || condition.includes('overcast')) {
            return 'https://cdn-icons-png.flaticon.com/512/3313/3313888.png';
        } else if (condition.includes('rain') || condition.includes('drizzle')) {
            return 'https://cdn-icons-png.flaticon.com/512/3351/3351979.png';
        } else if (condition.includes('snow') || condition.includes('sleet')) {
            return 'https://cdn-icons-png.flaticon.com/512/642/642102.png';
        } else if (condition.includes('fog') || condition.includes('mist')) {
            return 'https://cdn-icons-png.flaticon.com/512/4005/4005901.png';
        } else if (condition.includes('thunder') || condition.includes('storm')) {
            return 'https://cdn-icons-png.flaticon.com/512/1146/1146869.png';
        } else {
            return 'https://cdn-icons-png.flaticon.com/512/6974/6974833.png';
        }
    }
    
    function updateBackground(weather) {
        let gradient;
        
        if (weather.includes('sunny') || weather.includes('clear')) {
            gradient = 'linear-gradient(135deg, #FF9500, #FF5E3A)';
        } else if (weather.includes('cloudy') || weather.includes('overcast')) {
            gradient = 'linear-gradient(135deg, #7F8C8D, #ACBAC1)';
        } else if (weather.includes('rain') || weather.includes('drizzle')) {
            gradient = 'linear-gradient(135deg, #3498DB, #2C3E50)';
        } else if (weather.includes('snow') || weather.includes('sleet')) {
            gradient = 'linear-gradient(135deg, #E4E5E6, #00416A)';
        } else if (weather.includes('fog') || weather.includes('mist')) {
            gradient = 'linear-gradient(135deg, #B6B6B6, #5D6D7E)';
        } else if (weather.includes('thunder') || weather.includes('storm')) {
            gradient = 'linear-gradient(135deg, #4B79A1, #283E51)';
        } else {
            gradient = 'linear-gradient(135deg, #67B26F, #4ca2cd)';
        }
        
        document.body.style.background = gradient;
    }
    
    // Initialize with default city (London)
    searchInput.value = 'London';
    searchWeather();
});