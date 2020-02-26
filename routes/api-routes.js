var db = require("../models");
var passport = require("../config/passport");

module.exports = function(app) {
  	// route to get data about a particular user
  	app.get("/api/user/id", function(req, res) {
    	db.User.findOne({
      		where: {
        		id: req.session.passport.user.id
      		}
    	}).then(function(dbUser) {
      		res.json(dbUser);
    	})
	});

	// Route for getting some data about our user to be used client side
	app.get("/api/user_data", function(req, res) {
    	if (!req.user) {
      		// The user is not logged in, send back an empty object
      		res.json({});
		} 
		else {
      		// Otherwise send back the username
      		res.json({
        		username: req.user.email,
      		});
    	}
  	});
	  
	// route to get data about a particular event
  	app.get("/api/event/:id", function(req, res) {
    	db.Events.findOne({
      		where: {
        		id: req.params.id,
      		},
      		include: [db.Charity]
    	}).then(function(data) {
      		const context = {
          		name: data.name,
				description: data.description,
				charityName: data.Charity.name,
				charityDesc: data.Charity.description,
				contact: data.Charity.phoneNumber,
				email: data.Charity.email
      		}
      		res.json(context);
      		res.end();
    	})
	});
	  
	// route to get data about a particular event
  	app.get("/api/donation/:id", function(req, res) {
    	db.Donations.findOne({
      		where: {
        		id: req.params.id,
      		},
      		include: [db.User]
    	}).then(function(data) {
      		const context = {
				name: data.User.firstName + " " + data.User.lastName,
				description: data.description,
				category: data.category,
				contact: data.User.phoneNumber,
				email: data.User.email
      		}
      		res.json(context);
      		res.end();
    	})
  	});

  	// route to get data about the searched charity
  	app.get("/api/charity/:id", function(req, res) {
    	db.Charity.findOne({
      		where: {
        		id: req.params.id
      		}
    	}).then(function(dbCharity) {
      		res.json(dbCharity);
    	})
  	});

  	// route to get data about the charity linked to the active user
 	app.get("/api/active", function(req, res) {
    	db.Charity.findOne({
      		where: {
        		charityKey: req.session.passport.user.charityKey
      		}
    	}).then(function(dbCharity) {
      		res.json(dbCharity);
    	})
  	});

  	// route to get data about location markers
  	app.get("/api/markers", function(req, res) {
    	db.Donations.findAll({include: [db.User]}).then(function(dbDonations) {
      		db.Charity.findAll({}).then(function(dbCharity){
        		db.Events.findAll({include: [db.Charity]}).then(function(dbEvents) {
          			var data= {
						donation: dbDonations,
						charity: dbCharity,
						event: dbEvents
          			}
          			res.json(data);
        		});
      		});
    	});
  	});
  
  	// list-donations route loads list view of all donations
  	app.get("/list-donations", function(req, res) {
    	db.Donations.findAll({ }).then(function(dbDonations){
      		const context = {
        		donations: dbDonations.map(donation => {
					return {
						category: donation.category,
						description: donation.description,
						id: donation.id,
					}
        		})
      		};
			if (req.user) {
				if(req.user.type == "charity") {
					res.render("listDonations", {
						donations: context.donations,
						layout: "cuser.handlebars"
					});
				}
				else {
					res.render("listDonations", {
						donations: context.donations,
						layout: "user.handlebars"
					});
				}
			}
			else {
				res.render("listDonations", {
					donations : context.donations
				});
			}
    	});
  	});


  	// route to get list of all events
  	app.get("/api/user", function(req, res) {
    	db.User.findAll({ }).then(function(dbUser) {
      		res.json(dbUser);
    	})
  	});

  	// route to get list of all events
   	app.get("/api/event", function(req, res) {
     	db.Events.findAll({ }).then(function(dbEvents) {
       		res.json(dbEvents);
     	})
   	});

  	// route to get data about a particular donation
  	app.get("/api/donation", function(req, res) {
    	db.Donations.findAll({ include: [db.User] }).then(function(dbDonations) {
      		res.json(dbDonations);
    	})
  	});

  	// route to get data about the searched charity
  	app.get("/api/charity", function(req, res) {
    	db.Charity.findAll({ }).then(function(dbCharity) {
      		res.json(dbCharity);
    	})
  	});

  	// logging out a user
  	app.get("/logout", function(req, res) {
    	db.User.update({ type: null }, {
      		where: {
        		email: req.session.passport.user.email
      		}
    	})
		.then(function() {
			req.logout();
			res.redirect("/");
		})
		.catch(function(err) {
			console.log(err);
		})
  	});

  	// logging in a user
  	app.post("/api/login", function(req, res, next) {
    	if(req.body.charityKey) {
      		db.User.update({ type: "charity" }, {
        		where: {
          			email: req.body.email
        		}
      		})
      		.then(function(dbUser) {
        		passport.authenticate('local', function(err, user, info) {
					if (err) { return next(err); }
					if (!user) { return res.redirect('/login'); }
						req.logIn(user, function(err) {
							if (err) { return next(err); }
							return res.redirect('/user');
						});
        		})(req, res, next);
      		})
      		.catch(function(err) {
        		res.status(401).json(err);
      		});
    	}
    	else {
     		passport.authenticate('local', function(err, user, info) {
        		if (err) { return next(err); }
        		if (!user) { return res.redirect('/login'); }
        			req.logIn(user, function(err) {
          				if (err) { return next(err); }
          				return res.redirect('/user');
        			});
      		})(req, res, next);
    	}
  	});

  	// route to POST a new user
  	app.post("/api/register", function(req, res) {
    	db.User.create({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			phoneNumber: req.body.phoneNumber,
			email: req.body.email,
			password: req.body.password,
			charityKey: req.body.charityKey
		})
      	.then(function() {
        	res.redirect('/login');
      	})
      	.catch(function(err) {
        	res.status(401).json(err);
      	});
  	});

  	// route to POST a new charity
  	app.post("/api/registerCharity", function(req, res) {
    	db.Charity.create({
			name: req.body.name,
			phoneNumber: req.body.phoneNumber,
			email: req.body.email,
			charityKey: req.body.charityKey,
			description: req.body.description
    	})
      	.then(function() {
        	res.redirect('/register');
      	})
      	.catch(function(err) {
        	res.status(401).json(err);
      	});
  	});

  	// route to POST a new event
  	app.post("/api/event", function(req, res) {
    	db.Charity.findOne({where: {charityKey: req.session.passport.user.charityKey}}).then(function(dbCharity) {
      		db.Events.create({
				description: req.body.description,
				lat: req.body.lat,
				lng: req.body.lng,
				charityKey: req.session.passport.user.charityKey,
				CharityId: dbCharity.dataValues.id
      		})
      		.then(function(dbEvent) {
        		console.log("success");
      		})
      		.catch(function(err) {
        		res.status(401).json(err);
      		})
    	})
    	.catch(function(err) {
      		res.status(401).json(err);
    	})
  	});

  	// route to POST a new event history item
  	app.post("/api/eventHistory", function(req, res) {
    	db.Charity.findOne({where: {charityKey: req.session.passport.user.charityKey}}).then(function(dbCharity) {
      		db.EventHistory.create({
				description: req.body.description,
				charityKey: req.session.passport.user.charityKey,
				CharityId: dbCharity.dataValues.id
      		})
      		.then(function() {
        		console.log("success as well");
      		})
      		.catch(function(err) {
        		res.status(401).json(err);
      		})
    	})
    	.catch(function(err) {
      		res.status(401).json(err);
    	})
  	});

  	// route to POST a new donation
  	app.post("/api/donation", function(req, res) {
    	db.Donations.create({
			description: req.body.description,
			category: req.body.category,
			lat: req.body.lat,
			lng: req.body.lng,
			UserId: req.user.id
    	})
      	.then(function() {
        	//add a thank you message
        	console.log("success");
      	})
      	.catch(function(err) {
        	res.status(401).json(err);
      	});
  	});

  	// route to POST a new donation history item
  	app.post("/api/donationHistory", function(req, res) {
    	db.DonationHistory.create({
			description: req.body.description,
			category: req.body.category,
			UserId: req.user.id
    	})
      	.then(function() {
        	//add a thank you message
        	console.log("success as well");
      	})
      	.catch(function(err) {
        	res.status(401).json(err);
      	});
  	});

  	// route to PUT (update) a charity
  	app.put("/api/charity", function(req, res) {
    	db.Charity.update({
			name: req.body.name,
			phoneNumber: req.body.phone,
			email: req.body.email,
			description: req.body.description,
			lat: req.body.lat,
			lng: req.body.lng
    	},
    	{
      		where: {
        		charityKey: req.session.passport.user.charityKey
      		}
    	})
    	.then(function() {
      		console.log("success");
    	})
    	.catch(function(err) {
      		res.status(401).json(err);
    	});
  	});

  	// route to PUT (update) all user keys
 	app.put("/api/userkeys", function(req, res) {
    	db.User.update({ 
			charityKey: null 
		},
    	{
      		where: {
        		charityKey: req.session.passport.user.charityKey
      		}
    	})
    	.then(function() {
      		console.log("successfully updated user's charityKeys");
    	})
    	.catch(function(err) {
      		res.status(401).json(err);
    	});
  	});

  	// route to PUT (update) a user
  	app.put("/api/user", function(req, res) {
    	db.User.update({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			phoneNumber: req.body.phoneNumber,
			email: req.body.email
    	},
    	{
      		where: {
        		id: req.session.passport.user.id
      		}
    	})
    	.then(function() {
      		console.log("successfully updated user");
    	})
    	.catch(function(err) {
      		res.status(401).json(err);
    	});
  	});

  	//route to delete a donation
 	app.delete("/api/donation/:id", function(req, res) {
    	db.Donations.destroy({
      		where: {
        		id: req.params.id
      		}
    	}).then(function(dbDonation) {
      		res.json(dbDonation);
    	});
  	});

  	//route to delete an event
  	app.delete("/api/event/:id", function(req, res) {
    	db.Events.destroy({
      		where: {
        		id: req.params.id
      		}
    	}).then(function(dbEvent) {
      		res.json(dbEvent);
    	});
  	});

  	//route to delete a user
  	app.delete("/api/user/:id", function(req, res) {
    	var id = req.session.passport.user.id;
    	db.User.destroy({
      		where: {
        		id: id
      		}
    	}).then(function(dbUser) {
      		res.json(dbUser);
    	});
  	});

  	//route to delete a charity
  	app.delete("/api/charity/:id", function(req, res) {
    	var id = req.session.passport.user.charityKey;
    	db.Charity.destroy({
      		where: {
        		charityKey: id
      		}
    	}).then(function(dbCharity) {
      		res.json(dbCharity);
    	});
  	});

  	//route to get donations by category
  	app.get("/api/donation/category/:category", function(req, res) {
    	db.Donations.findAll({
      		where: {
        		category: req.params.category
      		}
    	}).then(function(dbDonations) {
      		res.render(dbDonations);
      		const context = {
        		donations: dbDonations.map(donation => {
          			return {
						category: donation.category,
						description: donation.description,
						id: donation.id,
          			}
        		})
      		};
      		if (req.user) {
        		if(req.user.type == "charity") {
          			res.render("listDonations", {
						donations: context.donations,
						category: req.params.category,
						layout: "cuser.handlebars"
          			});
        		}
        		else {
          			res.render("listDonations", {
						donations: context.donations,
						category: req.params.category,
						layout: "user.handlebars"
          			});
        		}
      		}
      		else {
        		res.render("listDonations", {
					donations : context.donations,
					category: req.params.category,
        		});
      		}
    	});
  	});
};