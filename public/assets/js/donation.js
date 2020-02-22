async function initMap() {
    var myLocation;
    
    await getPosition()
    .then((position) => {
        myLocation = {lat: position.coords.latitude, lng: position.coords.longitude};
        // can add zoom later
        // sets lat&lng incase the user doesn't move the marker
        window.latInput = position.coords.latitude;
        window.lngInput = position.coords.longitude;
    })
    .catch((err) => {
        console.error(err.message);
        myLocation = {lat: -25.363, lng: 131.044};
    });
    
    // console.log(myLocation);

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: myLocation
    });

    var contentString = '<form class="donation">'+
            '<div class="form-group">'+
            '<label for="Description">Description</label>'+
            '<br>'+
            '<textarea type="text" class="form-control" id="description-input" placeholder="Blankets, water ..."></textarea>'+
            '</div>'+
            '<br>'+
            '<div class="form-group">'+
            '<label for="categories">Number of Results</label>'+
            '<br>'+
            '<select id="categories" value="category"> <!--Drop down to what category the items are in-->'+
                '<option>Food</option>'+
                '<option>Clothes</option>'+
                '<option>Homeware</option>'+
                '<option>Help</option>'+
            '</select>'+
            '</div>'+ //add another drop down for updating status, can be set 'available' as default
            '<br>'+ //can also add another drop down to determine who can see it (add a model column to filter)
            '<button type="submit" class="donationCreation">Create Donation</button>'+
        '</form>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    var marker = new google.maps.Marker({
        position: myLocation,
        map: map,
        draggable: true,
        title: 'Donation location'
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
$(document).on('submit', '.donation', function(event){
    var descriptionInput = $("textarea#description-input");

    event.preventDefault();
    var donationData = {
        description: descriptionInput.val().trim(),
        category: $("#categories").val(),
        lat: latInput,
        lng: lngInput
    }

    if(!donationData.description) {
        return;
    }

    console.log(donationData);

    //ajax call and if successful returns the user to home page
    createDonation(donationData.description, donationData.category, donationData.lat, donationData.lng);    
});

function createDonation(description, category, lat, lng) {
    $.post("/api/donation", {
      description: description,
      category: category,
      lat: lat,
      lng: lng
    })
      .then(function() {
        window.location.replace("/user");
      }) // If there's an error, log the error
      .catch(function(err) {
        console.log(err);
      });
}