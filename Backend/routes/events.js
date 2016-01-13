// events.js
// Routes to CRUD events.

var URL = require('url');

var errors = require('../models/errors');
var Event = require('../models/event');

function getNameEvent(event) {
    return '/events/' + encodeURIComponent(event.nom);
}

/**
 * GET /events
 */

exports.list = function (req, res, next) {
    Event.getAll(function (err, events) {
        if (err) return next(err);
        res.json(events);
    });
};

/**
 * POST /users {username, ...}
 */
exports.create = function (req, res, next) {
    console.log('Bonjour');
    //var adminOK = Event.isAdmin(req.body.id);
   // console.log('ICI');
   // console.log(adminOK);
   // if (Event.isAdmin(machin)) {
        Event.create({
            nom: req.body.nom,
            lieu: req.body.lieu,
            prix: req.body.prix,
            description: req.body.description,
            capacite: req.body.capacite,
            valid: 0,
            date: req.body.date,
            shortDescription: req.body.shortDescription
        }, function (err, event) {
            if (err) {
                /*if (err instanceof errors.ValidationError) {
                 // Return to the create form and show the error message.
                 // TODO: Assuming username is the issue; hardcoding for that
                 // being the only input right now.
                 // TODO: It'd be better to use a cookie to "remember" this info,
                 // e.g. using a flash session.
                 return res.redirect(URL.format({
                 pathname: '/users',
                 query: {
                 username: req.body.username,
                 error: err.message,
                 },
                 }));*/
                //} else {
                return next(err);
                //}
            }
            //res.redirect();
            res.json(event);
        });
    };
  /*  else {
        Event.create({
            nom: req.body.nom,
            lieu: req.body.lieu,
            prix: req.body.prix,
            description: req.body.description,
            capacite: req.body.capacite,
            valid: 0,
            date: req.body.date,
            shortDescription: req.body.shortDescription
        }, function (err, event) {
            if (err) {
                /*if (err instanceof errors.ValidationError) {
                 // Return to the create form and show the error message.
                 // TODO: Assuming username is the issue; hardcoding for that
                 // being the only input right now.
                 // TODO: It'd be better to use a cookie to "remember" this info,
                 // e.g. using a flash session.
                 return res.redirect(URL.format({
                 pathname: '/users',
                 query: {
                 username: req.body.username,
                 error: err.message,
                 },
                 }));*/
                //} else {*/
               // return next(err);
                //}
           // }
            //res.redirect();
         /*   res.json(event);
        });
    }
};*/

/**
 * DELETE /users/:username
 */
exports.del = function (req, res, next) {
    Event.get(req.params.id, function (err, event) {
        // TODO: Gracefully handle "no such user" error somehow.
        // E.g. redirect back to /users with an info message?
        if (err) return next(err);
        event.del(function (err) {
            if (err) return next(err);
            res.json(event);
        });
    });
};

/**
 * GET /users/:username
 */
exports.show = function (req, res, next) {
    Event.get(req.params.id, function (err, event) {
        if (err) res.json(err);
        res.json(event);

    });
};

/**
 * POST /users/:username {username, ...}
 */
exports.edit = function (req, res, next) {
    Event.get(req.params.id, function (err, event) {
        // TODO: Gracefully "no such user" error. E.g. 404 page.
        if (err) return next(err);
        event.patch(req.body, function (err) {
            if (err) {
                if (err instanceof errors.ValidationError) {
                    // Return to the edit form and show the error message.
                    // TODO: Assuming username is the issue; hardcoding for that
                    // being the only input right now.
                    // TODO: It'd be better to use a cookie to "remember" this
                    // info, e.g. using a flash session.
                    /*return res.json(URL.format({
                        pathname: getNameEvent(event),
                        query: {
                            id: req.body.id,
                            error: err.message,
                        },
                    }));*/
                    return console.log('error machin bidule');
                } else {
                    return next(err);
                }
            }
            res.json(event);
        });
    });
};