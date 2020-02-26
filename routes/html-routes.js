var isAuthenticated = require("../config/middleware/isAuthenticated");
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {
  	// Each of the below routes just handles the HTML page that the user gets sent to.
  	// index route loads home page
  	app.get("/", function(req, res) {
    	if (req.user) {
      		// User has logged in
      		if(req.user.type == "charity") {
        		res.render("user-home", {
          			layout: "cuser.handlebars"
        		});
      		}
      		else {
        		res.render("user-home", {
          			layout: "user.handlebars"
        		});
      		}
    	}
    	else {
      		res.render("index");
    	}
  	});
  
  	// user route loads home page after user logs-in
  	app.get("/user", isAuthenticated, function(req, res) {
    	if(req.user.type == "charity") {
      		res.render("user-home", {
        		layout: "cuser.handlebars"
      		});
    	}
    	else {
      		res.render("user-home", {
        		layout: "user.handlebars"
      		});
    	}
  	});

  	// register route loads registration page of new user 
  	app.get("/register", function(req, res) {
    	res.render("registration");
  	});

	// login route loads login page for existing user
	app.get("/login", function(req, res) {
    	res.render("login");
  	});

	// donation route loads donation form for posting new donation 
	app.get("/donation", isAuthenticated, function(req, res) {
    	res.render("donation", {
      		layout: "user.handlebars"
    	});
  	});

  	// charity search when user isn't logged in
  	app.get("/charity", function(req, res) {
    	if (req.user) {
      		if(req.user.type == "charity") {
        		res.render("charitySettings", {
          			layout: "cuser.handlebars"
        		});
      		}
      		else {
        		res.render("charitySearch", {
          			layout: "user.handlebars"
        		});
      		}
    	}
    	else {
      		res.render("charitySearch");
    	}
  	});

  	// settings route for charites
  	app.get("/settings", isAuthenticated, function(req, res) {
    	res.render("charitySettings", {
      		layout: "cuser.handlebars"
    	});
  	});

  	// settings route for charites
  	app.get("/usersettings", isAuthenticated, function(req, res) {
    	res.render("userSettings", {
      		layout: "user.handlebars"
    	});
  	});

  	// setting location for charity 
  	app.get("/location", isAuthenticated, function(req, res) {
    	res.render("location", {
      		layout: "cuser.handlebars"
    	});
  	});

  	// event route loads event form for posting new event
  	app.get("/event", isAuthenticated, function(req, res) {
    	res.render("event", {
      		layout: "cuser.handlebars"
    	});
  	});

   	//route loads donation history of user
  	app.get("/userhistory", isAuthenticated, function(req, res) {
  		db.DonationHistory.findAll({ include: [db.User], where: {UserId:req.session.passport.user.id} }).then(function(dbDonations) {
      		res.render("dhistory", {
        		dbDonations,
        		layout: "user.handlebars"
      		})
    	});
  	});

  	// route loads active user donations
  	app.get("/active-donations", isAuthenticated, function(req, res) {
    	db.Donations.findAll({ include: [db.User], where: {UserId:req.session.passport.user.id} }).then(function(dbDonations) {
      		res.render("dactive", {
        		dbDonations,
        		layout: "user.handlebars"
      		})
    	});
  	});

  	// /cuser/history route loads event history of charity user
  	app.get("/cuserhistory", isAuthenticated, function(req, res) {
    	db.EventHistory.findAll({ include: [db.Charity], where: {charityKey: req.session.passport.user.charityKey} }).then(function(dbEvents) {
      		res.render("ehistory", {
        		dbEvents,
        		layout: "cuser.handlebars"
      		});
    	});
  	});

  	// /cuser/history route loads event history of charity user
  	app.get("/active-events", isAuthenticated, function(req, res) {
    	db.Events.findAll({ include: [db.Charity], where: {charityKey: req.session.passport.user.charityKey} }).then(function(dbEvents) {
      		res.render("eactive", {
        		dbEvents,
        		layout: "cuser.handlebars"
      		});
    	});
  	});

  	// list-events route loads list view of all events
  	app.get("/list-events", function(req, res) {
    	db.Events.findAll({ }).then(function(dbEvents){
      		const context = {
        		events: dbEvents.map(event => {
          			return {
						name: event.name,
						description: event.description,
						id: event.id,
						charityId: event.CharityId
          			}
        		})
      		};
      		if (req.user) {
        		if(req.user.type == "charity") {
          			res.render("listEvents", {
            			events: context.events,
            			layout: "cuser.handlebars"
          			});
        		}
        		else {
          			res.render("listEvents", {
            			events: context.events,
            			layout: "user.handlebars"
          			});
        		}
      		}
      		else {
        		res.render("listEvents", {
          			events : context.events
        		});
      		}
    	});
  	});

  	// Route for logging user out
  	app.get("/logout", function(req, res) {
    	req.logout();
    	res.redirect("/");
  	});
};