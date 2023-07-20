let userTab = document.querySelector("[data-userWeather]");
let searchTab = document.querySelector("[data-searchWeather]");
let userContainer = document.querySelector(".weather-container");
let grantAccessContainer = document.querySelector(".grant-loctaion-container");
let searchForm = document.querySelector("[data-searchForm]");
let loadingScreen = document.querySelector(".loading-container");
let userInfoContainer = document.querySelector(".user-info-container");


let currentTab = userTab;


const API_KEY = "54ecba17153fa85d53fa601c755627aa";
currentTab.classList.add("current-tab");
getFromSessionStorage();

function switchTab(clickedTab){
    if(currentTab != clickedTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){

            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }else{
            // Mai pahle serch waale tab pe the ab your weather weather waala tab visible karna hai
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getFromSessionStorage();
        }
    }
}

userTab.addEventListener("click", function(){
    // Passing clicked tab as a parameter
    switchTab(userTab);
});

searchTab.addEventListener("click", function(){
    switchTab(searchTab);
});

// Check for the coordinates are already present
function getFromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }else{
        const coordinates = JSON.parse(localCoordinates);

        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    let {lat, lon} = coordinates;
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    // API CALL
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }catch(err){
        loadingScreen.classList.remove("active");
        // HOMEWORK
    }
}
function renderWeatherInfo(weatherInfo){
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    // Fetch values from weather info object and put in UI
    cityName.textContent = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.textContent = `${weatherInfo?.main?.temp} °C`;
    windspeed.textContent = `${weatherInfo?.wind?.speed}m/s`;
    humidity.textContent = `${weatherInfo?.main?.humidity}%`;
    cloudiness.textContent = `${weatherInfo?.clouds?.all}%`;
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }else{
        // Homework alert dikhao
    }
}

function showPosition(position){
    let userCoordinates = {
        lat : position.coords.latitude,
        lon : position.coords.longitude
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation());

const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", function(event){
    event.preventDefault();
    let cityName =searchInput.value;
    if(cityName === ""){
        return;
    }else{
        fetchSearchWeatherInfo(cityName);
    }
});
async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }catch(err){
        // Home work
    }
}