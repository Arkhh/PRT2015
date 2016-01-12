// events.js
// Routes to CRUD events.

var URL = require('url');

var errors = require('../models/errors');
var Event = require('../models/event');
var User = require('../models/user');

function getNameEvent(event) {
    return '/events/' + encodeURIComponent(event.nom);
}

/**
 * GET /events
 */

exports.list = function (req, res, next) {
    Event.getAll(function (err, events) {
        if (err) return next(err);
        res.json('events', {
            Event: Event,
            events: events,
            nom: req.query.nom,   // Support pre-filling create form
            lieu: req.query.lieu,
            prix: req.query.prix,
            description: req.query.description,
            capacite: req.query.capacite,
            valid: req.query.valid,
            date: req.query.date,
            shortDescription: req.query.shortDescription,
            error: req.query.error,     // Errors creating; see create route
        });
    });
};

/**
 * POST /users {username, ...}
 */
exports.create = function (req, res) {
    var admin = false;
    console.log('ADMIN');
    console.log(admin);

    User.get(req.body.idCreateur, function (err, user) {
        if (err) return res.json( {error:err});
        admin=user.isAdmin();
        console.log('ADMIN 2');
        console.log(admin);
            Event.create({
                nom: req.body.nom,
                lieu: req.body.lieu,
                prix: req.body.prix,
                description: req.body.description,
                capacite: req.body.capacite,
                valid: admin,
                date: req.body.date,
                shortDescription: req.body.shortDescription
            }, function (err, event) {
                if (err) {
                    return res.json({
                        pathname: '/events',
                        error: err
                    });
                }
                return res.json(event);
            });
    })
};


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