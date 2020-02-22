var userSelection = ""; //set this value with a drop down menu ("" means all)

//ajax call to import location data
function getMarkers(cb) {
    $.get("/api/donation", function(data) {
    }).then(function(data) {
        data = data.filter(function(obj) {
            if(userSelection!=="") {
                switch (obj.category) {
                    case userSelection: 
                        return obj;
                    default:
                        return;
                }
            }
            return obj;
        })
        cb(data);
    });
}

function initMap() {
    //renders the whole map and defines the initial zoom level and where to center it on
    var styledMapType = new google.maps.StyledMapType(
        [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#38414e'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#17263c'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
          ],
        {name: 'Night Mode'});

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 5,
      center: {lat: -26.363, lng: 135.044},
      mapTypeControlOptions: { //options for controlling which types the user can use
        mapTypeIds: ['roadmap', 'styled_map']
      }
    });

    // adding the custom map style to the mapTypes
    map.mapTypes.set('styled_map', styledMapType);
    // setting the default map type
    map.setMapTypeId('roadmap');

    var iconBase = 'http://maps.google.com/mapfiles/kml/pal2/';

    var icons = {
        Food: {
            icon: iconBase + 'icon55.png'
        },
        Homeware: {
            icon: iconBase + 'icon2.png'
        },
        Clothes: {
            icon: iconBase + 'icon57.png'
        },
        Help: {
            icon: iconBase + 'icon7.png'
        }
    };

    //loading the locations from the database query
    var mark = function(cb) {
        getMarkers(function(data) {
            cb(
                data.map(function(info) {
                    // console.log(info); //contains all the information from database (users + donations)
                    var markerlocation = {lat: parseFloat(info.lat), lng: parseFloat(info.lng)}
                    return new google.maps.Marker({
                        position: markerlocation,
                        icon: icons[info.category].icon,
                        // label: info.category.charAt(0),
                        customInfo: {
                            category: info.category,
                            description: info.description,
                            user: info.User.firstName,
                            phone: info.User.phoneNumber,
                            email: info.User.email
                        }
                    });
                })
            )
        });
    }

    var infowindow = new google.maps.InfoWindow();

    // Add a marker clusterer to manage the markers and add on click listeners to all of them.
    mark(function(data){
        for(var x=0; x<data.length; x ++) {
            var marker = data[x];
            google.maps.event.addListener(marker, 'click', function() {
                var content = this.customInfo;
                infowindow.setContent(
                    "<Strong>Category:</Strong> " + content.category +
                    "<br><Strong>Description:</Strong> "+ content.description + 
                    "<br><Strong>Donator:</Strong> " + content.user + 
                    "<br><Strong>Phone:</Strong> " + content.phone + 
                    "<br><Strong>Email:</Strong> " + content.email
                );
                infowindow.open(this.getMap(), this);
            });
        }
        var markerCluster = new MarkerClusterer(map, data,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});    
    });
}