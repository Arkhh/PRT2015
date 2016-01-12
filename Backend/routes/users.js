// users.js
// Routes to CRUD users.

var URL = require('url');

var errors = require('../models/errors');
var User = require('../models/user');

function getUserURL(user) {
    return '/users/' + encodeURIComponent(user.email);
}

/**
 * GET /users
 */
exports.list = function (req, res) {
    User.getAll(function (err, users) {
        if (err) return res.json(err);
        return res.json('users', {
            User: User,
            users: users
        })
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
            return res.json({
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
            return res.json({
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
        if (err) return res.json( {error:err});

        user.patch(req.body, function (err) {
            if (err) {
                if (err instanceof errors.UnicityError||err instanceof errors.PropertyError) {
                    return res.json({
                            error: err
                    });
                } else {
                    return res.json(err);
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
        if (err) return res.json( {error:[{message: [err]}]});
        return res.json(user);
    })
};
/**
 * DELETE /users/:username
 */
exports.del = function (req, res) {
    User.get(req.params.id, function (err, user) {
        if (err) return res.json(err);
        user.del(function (err) {
            if (err) return res.json(err);
            return res.json({deleted:'ok', user: user});
        });
    });
};