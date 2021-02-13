var day = moment().format('M/D/Y');
//var to start search
var city 
//variables for fetch results
var data
var uvi
//main weather variables
var temp
var humidity
var windspeed
var uvindex
var lon
var lat
//variables for five-day forecast
var icon
var fdate
var ftemp
var ficon
var fhumid
//var to create array of all data
var previous
var retrievedData
var old


//start search function with click of search bar
  document.querySelector('#schBtn').addEventListener('click',function (event) {
      event.preventDefault();
      city = document.querySelector("#city-search").value
      //clear search bar
      document.querySelector("#city-search").value = ""

      doSearch(city);
  })
   
//search for weather by city
async function doSearch(city){
    console.log( `search ${city} `)
    
    //run fetch to openWeather for weather info
    data = await fetch ( "https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=7cc8c49decf9f1dad6cc72eebd7c1304&units=metric").then( r=>r.json())
        console.log (`searching data for ${city}`, data)
    //save data as variables
    title = data.name
    icon = data.weather[0].icon
    temp = data.main.temp
    humidity = data.main.humidity
    windspeed = data.wind.speed * 3.6
    wsFIXED = windspeed.toFixed(1)
    lat = data.coord.lat
    lon = data.coord.lon
    
    //Use city Lat and Lon to call search for additional UV data to complete forecast
    searchUV(city)
}
//search for UV info and five-day forecast    
async function searchUV(city){
    //run fetch for UV and forecast
    uvi = await fetch ( "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&appid=7cc8c49decf9f1dad6cc72eebd7c1304").then( r=>r.json() )
    console.log( `searching uvi for ${city}`, uvi)
    for ( var i=0; i < 5; i++ ) {
    uvindex = uvi.current.uvi
    ficon = uvi.daily[i].weather[0].icon
    ftemp = uvi.daily[i].temp.day - 273
    fhumid = uvi.daily[i].humidity
    }
   
    publishResults(city) 
}

//publish results in HTML page
function publishResults(city){
    //post weather information in card  
    document.getElementById('icon1').src = `http://openweathermap.org/img/w/${uvi.daily[0].weather[0].icon}.png`
    document.getElementById('icon2').src = `http://openweathermap.org/img/w/${uvi.daily[1].weather[0].icon}.png`
    document.getElementById('icon3').src = `http://openweathermap.org/img/w/${uvi.daily[2].weather[0].icon}.png`
    document.getElementById('icon4').src = `http://openweathermap.org/img/w/${uvi.daily[3].weather[0].icon}.png`
    document.getElementById('icon5').src = `http://openweathermap.org/img/w/${uvi.daily[4].weather[0].icon}.png`

    if(`${uvindex}` > 3 ) {document.querySelector("#uvdata").style.backgroundColor = "red"}
    if(`${uvindex}` > 3 ) {document.querySelector("#uvdata").style.color = "white"}
    if(`${windspeed}` > 70 ) {document.querySelector("#speed").style.color = "red"}

    //Forecast date
    document.querySelector(`#datef1`).innerHTML = moment().add(1,'d').format('M/D/Y');
    document.querySelector(`#datef2`).innerHTML = moment().add(2,'d').format('M/D/Y');
    document.querySelector(`#datef3`).innerHTML = moment().add(3,'d').format('M/D/Y');
    document.querySelector(`#datef4`).innerHTML = moment().add(4,'d').format('M/D/Y');
    document.querySelector(`#datef5`).innerHTML = moment().add(5,'d').format('M/D/Y');
    //Forecast Icon
    document.getElementById('icon1').src = `http://openweathermap.org/img/w/${uvi.daily[0].weather[0].icon}.png`
    document.getElementById('icon2').src = `http://openweathermap.org/img/w/${uvi.daily[1].weather[0].icon}.png`
    document.getElementById('icon3').src = `http://openweathermap.org/img/w/${uvi.daily[2].weather[0].icon}.png`
    document.getElementById('icon4').src = `http://openweathermap.org/img/w/${uvi.daily[3].weather[0].icon}.png`
    document.getElementById('icon5').src = `http://openweathermap.org/img/w/${uvi.daily[4].weather[0].icon}.png`
    //Forecast 5 day temperature
    document.querySelector(`#forecasttemp1`).innerHTML  = `Temp: ${(uvi.daily[0].temp.day - 273).toFixed(1)} C`
    document.querySelector(`#forecasttemp2`).innerHTML  = `Temp: ${(uvi.daily[1].temp.day - 273).toFixed(1)} C`
    document.querySelector(`#forecasttemp3`).innerHTML  = `Temp: ${(uvi.daily[2].temp.day - 273).toFixed(1)} C`
    document.querySelector(`#forecasttemp4`).innerHTML  = `Temp: ${(uvi.daily[3].temp.day - 273).toFixed(1)} C`
    document.querySelector(`#forecasttemp5`).innerHTML  = `Temp: ${(uvi.daily[4].temp.day - 273).toFixed(1)} C`
    //Forecast 5 day humidity
    document.querySelector(`#forecasthumid1`).innerHTML  = `Humidity: ${uvi.daily[0].humidity} %`
    document.querySelector(`#forecasthumid2`).innerHTML  = `Humidity: ${uvi.daily[1].humidity} %`
    document.querySelector(`#forecasthumid3`).innerHTML  = `Humidity: ${uvi.daily[2].humidity} %`
    document.querySelector(`#forecasthumid4`).innerHTML  = `Humidity: ${uvi.daily[3].humidity} %`
    document.querySelector(`#forecasthumid5`).innerHTML  = `Humidity: ${uvi.daily[4].humidity} %`

    storePrevious(city)

}
 
function storePrevious(city) {
    //add most recently searched city to previously searched cities
    console.log(`store ${city}`)
    //add city to local storage

    let previous = JSON.parse(localStorage.getItem("previous")) || [];
    if (previous.indexOf(city) === -1) {
        previous.push(city);
        
        localStorage.setItem("previous" , JSON.stringify(previous) )

        makeRow(city)
    }    
}


function makeRow(city) { 
    
    let li = `<li class="list-group-item" id="previous"><button type="button" class="btn" id="pvsBtn" onclick="pvsSearch(this)" >${city}</li>` ; 
    document.querySelector("#addCity").innerHTML += li;
    console.log(`adding ${city} to previous`)
    // pvsSearch()     
}

function pvsSearch(el) {
    console.log("previous search activated")
    console.log(el.textContent)
    doSearch(el.textContent)

}