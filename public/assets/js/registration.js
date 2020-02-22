var charityUser;

function updateUser() {
    var userType = document.getElementById("userType");

    if (userType.value === "Normal User") {
        charityUser = false;
    }
    else if(userType.value === "Charity user") {
        charityUser = true;
    }

    if(userType.value === "Select User..") {
        $("#uRegistration").addClass("is-hidden");
        $("#cuRegistration").addClass("is-hidden");
    }
    else if(!charityUser) {
        $("#uRegistration").removeClass("is-hidden");
        $("#cuRegistration").addClass("is-hidden");
    }
    else if(charityUser) {
        $("#cuRegistration").removeClass("is-hidden");
        $("#uRegistration").addClass("is-hidden");
    }

}
