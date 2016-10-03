/* eslint-env jquery */
/* global icons, geolocator */
'use strict';
var haveGeo = false;

  if('serviceWorker' in navigator) {
    console.log('Attempting ServiceWorker registration');
    navigator.serviceWorker.register('sw.js').then(function(registration) {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch(function(err) {
      console.log('ServiceWorker registration failed: ', err);
    });
  }

  // Successfully got location
   function onGeoSuccess(location) {
       console.log(location); console.log(location.coords);
       document.querySelectorAll('.city')[0].textContent = location.address.city;
       if(!haveGeo) { getForecast(location.coords); }
       haveGeo = true;
   }

   // Hide loader, display forecast
   function opac(){
     document.querySelectorAll('.loader')[0].style.display = 'none';
     document.getElementById('t1').checked = true;
   }

   // Could not obtain location
   function onGeoError(error) {
       console.log(error);
       opac();
       document.querySelectorAll('.forecast')[0].innerHTML = '<h2>There was an error getting your location! &#128546;</h2>';
   }

   // Could not obtain forecast
   function onForecastError(err){
     console.log('Error with fetch:', err);
     opac();
     document.querySelectorAll('.forecast')[0].innerHTML = '<h2>There was an error getting your forecast! &#128546;</h2>';
   }

   // Display forecast
   function displayForecast(forecast){
     console.log(forecast);
     document.querySelectorAll('.currently .summary')[0].textContent = forecast.currently.summary;
     document.querySelectorAll('.currently .icon')[0].innerHTML = icons[forecast.currently.icon];
     document.querySelectorAll('.currently .temp')[0].innerHTML = forecast.currently.temperature.toString().split('.')[0] + '<span class="deg">°F</span>';
     document.querySelectorAll('.next-day .summary')[0].textContent = forecast.hourly.summary;
     document.querySelectorAll('.next-week .summary')[0].textContent = forecast.daily.summary;
     document.querySelectorAll('.offline-timestamp')[0].textContent = forecast.currently.time;
     opac();
   }

   // Grab forecast
   function getForecast(coords){
     var loc = coords.latitude + ',' + coords.longitude;
     fetch('https://api.weather.yoavraccah.com/?loc=' + loc)
     .then(function(response){
       if(response.ok){
         response.json().then( function(body){ displayForecast(body); });
       } else { onForecastError(response); }
     })
     .catch(function(err) { onForecastError(err); });
   }

   // Grab location
   window.onload = function () {
       geolocator.config({ language: 'en', google: { version: '3', key: 'AIzaSyB92rP9EmypOx7m9FvgAKFTMv513E4rPLI ' }});
       var geoOpts = { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000, addressLookup: true, fallbackToIP: true };
       geolocator.locate(geoOpts, function(err, location){
         if(err){ onGeoError(err); }
         onGeoSuccess(location);
       });

       // Crude offline check. SW will never cache check.json
       fetch('check.json').catch(function(){
         var date = new Date(parseInt(document.querySelectorAll('.offline-timestamp')[0].textContent) * 1000);
         document.querySelectorAll('.offline-timestamp')[0].textContent = date.toDateString();
         document.querySelectorAll('.offline')[0].style.display = 'block';
       });


   };
