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

    Matche.getCrud(req.params.id, function (err, matche) {
        if (err) return res.status(404).json( {error:err});

        matche.patch(req.body, function (err,resul) {
            if (err) {
                if (err instanceof errors.UnicityError||err instanceof errors.PropertyError) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    return res.status(500).json(err);
                }
            }
            return res.json(resul);
        });
    });
};

/**
 * DELETE /matches/:id
 */
exports.del = function (req, res) {
    Matche.getCrud(req.params.id, function (err, matche) {
        if (err) return res.status(404).json(err);
        matche.del(function (err) {
            if (err) return res.status(500).json(err);
            return res.json({deleted:'ok', match: matche});
        });
    });
};

/**
 * GET /histo/users/:id
 */
exports.getByUserValide = function (req, res) {
    Matche.getByUserValide(req.params.id, function (err, matches) {
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
 * POST /usersnext/histo
 */
exports.getByUserValideNext= function (req,res) {
    Matche.getByUserValideNext(req.body, function (err, matches) {
        if (err) {
            return res.status(404).json({
                pathname: '/usersnext/histo',
                error: err
            });
        }
        return res.json(matches);
    })
};
/**
 * GET /unvalid/matches/users/:id
 */
exports.getByUserNonValide = function (req, res) {
    Matche.getByUserNonValide(req.params.id, function (err, matches) {
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
 * POST /unvalid/usersnext/matches
 */
exports.getByUserNonValideNext= function (req,res) {
    Matche.getByUserNonValideNext(req.body, function (err, matches) {
        if (err) {
            return res.status(404).json({
                pathname: '/unvalid/usersnext/matches',
                error: err
            });
        }
        return res.json(matches);
    })
};

/**
 * GET /unvalid/matches/users/:id
 */
exports.getByUserNonValideTot= function (req,res) {
    Matche.getByUserNonValideTot(req.params.id, function (err, matches) {
        if (err) {
            return res.status(404).json({
                pathname: '/all/unvalid/matches/users/:id',
                error: err
            });
        }
        return res.json(matches);
    })
};

/**
 * POST /matches/between
 */
exports.getBetween= function (req,res) {
    Matche.getBetween(req.body, function (err, matches) {
        if (err) {
            return res.status(404).json({
                pathname: '/matches/between',
                error: err
            });
        }
        return res.json(matches);
    })
};



/**
 * POST /matches/result
 * */

exports.setResult=function(req,res){
    Matche.setResult(req.body,function(err,matche){
        if (err) {
            return res.status(404).json({
                pathname: '/matches/result',
                error: err
            });
        }
        return res.json(matche);
    })
};
