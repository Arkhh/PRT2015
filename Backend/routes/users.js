// users.js
// Routes to CRUD users.

var URL = require('url');

var errors = require('../models/errors');
var User = require('../models/user');

function getUserURL(user) {
    return '/users/' + encodeURIComponent(user.username);
}

/**
 * GET /users
 */
exports.list = function (req, res) {
    User.getAll(function (err, users) {
        if (err) return res.json(err);
        return res.json('users', {
            User: User,
            users: users,
            id: req.query.id,   // Support pre-filling create form
            error: req.query.error     // Errors creating; see create route
        });
    });
};

/**
 * POST /users {username, ...}
 */
exports.create = function (req, res) {
    User.create({
        id: req.body.id,
        password: req.body.password
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
        if (err)
        {
            return res.json({
                pathname: '/users/:id',
                error: err
            });
        }
        res.json(user);
    });
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
 * DELETE /users/:username
 */
exports.del = function (req, res) {
    User.get(req.params.id, function (err, user) {
        if (err) return res.json(err);
        user.del(function (err) {
            if (err) return res.json(err);
            res.json({deleted:'ok', user: user});
        });
    });
};
