// Select elements
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city');
const weatherResult = document.getElementById('weather-result');
const toggleUnitBtn = document.getElementById('toggle-unit');

// API key
const apiKey = '68d79b585a869c640c6d9d153831afd5';

// State to track units
let isMetric = true;

// Event listener for search button
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        weatherResult.innerHTML = '<p>Loading...</p>';
        getCoordinates(city);
    } else {
        weatherResult.innerHTML = '<p>Please enter a city name.</p>';
    }
});

// Event listener for unit toggle button
toggleUnitBtn.addEventListener('click', () => {
    isMetric = !isMetric;
    toggleUnitBtn.textContent = isMetric ? 'Switch to °F' : 'Switch to °C';
    const city = cityInput.value.trim();
    if (city) {
        getCoordinates(city);
    }
});

// Function to get coordinates from city name
async function getCoordinates(city) {
    try {
        const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`);
        const data = await response.json();
        if (data.length > 0) {
            const { lat, lon } = data[0];
            getWeather(lat, lon, city);
        } else {
            weatherResult.innerHTML = '<p>City not found. Please enter a valid city name.</p>';
        }
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        weatherResult.innerHTML = '<p>An error occurred while fetching coordinates. Please try again later.</p>';
    }
}

// Function to fetch weather data using coordinates
async function getWeather(lat, lon, city) {
    const units = isMetric ? 'metric' : 'imperial';
    try {
        const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${apiKey}&units=${units}`);
        const data = await response.json();
        displayWeather(data, city);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        weatherResult.innerHTML = '<p>An error occurred while fetching weather data. Please try again later.</p>';
    }
}

// Function to display weather data
function displayWeather(data, city) {
    const tempUnit = isMetric ? '°C' : '°F';
    weatherResult.innerHTML = `
        <div>
            <h2>Weather in ${city}</h2>
            <p><strong>Temperature:</strong> ${data.current.temp} ${tempUnit}</p>
            <p><strong>Weather:</strong> ${data.current.weather[0].description}</p>
            <p><strong>Humidity:</strong> ${data.current.humidity} %</p>
            <p><strong>Wind Speed:</strong> ${data.current.wind_speed} ${isMetric ? 'm/s' : 'mph'}</p>
            <p><img src="http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png" alt="${data.current.weather[0].description} icon"></p>
            <h3>7-Day Forecast</h3>
            ${data.daily.slice(1, 8).map(day => `
                <div>
                    <p><strong>${new Date(day.dt * 1000).toDateString()}:</strong></p>
                    <p>Temp: ${day.temp.day} ${tempUnit}</p>
                    <p>Weather: ${day.weather[0].description}</p>
                    <p><img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="${day.weather[0].description} icon"></p>
                </div>
            `).join('')}
        </div>
    `;
}




