$(document).ready(function() {
    var donationList = $("#donation-list");
    var donationDetails = $("#donation-details");
    donationList.removeClass("is-hidden");
    donationDetails.addClass("is-hidden");

    var donationPosts;
    $("li").on("click", function(event) {
        event.preventDefault();
        var id = $(this).data("id");
        $.ajax({
            method: "GET",
            url: "/api/donation/" + id,
          }).then(function(data) {
                console.log(data);
                donationList.addClass("is-hidden");
                donationDetails.removeClass("is-hidden");
                $("#name").text(data.name);
                $("#description").text(data.description);
                $("#category").text(data.category);
                $("#email").text(data.contact);
                $("#phnumber").text(data.email);
        });
    });

    $("#backBtn").on("click", function() {
        event.preventDefault();
        location.reload();
    });

    // On filtering results by category, call list-donations API with a query parameter
    $(".dropdown-item").on("click", function() {
        var category = $(this).text().trim();
        if(category === "All") {
            window.location.href = "/list-donations";
        }
        else {
            window.location.href = "/list-donations?category=" + category;
        }
    });

    var alterClass = function() {
        var ww = document.body.clientWidth;
        if (ww < 600) {
            $('.heading-with-filter').removeClass('is-pulled-left');
            $('.dropdown').removeClass('is-pulled-right');
        } else if (ww >= 600) {
            $('.heading-with-filter').addClass('is-pulled-left');
            $('.dropdown').addClass('is-pulled-right');
        };
    };

    $(window).resize(function(){
        alterClass();
    });
    //Fire when the page first loads to set the float of the components based on screen size
    alterClass();
});