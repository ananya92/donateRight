var db = require("../models");

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

  app.post("/api/event", function(req, res) {
    // route to POST a new event
  });

  app.post("/api/donation", function(req, res) {
    // route to POST a new donation
});

};
