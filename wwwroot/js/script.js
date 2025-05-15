// wwwroot/js/script.js
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const cityElement = document.getElementById('city');
    const dateElement = document.getElementById('date');
    const temperatureElement = document.getElementById('temperature');
    const descriptionElement = document.getElementById('description');
    const weatherImg = document.getElementById('weather-img');
    const humidityElement = document.querySelector('.humidity');
    const windElement = document.querySelector('.wind');
    const forecastContainer = document.querySelector('.forecast');

    // Weather icon mapping
    const weatherIcons = {
        'sunny': 'https://cdn-icons-png.flaticon.com/512/6974/6974833.png',
        'clear': 'https://cdn-icons-png.flaticon.com/512/6974/6974833.png',
        'partly cloudy': 'https://cdn-icons-png.flaticon.com/512/3222/3222800.png',
        'cloudy': 'https://cdn-icons-png.flaticon.com/512/3313/3313888.png',
        'overcast': 'https://cdn-icons-png.flaticon.com/512/3313/3313888.png',
        'mist': 'https://cdn-icons-png.flaticon.com/512/3313/3313888.png',
        'fog': 'https://cdn-icons-png.flaticon.com/512/3313/3313888.png',
        'rain': 'https://cdn-icons-png.flaticon.com/512/3351/3351979.png',
        'drizzle': 'https://cdn-icons-png.flaticon.com/512/3351/3351979.png',
        'snow': 'https://cdn-icons-png.flaticon.com/512/6428/6428691.png',
        'thunder': 'https://cdn-icons-png.flaticon.com/512/2936/2936886.png'
    };

    // Initialize with default city
    fetchWeather('London');

    // Event listeners
    searchBtn.addEventListener('click', () => {
        const city = searchInput.value.trim();
        if (city) {
            fetchWeather(city);
        }
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const city = searchInput.value.trim();
            if (city) {
                fetchWeather(city);
            }
        }
    });

    // Fetch weather data
    async function fetchWeather(city) {
        try {
            // Show loading state
            cityElement.textContent = 'Loading...';
            temperatureElement.textContent = '--°C';
            descriptionElement.textContent = '';
            humidityElement.textContent = '--%';
            windElement.textContent = '-- km/h';

            // Fetch current weather
            const currentResponse = await fetch(`/api/weather/current?city=${encodeURIComponent(city)}`);
            if (!currentResponse.ok) {
                throw new Error(await currentResponse.text());
            }
            const currentData = await currentResponse.json();

            // Fetch forecast
            const forecastResponse = await fetch(`/api/weather/forecast?city=${encodeURIComponent(city)}&days=5`);
            if (!forecastResponse.ok) {
                throw new Error(await forecastResponse.text());
            }
            const forecastData = await forecastResponse.json();

            // Update UI with current weather
            updateCurrentWeather(currentData);
            
            // Update UI with forecast
            updateForecast(forecastData);
            
        } catch (error) {
            console.error('Error fetching weather data:', error);
            cityElement.textContent = 'Error loading weather';
            temperatureElement.textContent = '--°C';
            descriptionElement.textContent = 'Please try another city';
        }
    }

    // Update current weather UI
    function updateCurrentWeather(data) {
        cityElement.textContent = `${data.locationName}`;
        temperatureElement.textContent = `${Math.round(data.currentTemperature)}°C`;
        descriptionElement.textContent = data.currentCondition;
        humidityElement.textContent = `${data.currentHumidity}%`;
        windElement.textContent = `${Math.round(data.currentWindKph)} km/h`;

        // Update date
        const now = new Date();
        dateElement.textContent = now.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });

        // Update weather icon based on condition
        const condition = data.currentCondition.toLowerCase();
        let iconKey = 'cloudy'; // default
        
        if (condition.includes('sun') || condition.includes('clear')) {
            iconKey = 'sunny';
        } else if (condition.includes('partly')) {
            iconKey = 'partly cloudy';
        } else if (condition.includes('cloud')) {
            iconKey = 'cloudy';
        } else if (condition.includes('rain') || condition.includes('drizzle')) {
            iconKey = 'rain';
        } else if (condition.includes('snow')) {
            iconKey = 'snow';
        } else if (condition.includes('thunder') || condition.includes('storm')) {
            iconKey = 'thunder';
        }
        
        weatherImg.src = weatherIcons[iconKey] || weatherIcons['cloudy'];
    }

    // Update forecast UI
    function updateForecast(data) {
        // Clear previous forecast
        forecastContainer.innerHTML = '';
        
        // Get the next 5 days (skip today)
        const forecastDays = data.forecast.forecastday.slice(0, 5);
        
        forecastDays.forEach(day => {
            const forecastDayElement = document.createElement('div');
            forecastDayElement.className = 'forecast-day';
            
            // Format date as short weekday (e.g., "Mon")
            const date = new Date(day.date);
            const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
            
            // Get appropriate icon
            const condition = day.day.condition.text.toLowerCase();
            let iconKey = 'cloudy'; // default
            
            if (condition.includes('sun') || condition.includes('clear')) {
                iconKey = 'sunny';
            } else if (condition.includes('partly')) {
                iconKey = 'partly cloudy';
            } else if (condition.includes('cloud')) {
                iconKey = 'cloudy';
            } else if (condition.includes('rain') || condition.includes('drizzle')) {
                iconKey = 'rain';
            } else if (condition.includes('snow')) {
                iconKey = 'snow';
            } else if (condition.includes('thunder') || condition.includes('storm')) {
                iconKey = 'thunder';
            }
            
            forecastDayElement.innerHTML = `
                <p>${weekday}</p>
                <img src="${weatherIcons[iconKey] || weatherIcons['cloudy']}" alt="${day.day.condition.text}">
                <p>${Math.round(day.day.avgtemp_c)}°C</p>
            `;
            
            forecastContainer.appendChild(forecastDayElement);
        });
    }
});