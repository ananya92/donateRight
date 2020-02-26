$(document).on("click", ".delete-event", handleDelete);

// Function for handling what happens when the delete button is pressed
function handleDelete() {
    var id = $(this).parent().data("id");
    $.ajax({
      	method: "DELETE",
      	url: "/api/event/" + id
    })
    .then(location.reload());
}