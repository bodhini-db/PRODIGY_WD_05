const weatherApi = {
    key: '4eb3703790b356562054106543b748b2',
    baseUrl: 'https://api.openweathermap.org/data/2.5/weather'
};

// Function to prompt for city
function promptForCity() {
    swal("Enter City", {
        content: "input",
        button: {
            text: "Submit",
            closeModal: true,
        },
    }).then(city => {
        if (city) {
            getWeatherReport(city);
        } else {
            swal("Empty Input", "Please enter a city", "error");
        }
    });
}

// Function to fetch weather report
function getWeatherReport(city) {
    if (!city) {
        swal("Empty Input", "Please enter a city", "error");
        return;
    }
    fetch(`${weatherApi.baseUrl}?q=${city}&appid=${weatherApi.key}&units=metric`)
        .then(response => response.json())
        .then(showWeatherReport)
        .catch(error => {
            swal("Error", "Unable to fetch weather data. Please try again later.", "error");
            console.error("Error fetching weather data:", error);
        });
}

// Function to display weather report
function showWeatherReport(weather) {
    if (weather.cod === '404') {
        swal("Bad Input", "Entered city didn't match", "warning");
        reset();
        return;
    }

    let op = document.getElementById('weather-body');
    op.style.display = 'block';
    let todayDate = new Date();

    op.innerHTML =
        `<div class="location-deatils">
            <div class="city" id="city">${weather.name}, ${weather.sys.country}</div>
            <div class="date" id="date">${dateManage(todayDate)}</div>
        </div>
        <div class="weather-status">
            <div class="temp" id="temp">${Math.round(weather.main.temp)}&deg;C</div>
            <div class="weather" id="weather">${weather.weather[0]?.main || 'Unknown'} <i class="${getIconClass(weather.weather[0]?.main || '')}"></i></div>
            <div class="min-max" id="min-max">${Math.floor(weather.main.temp_min)}&deg;C (min) / ${Math.ceil(weather.main.temp_max)}&deg;C (max)</div>
            <div id="updated_on">Updated as of ${getTime(todayDate)}</div>
        </div>
        <hr>
        <div class="day-details">
            <div class="basic">Feels like ${weather.main.feels_like}&deg;C | Humidity ${weather.main.humidity}%<br> Pressure ${weather.main.pressure} mb | Wind ${weather.wind.speed} KMPH</div>
        </div>`;

    changeBg(weather.weather[0]?.main || 'Unknown');
    reset();
}

// Function to format time
function getTime(todayDate) {
    let hour = addZero(todayDate.getHours());
    let minute = addZero(todayDate.getMinutes());
    return `${hour}:${minute}`;
}

// Function to format date
function dateManage(dateArg) {
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let year = dateArg.getFullYear();
    let month = months[dateArg.getMonth()];
    let date = dateArg.getDate();
    let day = days[dateArg.getDay()];
    return `${date} ${month} (${day}), ${year}`;
}

// Function to change background based on weather status
function changeBg(status) {
    const bgMap = {
        'Clouds': 'url("images/clouds.jpg")',
        'Rain': 'url("images/rain.jpg")',
        'Clear': 'url("images/clear.jpg")',
        'Snow': 'url("images/snow.jpg")',
        'Sunny': 'url("images/sunny.jpg")',
        'Thunderstorm': 'url("images/thunderstorm.jpg")',
        'Drizzle': 'url("images/drizzle.jpg")',
        'Mist': 'url("images/mist.jpg")'
    };
    document.body.style.backgroundImage = bgMap[status] || 'url("images/bg1.png")';
}

// Function to get icon class based on weather status
function getIconClass(classarg) {
    const iconMap = {
        'Rain': 'fas fa-cloud-showers-heavy',
        'Clouds': 'fas fa-cloud',
        'Clear': 'fas fa-cloud-sun',
        'Sunny': 'fas fa-sun',
        'Snow': 'fas fa-snowflake',
        'Thunderstorm': 'fas fa-poo-storm',
        'Drizzle': 'fas fa-cloud-rain',
        'Mist': 'fas fa-smog',
        'Haze': 'fas fa-smog',
        'Fog': 'fas fa-smog'
    };
    return iconMap[classarg] || '';
}

// Function to reset the search input box
function reset() {
    searchInputBox.value = '';
}

// Function to add leading zero to a number
function addZero(num) {
    return num < 10 ? '0' + num : num;
}

// Event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    if (!sessionStorage.getItem('promptShown')) {
        promptForCity();
        sessionStorage.setItem('promptShown', 'true');
    }
});

// Event listener for search input box
let searchInputBox = document.getElementById('input-box');
searchInputBox.addEventListener('keypress', (event) => {
    if (event.keyCode === 13) {
        getWeatherReport(searchInputBox.value);
    }
});
