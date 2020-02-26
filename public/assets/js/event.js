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
            '<div class="form-group field">'+
            '<label class="label" for="Title">Title</label>'+
            '<p class="control is-expanded">'+
            '<input class="input" type="text" id="title-input" required placeholder="Event name">'+
            '</p>'+
            '</div>'+
            '<div class="form-group field">'+
            '<label class="label" for="Description">Description</label>'+
            '<textarea type="text" class="form-control textarea is-primary is-small" required rows="4" id="description-input" placeholder="Eg. Canned food collection for supporting flood victims"></textarea>'+
            '</div>'+
            '<button type="submit" class="eventCreation button is-primary">Create Event</button>'+
        '</form>';

    var infowindow1 = new google.maps.InfoWindow({
        content: contentString
    });

    var infowindow2 = new google.maps.InfoWindow({
        content: "<p>Click to post new event!</p>"
    });

    var marker = new google.maps.Marker({
        position: myLocation,
        map: map,
        draggable: true,
        title: 'Event location'
    });
    
    // Show default message to user to indicate how to post a new donation
    infowindow2.open(map, marker);

    marker.addListener('click', function() {
        infowindow2.close();
        infowindow1.open(map, marker);
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
    var titleInput = $("#title-input");
    event.preventDefault();
    var eventData = {
        title: titleInput.val().trim(),
        description: descriptionInput.val().trim(),
        lat: latInput,
        lng: lngInput
    }

    if(!eventData.description) {
        return;
    }

    console.log(eventData);

    //ajax call and if successful returns the user to home page
    createEvent(eventData.description, eventData.title, eventData.lat, eventData.lng); 
    createHistory(eventData.description, eventData.title);   
});

//function to create history item
function createHistory(description, title) {
    $.post("/api/eventHistory", {
        title: title,
        description: description
    })
    .then(function() {
        window.location.replace("/user");
    }) // If there's an error, log the error
    .catch(function(err) {
        console.log(err);
    });
}

function createEvent(description, title, lat, lng) {
    $.post("/api/event", {
        title: title,
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