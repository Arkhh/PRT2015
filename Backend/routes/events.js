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
        if (err) return res.status(500).json( {error:err});
        res.json(events);
    });
};

/**
 * POST /users {username, ...}
 */

exports.create = function (req, res) {
    var valid = 0;
    User.get(req.body.idCreateur, function (err, user) {
        if (err) return res.status(404).json( {error:err});
        admin=user.isAdmin();
        if(admin) valid=1;
        Event.create({
            nom: req.body.nom,
            lieu: req.body.lieu,
            date: req.body.date,
            prix: req.body.prix,
            valid: valid
        }, function (err, user) {
            if (err) {
                return res.status(500).json({
                    pathname: '/users',
                    error: err
                });
            }
            return res.json(user);
        });
    })
};


/**
 * DELETE /users/:username
 */
exports.del = function (req, res, next) {
    Event.get(req.params.id, function (err, event) {
        if (err) return res.status(404).json(err);
        event.del(function (err) {
            if (err) return res.status(500).json(err);
            res.json(event);
        });
    });
};

/**
 * GET /users/:username */
exports.show = function (req, res, next) {
    Event.get(req.params.id, function (err, event) {
        if (err) res.status(404).json(err);
        res.json(event);

    });
};

/**
 * POST /users/:username {username, ...}
 */
exports.edit = function (req, res) {

    Event.get(req.params.id, function (err, event) {
        if (err) return res.status(404).json( {error:err});

        event.patch(req.body, function (err) {
            if (err) {
                if (err instanceof errors.UnicityError||err instanceof errors.PropertyError) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    return res.status(500).json(err);
                }
            }
            return res.json(event);
        });
    });
};