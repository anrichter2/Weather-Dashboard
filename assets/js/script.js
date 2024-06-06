//TODO: get a weather API key
// make a function that fetches the lat and log of a city and then fetches weather data based on that log and lat
// make function for displaying that weather information dynamically to the page
// make a function for making a list of previous serches appear
// add event listeners for the search button and previous searches
const weatherAPIKey = `a83f7466cca6e6eb8fab0e903c110044`;

const cityName = document.getElementById('city-name');
const formSubmit = document.getElementById('city-input-form');

function fetchGeoData() {
    
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
            const latitude = geoData.lat
            const longitude = geoData.lon
            return latitude, longitude
        })

    fetchWeatherData(latitude, longitude)
};

function fetchWeatherData(latitude, longitude) {
            
    const baseWeatherAPI = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${weatherAPIKey}`
            
    fetch(baseWeatherAPI)
        .then(function(weatherResponse) {
            return weatherResponse.json();
        })

        .then(function(weatherData) {
            createWeatherCards(weatherData)
        });

};


function createWeatherCards() {
    let mainCardHeader = document.createElement('h3')
}

formSubmit.addEventListener('submit', fetchGeoData())
