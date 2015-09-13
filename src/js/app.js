/**
 * Neighborhood Map project /part of the Udacity FEND Nanodegree/ cohort May'2015
 * @author Daiva Satas
 * Please read the README.md file to start.
 * The link to source code on GitHub repository:
 * {@link https://github.com/daivaSts/P5-1-Neighborhood-Map-Project}
 * The link to the Udacity Project Page:
 * {@link https://www.udacity.com/course/viewer#!/c-nd001/l-2711658591/m-2629448638}
 */

/**
 * @descripion
 * The file app.js provides the funcionality to create a Google Map, Colorado ski resort objects in a list view,
 * binds them to the map markers and search windows. The object properties are dinamicly updated in UI via
 * knockoutJS Model-View-View Model pattern (MVVM).
 * Weather information displayed is received using Open Weather Map API http://openweathermap.org/current/
 * Location information received using Mediawiki Opensearch API https://en.wikipedia.org/
 * Search/ autocomplete enables you to quickly find and select from a pre-populated list of resorts.
 */

$(function () {
    /** Whole-script strict mode syntax **/
    "use strict";
    app();
});

var app = function () {

    /** Whole-script strict mode syntax **/
    "use strict";

    /** global variable **/
    var map;

    /**
     * Model data -  holds the information needed successfyly run this application
     * JSON format data for all ski resorts.
     */
    var resortLocations = [
        {
            placeName: "Telluride Ski Resort",
            lat: 37.936389,
            lon: -107.820278,
            id: "1",
            cityId: 5441199
        },
        {
            placeName: "Vail Ski Resort",
            lat: 39.6391,
            lon: -106.3738,
            id: "2",
            cityId: 5442727
        },
        {
            placeName: "Keystone Resort",
            lat: 39.605,
            lon: -105.954167,
            id: "3",
            cityId: 5696694
        },
        {
            placeName: "Breckenridge Ski Resort",
            lat: 39.48,
            lon: -106.067,
            id: "4",
            cityId: 4378291
        },
        {
            placeName: "Steamboat Ski Resort",
            lat: 40.452778,
            lon: -106.773056,
            id: "5",
            cityId: 5582371
        },
        {
            placeName: "Wolf Creek ski area",
            lat: 37.472222,
            lon: -106.793333,
            id: "6",
            cityId: 5785035
        },
        {
            placeName: "Eldora Mountain Resort",
            lat: 39.9375,
            lon: -105.583611,
            id: "7",
            cityId: 4855218
        },
        {
            placeName: "Powderhorn Resort",
            lat: 39.063056,
            lon: -108.155556,
            id: "8",
            cityId: 5435240
        }
    ];

    /**
     * Asynchronous ajax request to Open Weather Map API http://openweathermap.org/current/
     * @function - fired with the clicks on map marker or View list element events
     * @param {object} resort
     * @param {object} infowindow
     */
    function loadWeatherData(resort, infowindow) {
        var contentString, snowData, snowString, tempMin, tempMax, weatherIcon, weatherDescription, timeDt;
        var name = resort.placeName();
        var weather = resort.weather();
        var id = resort.id();
        var dt = resort.dt();
        var cityId = resort.cityId();

        var wikiRequestTimeout = setTimeout(function () {
            console.log("failed to get weather resources");
        }, 8000);

        var weatherUrl = "http://api.openweathermap.org/data/2.5/weather?id=" + cityId +
                "&units=Imperial&APPID=ff982803bc4c98cca0de6f7c93d7e598";

        return $.ajax({
            url: weatherUrl,
            dataType: "jsonp",
            success: function (data) {

                /** Checking if received data JSON holds "snow" key **/
                if (data.snow === undefined) {
                    snowString = "<p>Snow Accumulation: 0 </p>";
                } else {
                    snowData = Math.floor(data.snowData["1h"]);
                    snowString = "<p>Snow: " + snowData + "mm for the last hour</p>";
                }

                /** Creating infowindow string usind response data**/
                timeDt = data.dt; //seconds
                tempMin = "<p>Low: " + Math.floor(data.main.temp_min) + "F</p>";
                tempMax = "<p>Hi: " + Math.floor(data.main.temp_max) + "F</p>";
                weatherIcon = "img/" + data.weather["0"].icon + ".png";
                weatherDescription = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);

                contentString = "<div><b>" + name + "</b>" + "</div>" +
                        "<img src=" + weatherIcon + ">" + weatherDescription + "</div>" +
                        "<div>" + tempMax + tempMin + snowString + "</div>";

                /** Sets infowindow content with response data **/
                infowindow.setContent(contentString);


                /** Updates the Model weather property **/
                resort.weather(contentString);
                resort.dt(timeDt);

                /** Updates the local storage **/
                localStorage.setItem(name, contentString);
                localStorage.setItem(id, timeDt);

                clearTimeout(wikiRequestTimeout);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                contentString = "<div><b>Sorry! Weather data failed to load</b></div>";
                infowindow.setContent(contentString);
                alert(errorThrown);
            }
        });
        return false;
    }

    /**
     * Mediawiki Opensearch API for Wikipedia
     * Event listener for browsers "click" event asynchronous ajax request to https://en.wikipedia.org/
     * @function fired with the click event, is called by getWikiInfo(), when done, data are passed to handleWikiData()
     * @param {string} - resort name
     */
    function loadWikiData(resortName) {

        var wikiRequestTimeout = setTimeout(function () {
            console.log("failed to get wikipedia resources");
        }, 8000);

        var wikiUrl = "http://en.wikipedia.org/w/api.php?&action=opensearch&format=json&search=" +
                resortName + "&namespace=0";

        return $.ajax({
            url: wikiUrl,
            dataType: "jsonp",
            success: function (data) {
                clearTimeout(wikiRequestTimeout);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                contentString = "<div><b>Sorry! Wikipedia data failed to load</b></div>";
                infowindow.setContent(contentString);
                alert(errorThrown);
            }
        });
        return false;
    }

    /**
     * Calculates the number of days left until winter solstice for the app header tag
     * @function
     */
    var daysLeft = function () {
        var oneDay = 24 * 60 * 60 * 1000;
        var today = new Date();
        var firstDate = new Date(today);

        var secondDate = new Date(2015, 12, 22);
        var daysUntilSolstice = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
        return daysUntilSolstice;
    };

    /**
     * Represents location Ski Resort.
     * Constructor Declaration.
     * @param {JSON data}  - ski resorts.
     */
    var Resort = function (data) {
        this.placeName = ko.observable(data.placeName);
        this.lat = ko.observable(data.lat);
        this.lon = ko.observable(data.lon);
        this.id = ko.observable(data.id);
        this.href = ko.computed(function () {
            return "#" + this.id();
        }, this);
        this.wiki = ko.observable("");
        this.weather = ko.observable("");
        this.cityId = ko.observable(data.cityId);
        this.marker = ko.observable("");
        this.dt = ko.observable(0);
    };

    /**
     * Creates location objects, Initializes Google Maps markers, provides synchronization for the location
     * list view, search bar and map markers, sends request MediaWiki API to get info about each location.
     * @contructor Declaration MyViewModel
     */
    var MyViewModel = function () {
        var self = this;

        /** resort list via the mapping plugin to automatically create observable properties for each
         * of the properties on each resort location.
         **/
        self.resortList = ko.observableArray([]);

        resortLocations.forEach(function (item) {
            self.resortList.push(new Resort(item));
        });

        self.mappedResortList = ko.mapping.fromJS(self.resortList());


        /** Sets current place **/
        self.currentPlace = ko.observable(self.mappedResortList()[0]);

        /**  String which holds the search value **/
        self.placeSearch = ko.observable("");


        /** Creates a list of location objects which do meet the filter criteria for the View **/
        self.filteredRecords = ko.computed(function () {
            return ko.utils.arrayFilter(self.mappedResortList(), function (r) {
                return (self.placeSearch().length === 0 || r.placeName().toLowerCase().search(self.placeSearch().toLowerCase()) !== -1);
            });
        });


        /**
         * Search box autocomplete functionality using TypeaheadJS
         * http://twitter.github.io/typeahead.js/
         */
        self.resortNames = [];
        self.mappedResortList().forEach(function (resort) {
            self.resortNames.push(resort.placeName());
        });

        var substringMatcher = function (strs) {
            return function findMatches(q, cb) {
                var matches, substrRegex;
                /** An array that will be populated with substring matches */
                matches = [];

                /** regex used to determine if a string contains the substring `q` */
                substrRegex = new RegExp(q, "i");

                /** iterate through the pool of strings and for any string that
                 * contains the substring `q`, add it to the `matches` array
                 */
                $.each(strs, function (i, str) {
                    if (substrRegex.test(str)) {
                        matches.push(str);
                    }
                });
                cb(matches);
            };
        };

        $("#search .typeahead").typeahead({
            hint: true,
            highlight: true,
            minLength: 0
        },
        {
            source: substringMatcher(self.resortNames)
        }).on("typeahead:selected", function (obj, datum) {
            self.placeSearch(datum);
        });


        /**
         * Creates a list of markers which doesn't meet the filter criteria for the View, re-sets all the markers
         * to initial state - as visible, changes the marker icon to visible.
         */
        self.filteredMarkers = ko.computed(function () {
            return ko.utils.arrayFilter(self.mappedResortList(), function (r) {
                if (r.marker()) {
                    r.marker().setVisible(true);
                    r.marker().icon = "img/skiing-brown2.png";
                    return (r.marker().title.toLowerCase().search(self.placeSearch().toLowerCase()) === -1);
                }
            });
        });

        /** Sets markers to invisible **/
        self.setMarkersInvisible = ko.computed(function () {
            var i;
            for (i in self.filteredMarkers()) {
                self.filteredMarkers()[i].marker().infowindow.close();
                self.filteredMarkers()[i].marker().setVisible(false);
            }
        });

        /** Gets number of days for the header **/
        self.days = ko.observable(daysLeft());

        /**
         * Sets the clicked place in ListView to current place. If clicked the first time, sends the request to
         * MediaWiki API, calls handleData() after response received.
         */
        self.getWikiInfo = function () {
            self.currentPlace(this);
            if (this.wiki().length <= 1) {
                loadWikiData(this.placeName()).done(handleWikiData);
            }
        };

        /**
         * Iterates over the data received with ajax call from Wikipedia, creates and appends
         * the panel information window to the panel element.
         */
        var handleWikiData = function (data) {
            var i, len, string, placeId;

            len = data[1].length;
            for (i = 0; i < len; i += 1) {
                string = "<li class='article'><p>" + data[2][i] + "</p></li>" + "<a href='" +
                        data[3][i] + "'>Read more in Wikipedia</a>";

                self.currentPlace().wiki(data[2][i]);
                placeId = "#" + self.currentPlace().id();
                $(placeId).append(string);
            }
        };
    };

    /**
     * Google Maps Javascript API
     * Custom bindings initializes Google Map, creates markers, infowindows observed and conected to
     * to DOM "map" element.
     */

    ko.bindingHandlers.mymap = {
        /**
         * @function init
         * @param {object} element - id="map";
         * @param {object} valueAccessor - filtered resort list
         */
        init: function (element, valueAccessor) {
            /** Creates and sets the Google Map**/
            map = new google.maps.Map(document.getElementById("map"), {
                zoomControl: true,
                zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.SMALL,
                    position: google.maps.ControlPosition.RIGHT_CENTER
                },
                disableDefaultUI: true,
                zoom: 6,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });

            var southWest = new google.maps.LatLng(38, -111);
            var northEast = new google.maps.LatLng(40.5, -104);
            var bounds = new google.maps.LatLngBounds(southWest, northEast);
            map.fitBounds(bounds);

            /** The array of filtered places **/
            var filteredResorts = ko.utils.unwrapObservable(valueAccessor());

            /**
             * Marker icon under Creative Commons Attribution-Share Alike 3.0 Unported license
             * credit to Maps Icons Collection https://mapicons.mapsmarker.com,  author: Nicolas Mollet.
             */
            var image = ["img/skiing-white2.png", "img/skiing-brown2.png"];

            /** The fallback for infowindow if weather information is not loaded **/
            var contentString = "<div><p>Loading...</p></div>";


            /**
             * forEach() method creates markers, loads infowindow with required data
             * @function
             * @param {resort object} from filtered resort list array
             */
            filteredResorts.forEach(function (resort) {
                var marker = new google.maps.Marker({
                    position: {lat: resort.lat(), lng: resort.lon()},
                    title: resort.placeName(),
                    map: map,
                    visible: true,
                    icon: image[1],
                    infowindow: new google.maps.InfoWindow({
                        maxWidth: 400,
                        content: contentString,
                        opened: false
                    })
                });

                /** Updates the Model marker property **/
                resort.marker(marker);

               /**
                * Event listener : when clicked on the marker, opens/closes the info window depending on the
                * marker.open status, calls loadWeatherData() to get the weather information if clicked first time.
                */

                var infowindow = resort.marker().infowindow;
                var weatherInfo = resort.weather();
                var marker = resort.marker();
                var numId = resort.id();
                var titleElem = document.getElementsByClassName("panel-info");
                var elm = titleElem[numId - 1];
                var failedWeather = "<div><b>Sorry! Weather data failed to load</b></div>";

                google.maps.event.addListener(marker, "click", function () {

                    /** Closes the infowondow if it is opend **/
                    if (infowindow.opened === true && marker.icon === image[0]) {
                        infowindow.close();
                        infowindow.opened = false;
                        marker.setIcon(image[1]);
                    } else {
                        /** Close all other opened inforwindows **/
                        filteredResorts.forEach(function (resort) {
                            if (resort.marker().infowindow.opened) {
                                resort.marker().infowindow.close();
                                resort.marker().infowindow.opened = false;
                                resort.marker().setIcon(image[1]);
                            }
                        });

                        /**
                         * Checks if marker's infowindow has weather information set, is it stored in the localStorage
                         * and whether it has expired or not (older than 1hr), calls loadWeatherData() to update
                         * the weather data if needed.
                         **/
                        if (weatherInfo === failedWeather || weatherInfo.length === 0) {
                            loadWeatherData(resort, infowindow);
                        } else {
                            if (!localStorage.getItem(resort.placeName())) {
                                loadWeatherData(resort, infowindow);
                            } else if (Math.floor(((Date.now() / 1000) - localStorage.getItem(resort.id())) / 360) > 60) {
                                loadWeatherData(resort, infowindow);
                            } else {
                                infowindow.setContent(weatherInfo);
                            }
                        }

                    /** Opens the infowindow, centers the marker, updates the MyViewModel **/

                        map.panTo(marker.getPosition());
                        map.panBy(0, -100);
                        infowindow.open(map, this);
                        marker.setIcon(image[0]);
                        infowindow.opened = true;
                    }
                });

                /**
                * Custom control event listener for browsers "click" event: when clicked on the viewList item,
                * opens/closes the info window on matching marker, calls loadWeatherData() to get the weather
                * information, temporarely stores info in local storage.
                */

                google.maps.event.addDomListener(elm, "click", (function (marker) {
                    var count = 0;
                    return function () {
                        count += 1;
                        /** Closes the infowondow if it is opend **/
                        filteredResorts.forEach(function (resort) {
                            if (resort.marker().infowindow.opened) {
                                resort.marker().infowindow.close();
                                resort.marker().infowindow.opened = false;
                                resort.marker().setIcon(image[1]);
                            }
                        });

                        /**
                         * Checks if marker's infowindow has weather information set, is it stored in the localStorage
                         * and whether it has expired or not (older than 1hr), calls loadWeatherData() to update
                         * the weather data if needed.
                         */
                        if (infowindow.opened === false && count % 2 !== 0) {
                            if (weatherInfo === failedWeather || weatherInfo.length === 0) {
                                loadWeatherData(resort, infowindow);
                            } else {
                                if (!localStorage.getItem(resort.placeName())) {
                                    loadWeatherData(resort, infowindow);
                                } else if (Math.floor(((Date.now() / 1000) - localStorage.getItem(resort.id())) / 360) > 60) {
                                    loadWeatherData(resort, infowindow);
                                } else {
                                    infowindow.setContent(weatherInfo);
                                }
                            }

                            /** Opens the infowindow, centers the marker, updates the MyViewModel **/

                            map.panTo(marker.getPosition());
                            infowindow.open(map, marker);
                            marker.setIcon(image[0]);
                            infowindow.opened = true;
                        }

                    };
                })(marker));


                /** Hides the closing button "x" on infowindow **/
                google.maps.event.addListener(infowindow, "domready", function () {
                    $(".gm-style-iw").next("div").hide();
                });
            });
        }
    };

    ko.applyBindings(new MyViewModel());
};