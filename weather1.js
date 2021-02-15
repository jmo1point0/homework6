// GLOBAL VARIABLE
var APIkey = "675497bd2c60dc6e174c3425e9268fae";

// grab input from input element on click
document.getElementById("searchButton").onclick = function () {
    var enteredCity = document.getElementById("cityInput").value
    if (enteredCity) {
        // clearing input field
        document.getElementById("cityInput").value = ""
        searchCity(enteredCity)
    }
}

// make search cities appear underneath search bar as a list from local storage
function makeList() {
    var savedCities = JSON.parse(localStorage.getItem("cities")) || []
    for (let i = 0; i < savedCities.length; i++) {
        createList(savedCities[i])
    }
}
makeList()

// search city function
async function searchCity(city) {
    var cities = JSON.parse(localStorage.getItem("cities")) || []
    if (cities.indexOf(city) === -1) {
        cities.push(city)
        localStorage.setItem("cities", JSON.stringify(cities))
        createList(city)
    }
    // WEATHER URL 
    var urlWeather = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}&units=metric`;

    var time = moment().format('MMMM Do YYYY, h:mm:ss a');

    // fetch info for location instered
    fetch(urlWeather).then(response => response.json())
        .then(json => {
            console.log(json)
            // inserting the weather stuff into HTML
            document.getElementById("cityTitle").innerHTML = json.name
            document.getElementById("currentDate").innerHTML = "Current Date: " + `${time}`            
            document.getElementById("temperature").innerHTML = "Temperature: " + json.main.temp
            document.getElementById("humidity").innerHTML = "Humidity: " + json.main.humidity
            document.getElementById("wind").innerHTML = "Wind Speed: " + json.wind.speed
            document.getElementById("weatherIcon").src = "http://openweathermap.org/img/w/" + json.weather[0].icon + ".png"
            // lat & long --  UV index 
            var lat = json.coord.lat
            var lon = json.coord.lon
            forecast(city)
            uv(lat, lon)
        })
        .catch(err => console.log('Request failed', err))
}

// function to insert 5 day forecast
function forecast(city) {
    // 5 day forecast fetch
    var forecastURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIkey + "&units=metric";
    fetch(forecastURL).then(response => response.json())
        .then(json => {
            console.log(json)
            // reset the HTML so it does not repeat the 5 day forecast
            document.getElementById("fiveDay").innerHTML = ""
            for (let i = 0; i < json.list.length; i++) {
                if (json.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                    // card with 5 day forecast
                    let col = `
            <div class="card forecast">
            <div class="card-body">
              <h5 class="card-title">${new Date(
                        json.list[i].dt_txt
                    ).toLocaleDateString()}</h5>
              <img src='${"http://openweathermap.org/img/w/" + json.list[i].weather[0].icon + ".png"}'/>
              <p class="card-text">${"Temperature: " + json.list[i].main.temp_max +
                        " °C"}</p>
              <p class="card-text">${"Humidity: " + json.list[i].main.humidity + "%"}</p>
            </div>
          </div> `
                    document.getElementById("fiveDay").innerHTML += col
                }
        }
     })
}

// get UV index for daily forecast
function uv(lat, lon) {
    let uvURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + APIkey + "&lat=" + lat + "&lon=" + lon;
    fetch(uvURL).then(response => response.json())
        .then(json => {
            console.log(json)
            document.getElementById("uvin").innerHTML = "UV Index: " + json.value
        })
}

// create list of cities searched 
function createList(city) {
    var cityList = document.getElementById("searchedCities")
    var list = `<button>${city}</button>`
    cityList.innerHTML += list
}

// make the searched cities list clickable
document.getElementById("searchedCities").addEventListener("click", function (event) {
    if (!event.target.classList.contains("something")) {
        searchCity(event.target.textContent)
    }
})