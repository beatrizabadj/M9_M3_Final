let deleteHandlerAttached = false;

document.addEventListener('DOMContentLoaded', function () {
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

    // Add event delegation for history list clicks HERE (moved from displayWeatherHistory)
    document.getElementById('history-list').addEventListener('click', async (e) => {
        const deleteBtn = e.target.closest('.delete');
        if (deleteBtn) {
            e.stopPropagation(); // Prevent event bubbling
            const id = deleteBtn.dataset.id;
            await deleteHistoryItem(id);
            return;
        }

        const viewBtn = e.target.closest('.view');
        if (viewBtn) {
            e.stopPropagation(); // Prevent event bubbling
            const id = viewBtn.dataset.id;
            viewHistoryItem(id);
        }
    });

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

            // Refresh history list after successful search
            await loadWeatherHistory();

        } catch (error) {
            console.error('Error fetching weather data:', error);
            cityElement.textContent = 'Error loading weather';
            temperatureElement.textContent = '--°C';
            descriptionElement.textContent = 'Please try another city';
        }
    }

    // Update current weather UI
    function updateCurrentWeather(data) {
        cityElement.textContent = data.locationName;
        temperatureElement.textContent = `${Math.round(data.currentTemperature)}°C`;
        descriptionElement.textContent = data.currentCondition;
        humidityElement.textContent = `${data.currentHumidity}%`;
        windElement.textContent = data.currentWindKph ? `${Math.round(data.currentWindKph)} km/h` : "-- km/h";

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

            // Format date as short weekday
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

            forecastDayElement.innerHTML =
                `<p>${weekday}</p>
                <img src="${weatherIcons[iconKey] || weatherIcons['cloudy']}" alt="${day.day.condition.text}">
                <p>${Math.round(day.day.avgtemp_c)}°C</p>
                `;

            forecastContainer.appendChild(forecastDayElement);
        });
    }

    async function loadWeatherHistory() {
        try {
            const response = await fetch('/api/weather/history');
            if (!response.ok) {
                throw new Error(await response.text());
            }
            const history = await response.json();
            displayWeatherHistory(history);
        } catch (error) {
            console.error('Error loading weather history:', error);
        }
    }

    function displayWeatherHistory(history) {
        const historyList = document.getElementById('history-list');
        // Clear existing items AND remove old event listeners
        historyList.innerHTML = '';

        if (history.length === 0) {
            historyList.innerHTML = '<p>No weather history available</p>';
            return;
        }

        // Attach event listener ONLY if not already attached
        if (!deleteHandlerAttached) {
            historyList.addEventListener('click', handleHistoryListClick);
            deleteHandlerAttached = true;
        }

        history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.dataset.id = item.id;

            const date = new Date(item.timestamp).toLocaleString();

            historyItem.innerHTML =
                `<div class="history-info">
                    <p>${item.locationName}</p>
                    <p>${Math.round(item.currentTemperature)}°C, ${item.currentCondition}</p>
                    <p>Humidity: ${item.currentHumidity}%</p>
                    <p>${date}</p>
                </div>
                <div class="history-actions">
                    <button class="view" data-id="${item.id}">View</button>
                    <button class="delete" data-id="${item.id}">Delete</button>
                </div>
                `;

            historyList.appendChild(historyItem);
        });
    }

    // Separate click handler function
    async function handleHistoryListClick(e) {
        const deleteBtn = e.target.closest('.delete');
        if (deleteBtn) {
            e.stopPropagation();
            e.preventDefault(); // Add this to prevent any default behavior
            const id = deleteBtn.dataset.id;
            await deleteHistoryItem(id);
            return;
        }

        const viewBtn = e.target.closest('.view');
        if (viewBtn) {
            e.stopPropagation();
            e.preventDefault(); // Add this to prevent any default behavior
            const id = viewBtn.dataset.id;
            viewHistoryItem(id);
        }
    }

    async function viewHistoryItem(id) {
        try {
            // First try to get the full record from your history endpoint
            const historyResponse = await fetch('/api/weather/history');
            if (!historyResponse.ok) throw new Error('Failed to fetch history');

            const history = await historyResponse.json();
            const item = history.find(i => i.id == id); // Find the specific item

            if (!item) throw new Error('History item not found');

            // Update the UI with the historical data
            cityElement.textContent = item.locationName;
            temperatureElement.textContent = `${Math.round(item.currentTemperature)}°C`;
            descriptionElement.textContent = item.currentCondition;
            humidityElement.textContent = `${item.currentHumidity}%`;

            const date = new Date(item.timestamp);
            dateElement.textContent = date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (error) {
            console.error('Error viewing history item:', error);
            alert('Failed to load historical weather data: ' + error.message);
        }
    }

    async function deleteHistoryItem(id) {
        // Get the item element before showing confirmation
        const itemElement = document.querySelector(`.history-item[data-id="${id}"]`);

        if (!itemElement) {
            console.log('Item already removed from UI');
            return;
        }

        
    

        // Visual feedback
        itemElement.style.opacity = '0.5';
        itemElement.querySelectorAll('button').forEach(btn => {
            btn.disabled = true;
        });

        try {
            const response = await fetch(`/api/weather/history/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            // Remove from UI only after successful server response
            itemElement.remove();

        } catch (error) {
            console.error('Delete error:', error);
            alert(`Delete failed: ${error.message}`);
            // Reset UI state
            itemElement.style.opacity = '1';
            itemElement.querySelectorAll('button').forEach(btn => {
                btn.disabled = false;
            });
        }
    }

    // Call this at the end of your DOMContentLoaded event listener
    loadWeatherHistory();
});