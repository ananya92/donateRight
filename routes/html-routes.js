// Author: Ananya Pramanik
// *********************************************************************************
// html-routes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************
// Requiring middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");
// Routes
// =============================================================
var db = require("../models");
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
        res.render("charitySearch", {
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
  // settings route for charites as to set location
  app.get("/settings", isAuthenticated, function(req, res) {
    res.render("charitySettings", {
      layout: "cuser.handlebars"
    });
  });
  // event route loads event form for posting new event
  app.get("/event", isAuthenticated, function(req, res) {
    res.render("event", {
      layout: "cuser.handlebars"
    });
  });
   // /user/history route loads donation history of user
   app.get("/user/history", isAuthenticated, function(req, res) {
    res.render("dhistory", {
      layout: "user.handlebars"
    });
  });
  // /cuser/history route loads event history of charity user
  app.get("/cuser/history", isAuthenticated, function(req, res) {
    res.render("ehistory", {
      layout: "cuser.handlebars"
    });
  });

  // list-donations route loads list view of all donations
  app.get("/list-donations", function(req, res) {
    if (req.user) {
      if(req.user.type == "charity") {
        res.render("listDonations", {
          layout: "cuser.handlebars"
        });
      }
      else {
        res.render("listDonations", {
          layout: "user.handlebars"
        });
      }
    }
    else {
      res.render("listDonations");
    }
  });
  // Route for logging user out
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });
  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the username
      res.json({
        username: req.session.passport.user.email,
      });
    }
  });
};