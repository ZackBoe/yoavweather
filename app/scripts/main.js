/* eslint-env jquery */
/* global icons, geolocator */
'use strict';
var haveGeo = false;


//The callback function executed when the location is fetched successfully.
   function onGeoSuccess(location) {
       console.log(location); console.log(location.coords);
       document.querySelectorAll('.city')[0].textContent = location.address.city;
       if(!haveGeo) { getForecast(location.coords); }
       haveGeo = true;
   }
   //The callback function executed when the location could not be fetched.
   function onGeoError(error) {
       console.log(error);
   }

   function displayForecast(forecast){
     console.log(forecast);
     document.querySelectorAll('.loader')[0].style.opacity = 0;
     document.querySelectorAll('.forecast')[0].style.opacity = 1;
     document.querySelectorAll('.currently .summary')[0].textContent = forecast.currently.summary;
     document.querySelectorAll('.currently .icon')[0].innerHTML = icons[forecast.currently.icon];
     document.querySelectorAll('.currently .temp')[0].innerHTML = forecast.currently.temperature.toString().split('.')[0] + '<span class="deg">°F</span>';

     document.querySelectorAll('.next-day .summary')[0].textContent = forecast.hourly.summary;

     document.querySelectorAll('.next-week .summary')[0].textContent = forecast.daily.summary;

   }

   function getForecast(coords){
     var loc = coords.latitude + ',' + coords.longitude;
     fetch('https://zackboehm.com/yoav/weather/api/?loc=' + loc)
     .then(function(response){
       if(response.ok){
         response.json().then( function(body){ displayForecast(body); });
       } else { console.log('Error with fetch'); }
     })
     .catch(function(err){
       console.log('Error with fetch:', err);
     });
   }


   window.onload = function () {
       var geoOpts = { enableHighAccuracy: true, timeout: 10000, maximumAge: 600000 };
       geolocator.locate(onGeoSuccess, onGeoError, 2, geoOpts);
   };
