
// Event Listener for the 'Get Weather' button
document.addEventListener('DOMContentLoaded', () => {
    //default image for city picture
    defaultImageSrc = document.querySelector('.city-picture img').src;

    const getWeatherButton = document.querySelector('.get-weather-button button');
    getWeatherButton.addEventListener('click', getWeather);

  });

// API Key from OpenWeatherMap
const apiKey = '52f9551cd7a1bd858e245f2cf35d65b0';

// API Key from Unsplash.com
const unsplashApiKey ='fWhvwrkWfG_N0IVGft1WN1f9dU0l6Q3z8Cv29cIMIWM';

// Kelvin to Fahrenheit conversion
const kelvinToFahrenheit = (kelvin) => ((kelvin - 273.15) * 9/5 + 32).toFixed(1);


// clear inputs after calling API
const clearInputs = () => {
    document.getElementById('cityInput').value = '';
    document.getElementById('stateInput').value = '';
    document.getElementById('zipInput').value = '';
};


// Testing out adding weather icons to see if they will change dependent on the weather data brought back
const getIconClassForWeather = (forecastDescription) => {
    if (forecastDescription.toLowerCase().includes('clear')) {
        return 'wi-sunny wi-large';
    } else if (forecastDescription.toLowerCase().includes('rain')) {
        return 'wi-rain wi-large';
    } else if (forecastDescription.toLowerCase().includes('cloud')) {
        return 'wi-cloudy wi-large';
    } else if (forecastDescription.toLowerCase().includes('thunderstorm')) {
        return 'wi-thunderstorm wi-large';
    } else {
        return 'wi-na wi-large'; 
    }
}

// Arrow function to get an image of the city a person inputs
const grabCityImg = (cityName) => {
    const apiUrl = `https://api.unsplash.com/search/photos?query=${cityName}&orientation=landscape&fit=crop&w=400&h=400&client_id=${unsplashApiKey}`;

    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      if (data.results && data.results.length > 0) {
        const imageUrl = data.results[0].urls.regular;
        const cityPictureElement = document.querySelector('.city-picture img');
        cityPictureElement.src = imageUrl;
      } else {
        console.error('No city image found for', cityName);
      }
    })
    .catch(error => {
      console.error('Error fetching city image:', error);
    });
}


// Arrow function to fetch weather data
const getWeather = () => {
    const cityInput = document.getElementById('cityInput').value;
    const stateInput = document.getElementById('stateInput').value;
    const zipInput = document.getElementById('zipInput').value;
  
    if (!cityInput && !stateInput && !zipInput) {
        alert('Please enter a city and state or a zip code.');
        return;
    }

  // I wanted a way to have a user either enter city and state or zip code
  // looked up a way to use a variable named locationParam that allows a user to do this
  // If the user only enters zip code, it defaults to the static city-picture unless a picture is found via Unsplash
  // If the user enters a city and state then the city image can be pulled from Unsplash by grabCityImg
    let locationParam;
  
    if (zipInput) {
        locationParam = `zip=${zipInput}`;
        const cityPictureElement = document.querySelector('.city-picture img');
        if (cityPictureElement) {
            cityPictureElement.src = defaultImageSrc;
        }
    } else if (cityInput && stateInput) {
        locationParam = `q=${cityInput},${stateInput}`;
        grabCityImg(cityInput);
    } else {
        alert('Please enter a city and state or a zip code.');
        return;
    }
    
  
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?${locationParam},US&appid=${apiKey}`;

    // fetch information from API
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        if (data && data.main) {
          document.querySelector('.col-12 h2').textContent = `${data.name} | ${zipInput || 'Zip Code Not Entered'}`;
          document.querySelector('.col-4.text-center.text-uppercase.high h3').textContent = `${kelvinToFahrenheit(data.main.temp_max)}°F`;
          document.querySelector('.col-4.text-center.text-uppercase.low h3').textContent = `${kelvinToFahrenheit(data.main.temp_min)}°F`;
          document.querySelector('.col-4.text-center.text-uppercase.humidity h3').textContent = `${data.main.humidity}%`;
          
        

        // Display extra information about the forecast in the forecast section 
          const forecastElements = document.querySelector('.forecast p');
          const forecastDescription = data.weather[0].description;
          const forecastPressure = data.main.pressure;
          const windSpeed = data.wind.speed;
          const windDegree = data.wind.deg;
          const windGust = data.wind.gust;
          const weatherIconElement = document.querySelector('.weather-icon');
          if (weatherIconElement) {
              weatherIconElement.className = "wi " + getIconClassForWeather(forecastDescription);
          } else {
              console.error('This icon is not preloaded');
          }
     
          
          // specific for wind gust data because sometimes it doesn't show up
          const windGustInfo = windGust !== undefined ? `WIND GUST: ${windGust} mph <br>` : 'WIND GUST: information not available<br>';

          // display forcast content and extras such as pressure, wind speed, wind gust and wind degree
          const forecastContent = `
          ${forecastDescription} <br>
          PRESSURE: ${forecastPressure} hPa <br>
          WIND SPEED: ${windSpeed} mph <br>
          ${windGustInfo}
          WIND DEGREE: ${windDegree}°<br>`;

    
         forecastElements.innerHTML = forecastContent;
         
        } else {

          // checks to see if the data is correct
          console.error('Data is missing or incomplete:', data);
          alert('Weather data is missing or incomplete. Please check the city and state.');
        }
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data. Please check the city and state.');
      });

    // get city image
    grabCityImg(cityInput || stateInput || zipInput);

    // Clear input fields after API data has been called
    clearInputs();

  }


  

