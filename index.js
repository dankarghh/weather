const input = document.querySelector("input");
const searchBtn = document.querySelector("button");
const display = document.querySelector(".display");
const displayLocation = document.querySelector(".location");
const displayTemp = document.querySelector(".main-temp");
const displayDetails = document.querySelector(".details");
const displayWeather = document.querySelector(".weather");
const displayIcon = document.querySelector(".icon");
const img = document.querySelector("img");
const errorMsg = document.querySelector(".error-container");
const forecastContainer = document.querySelector(".forecast-container");
const displayDate = document.querySelector(".date-main");
const form = document.querySelector("form");
const app = document.querySelector(".app");
const unitsC = document.querySelector(".units-c");
const unitsF = document.querySelector(".units-f");
let activeUnits = unitsC;
let searchQuery = "";

//add listeners to units buttons so user can change units

unitsF.addEventListener("click", e => {
  if (activeUnits === unitsC) {
    unitsF.classList.toggle("active-units");
    unitsC.classList.toggle("active-units");
    activeUnits = unitsF;
    getData();
  }
});

unitsC.addEventListener("click", e => {
  if (activeUnits === unitsF) {
    unitsF.classList.toggle("active-units");
    unitsC.classList.toggle("active-units");
    activeUnits = unitsC;
    getData();
  }
});

//initial api call to retrieve data
async function getData() {
  // searchQuery = input.value;

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&APPID=5d9558c98745f247d03ba46363f4043c&units=metric`,
      { mode: "cors" }
    );
    const weatherData = await response.json();
    console.log(weatherData);
    errorMsg.textContent = "";
    input.classList.remove("error");

    filterData(weatherData);
  } catch (err) {
    errorMsg.textContent = "^ Please enter valid city name";
    input.classList.add("error");
  }
}

//event listener on form
form.addEventListener("submit", e => {
  e.preventDefault();
  searchQuery = input.value;
  getData();
  input.value = "";
});

//function to take returned data and filter only whats needed and return new object

function filterData(weatherData) {
  let filteredData = {
    dt: weatherData.dt + weatherData.timezone,
    lon: weatherData.coord.lon,
    lat: weatherData.coord.lat,
    min: weatherData.main.temp_min,
    max: weatherData.main.temp_max,
    city: weatherData.name,
    country: weatherData.sys.country,
    weather: weatherData.weather[0].description,
    temp: weatherData.main.temp,
    tempF: weatherData.main.temp * (9 / 5) + 32,
    humidity: weatherData.main.humidity,
    feelsLike: weatherData.main.feels_like,
    feelsLikeF: weatherData.main.feels_like * (9 / 5) + 32,
    icon: weatherData.weather[0].icon,
  };
  render(filteredData);
  getForecast(filteredData);

  console.log(filteredData);
}

//renders display using filtered data

function render(filteredData) {
  app.classList.remove("hidden");
  displayLocation.textContent = `${filteredData.city}, ${filteredData.country}`;
  displayWeather.textContent = filteredData.weather;
  displayDate.textContent = new Date(filteredData.dt * 1000).toUTCString();

  img.src = `http://openweathermap.org/img/wn/${filteredData.icon}@2x.png`;

  if (activeUnits === unitsC) {
    displayTemp.textContent = Math.round(filteredData.temp) + "°C";
    displayDetails.textContent =
      "humidity: " +
      Math.round(filteredData.humidity) +
      "% | " +
      "feels like " +
      Math.round(filteredData.feelsLike) +
      "°C";
  } else {
    displayTemp.textContent =
      Math.round(convertUnitsToF(Math.round(filteredData.temp))) + "°F";
    displayDetails.textContent =
      "humidity: " +
      Math.round(filteredData.humidity) +
      "% | " +
      "feels like " +
      Math.round(convertUnitsToF(Math.round(filteredData.feelsLike))) +
      "°F";
  }
}

