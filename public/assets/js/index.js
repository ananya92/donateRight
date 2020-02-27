$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
  
        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        $(".navbar-burger").toggleClass("is-active");
        $(".navbar-menu").toggleClass("is-active");
  
    });

    // This file just does a GET request to figure out which user is logged in
    // and updates the HTML on the page
    $.get("/api/user_data").then(function(data) {
        $(".member-name").text(data.username);
    });

    var alterClass = function() {
        var ww = document.body.clientWidth;
        if (ww < 600) {
            $('#welcome-mobile').removeClass('is-hidden');
            $('#welcome-normal').addClass('is-hidden');
        } else if (ww >= 600) {
            $('#welcome-mobile').addClass('is-hidden');
            $('#welcome-normal').removeClass('is-hidden');
        };
    };

    $(window).resize(function(){
        alterClass();
    });
    //Fire when the page first loads to set the float of the components based on screen size
    alterClass();

    $(".mission").hover(function(){
        $(this).toggleClass("is-dark", 20);
        $(this).toggleClass("is-light", 20);
	});
  });