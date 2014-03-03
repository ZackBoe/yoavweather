$(function() {
	console.log("ready to roll!");
	desc = $('.desc');
	forecast = $('.forecast');
	$('.toggle-desc').click(function(e) {
		e.preventDefault();
		if($(this).hasClass('open')) desc.slideUp();
		else { 
			desc.slideDown();
			forecast.hide();
		}
		$(this).toggleClass('open');
	});

	$('.taco').click(function(e) {
		e.preventDefault();
		if($(this).hasClass('fin')){
			if($(this).hasClass('open')) forecast.slideUp();
			else { forecast.slideDown(); desc.hide();
			}
			$(this).toggleClass('open');
		}
		else e.preventDefault();
	});

	$('.close').click(function(e) {
		e.preventDefault();
		forecast.slideUp();
		$('.taco').toggleClass('open');
	});

if (Modernizr.geolocation) {
  getLocation();
} else {
	console.log("can't get location");
  $('.type').html("Couldn't find your location :(");
}
});

function getLocation(){
	navigator.geolocation.getCurrentPosition(function(position) {
		getWeather(position.coords.latitude, position.coords.longitude);
    }, function() {
    	$('.city').removeClass("hide");
    	$('.type').html("Couldn't find your location.<br>Enter your location, press enter.");
    	$('#city').keypress(function (e) {
    	  if (e.which == 13) {
    	    city = $('#city').val();
    	    $('.city').addClass("hide");
    	    getWeather(null, null, city);
    	   	e.preventDefault()
    	  }
    	});

    }, { enableHighAccuracy: false, timeout: 1000, maximumAge: 1000 });
}


// http://openweathermap.org/ is awesome, A++ would weather again.
function getWeather (lat, lng, city) {
	console.log("Getting weather");
	if(city != null){
		$.getJSON( "http://api.openweathermap.org/data/2.5/weather?q="+city+"&APPID=927b95cfa440255eddf1ebff447cab15", function( data ) {
			yoavWeather(data);
			$.getJSON( "http://api.openweathermap.org/data/2.5/forecast/daily?q="+city+"&cnt=8&mode=json&APPID=927b95cfa440255eddf1ebff447cab15", function( data ) {
				yoavForecast(data);
			}); 
		}); 
	}
	else {
		$.getJSON( "http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lng+"&APPID=927b95cfa440255eddf1ebff447cab15", function( data ) {
			yoavWeather(data);
			$.getJSON( "http://api.openweathermap.org/data/2.5/forecast/daily?lat="+lat+"&lon="+lng+"&cnt=8&mode=json&APPID=927b95cfa440255eddf1ebff447cab15", function( data ) {
				yoavForecast(data);
			}); 
		}); 
	}
}


function yoavForecast (forecast) {
	if(forecast.cod != 200){

	}
	else {
		for (var i = forecast.list.length - 1; i >= 0; i--) {
			if(i == 3) $('.forecast').prepend('<div class="day spacer"></div><div class="day spacer"></div>');
			console.log(forecast.list[i]);
			var d = new Date(0);
			d.setUTCSeconds(forecast.list[i].dt);
			switch(d.getDay()){
				case 0:
					day = 'Sunday';
					break;
				case 1:
					day = 'Monday';
					break;
				case 2:
					day = 'Tuesday';
					break;
				case 3:
					day = 'Wednesday';
					break;
				case 4:
					day = 'Thursday';
					break;
				case 5:
					day = 'Friday';
					break;
				case 6:
					day = 'Saturday';
					break;
				default:
					day = 'Someday';
					break;
			}
			maxtC = forecast.list[i].temp.max - 273.15;
			maxtF = maxtC * 9 / 5 + 32;
			maxtempF = maxtF.toString().split(".");
			maxtempC = maxtC.toString().split(".");
			mintC = forecast.list[i].temp.min - 273.15;
			mintF = mintC * 9 / 5 + 32;
			mintempF = mintF.toString().split(".");
			mintempC = mintC.toString().split(".");
			icon =  forecast.list[i].weather[0].icon;
			$('.forecast').prepend('<div class="day"><h3>'+day+'</h3><img src="http://openweathermap.org/img/w/'+icon+'.png"><h4><span class="h">'+maxtempF[0]+'&deg;</span>&nbsp;&nbsp;<span class="l">'+mintempF[0]+'&deg; F</span></h4><h4><span class="h">'+maxtempC[0]+'&deg;</span>&nbsp;&nbsp;<span class="l">'+mintempC[0]+'&deg; C</span></h4></div>')
			date = null;
		};
	}
	// $('.forecast').append('<div class="day close toggle-forecast">Close</div>');
	$('.taco').addClass('fin');
}

function yoavWeather (data) {
	if(data.cod == 404){
		$('.type').html("Couldn't find your location. :(");
	}
	else {
description = data.weather[0].description;
		icon = data.weather[0].icon;
		wid = data.weather[0].id;
		tC = data.main.temp - 273.15;
		tF = tC * 9 / 5 + 32;
		tempF = tF.toString().split(".");
		tempC = tC.toString().split(".");
		$('.temp').html(tempF[0]+"&deg;F / "+tempC[0]+"&deg;C");
		$('.type').html(description);
		console.log(wid);
		switch (wid) {
			case 200:
			case 201:
			case 202:
			case 210:
			case 211:
			case 212:
			case 221:
			case 230:
			case 231:
			case 232:
				$('.bg').removeClass('wDefault').addClass("wTStorm");
				break;
			case 300:
			case 301:
			case 302:
			case 310:
			case 311:
			case 312:
			case 313:
			case 314:
			case 321:
			case 500:
			case 501:
				$('.bg').removeClass('wDefault').addClass("wDrizzle");
				break;
			case 502:
			case 503:
			case 504:
			case 511:
			case 520:
			case 521:
			case 522:
			case 531:
				$('.bg').removeClass('wDefault').addClass("wRain");
				break;
			case 600:
			case 601:
			case 611:
			case 612:
			case 615:
			case 616:
			case 620:
			case 621:
				$('.bg').removeClass('wDefault').addClass("wLSnow");
				break;
			case 622:
			case 602:
				$('.bg').removeClass('wDefault').addClass("wHSnow");
				break;
			case 701:
			case 711:
			case 721:
			case 741:
				$('.bg').removeClass('wDefault').addClass("wHaze");
				break;
			case 800:
				$('.bg').removeClass('wDefault').addClass("wClear");
				break;
			case 801:
			case 802:
				$('.bg').removeClass('wDefault').addClass("wPCloud");
				break;
			case 803:
				$('.bg').removeClass('wDefault').addClass("wMCloud");
				break;
			case 804:
				$('.bg').removeClass('wDefault').addClass("wOcast");
				break;
			default:
				break;
		}
	}
}