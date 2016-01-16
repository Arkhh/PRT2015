// users.js
// Routes to CRUD users.

var URL = require('url');

var errors = require('../models/errors');
var User = require('../models/user');



/**
 * GET /users
 */
exports.list = function (req, res) {
    User.getAll(function (err, users) {
        if (err) return res.status(500).json(err);
        return res.json(users);
    })
};

/**
 * POST /users {username, ...}
 */
exports.create = function (req, res) {
    User.create({
        password: req.body.password,
        email: req.body.email,
        nom: req.body.nom,
        prenom: req.body.prenom
    }, function (err, user) {
        if (err) {
            return res.status(500).json({
                pathname: '/users',
                error: err
            });
        }
        return res.json(user);
    });
};



/**
 * GET /users/:id
 */
exports.show = function (req, res) {
    User.get(req.params.id, function (err, user) {
        if (err) {
            return res.status(404).json({
                pathname: '/users/:id',
                error: err
            });
        }
        return res.json(user);
    })
};

/**
 * POST /users/:id {username, ...}
 */
exports.edit = function (req, res) {

    User.get(req.params.id, function (err, user) {
        if (err) return res.status(404).json( {error:err});

        user.patch(req.body, function (err) {
            if (err) {
                if (err instanceof errors.UnicityError||err instanceof errors.PropertyError) {
                    return res.status(500).json({
                            error: err
                    });
                } else {
                    return res.status(500).json(err);
                }
            }
            return res.json(user);
        });
    });
};

/**
 * POST /auth/
 */
exports.connect = function (req, res){
    User.connect(
        {
        password: req.body.password,
        email: req.body.email}, function (err, user) {
        if (err) return res.status(404).json( {error:[{message: [err]}]});
        return res.json(user);
    })
};
/**
 * DELETE /users/:username
 */
exports.del = function (req, res) {
    User.get(req.params.id, function (err, user) {
        if (err) return res.status(404).json(err);
        user.del(function (err) {
            if (err) return res.status(500).json(err);
            return res.json({deleted:'ok', user: user});
        });
    });
};
/**
 * INSCRIPTION /users/inscription/:id
 */
exports.inscription = function (req, res) {
    User.get(req.params.id, function (err, user) {
        if (err) return res.status(404).json(err);
        user.inscription(req.body.idEvent, function (rel, err) {
            if (err) return res.status(500).json(err);
            return res.json(rel);
        });
    });
};