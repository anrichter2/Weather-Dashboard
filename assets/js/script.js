// Weather API key for OpenWeatherMap API
const weatherAPIKey = `a83f7466cca6e6eb8fab0e903c110044`;

// Element Selectors
const cityInput = document.getElementById('city-name');
const formSubmit = document.getElementById('city-input-form');
const previousSearchDiv = document.getElementById('previous-search-target');
const currentWeatherSec = document.getElementById('today-weather-card');
const forcastText = document.getElementById('forcast-text')
const futureWeatherDiv = document.getElementById('future-weather-cards');

// Function that takes the inputed city name and saves it to local storage, clears the city input, and then calls the render and fetchGeo functions
function getCityName(event) {
    event.preventDefault();
    
    let cityName = cityInput.value.trim()
    let previousSearches = JSON.parse(localStorage.getItem("searches"));

    if (previousSearches == null) {
        previousSearches = []
    };

    // if and for loops that determines how new searches are added or removed from local storage
    if (previousSearches.length == 0) {
        previousSearches.push(cityName);
        console.log('hit');
        localStorage.setItem("searches", JSON.stringify(previousSearches));
    } else {
        previousSearches.unshift(cityName);
        localStorage.setItem("searches", JSON.stringify(previousSearches));
        for (let i = 1; i < previousSearches.length; i++) {
            if (previousSearches[0] == previousSearches[i]) {
                previousSearches.splice(i, 1);
                localStorage.setItem("searches", JSON.stringify(previousSearches));
            }
        };
    };

    // Puts a limit on how many previous searches can be in local storage so that the list doesn't keep growing infinitly
    if (previousSearches.length > 5) {
        previousSearches.pop();
        localStorage.setItem("searches", JSON.stringify(previousSearches));
    };

    cityInput.value = ""

    renderPreviousSearches()
    fetchGeoData(cityName)
};

// Function for updating local storage when one of the previous search buttons are clicked
function handleButtonCity(cityName) {

    let previousSearches = JSON.parse(localStorage.getItem("searches"));

    for (let i = 1; i < previousSearches.length; i++) {
        if (cityName == previousSearches[i]) {
            previousSearches.splice(i, 1);
            previousSearches.unshift(cityName);
            localStorage.setItem("searches", JSON.stringify(previousSearches));
        };
    };

    renderPreviousSearches();
    fetchGeoData(cityName);
};

// Function that uses one openweathermap API to find the latitude and longitude location of a city the user inputs
function fetchGeoData(cityName) {

    const geoCodingAPIURL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${weatherAPIKey}`;
    
    fetch(geoCodingAPIURL)
        .then(function (geoResponse) {
            return geoResponse.json();
        })
        
        .then(function (geoData) {
            const latitude = geoData[0].lat
            const longitude = geoData[0].lon
            fetchCurrentWeatherData(latitude, longitude);
            fetchFutureWeatherData(latitude, longitude);
        })

};

// Function that uses the latitude and longitude of a city to fetch current weather data
function fetchCurrentWeatherData(latitude, longitude) {
    const baseCurrentWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherAPIKey}&units=imperial`;

    fetch(baseCurrentWeatherAPI)
        .then(function(weatherCurrentResponse) {
            return weatherCurrentResponse.json();
        })

        .then(function(weatherCurrentData) {
            createCurrentWeatherCard(weatherCurrentData);
        })
};

