async function initMap() {
    var myLocation;
    var zoom;
    
    await getPosition()
    .then((position) => {
        myLocation = {lat: position.coords.latitude, lng: position.coords.longitude};
        zoom = 10;
        // sets lat&lng incase the user doesn't move the marker
        window.latInput = position.coords.latitude;
        window.lngInput = position.coords.longitude;
    })
    .catch((err) => {
        console.error(err.message);
        myLocation = {lat: -25.363, lng: 131.044};
        zoom = 4;
    });

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: zoom,
        center: myLocation
    });

    var contentString = '<button type="submit" class="setLocal button is-primary">Set Location</button>';

    var infowindow1 = new google.maps.InfoWindow({
        content: contentString
    });

    var marker = new google.maps.Marker({
        position: myLocation,
        map: map,
        draggable: true,
        title: 'Donation location'
    });

    marker.addListener('click', function() {
        infowindow2.close();
        infowindow1.open(map, marker);
    });

    var infowindow2 = new google.maps.InfoWindow({
        content: '<p>Click and drag the marker to set the location.</p>'
    });

    //Show to user when page loads to inform them how to set the location
    infowindow2.open(map, marker);

    //get marker position if user moves it
    google.maps.event.addListener(marker, 'dragend', function (evt) {
        window.latInput = evt.latLng.lat();
        window.lngInput = evt.latLng.lng();
    });
}

function getPosition() {
    return new Promise((res, rej) => {
        navigator.geolocation.getCurrentPosition(res, rej);
    });
}

//on click function for donation creation (ajax post)
$(document).on('click', '.setLocal', function(event){
    event.preventDefault();
    var locationData = {
        lat: latInput,
        lng: lngInput
    }

    console.log(locationData);

    //ajax call and if successful returns the user to charity settings
    createLocation(locationData.lat, locationData.lng);    
});

function createLocation(lat, lng) {
    $.ajax({
        url: "/api/charity",
        type: "PUT",
        data: {
            lat: lat,
            lng: lng
        }
    })
      .then(function() {
        console.log("success");
        window.location.replace("/user");
      }) // If there's an error, log the error
      .catch(function(err) {
        console.log(err);
      });
}