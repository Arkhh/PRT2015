// users.js
// Routes to CRUD users.

var URL = require('url');

var errors = require('../models/errors');
var Piece = require('../models/piece');

function getUserURL(piece) {
    return '/pieces/' + encodeURIComponent(piece._id);
}

/**
 * GET /pieces
 */
exports.list = function (req, res, next) {
    Piece.getAll(function (err, pieces) {
        if (err) return next(err);

        res.json('piece', {
            Piece: Piece,
            pieces: pieces,
            name: req.query.name,   // Support pre-filling create form
            error: req.query.error,     // Errors creating; see create route
        });
    });
};

/**
 * POST /pieces {, ...}
 */
exports.create = function (req, res, next) {
    Piece.create({

        name: req.body.name,
        quantity:req.body.quantity,
        limit:req.body.limit
    }, function (err, piece) {
        if (err) {
            if (err instanceof errors.ValidationError) {
                // Return to the create form and show the error message.
                // TODO: Assuming username is the issue; hardcoding for that
                // being the only input right now.
                // TODO: It'd be better to use a cookie to "remember" this info,
                // e.g. using a flash session.
                return res.redirect(URL.format({
                    pathname: '/pieces',
                    query: {
                        id:req.body.id,
                        name: req.body.name,
                        quantity:req.body.quantity,
                        limit:req.body.limit,
                        error: err.message
                    },
                }));
            } else {
                return next(err);
            }
        }
        res.json(piece);
    });
};

/**
 * GET /pieces/:id
 */
exports.show = function (req, res, next) {
    Piece.get(req.params.id, function (err, pieces) {
        // TODO: Gracefully "no such user" error. E.g. 404 page.
        if (err) return next(err);
        // TODO: Also fetch and show followers? (Not just follow*ing*.)

            res.json('piece', {
                Piece: Piece,
                pieces: pieces,
                name: req.query.name,   // Support pre-filling create form
                error: req.query.error,     // Errors creating; see create route
            });

    });
};


/**
 * POST /users/:username {username, ...}
 */
exports.edit = function (req, res, next) {
    Piece.edit({
        id:req.body.id,
        name: req.body.name,
        quantity:req.body.quantity,
        limit:req.body.limit}
        ,function (err, piece) {
        // TODO: Gracefully "no such user" error. E.g. 404 page.
        if (err) return next(err);
        user.patch(req.body, function (err) {
            if (err) {
                if (err instanceof errors.ValidationError) {
                    // Return to the edit form and show the error message.
                    // TODO: Assuming username is the issue; hardcoding for that
                    // being the only input right now.
                    // TODO: It'd be better to use a cookie to "remember" this
                    // info, e.g. using a flash session.
                    return res.redirect(URL.format({
                        pathname: getUserURL(user),
                        query: {
                            username: req.body.username,
                            error: err.message,
                        },
                    }));
                } else {
                    return next(err);
                }
            }
            res.json('piece', {
                Piece: Piece,
                pieces: pieces,
                name: req.query.name,   // Support pre-filling create form
                error: req.query.error,     // Errors creating; see create route
            });
        });
    });
};
