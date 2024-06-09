//TODO: get a weather API key
// make function for displaying that weather information dynamically to the page
// make a function for making a list of previous searches appear
// add event listeners for the search button and previous searches
const weatherAPIKey = `a83f7466cca6e6eb8fab0e903c110044`;

const cityInput = document.getElementById('city-name');
const formSubmit = document.getElementById('city-input-form');
const previousSearchDiv = document.getElementById('previous-search-target');
const currentWeatherSec = document.getElementById('today-weather-card');
const futureWeatherSec = document.getElementById('future-weather-cards');

function getCityName(event) {
    event.preventDefault();
    
    let cityName = cityInput.value.trim()
    let previousSearches = JSON.parse(localStorage.getItem("searches"));

    if (previousSearches == null) {
        previousSearches = []
    };

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

    if (previousSearches.length > 5) {
        previousSearches.pop();
        localStorage.setItem("searches", JSON.stringify(previousSearches));
    };

    cityInput.value = ""

    renderPreviousSearches()
    fetchGeoData(cityName)
}

function fetchGeoData(cityName) {

    const geoCodingAPIURL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${weatherAPIKey}`;
    
    fetch(geoCodingAPIURL)
        .then(function (geoResponse) {
            //console.log(geoResponse)
            return geoResponse.json();
        })
        
        .then(function (geoData) {
            //console.log(geoData)
            const latitude = geoData[0].lat
            const longitude = geoData[0].lon
            fetchCurrentWeatherData(latitude, longitude);
            fetchFutureWeatherData(latitude, longitude);
        })

};

function fetchCurrentWeatherData(latitude, longitude) {
    const baseCurrentWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherAPIKey}&units=imperial`;

    fetch(baseCurrentWeatherAPI)
        .then(function(weatherCurrentResponse) {
            return weatherCurrentResponse.json();
        })

        .then(function(weatherCurrentData) {
            //console.log(weatherCurrentData); //DELETE LATER
            createCurrentWeatherCard(weatherCurrentData);
        })
};

function fetchFutureWeatherData(latitude, longitude) {
            
    const baseWeatherAPI = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${weatherAPIKey}&units=imperial`;
    const baseFutureWeatherAPI = `api.openweathermap.org/data/2.5/forecast/daily?lat=${latitude}&lon=${longitude}&cnt={cnt}&appid=${weatherAPIKey}`;

    fetch(baseWeatherAPI)
        .then(function(weatherFutureResponse) {
            return weatherFutureResponse.json();
        })

        .then(function(weatherFutureData) {
            //console.log(weatherFutureData) //DELETE LATER
            futureWeatherSec.innerHTML = ""
            for (let i = 0; i < weatherFutureData.list.length; i++) {
                if (i == 3 || i == 11 || i == 19 || i == 27 || i == 35) {
                    createFutureWeatherCards(weatherFutureData.list[i]);
                };
            };
        });

};

function createCurrentWeatherCard(weatherCurrentData) {
    currentWeatherSec.innerHTML = ""

    const currentCard = document.createElement('div');
    currentCard.classList.add('card');
    currentWeatherSec.appendChild(currentCard);

    const mainCardHeader = document.createElement('div');
    mainCardHeader.classList.add('card-header');
    currentCard.appendChild(mainCardHeader);

    const cityEl = document.createElement('h3');
    cityEl.classList.add('card-title');
    cityEl.textContent = weatherCurrentData.name
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

function createFutureWeatherCards(weatherObject) {
    const dateAndTime = weatherObject.dt_txt.split(' ');
    const dateArray = dateAndTime[0].split('-');
    const dateCorrectOrder = [dateArray[1], dateArray[2], dateArray[0]];
    const finalDate = dateCorrectOrder.join('/');

    const futureCard = document.createElement('div');
    futureCard.classList.add('card');
    futureWeatherSec.appendChild(futureCard);

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    futureCard.appendChild(cardBody);

    const dateEl = document.createElement('h3');
    dateEl.classList.add('card-title');
    dateEl.textContent = finalDate;
    cardBody.appendChild(dateEl);

    const tempEl = document.createElement('p');
    tempEl.classList.add('card-text');
    tempEl.textContent = `Temperature: ${weatherObject.main.temp} \u2109`
    cardBody.appendChild(tempEl);

    const windEl = document.createElement('p');
    windEl.classList.add('card-text');
    windEl.textContent = `Wind speed: ${weatherObject.wind.speed} MPH`
    cardBody.appendChild(windEl);

    const humidityEl = document.createElement('p');
    humidityEl.classList.add('card-text');
    humidityEl.textContent = `Humidity: ${weatherObject.main.humidity}%`
    cardBody.appendChild(humidityEl);
};

function renderPreviousSearches () {
    let previousSearches = JSON.parse(localStorage.getItem("searches"));

    if (previousSearches == null) {
        previousSearches = []
    }

    //console.log(previousSearches)

    previousSearchDiv.innerHTML = ""

    for (let i = 0; i < previousSearches.length; i++) {
        const buttonEl = document.createElement('button');
        buttonEl.textContent = previousSearches[i];
        previousSearchDiv.appendChild(buttonEl);
    }

}

function init() {
    renderPreviousSearches();
};

init()

formSubmit.addEventListener('submit', getCityName)
