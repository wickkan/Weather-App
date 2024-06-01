// Select elements
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city');
const weatherResult = document.getElementById('weather-result');

// API key
const apiKey = 'c6dcf531c2219dcdb638b66b8ddbf1e5';

// Event listener for search button
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getCoordinates(city);
    } else {
        weatherResult.innerHTML = '<p>Please enter a city name.</p>';
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
    try {
        const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&appid=${apiKey}&units=metric`);
        const data = await response.json();
        displayWeather(data, city);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        weatherResult.innerHTML = '<p>An error occurred while fetching weather data. Please try again later.</p>';
    }
}

// Function to display weather data
function displayWeather(data, city) {
    weatherResult.innerHTML = `
        <div>
            <h2>Weather in ${city}</h2>
            <p><strong>Temperature:</strong> ${data.current.temp} °C</p>
            <p><strong>Weather:</strong> ${data.current.weather[0].description}</p>
            <p><strong>Humidity:</strong> ${data.current.humidity} %</p>
            <p><strong>Wind Speed:</strong> ${data.current.wind_speed} m/s</p>
            <p><img src="http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png" alt="${data.current.weather[0].description} icon"></p>
        </div>
    `;
}



