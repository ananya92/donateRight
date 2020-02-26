// onclick for deleting a donation
$(document).on("click", ".delete-donation", handleDelete);

// Function for handling what happens when the delete button is pressed
function handleDelete() {
    var id = $(this).parent().data("id");
    $.ajax({
    	method: "DELETE",
    	url: "/api/donation/" + id
    })
    .then(location.reload());
}