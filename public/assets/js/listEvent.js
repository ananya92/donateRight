$(document).ready(function() {
    var eventList = $("#event-list");
    var eventDetails = $("#event-details");
    eventList.removeClass("is-hidden");
    eventDetails.addClass("is-hidden");

    $("li").on("click", function(event) {
        event.preventDefault();
        console.log(event);
        var id = $(this).data("id");
        $.ajax({
            method: "GET",
            url: "/api/event/" + id,
          }).then(function(data) {
                console.log(data);
                eventList.addClass("is-hidden");
                eventDetails.removeClass("is-hidden");
                $("#ename").text(data.name);
                $("#edescription").text(data.description);
                $("#cname").text(data.charityName);
                $("#cdescription").text(data.charityDesc);
                $("#email").text(data.contact);
                $("#phnumber").text(data.email);
        });
    });

    $("#backBtn").on("click", function() {
        event.preventDefault();
        location.reload();
    });
});