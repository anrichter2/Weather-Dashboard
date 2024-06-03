//TODO: get a weather API key
// make a function that fetches the lat and log of a city and then fetches weather data based on that log and lat
// make function for displaying that weather information dynamically to the page
// make a function for making a list of previous serches appear
// add event listeners for the search button and previous searches
const weatherAPIKey = "a83f7466cca6e6eb8fab0e903c110044";
const geoCodingAPIURL = "http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}"

const cityName = document.getElementById('city-name')

function fetchWeatherData() {

    let cityName = document.getElementById('city-name')
    const geoCodingAPIURL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},{state code},{country code}&limit={limit}&appid=${weatherAPIKey}`
    const baseWeatherAPI = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${weatherAPIKey}`
    // use cnt parameter to control number of days

    fetch(geoCodingAPIURL)
        .then(function (response) {
            return response.json();
        })

        .then(function(data) {
            const latitude = data.lat
            const longitude = data.lon
        });

    fetch(baseWeatherAPI)
        .then(function(response) {
            return response.json();
        })

        .then(function(data) {
            createWeatherCards()
        })
};

function createWeatherCards() {
    let mainCardHeader = document.createElement('h3')
}
