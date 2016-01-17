// matches.js
// Routes to CRUD matches.

var URL = require('url');

var errors = require('../models/errors');
var Matche = require('../models/matche');



/**
 * GET /matches
 */
exports.list = function (req, res) {
    Matche.getAll(function (err, matches) {
        if (err) return res.status(500).json(err);
        return res.json(matches)
    })
};

/**
 * POST /matches
 */
exports.create = function (req, res) {
    Matche.create({
        idJ1: req.body.idJ1,
        idJ2: req.body.idJ2,
        gainJ1: req.body.gainJ1,
        gainJ2: req.body.gainJ2,
        perteJ1:req.body.perteJ1,
        perteJ2:req.body.perteJ2,
        date:req.body.date
    }, function (err, matche) {
        if (err) {
            return res.status(500).json({
                pathname: '/matches',
                error: err
            });
        }
        return res.json(matche);
    });
};

/**
 * GET /matches/:id
 */
exports.show = function (req, res) {
    Matche.get(req.params.id, function (err, matche) {
        if (err) {
            return res.status(404).json({
                pathname: '/Matches/:id',
                error: err
            });
        }
        return res.json(matche);
    })
};


/**
 * POST /matches/:id {}
 */
exports.edit = function (req, res) {

    Matche.get(req.params.id, function (err, matche) {
        if (err) return res.status(404).json( {error:err});

        matche.patch(req.body, function (err) {
            if (err) {
                if (err instanceof errors.UnicityError||err instanceof errors.PropertyError) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    return res.status(500).json(err);
                }
            }
            return res.json(matche);
        });
    });
};

/**
 * DELETE /matches/:id
 */
exports.del = function (req, res) {
    Matche.get(req.params.id, function (err, matche) {
        if (err) return res.status(404).json(err);
        matche.del(function (err) {
            if (err) return res.status(500).json(err);
            return res.json({deleted:'ok', match: matche});
        });
    });
};

/**
 * GET /matches/users/:id
 */
exports.getByUser = function (req, res) {
    Matche.getByUser(req.params.id, function (err, matches) {
        if (err) {
            return res.status(404).json({
                pathname: '/matches/users/:id',
                error: err
            });
        }
        return res.json(matches);
    })
};

/**
 * POST /matches/usersnext
 */
exports.getByUserNext= function (req,res) {
    Matche.getByUserNext(req.body, function (err, matches) {
        if (err) {
            return res.status(404).json({
                pathname: '/matches/usersnext',
                error: err
            });
        }
        return res.json(matches);
    })
}
