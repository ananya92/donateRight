var db = require("../models");
var passport = require("../config/passport");

module.exports = function(app) {
  app.get("/api/event/:id", function(req, res) {
    // route to get data about a particular event

  });

  app.get("/api/donation/:id", function(req, res) {
    // route to get data about a particular donation
    
  });

  app.get("/api/charity/:id", function(req, res) {
    // route to get data about the searched charity
    
  });

  app.get("/api/event", function(req, res) {
    // route to get list of all events

  });

  app.get("/api/donation", function(req, res) {
    // route to get data about a particular donation
    
  });

  app.get("/api/charity", function(req, res) {
    // route to get data about the searched charity
    
  });

  // logging out a user
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  // logging in a user
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    res.json(req.user);
  });

  // signing up a new user
  app.post("/api/signup", function(req, res) {
    db.User.create({
      email: req.body.email,
      password: req.body.password
    })
      .then(function() {
        res.redirect(307, "/api/login");
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
});

};