//seperate function to get forecast data as needs additional inputs long and lat that aren't requested in original api call
async function getForecast(filteredData) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${filteredData.lat}&lon=${filteredData.lon}&exclude=current,minutely,hourly,alerts&units=metric&appid=5d9558c98745f247d03ba46363f4043c`,
      { mode: "cors" }
    );
    const forecast = await response.json();
    filterForecast(forecast);
  } catch (err) {
    console.log(err);
  }
}

//filter forecast data and return array of objects corresponding to days of week
function filterForecast(forecast) {
  let filteredForecast = [
    {
      min: Math.round(forecast.daily[0].temp.min),
      max: Math.round(forecast.daily[0].temp.max),
      icon: forecast.daily[0].weather[0].icon,
      dayOf: forecast.daily[0].dt + forecast.timezone_offset,
    },
    {
      min: Math.round(forecast.daily[1].temp.min),
      max: Math.round(forecast.daily[1].temp.max),
      icon: forecast.daily[1].weather[0].icon,
      dayOf: forecast.daily[1].dt + forecast.timezone_offset,
    },
    {
      min: Math.round(forecast.daily[2].temp.min),
      max: Math.round(forecast.daily[2].temp.max),
      icon: forecast.daily[2].weather[0].icon,
      dayOf: forecast.daily[2].dt + forecast.timezone_offset,
    },
    {
      min: Math.round(forecast.daily[3].temp.min),
      max: Math.round(forecast.daily[3].temp.max),
      icon: forecast.daily[3].weather[0].icon,
      dayOf: forecast.daily[3].dt + forecast.timezone_offset,
    },
    {
      min: Math.round(forecast.daily[4].temp.min),
      max: Math.round(forecast.daily[4].temp.max),
      icon: forecast.daily[4].weather[0].icon,
      dayOf: forecast.daily[4].dt + forecast.timezone_offset,
    },
    {
      min: Math.round(forecast.daily[5].temp.min),
      max: Math.round(forecast.daily[5].temp.max),
      icon: forecast.daily[5].weather[0].icon,
      dayOf: forecast.daily[5].dt + forecast.timezone_offset,
    },
    {
      min: Math.round(forecast.daily[6].temp.min),
      max: Math.round(forecast.daily[6].temp.max),
      icon: forecast.daily[6].weather[0].icon,
      dayOf: forecast.daily[6].dt + forecast.timezone_offset,
    },
    {
      min: Math.round(forecast.daily[7].temp.min),
      max: Math.round(forecast.daily[7].temp.max),
      icon: forecast.daily[7].weather[0].icon,
      dayOf: forecast.daily[7].dt + forecast.timezone_offset,
    },
  ];
  renderForecast(filteredForecast);
}

//takes in new array and renders display
function renderForecast(filteredForecast) {
  clearElement(forecastContainer);
  filteredForecast.forEach(day => {
    const div = document.createElement("div");
    div.classList.add("daily-forecast");
    forecastContainer.appendChild(div);

    const dayName = new Date(day.dayOf * 1000).getDay();

    const weekdays = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
    const dayOfWeek = document.createElement("p");
    dayOfWeek.innerText = weekdays[dayName];
    div.appendChild(dayOfWeek);

    const icon = document.createElement("img");
    icon.src = `http://openweathermap.org/img/wn/${day.icon}@2x.png`;
    div.appendChild(icon);

    if (activeUnits === unitsC) {
      const minMax = document.createElement("p");
      minMax.textContent = `${day.min}° | ${day.max}°`;
      div.appendChild(minMax);
    } else {
      const minMax = document.createElement("p");
      minMax.textContent =
        Math.round(convertUnitsToF(day.min)) +
        "° | " +
        Math.round(convertUnitsToF(day.max)) +
        "°";
      div.appendChild(minMax);
    }
  });
}

//used to clear forecast container as contents dynamically created
function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function convertUnitsToF(temp) {
  temp = temp * (9 / 5) + 32;
  return temp;
}

console.log(convertUnitsToF(10));
