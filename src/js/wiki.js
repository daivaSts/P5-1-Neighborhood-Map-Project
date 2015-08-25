function loadData(placeName) {


    var wikiRequestTimeout = setTimeout(function(){
        console.log("failed to get wikipedia resources");
    }, 8000);

    var wikiUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" +
                placeName + "&format=json"

    return $.ajax( {
        url: wikiUrl,
        dataType: 'jsonp',
        success:  function(data) {

            clearTimeout(wikiRequestTimeout);

        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(textStatus, errorThrown);
        }

    })
    return false;
};



