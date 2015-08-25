
var Place = function(data) {
	this.placeName = ko.observable(data.placeName);
	this.lat = ko.observable(data.lat);
	this.lon = ko.observable(data.lon);
	this.id = ko.observable(data.id);
	this.href = ko.computed(function() {
		return "#"+ this.id();
		},this);
	this.wiki = ko.observable(data.wiki);
	this.weather = ko.observable(data.weather);
	this.cityId = ko.observable(data.cityId);
	this.stat = ko.observable(data.stat);
	}


var MyViewModel = function() {
	var self = this;

	self.resortList = ko.observableArray([]);

	resortLocations.forEach(function(item) {
		self.resortList.push(new Place(item));
	});

	self.currentPlace = ko.observable(this.resortList()[0]);
/**
 * Search markers***************************************
 */
	self.markerList = ko.observableArray([]);

	addMarker= function(marker) {
		self.markerList.push(marker);
	}

	self.filteredMarkers = ko.computed(function() {
        return ko.utils.arrayFilter(self.markerList(), function(r) {
        	r.setVisible(true);
        	return (r.title.toLowerCase().search(self.placeSearch().toLowerCase()) == -1)
        });
    });

	self.toggleMarkers = ko.computed(function(){
		for (var i in self.filteredMarkers()) {
				self.filteredMarkers()[i].setVisible(false);
		}
	});

/**
 *  Search function*****************************
 */
	self.placeSearch = ko.observable('');

    self.filteredRecords = ko.computed(function() {
        return ko.utils.arrayFilter(self.resortList(), function(r) {
        	return (self.placeSearch().length == 0 || r.placeName().toLowerCase().search(self.placeSearch().toLowerCase()) != -1)
        });
    });

/**
 * helper functions ***********************************
 */
	getResortList =  function() {
		return self.resortList();
	}

	setPlaceWeather = function(i, info) {
		self.resortList()[i].weather(info);
	}

/****************************************************************************************************
 * Is called by getWikiInfo, iterates over the data received from Wikipedia, adds information to ViewList
 */
	handleData = function(data) {
		//console.log(data)
		for (var i = 0; i < data[1].length; i++) {
			var string = '<li class="article"><p>'+data[2][i]+'</p></li>'+'<a href="'+
						data[3][i]+'">Read more in Wikipedia</a>';

	        self.currentPlace().wiki(data[2][i]);
			var placeId = "#"+self.currentPlace().id();
			$(placeId).append(string);
		};
	}

/**
 * Sets the clicked place in ListView to current place, if clicked the first time, sends the request to Wikipedia,
 * calls handleData function after response received.
 */
    this.getWikiInfo = function() {
    	self.currentPlace(this);
    	console.log(this)

    	if (this.wiki().length  <= 1) {
    		loadData(this.placeName()).done(handleData);
    	};
	}
}

ko.applyBindings(new MyViewModel());
