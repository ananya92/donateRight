async function initMap() {
    var myLocation;
    var zoom;
    
    await getPosition()
    .then((position) => {
        myLocation = {lat: position.coords.latitude, lng: position.coords.longitude};
        zoom = 10;
        // can add zoom later
        // sets lat&lng incase the user doesn't move the marker
        window.latInput = position.coords.latitude;
        window.lngInput = position.coords.longitude;
    })
    .catch((err) => {
        console.error(err.message);
        myLocation = {lat: -25.363, lng: 131.044};
        zoom = 4;
    });
    
    // console.log(myLocation);

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: zoom,
        center: myLocation
    });

    var contentString = '<form class="event">'+
            '<div class="form-group">'+
            '<label for="Description">Description</label>'+
            '<br>'+
            '<textarea type="text" class="form-control" id="description-input" placeholder="Blankets, water ..."></textarea>'+
            '</div>'+
            '<br>'+
            '<button type="submit" class="eventCreation">Create Event</button>'+
        '</form>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    var marker = new google.maps.Marker({
        position: myLocation,
        map: map,
        draggable: true,
        title: 'Event location'
    });
    
    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });

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
$(document).on('submit', '.event', function(event){
    var descriptionInput = $("textarea#description-input");

    event.preventDefault();
    var eventData = {
        description: descriptionInput.val().trim(),
        lat: latInput,
        lng: lngInput
    }

    if(!eventData.description) {
        return;
    }

    console.log(eventData);

    //ajax call and if successful returns the user to home page
    createEvent(eventData.description, eventData.lat, eventData.lng); 
    createHistory(eventData.description);   
});

//function to create history item
function createHistory(description) {
    $.post("/api/eventHistory", {
        description: description,
    })
    .then(function() {
        window.location.replace("/user");
    }) // If there's an error, log the error
    .catch(function(err) {
        console.log(err);
    });
}

function createEvent(description, lat, lng) {
    $.post("/api/event", {
      description: description,
      lat: lat,
      lng: lng
    })
      .then(function() {
        console.log("success");
      }) // If there's an error, log the error
      .catch(function(err) {
        console.log(err);
      });
}