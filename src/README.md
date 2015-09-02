May 2015 Cohort
### P5-1: Neighborhood Map project

CHALLENGE:
The challenge is to develop a single page application featuring a map of a neighborhood I would like
to visit, adding additional functionality to this map including highlighted locations, Wikipedia and Open Weather
data about those locations, search and filter functionality to browse the content.

TO USE:
* Clone project or download project's zip folder to your computer.
* Open dist/index.html file in your browser.
* Interactions:
	* Click on the list panel to open a panel with more information received from Wikipedia and a Google
		Map marker with current weather information.
	* Click on the marker to get current weather information at the location.
	* Type in the search window any location name to filter locations.

DEVELOPMENT:
* Developed project code following Model-View-View-Model (MVVM) patter, using KnockoutJS framework.
* Developed code required to add a full-screen map to the page using the Google Maps API through Knockout custom bindings.
* Developed code required to add map markers identifying locations of interest.
* Implemented the search bar functionality to search and filter the map markers according to filter result.
* Implemented a list view of the identified locations.
* Map markers provide the latest weather data from Open Weather API when clicked.
* List view entry has collapsible panel with more information received from Wikipedia when clicked.
* Created Cache manifest myCache.appcache file to cash images and resources.
* Created .htaccess  with the expiration dates.
* Minified js, css added to html, minified html.
* Added comments to code using JSDoc 3  markup language.

#### Optimization Tips, Tricks, References and Resources:
* Open Tips-tricks-resources.txt

