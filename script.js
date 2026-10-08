const apiKey = "25324c8224a28a2b23fdb35ce923947e";
const baseUrl = "https://api.openweathermap.org/data/2.5";
const iconUrl = "https://openweathermap.org/img/wn/";

const cityInput = document.querySelector('#city-input');
const searchBtn = document.querySelector("#search-btn");
const cityName = document.querySelector("#city-name");
const dataTime = document.querySelector("#date-time");
const weatherIcon = document.querySelector("#weather-icon");
const temperature = document.querySelector("#temperature");
const weatherDescription = document.querySelector("#weather-description");
const feelsLike = document.querySelector("#feels-like");
const humidity = document.querySelector("#humidity");
const windSpeed = document.querySelector("#wind-speed");
const pressure = document.querySelector("#pressure");
const forecastCont = document.querySelector("#forecast-cont");

cityInput.addEventListener('keyup', function(evt){
    if (evt.key == 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            getCurrentWeather(city);
            getForecast(city);
        }
        cityInput.value = "";
    }

})

searchBtn.addEventListener('click', function(evt){
    const city = cityInput.value.trim();
    if (city) {
        getCurrentWeather(city);
        getForecast(city);
    }
})

async function getCurrentWeather(city) {
    try {
        let responce = await fetch(`${baseUrl}/weather?q=${city}&appid=${apiKey}&units=metric&lang=ru`);


        if (!responce.ok) {
            if (responce.status === 404) {
                alert("Город не найден. Проверьте название города.");
            }
            else {
                alert('Произошла ошибка при получении данных');
            }
            return;
        }

        let data = await responce.json();
        updateUI(data);
        console.log(data);
    }
    catch(error) {
        console.log('Ошибка: ' + error);
        alert('Произошла ошибка при получении данных: ' + error);

    };
    


}

async function getForecast(city) {
    try {
        let responce = await fetch(`${baseUrl}/forecast?q=${city}&appid=${apiKey}&units=metric&lang=ru`);

        if (!responce.ok) {
            return;
        }

        const data = await responce.json();
        console.log(data);
        updateForecastUI(data);
    } catch (error) {
        console.log('Ошибка: ' + error);
    }
}

function updateUI(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;

    const dataOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
    const timeOptions = { hour: '2-digit', minute: '2-digit'};

    const now = new Date();

    const formatteDate = now.toLocaleDateString('ru-Ru', dataOptions);
    const formatteTime = now.toLocaleTimeString('ru-Ru', timeOptions);

    dataTime.textContent = `${formatteDate}, ${formatteTime}`;

    // Обновление иконки погоды

    const iconCode = data.weather[0].icon;
    weatherIcon.src = `${iconUrl}${iconCode}@2x.png`;
    console.log(weatherIcon);

    // Обновление температуры
    
    temperature.textContent = `${Math.round(data.main.temp)}°С`;

    weatherDescription.textContent = data.weather[0].description;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°С`;
    humidity.textContent = `${data.main.humidity}%`
    windSpeed.textContent = `${data.wind.speed}м/c`;

    const pressureInMn = `${Math.round(data.main.pressure * 0.75)}`
    pressure.textContent = `${pressureInMn}мм`;


    
}

function updateForecastUI(data) {
    forecastCont.innerHTML = "";

    // API отдаёт прогноз каждые 3 часа; берём по одной записи на день (полдень по UTC)
    const forecasts = data.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 5);

    forecasts.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const dayName = date.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'short' });

        const forecastItem = document.createElement("div");
        forecastItem.className = 'forecast-item';
        forecastItem.innerHTML = `
            <h3>${dayName}</h3>
            <img src="${iconUrl}${forecast.weather[0].icon}@2x.png" alt="${forecast.weather[0].description}">
            <p>${Math.round(forecast.main.temp)}°С</p>
        `;
        forecastCont.appendChild(forecastItem);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    getCurrentWeather('Ставрополь');
    getForecast('Ставрополь');
})