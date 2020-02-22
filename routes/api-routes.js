var db = require("../models");
var passport = require("../config/passport");
module.exports = function(app) {
  app.get("/api/user/:id", function(req, res) {
    db.User.findOne({
      where: {
        id: req.params.id
      }
    }).then(function(dbUser) {
      res.json(dbUser);
    })
  });
  app.get("/api/event/:id", function(req, res) {
    // route to get data about a particular event
    db.Events.findOne({
      where: {
        id: req.params.id
      }
    }).then(function(dbEvents) {
      res.json(dbEvents);
    })
  });
  app.get("/api/donation/:id", function(req, res) {
    // route to get data about a particular donation
    db.Donations.findOne({
      where: {
        id: req.params.id
      }
    }).then(function(dbDonations) {
      res.json(dbDonations);
    })
  });
  app.get("/api/charity/:id", function(req, res) {
    // route to get data about the searched charity
    db.Charity.findOne({
      where: {
        id: req.params.id
      }
    }).then(function(dbCharity) {
      res.json(dbCharity);
    })
  });
  app.get("/api/user", function(req, res) {
    // route to get list of all events
    db.User.findAll({ }).then(function(dbUser) {
      res.json(dbUser);
    })
  });
  app.get("/api/event", function(req, res) {
    // route to get list of all events
    db.Events.findAll({ }).then(function(dbEvents) {
      res.json(dbEvents);
    })
  });
  app.get("/api/donation", function(req, res) {
    // route to get data about a particular donation
    db.Donations.findAll({ include: [db.User] }).then(function(dbDonations) { //remember to restart server after changing clauses
      res.json(dbDonations);
    })
  });
  app.get("/api/charity", function(req, res) {
    // route to get data about the searched charity
    db.Charity.findAll({ }).then(function(dbCharity) {
      res.json(dbCharity);
    })
  });
  // logging out a user
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });
  // logging in a user
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    // console.log(req.body);
    if(req.body.charityKey) {
      db.User.findOne({
        where: {
          charityKey: req.body.charityKey
        }
      })
      .then(function(dbUser) {
        req.user.userType = "charity";
        res.json(req.user); //might be dbUser... check later
      })
      .catch(function(err) {
        res.status(401).json(err);
      });
    }
    else {
      req.user.userType = "regular";
      res.json(req.user);
    }
  });
  // signing up a new user
  app.post("/api/register", function(req, res) {
    db.User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      password: req.body.password
    })
      .then(function() {
        res.redirect('/login');
      })
      .catch(function(err) {
        res.status(401).json(err);
      });
  });
  app.post("/api/event", function(req, res) {
    // route to POST a new event
  });
  app.post("/api/donation", function(req, res) {
    // route to POST a new donation
    db.Donations.create({
      description: req.body.description,
      category: req.body.category,
      lat: req.body.lat,
      lng: req.body.lng,
      UserId: req.user.id
    })
      .then(function() {
        //add a thank you message
        res.redirect('/user') //need to fix, not finding address, maybe something to do with handlebars
      })
      .catch(function(err) {
        res.status(401).json(err);
      });
  });
};