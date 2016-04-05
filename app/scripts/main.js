console.log('\'Allo \'Allo!');
var haveGeo = false;


//The callback function executed when the location is fetched successfully.
   function onGeoSuccess(location) {
       console.log(location); console.log(location.coords)
       $('.city').text(location.address.city)
       if(!haveGeo) getForecast(location.coords);
       haveGeo = true;
   }
   //The callback function executed when the location could not be fetched.
   function onGeoError(error) {
       console.log(error);
   }

   function getForecast(coords){
     var loc = coords.latitude+','+coords.longitude;
     fetch('https://zackboehm.com/yoav/weather/api/?loc='+loc)
     .then(function(response){
       if(response.ok){
         response.json().then( function(body){ displayForecast(body) });
       } else { console.log('Error with fetch') }
     })
     .catch(function(err){
       console.log('Error with fetch:',err)
     });
   }

   function displayForecast(forecast){
     console.log(forecast);
     $('.loader').fadeOut();
     $('.forecast').css('opacity', 1);
     $('.currently .summary').text(forecast.currently.summary);
     $('.currently .icon').html(icons[forecast.currently.icon])
     $('.currently .temp').html(forecast.currently.temperature.toString().split('.')[0]+'<span class="deg">°F</span>')

     $('.next-hour .summary').text(forecast.minutely.summary);
     $('.next-hour .icon').html(icons[forecast.minutely.icon])

     $('.next-day .summary').text(forecast.hourly.summary);

     $('.next-week .summary').text(forecast.daily.summary);

   }

   window.onload = function () {
       var geoOpts = { enableHighAccuracy: true, timeout: 10000, maximumAge: 600000 };
       geolocator.locate(onGeoSuccess, onGeoError, 2, geoOpts);
   };
