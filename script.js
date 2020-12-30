var cityEl = $("#city-date");
var iconEl = $("#image-icon");
var tempEl = $("#temprature");
var windEl = $("#wind-speed");
var humidityEl = $("#humidity-level");
var uvIndexEl = $("#UV-Index");
var searchList = $("#past-searches");
var forecastEl = $("#weather-forecast");
var pastSearches = [];
//API key 
var APIKey = "166a433c57516f51dfab1f7edaed8413";

previousSearches();

function previousSearches() {
    console.log(pastSearches);
    console.log(searchList);
    searchList.empty();
    pastSearches = JSON.parse(localStorage.getItem("pastSearches"));
    console.log(pastSearches)
    if (pastSearches === null || pastSearches === []) {
        pastSearches = [];
        console.log(pastSearches);
    } else {
        for (var i = 0; i < pastSearches.length; i++) {
            var searchButton = $("<button>");
            searchButton.text(pastSearches[i]);
            searchButton.attr("location-data", pastSearches[i])
            searchButton.attr("id", "past-search-button");
            searchButton.addClass("btn btn-primary");
            var items = $("<li>");
            items.addClass("list");
            items.append(searchButton);
            searchList.append(items);
        }
    }
}

function getWeather(location) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&units=imperial&appid=" + APIKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).done(function (response) {
        console.log(response);
        var city = response.name;
        var date = new Date(response.dt * 1000)
        var icon = response.weather[0].icon;
        var iconURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        var temp = response.main.temp;
        var humidity = response.main.humidity;
        var wind = response.wind.speed;
        var lat = response.coord.lat;
        var lon = response.coord.lon;

        console.log(city);
        console.log(date);
        var dateStr = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        cityEl.text(`${city} ${dateStr}`)
        console.log(icon);
        iconEl.empty()
        iconEl.append($("<img>").attr({
            "src": iconURL,
            "alt": "Weather icon"
        }));
        console.log(temp);
        tempEl.html(`Temperature: ${temp} &#8457;`);
        console.log(humidity);
        humidityEl.text(`Humidity: ${humidity}%`);
        console.log(wind);
        windEl.text(`Wind Speed: ${wind} MPH`);
        console.log(lat);
        console.log(lon);
        var uvQueryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon;

        $.ajax({
            url: uvQueryURL,
            method: "GET"
        }).done(function (response) {
            var uvIndex = response.value;
            console.log(uvIndex);
            uvIndexEl.text(`UV Index: ${uvIndex}`);
        })
    })
}

function forecast(location) {
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + location + "&units=imperial&appid=" + APIKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).done(function (response) {
        console.log(response);
        forecastEl.empty();

        var forecastTitle = $("<div>").addClass("card col-2").append($("<h1>").text("Weather Forecast (5 days)").addClass("card-title"));
        forecastEl.append(forecastTitle);

        var list = response.list;

        for (i = 7; i < list.length; i += 8) {
            var forecastDay = $("<div>").addClass("card col-2").attr("id", "forecast" + (i / 8));
            var date = new Date(list[i].dt * 1000)
            var dateStr = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
            var forecastDate = $("<h5>").addClass("card-title").text(dateStr);
            var icon = list[i].weather[0].icon
            var forecastIcon = $("<div>").append($("<img>").attr({
                "src": `https://openweathermap.org/img/wn/${icon}@2x.png`,
                "alt": "Weather Icon"
            }));
            var forecastTemp = $("<p>").addClass("card-text").html(`Temp: ${list[i].main.temp}`);
            var forecastH = $("<p>").addClass("card-text").text(`Humidity: ${list[i].main.humidity} %`);
            forecastDay.append(forecastDate, forecastIcon, forecastTemp, forecastH);
            forecastEl.append(forecastDay);
        }
    })
}

$("#search").on("click", function (e) {
    e.preventDefault();

    var location = $("#location").val().trim();

    getWeather(location);

    forecast(location);

    pastSearches.push(location);

    console.log(pastSearches);

    localStorage.setItem("pastSearches", JSON.stringify(pastSearches));

    previousSearches();
});

$(document).on("click", "#past-searches", function (e) {
    e.preventDefault();

    var location = $(this).attr("location-data");

    console.log(location);

    getWeather(location);

    previousSearches();
})

$("#clear").on("click", function (e) {
    e.preventDefault();

    localStorage.clear();

    previousSearches();
})