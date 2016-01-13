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
        if (err) return res.json(err);
        return res.json('matches', {
            Matche: Matche,
            matches: matches
        })
    })
};

/**
 * POST /matches
 */
exports.create = function (req, res) {
    Matche.create({
      /*  id1: req.body.id1,
        id2: req.body.id2,
        GainJ1: req.body.GainJ1,
        GainJ1: req.body.GainJ1,
        PerteJ1:req.body.PerteJ1,
        PerteJ2:req.body.PerteJ2*/
        date:req.body.date
    }, function (err, matche) {
        if (err) {
            return res.json({
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
            return res.json({
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
        if (err) return res.json( {error:err});

        matche.patch(req.body, function (err) {
            if (err) {
                if (err instanceof errors.UnicityError||err instanceof errors.PropertyError) {
                    return res.json({
                        error: err
                    });
                } else {
                    return res.json(err);
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
        if (err) return res.json(err);
        matche.del(function (err) {
            if (err) return res.json(err);
            return res.json({deleted:'ok', match: matche});
        });
    });
};
