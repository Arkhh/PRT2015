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
exports.list = function (req, res, next) {
    User.getAll(function (err, users) {
        if (err) return next(err);
        res.json('users', {
            User: User,
            users: users,
            username: req.query.username,   // Support pre-filling create form
            error: req.query.error     // Errors creating; see create route
        });
    });
};

/**
 * POST /users {username, ...}
 */
exports.create = function (req, res, next) {
    User.create({
        username: req.body.username,
        password: req.body.password
    }, function (err, user) {
        if (err) {
            return res.json({
                pathname: '/users',
                error: err
            });
        }
        res.json(user);
    });
};



/**
 * GET /users/:username
 */
exports.show = function (req, res, next) {
    User.get(req.params.username, function (err, user) {
        // TODO: Gracefully "no such user" error. E.g. 404 page.
        if (err) return res.json(err);
        // TODO: Also fetch and show followers? (Not just follow*ing*.)
        user.getFollowingAndOthers(function (err, following, others) {
            if (err) return res.json(err);
            res.json('user', {
                User: User,
                user: user,
                username: req.query.username,   // Support pre-filling edit form
                error: req.query.error,   // Errors editing; see edit route
            });
        });
    });
};

/**
 * POST /users/:username {username, ...}
 */
exports.edit = function (req, res, next) {
    User.get(req.params.username, function (err, user) {
        // TODO: Gracefully "no such user" error. E.g. 404 page.
        if (err) return next(err);
        user.patch(req.body, function (err) {
            if (err) {
                if (err instanceof errors.UnicityError||err instanceof errors.PropertyError) {
                    // Return to the edit form and show the error message.
                    // TODO: Assuming username is the issue; hardcoding for that
                    // being the only input right now.
                    // TODO: It'd be better to use a cookie to "remember" this
                    // info, e.g. using a flash session.
                    return res.json({
                        pathname: getUserURL(user),
                        query: {
                            error: err.message
                        }
                    });
                } else {
                    return next(err);
                }
            }
            res.redirect(getUserURL(user));
        });
    });
};

/**
 * DELETE /users/:username
 */
exports.del = function (req, res, next) {
    User.get(req.params.username, function (err, user) {
        // TODO: Gracefully handle "no such user" error somehow.
        // E.g. redirect back to /users with an info message?
        if (err) return next(err);
        user.del(function (err) {
            if (err) return next(err);
            res.redirect('/users');
        });
    });
};
