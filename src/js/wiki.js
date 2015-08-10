
function loadData(placeName, placeInfo) {

    var $body = $('body');
    var $wikiContElem = $(placeInfo);


    // clear out old data before new request
    $wikiContElem.text("");

    // load wikipedia data
    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("failed to get wikipwdia resources");
    }, 8000);

    var xx = placeName;
    //console.log(xx)
    var wikiUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&search="+xx+"&format=json"

    $.ajax( {
        url: wikiUrl,
        dataType: 'jsonp',
        success: function(data) {
            var z = data;
            for (var i=0; i < z[1].length && i < 2; i++) {

                $wikiContElem.append('<li class="article"><p>'+z[2][i]+'</p></li>'+
                '<a href="'+z[3][i]+'">(Wikipedia)</a>' );
            };

            clearTimeout(wikiRequestTimeout);
        }
    })
    return false;
};

