const CITY_NAME = 'Istanbul'; 
window.addEventListener('DOMContentLoaded', () => {

  const locationEl = document.getElementById('location');
  const iconEl = document.getElementById('weather-icon');
  const tempEl = document.getElementById('temperature');
  const descEl = document.getElementById('description');
  const forecastContainer = document.getElementById('forecast-container');

  window.electronAPI.getWeather(CITY_NAME)
    .then(data => {
      
      if (data.error) {
        locationEl.innerText = data.error;
        tempEl.innerText = ":(";
        return;
      }

      const location = data.city.name;
      const forecastList = data.list;

      const currentData = forecastList[0];
      const temperature = Math.round(currentData.main.temp);
      const description = currentData.weather[0].description;
      const iconCode = currentData.weather[0].icon;

      locationEl.innerText = location;
      tempEl.innerText = `${temperature}°`;
      descEl.innerText = description.charAt(0).toUpperCase() + description.slice(1);

      iconEl.innerHTML = `<img src="http://openweathermap.org/img/wn/${iconCode}@4x.png" alt="${description}">`;

      forecastContainer.innerHTML = ''; 
      const nextForecasts = forecastList.slice(1, 6); 

      for (const forecast of nextForecasts) {

        const forecastTime = new Date(forecast.dt * 1000).getHours() + ':00';
        const forecastIcon = forecast.weather[0].icon;
        const forecastTemp = Math.round(forecast.main.temp);

        const itemDiv = document.createElement('div');
        itemDiv.className = 'forecast-item';
        itemDiv.innerHTML = `
          <div class="forecast-time">${forecastTime}</div>
          <img src="http://openweathermap.org/img/wn/${forecastIcon}@2x.png" alt="${forecast.weather[0].description}">
          <div class="forecast-temp">${forecastTemp}°</div>
        `;
        
        forecastContainer.appendChild(itemDiv);
      }
    })
    .catch(err => {
      console.error("Uygulama Hatası:", err);
      locationEl.innerText = 'Bilinmeyen bir hata oluştu.';
    });
});
