var map;


/*****************************
 *initMap() is called when page is loaded.
 */
function initMap() {
  var self = this;
  map = new google.maps.Map(document.getElementById('map'), {
    zoomControl: true,
    zoomControlOptions: {
        style: google.maps.ZoomControlStyle.SMALL,
        position: google.maps.ControlPosition.RIGHT_CENTER
    },
    disableDefaultUI: true,
    zoom: 6,
    mapTypeId:google.maps.MapTypeId.ROADMAP,
    center: {lat: 38.6, lng: -108.0}
  });

  list = getResortList();


  for (var i=0; i< list.length; i++) {
    var contentString = "<div><p>Loading...</p></div>";
    var infowindow = new google.maps.InfoWindow({
      maxWidth: 200,
      content: contentString
    });

    var marker = new google.maps.Marker({
      position: {lat: list[i].lat(), lng: list[i].lon()},
      map: map,
      visible: true,
      title: list[i].placeName()
    });


    addMarker(marker)


    /**
    * Event listener : when clicked on the marker, opens the info window.
    */

    var weatherInfo = getResortList()[i].weather();

    google.maps.event.addListener(marker,'click', (function(marker, infowindow,list,i){
      return function() {
        if (weatherInfo != "<div><b>Sorry! Weather data failed to load</b></div>" && weatherInfo.length > 0) {
          infowindow.setContent(weatherInfo);
        } else {
          loadWeatherData(list, i, infowindow);
        }

        infowindow.open(map, marker);
      };
    })(marker,infowindow,list,i));

    /**
    * Custom control event listener for browsers "click" event: when clicked on the list item,
    * opens the info window on matching marker
    */
    var elem = document.getElementsByClassName("panel-title")
    google.maps.event.addDomListener(elem[i], 'click', (function(marker, infowindow, list,i){
      return function() {

        if (weatherInfo != "<div><b>Sorry! Weather data failed to load</b></div>" && weatherInfo.length > 0) {
          infowindow.setContent(weatherInfo);
        } else {
          loadWeatherData(list, i, infowindow);
        }
        infowindow.open(map, marker);
      };
    })(marker, infowindow, list,i));
  };
}


// Calls the initMap() function when the page loads
//window.addEventListener('load', initMap);
