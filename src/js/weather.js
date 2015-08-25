function loadWeatherData(list, i, infowindow) {
//http://openweathermap.org/current project5

    var wikiRequestTimeout = setTimeout(function(){
        console.log("failed to get weather resources");
    }, 8000);

    var weatherUrl = 'http://api.openweathermap.org/data/2.5/weather?id='+list[i].cityId()+
            '&units=Imperial&APPID=ff982803bc4c98cca0de6f7c93d7e598';

    return  $.ajax({
        url: weatherUrl,
        dataType: 'jsonp',
        success: function(data) {

            var snow,z;
            if (data.snow === undefined){
            z = "<p>No Snow Accumulation Expected</p></p>"
            }else{
            snow = Math.floor(data.snow['1h']);
            z = "<p>Snow: "+snow+"mm for the last hour</p>";
            }
            var e = "<p>Temp: "+Math.floor(data.main.temp)+"F</p>";

            contentString = "<div><b>"+list[i].placeName()+"</b>"+e+z+"</div>";
            infowindow.setContent(contentString);

            setPlaceWeather(i, contentString);
            clearTimeout(wikiRequestTimeout);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            contentString = "<div><b>Sorry! Weather data failed to load</b></div>"
            infowindow.setContent(contentString);
            alert(errorThrown);
        }
    });
    return false;
};
