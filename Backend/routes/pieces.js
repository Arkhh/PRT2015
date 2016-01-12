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
        if (err) res.json(err);

        return res.json('piece', {
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
        if (err){
            return res.json({
                pathname: '/pieces',
                error: err
            });
        }

       return res.json(piece);
    });
};

/**
 * GET /pieces/:id
 */
exports.show = function (req, res, next) {
    Piece.get(req.params.id, function (err, piece) {

        if (err) {
            return res.json({
                pathname: '/pieces/:id',
                error: err
            });
        }
        res.json(piece);

    });
};


/**
 * POST /users/:id {id, ...}
 */
exports.edit = function (req, res, next) {
    Piece.get(req.params.id, function (err, piece) {
        // TODO: Gracefully "no such user" error. E.g. 404 page.
        if (err) return next(err);
        piece.patch(req.body, function (err) {
            if (err) return next(err);
            if (err) {
                if (err instanceof errors.UnicityError||err instanceof errors.PropertyError) {
                    return res.json({
                            error: err.message
                    });
                } else {
                    return res.json(err);
                }
            }
            return res.json(piece);
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
            res.json({deleted:'ok', piece: piece});

        });
    });
};
