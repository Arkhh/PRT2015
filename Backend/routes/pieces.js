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
        if (err) return next(err);
        /*{
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
                        error: err.message,
                    },
                }));
            } else {
                return next(err);
            }
        }*/
        res.json(piece);
    });
};

/**
 * GET /pieces/:id
 */
exports.show = function (req, res, next) {
    Piece.get(req.params.id, function (err, piece) {
        // TODO: Gracefully "no such user" error. E.g. 404 page.
        if (err) return next(err);
        // TODO: Also fetch and show followers? (Not just follow*ing*.)

        res.json(piece);

    });
};


/**
 * POST /users/:username {username, ...}
 */
exports.edit = function (req, res, next) {
    Piece.get(req.params.id, function (err, piece) {
        // TODO: Gracefully "no such user" error. E.g. 404 page.
        if (err) return next(err);
        piece.patch(req.body, function (err) {
            if (err) return next(err);
           /* if (err) {
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
            }*/
            res.json(piece);
        });
    });
};

/**
 * DELETE /users/:username
 */
exports.del = function (req, res, next) {
    Piece.get(req.params.id, function (err, piece) {
        // TODO: Gracefully handle "no such user" error somehow.
        // E.g. redirect back to /users with an info message?
        if (err) return next(err);
        piece.del(function (err) {
            if (err) return next(err);
           res.json(piece);
        });
    });
};
