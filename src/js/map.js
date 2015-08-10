var googleMap = '<div id="map"></div>';

var map;    // declares a global map variable

/*****************************
 *initializeMap() is called when page is loaded.
 */
function initializeMap() {
  var mapOptions = {
    disableDefaultUI: true,
    zoom: 8,
    mapTypeId:google.maps.MapTypeId.ROADMAP
  };
  /**
   * Create a new Google Map JavaScript Object and attaches it to <div id="map">
   */
  map = new google.maps.Map(document.querySelector('#map'), mapOptions);

  /**
   * Returns an array of every location string from the JSONs
   */
  function locationFinder() {
    var locations = [];
    var all = loca.resorts;
    for (var i = 0; i < all.length; i++) {
      var coor = [all[i].lat, all[i].lon];

      locations.push(all[i].placeNickname)
    };
    //console.log(locations)
    return locations;
  }

  /************************************************************
   *createMapMarker(placeData) reads Google Places search results to create map pins.
   *placeData is the object returned from search results containing information
   *about a single location.
   */
  function createMapMarker(placeData) {
    //console.log(placeData)
    // The next lines save location data from the search result object to local variables
    var lat = placeData.geometry.location.lat();  // latitude from the place service
    var lon = placeData.geometry.location.lng();  // longitude from the place service

    var address = placeData.formatted_address;   // name of the place from the place service
    var name = placeData.name;
    var bounds = window.mapBounds;            // current boundaries of the map window
    var infotext = {"Telluride Ski Resort": 'Telluride Ski Resort is a ski resort located in Mountain Village.',
                    "Steamboat Resorts": "Steamboat Resort is a major ski area in northwestern Colorado",
                    "Aspen Skiing Co": "Snowmass is a part of the Aspen/Snowmass ski resort complex located in Snowmass",
                    "Aspen Mountain Ski Resort - Aspen Skiing Company": "bla bla bla",
                    "Arapahoe Basin Ski Area": "jhdfs ;lkfsjnf;h ; biuugyg"

    };
    console.log("name: "+name)
    //console.log("address: "+address)
    // marker is an object with additional data about the pin for a single location
    var marker = new google.maps.Marker({
      map: map,
      position: placeData.geometry.location,
      animation: google.maps.Animation.DROP
    });

    function toggleBounce() {
      if (marker.getAnimation() != null) {
        marker.setAnimation(null);
      } else {
        marker.setAnimation(google.maps.Animation.DROP);
      }
    }
    var infoWindow = new google.maps.InfoWindow({
      content: infotext[name],
      maxWidth: 200
    });

    /**
     * Listener for a mouse click on the marker to show an info window
     */
    google.maps.event.addListener(marker, 'click', function() {
      toggleBounce();
      if(!marker.open){
           loadData(name)
          infoWindow.open(map,marker);
          marker.open = true;
      }else{
          infoWindow.close();
          marker.open = false;
      }
    });

    /**
     *bounds.extend() takes in a map location object, adds the pin to the map.
     */
    bounds.extend(new google.maps.LatLng(lat, lon));
    // fit the map to the new marker
    map.fitBounds(bounds);
    // center the map
    map.setCenter(bounds.getCenter());
  }

  /************************************************************
  callback(results, status) makes sure the search returned results for a location.
  If so, it creates a new map marker for that location.
  */
  function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      createMapMarker(results[0]);
    }
  }

  /************************************************************
  pinPoster(locations) takes in the array of locations created by locationFinder()
  and fires off Google place searches for each location
  */
  function pinPoster(locations) {
    /**
     *creates a Google place search service object which does the work of actually searching for location data.
     */
    var service = new google.maps.places.PlacesService(map);

    // Iterates through the array of locations, creates a search object for each location
    for (var place in locations) {
            //console.log(locations[place])
            var request = {
                query: locations[place]
      };
      // Actually searches the Google Maps API for location data and runs the callback
      // function with the search results after each search.
      service.textSearch(request, callback);
    }
  }

  /************************************************************
   * Sets the boundaries of the map based on pin locations
   */
  window.mapBounds = new google.maps.LatLngBounds();

  // locations is an array of location strings returned from locationFinder()
  locations = locationFinder();

  // pinPoster(locations) creates pins on the map for each location in the locations array
  pinPoster(locations);
}

// Calls the initializeMap() function when the page loads
window.addEventListener('load', initializeMap);

// Vanilla JS way to listen for resizing of the window and adjust map bounds
window.addEventListener('resize', function(e) {
  // Make sure the map bounds get updated on page resize
  map.fitBounds(mapBounds);
  //map.setZoom(8);

});
$("#mapDiv").append(googleMap)