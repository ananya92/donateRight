$(document).ready(function() {
    var donationList = $("#donation-list");
    var donationDetails = $("#donation-details");
    donationList.removeClass("is-hidden");
    donationDetails.addClass("is-hidden");

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
});