// Function that uses the latitude and longitude of a city to fetch future weather data
function fetchFutureWeatherData(latitude, longitude) {
            
    const baseWeatherAPI = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${weatherAPIKey}&units=imperial`;

    fetch(baseWeatherAPI)
        .then(function(weatherFutureResponse) {
            return weatherFutureResponse.json();
        })

        // This .then clears the elements from the future weather card section and the if loop selects data that is 24 hours apart so it shows data from 5 different days
        .then(function(weatherFutureData) {
            futureWeatherDiv.innerHTML = ""
            for (let i = 0; i < weatherFutureData.list.length; i++) {
                if (i == 3 || i == 11 || i == 19 || i == 27 || i == 35) {
                    console.log(weatherFutureData.list[i])
                    createFutureWeatherCards(weatherFutureData.list[i]);
                };
            };
        });

};

// Function for creating a card that displays the current weather
function createCurrentWeatherCard(weatherCurrentData) {
    // Dayjs for displaying the current date on the current weather card
    const today = dayjs();
    const todaysDate = today.format('MM/D/YYYY');

    // If loop for determining which weather icon to display based on weather data
    if (weatherCurrentData.weather[0].main == 'Clouds') {
        weatherIcon = `⛅`
    } else if (weatherCurrentData.weather[0].main == 'Clear') {
        weatherIcon = `☀`
    } else if (weatherCurrentData.weather[0].main == 'Rain') {
        weatherIcon = `☔`
    } else if (weatherCurrentData.weather[0].main == 'Snow') {
        weatherIcon = `🌨`
    } else if (weatherCurrentData.weather[0].main == 'Thunderstorm') {
        weatherIcon = `🌩`
    }

    currentWeatherSec.innerHTML = ""

    const currentCard = document.createElement('div');
    currentCard.classList.add('card');
    currentWeatherSec.appendChild(currentCard);

    const mainCardHeader = document.createElement('div');
    mainCardHeader.classList.add('card-header');
    currentCard.appendChild(mainCardHeader);

    const cityEl = document.createElement('h3');
    cityEl.classList.add('card-title');
    cityEl.textContent = weatherCurrentData.name + ` ${todaysDate}` + ` ${weatherIcon}`
    mainCardHeader.appendChild(cityEl);

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    currentCard.appendChild(cardBody);

    const tempEl = document.createElement('p');
    tempEl.classList.add('card-text');
    tempEl.textContent = `Temperature: ${weatherCurrentData.main.temp} \u2109`
    cardBody.appendChild(tempEl);

    const windEl = document.createElement('p');
    windEl.classList.add('card-text');
    windEl.textContent = `Wind speed: ${weatherCurrentData.wind.speed} MPH`
    cardBody.appendChild(windEl);

    const humidityEl = document.createElement('p');
    humidityEl.classList.add('card-text');
    humidityEl.textContent = `Humidity: ${weatherCurrentData.main.humidity}%`
    cardBody.appendChild(humidityEl);
};

// Function for creating future weather cards
function createFutureWeatherCards(weatherObject) {

    // Determines the date that the weather data is from
    const dateAndTime = weatherObject.dt_txt.split(' ');
    const dateArray = dateAndTime[0].split('-');
    const dateCorrectOrder = [dateArray[1], dateArray[2], dateArray[0]];
    const finalDate = dateCorrectOrder.join('/');

    forcastText.textContent = `5-Day Forecast`

    // If loop for determining which weather icon to display based on weather data
    if (weatherObject.weather[0].main == 'Clouds') {
        weatherIcon = `⛅`
    } else if (weatherObject.weather[0].main == 'Clear') {
        weatherIcon = `☀`
    } else if (weatherObject.weather[0].main == 'Rain') {
        weatherIcon = `☔`
    } else if (weatherObject.weather[0].main == 'Snow') {
        weatherIcon = `🌨`
    } else if (weatherObject.weather[0].main == 'Thunderstorm') {
        weatherIcon = `🌩`
    }

    const futureCard = document.createElement('div');
    futureCard.classList.add('card', 'col-2', 'text-bg-dark');
    futureWeatherDiv.appendChild(futureCard);

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    futureCard.appendChild(cardBody);

    const dateEl = document.createElement('h4');
    dateEl.classList.add('card-title');
    dateEl.textContent = finalDate;
    cardBody.appendChild(dateEl);

    const weatherIconEl = document.createElement('p');
    weatherIconEl.textContent = weatherIcon;
    cardBody.appendChild(weatherIconEl);

    const tempEl = document.createElement('p');
    tempEl.classList.add('card-text');
    tempEl.textContent = `Temp: ${weatherObject.main.temp} \u2109`
    cardBody.appendChild(tempEl);

    const windEl = document.createElement('p');
    windEl.classList.add('card-text');
    windEl.textContent = `Wind: ${weatherObject.wind.speed} MPH`
    cardBody.appendChild(windEl);

    const humidityEl = document.createElement('p');
    humidityEl.classList.add('card-text');
    humidityEl.textContent = `Humidity: ${weatherObject.main.humidity}%`
    cardBody.appendChild(humidityEl);
};

// Function for rendering buttons on the screen based of the users previous searches
function renderPreviousSearches () {
    let previousSearches = JSON.parse(localStorage.getItem("searches"));

    if (previousSearches == null) {
        previousSearches = []
    }

    previousSearchDiv.innerHTML = ""

    for (let i = 0; i < previousSearches.length; i++) {
        const buttonEl = document.createElement('button');
        buttonEl.classList.add('col-12', 'btn', 'btn-secondary', 'my-2')
        buttonEl.textContent = previousSearches[i];
        previousSearchDiv.appendChild(buttonEl);
    };
};

// initial function that runs when the webpage is first loaded
function init() {
    renderPreviousSearches();
};

init()

// Event listeners for the user submiting a city name via the form or by clicking a previous search button
formSubmit.addEventListener('submit', getCityName)

previousSearchDiv.addEventListener('click', function(event) {
    event.preventDefault()
    const element = event.target
    if (element.matches('button')) {
        cityName = element.textContent
        handleButtonCity(cityName)
    }
});
