//TODO: get a weather API key
// make a function that fetches the lat and log of a city and then fetches weather data based on that log and lat
// make function for displaying that weather information dynamically to the page
// make a function for making a list of previous serches appear
// add event listeners for the search button and previous searches
const weatherAPIKey = `a83f7466cca6e6eb8fab0e903c110044`;

const cityName = document.getElementById('city-name');
const formSubmit = document.getElementById('city-input-form');
const currentWeatherSec = document.getElementById('today-weather-card');
const futureWeatherSec = document.getElementById('future-weather-cards');

function fetchGeoData(event) {
    event.preventDefault();
    
    let cityName = document.getElementById('city-name').value
    const geoCodingAPIURL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${weatherAPIKey}`;
    //const geoCodingAPIURL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},{state code},{country code}&limit={limit}&appid=${weatherAPIKey}`
    // use cnt parameter to control number of days
    // can either just take the first value because it's based on popularity or I can add more input values to make it more complicated
    // I can limit the number of previous results but Stephen says that I should leave a comment with my submition about the fact that I am limiting it for the grader
    
    fetch(geoCodingAPIURL)
        .then(function (geoResponse) {
            console.log(geoResponse)
            return geoResponse.json();
        })
        
        .then(function (geoData) {
            console.log(geoData)
            const latitude = geoData[0].lat
            console.log(latitude) //Delete when done
            const longitude = geoData[0].lon
            console.log(longitude) //Delete when done
            fetchCurrentWeatherData(latitude, longitude);
            fetchFutureWeatherData(latitude, longitude);
            return latitude, longitude
        })

};

function fetchCurrentWeatherData(latitude, longitude) {
    const baseCurrentWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherAPIKey}&units=imperial`;

    fetch(baseCurrentWeatherAPI)
        .then(function(weatherCurrentResponse) {
            return weatherCurrentResponse.json();
        })

        .then(function(weatherCurrentData) {
            console.log(weatherCurrentData);
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
            console.log(weatherFutureData)
            for (let i = 0; i < weatherFutureData.list.length; i++) {
                if (i == 3 || 11 || 19 || 27 || 35) {
                    console.log(weatherFutureData.list[i]);
                    createFutureWeatherCards(weatherFutureData.list[i]);
                };
            };
        });

};

function createCurrentWeatherCard(weatherCurrentData) {
    //console.log(weatherCurrentData)
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
    console.log(finalDate); // DELETE when done

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

formSubmit.addEventListener('submit', fetchGeoData)
