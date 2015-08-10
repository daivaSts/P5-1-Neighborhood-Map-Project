
function loadData() {

    var $body = $('body');
    var $wikiContElem = $("#placeInfo");


    // clear out old data before new request
    $wikiContElem.text("");

    // load wikipedia data
    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("failed to get wikipwdia resources");
    }, 8000);

    var xx = "Steamboat Ski Resort";
    var wikiUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&search="+xx+"&format=json"

    $.ajax( {
        url: wikiUrl,
        dataType: 'jsonp',
        success: function(data) {
            var z = data;
            for (var i=0; i < z[1].length; i++) {

                $wikiContElem.append('<li class="article">'+ '<p>'+z[2][i]+'</p>'+'</li>' + "More info in: "+
                '<a href="'+z[3][i]+'">'+'Wikipedia'+'</a>' );
            };

            clearTimeout(wikiRequestTimeout);
        }
    })
    return false;
};
//loadData()
//$('#form-container').submit(loadData);
