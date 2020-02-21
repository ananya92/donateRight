// *********************************************************************************
// html-routes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************

// Dependencies
// =============================================================
var path = require("path");

// Routes
// =============================================================
module.exports = function(app) {

  // Each of the below routes just handles the HTML page that the user gets sent to.

  // index route loads index.html - home page when user hasn't logged in
  app.get("/", function(req, res) {
    res.render("index");
  });

  // user route loads user-home.html - home page after a regular user logs-in
  app.get("/user", function(req, res) {
    //res.sendFile(path.join(__dirname, "../public/user-home.html"));
  });

  // cuser route loads cuser-home.html - home page after a charity user logs-in
  app.get("/cuser", function(req, res) {
    //res.sendFile(path.join(__dirname, "../public/cuser-home.html"));
  });

  // register route loads registration.html - registration page of new user 
  app.get("/register", function(req, res) {
    //res.sendFile(path.join(__dirname, "../public/registration.html"));
  });

  // login route loads login.html - login page for existing user
  app.get("/login", function(req, res) {
    //res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  // donation route loads donation.html - donation form for posting new donation 
  app.get("/donation", function(req, res) {
    //res.sendFile(path.join(__dirname, "../public/donation.html"));
  });

  // charity route loads charitySearch.html - searching for a charity and loading its info and upcoming charity events
  app.get("/charity", function(req, res) {
    //res.sendFile(path.join(__dirname, "../public/charitySearch.html"));
  });

  // event route loads event.html - event form for posting new event
  app.get("/event", function(req, res) {
    //res.sendFile(path.join(__dirname, "../public/event.html"));
  });

   // /user/history route loads dhistory.html - donation history of user
   app.get("/user/history", function(req, res) {
    //res.sendFile(path.join(__dirname, "../public/dhistory.html"));
  });
  
  // /cuser/history route loads ehistory.html - event history of charity user
  app.get("/cuser/history", function(req, res) {
    //res.sendFile(path.join(__dirname, "../public/ehistory.html"));
  });

  // list-events route loads list view of all events
  app.get("/list-events", function(req, res) {

  });
  
  // list-donations route loads list view of all donations
  app.get("/list-donations", function(req, res) {

  });
};
