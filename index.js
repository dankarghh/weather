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

async function getData() {
  const searchQuery = input.value;

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&APPID=5d9558c98745f247d03ba46363f4043c&units=metric`,
      { mode: "cors" }
    );
    const weatherData = await response.json();
    console.log(weatherData);
    errorMsg.textContent = "";

    filterData(weatherData);
  } catch (err) {
    errorMsg.textContent = "Please search by City";
  }
}

searchBtn.addEventListener("click", e => {
  e.preventDefault();
  searchQuery = input.value;
  getData();
  input.value = "";
});

//function to take returned data and filter only whats needed and return object

function filterData(weatherData) {
  let filteredData = {
    city: weatherData.name,
    country: weatherData.sys.country,
    weather: weatherData.weather[0].description,
    temp: weatherData.main.temp,
    humidity: weatherData.main.humidity,
    feelsLike: weatherData.main.feels_like,
    icon: weatherData.weather[0].icon,
  };
  render(filteredData);
  console.log(filteredData);
}

function render(filteredData) {
  displayLocation.textContent = `${filteredData.city}, ${filteredData.country}`;
  displayWeather.textContent = filteredData.weather;

  img.src = `http://openweathermap.org/img/wn/${filteredData.icon}@2x.png`;

  displayTemp.textContent = Math.round(filteredData.temp) + "°C";
  displayDetails.textContent =
    "humidity: " +
    Math.round(filteredData.humidity) +
    "% | " +
    "feels like " +
    Math.round(filteredData.feelsLike) +
    "°C";
}


https://api.openweathermap.org/data/2.5/onecall?lat=-16.9167&lon=145.7667&exclude=current,minutely,hourly,alerts&appid=5d9558c98745f247d03ba46363f4043c