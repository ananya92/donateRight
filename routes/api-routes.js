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

  // list-events route loads list view of all events
  app.get("/list-events", function(req, res) {
    db.Events.findAll({ }).then(function(dbEvents){
      const context = {
        events: dbEvents.map(event => {
          return {
            name: event.name,
            description: event.description
          }
        })
      }
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
    console.log(req.body);
    if(req.body.charityKey) {
      db.User.update({ type: "charity" }, {
        where: {
          email: req.body.email
        }
      })
      .then(function(dbUser) {
        //authenticating after updating the user
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

  // signing up a new user
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

  //register a new charity
  app.post("/api/registerCharity", function(req, res) {
    db.Charity.create({
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      charityKey: req.body.charityKey,
      description: req.body.description
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