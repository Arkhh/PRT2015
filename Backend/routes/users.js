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
        prenom: req.body.prenom,
        classement: 1000,
        totalVolee: 0,
        totalFond: 0,
        totalFrappe: 0,
        totalEndurance: 0,
        totalTechnique: 0,
        nbEvalVolee: 0,
        nbEvalFond: 0,
        nbEvalFrappe: 0,
        nbEvalEndurance: 0,
        nbEvalTechnique: 0
    }, function (err, user) {
        if (err) {
            return res.status(500).json({
                pathname: '/users',
                error: err
            });
        }
        user.createRelVolee();
        user.createRelFrappe();
        user.createRelFond();
        user.createRelTechnique();
        user.createRelEndurance();
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
 * noteVolee /notationVolee/:note
 */
exports.noteVolee = function (req, res) {
    User.get(req.params.id, function (err, user) {
        if (err) return res.status(404).json(err);
        user.editRelVolee(req.body.note, function (err, user) {
            if (err) return res.status(404).json(err);
            return res.json({edited: 'ok', user: user});
        });
    });
};

/**
 * noteFrappe /notationFrappe/:note
 */
exports.noteFrappe = function (req, res) {
    User.get(req.params.id, function (err, user) {
        if (err) return res.status(404).json(err);
        user.editRelFrappe(req.body.note, function (err, user) {
            if (err) return res.status(404).json(err);
            return res.json({edited: 'ok', user: user});
        });
    });
};

/**
 * noteTechnique /notationTechnique/:note
 */
exports.noteTechnique = function (req, res) {
    User.get(req.params.id, function (err, user) {
        if (err) return res.status(404).json(err);
        user.editRelTechnique(req.body.note, function (err, user) {
            if (err) return res.status(404).json(err);
            return res.json({edited: 'ok', user: user});
        });
    });
};

/**
 * noteFond /notationFond/:note
 */
exports.noteFond = function (req, res) {
    User.get(req.params.id, function (err, user) {
        if (err) return res.status(404).json(err);
        user.editRelFond(req.body.note, function (err, user) {
            if (err) return res.status(404).json(err);
            return res.json({edited: 'ok', user: user});
        });
    });
};

/**
 * noteEndurance /notationEndurance/:note
 */
exports.noteEndurance = function (req, res) {
    User.get(req.params.id, function (err, user) {
        if (err) return res.status(404).json(err);
        user.editRelEndurance(req.body.note, function (err, user) {
            if (err) return res.status(404).json(err);
            return res.json({edited: 'ok', user: user});
        });
    });
};

/**
 * noteEndurance /notationEndurance/:note
 */
exports.searchSkillLvl = function (req, res) {
    User.get(req.params.id, function (err, user) {
        console.log('SORTIE DANS LE GET');
        if (err) return res.status(404).json(err);
        user.searchSkillLevel(req.body.nomSkill,req.body.noteCherchee, function (err, user) {
            console.log("SORTIE DANS LE SEARCH SKILL")
            if (err) return res.status(404).json(err);
            return res.json(user);
        });
    });
};
