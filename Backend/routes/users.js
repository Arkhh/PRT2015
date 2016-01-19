// users.js
// Routes to CRUD users.

var URL = require('url');

var errors = require('../models/errors');
var User = require('../models/user');
var Matche =require('../models/matche');
var _ =require('underscore');




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
        prenom: req.body.prenom
    }, function (err, user) {
        if (err) {
            return res.status(500).json({
                pathname: '/users',
                error: err
            });
        }
        user.createRel();
        return res.json(_.extend(user._node.properties,{
            id: user._node._id})); //TODO refactor

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
        return res.json(_.extend(user._node.properties,{
            id: user._node._id})); //TODO

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
            return res.json(_.extend(user._node.properties,{
                id: user._node._id})); //TODO
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
            return res.json(_.extend(user._node.properties,{
                id: user._node._id}));
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
 * searchSkillLvl /searchSkillLevel/:id
 */
exports.searchSkillLvl = function (req, res) {
    User.get(req.params.id, function (err, user) {
        if (err) return res.status(404).json(err);
        User.searchSkillLevel(req.params.id, req.body.nomSkill,req.body.noteCherchee, function (err, user) {
            if (err) return res.status(404).json(err);
            return res.json(user);
        });
    });
};

/**
 * read /readRel/:id
 */
exports.notation = function (req, res) {
    User.get(req.params.id, function (err, user) {
        if (err) return res.status(404).json(err);
        user.readRel(req.body.nomSkill, function (err, rel) {
            if (err) return res.status(404).json(err);
            console.log("mafraj");
            User.notation(req.body.note, rel, function (err, rela) {
                if (err) return res.status(500).json(err);
                Matche.setAnote(req.body.idJ,req.body.idm,function (err,matche){
                    if (err) return res.status(500).json(err);
                    return res.json(matche);
                });
               // return res.json(rela);
            });
            //return res.json(user);
        });
    });
};

/**
 * pubList /pub/users/
 */
exports.pubList = function (req,res) {
    User.pubList(function (err, users){
        if (err) return res.status(500).json(err);
        return res.json(users);
    })
};

/**
 * pubList /pub/users/:id
 */
exports.pubListId = function (req,res) {
    User.get(req.params.id, function (err, user) {
        if (err) return res.status(404).json(err);
        user.pubListId(function (err, users){
            if (err) return res.status(500).json(err);
            return res.json(users);
        })
    })
};

/**
 * GET /users
 */
exports.list = function (req, res) {
    User.getAll(function (err, users) {
        if (err) return res.status(500).json(err);
        return res.json(users);
    })
};

//SUGGESTION DE JOUEUR
/**
 * suggest /suggestion/:id
 */
exports.suggest = function (req,res) {
    User.get(req.params.id, function (err, user) {
        if (err) return res.status(404).json(err);
        user.suggest(function (err, users){
            if (err) return res.status(500).json(err);
            user.suggestMatch(function (err, usereuh){
                if (err) return res.status(500).json(err);
                var result=users.concat(usereuh);
                return res.json(result);
            })
        })
    })
};


/**
 * GET /adv/users/:id
 */
exports.adv = function (req, res) {
    User.getAdv(req.params.id,function (err, users) {
        if (err) return  res.status(404).json({
            pathname: 'adv/users/:id',
            error: err
        });
        return res.json(users);
    })
};

/**
 * search /search/:str
 */
//FONCTION RECHERCHE
exports.search = function (req,res) {
    User.search(req.params.str, function (err, user) {
        if (err) return res.status(500).json(err);
        console.log("user.length");
        console.log(user.length);
        return res.json(user);
        })
};

//SUGGESTION DE JOUEUR
/**
 * suggestAdvanced /suggest/:id
 */

//PREND EN COMPTE LES MOYENNES SUGGESTION
exports.suggestAdvanced = function (req,res) {
    User.get(req.params.id, function (err, user) {
        if (err) return res.status(404).json(err);
        user.suggestAdvanced(req.body, function (err,users){
            if (err) return res.status(500).json(err);
            return res.json(users);
        })
    })
};

/**
 * search /search/:str
 */
// SUGGESTION PREND EN COMTPE STRING, SEXE, MAINFORTE
exports.suggestSSMF = function (req,res) {
    User.search(req.body.str, function (err, user) {
        if (err) return res.status(404).json(err);
        console.log("req.body");
        console.log(req.body);
        User.suggestSSMF(req.body, user, function (err, usereuh){
            if (err) return res.status(500).json(err);
            return res.json(usereuh);
        })
    })
};


exports.suggestMatch = function (req,res) {
    User.get(req.params.id, function (err, user) {
        if (err) return res.status(404).json(err);
        console.log(user);

    })
};
/**
GET /totalenote/users/:id
*/
exports.getNbNote=function(req,res){
    User.getNbNote(req.params.id, function (err, user) {
        if (err) return res.status(500).json(err);
        return res.json(user);
    })
};
