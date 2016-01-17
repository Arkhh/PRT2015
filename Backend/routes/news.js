// news.js
// Routes to CRUD news.

var URL = require('url');

var errors = require('../models/errors');
var Neww = require('../models/new');

function getNewURL(neww) {
    return '/api/news/' + encodeURIComponent(neww.username);
}


/**
 * GET /news
 */
exports.list = function (req, res) {
    Neww.getAll(function (err, news) {
        if (err) return res.status(500).json(err);
        res.json(news);
    });
};

/**
 * GET /news/:id
 */
exports.show = function (req, res) {
    Neww.get(req.params.id, function (err, neww) {
        if (err)
        {
            return res.status(404).json({
                pathname: '/api/news/:id',
                error: err
            });
        }
        res.json(neww);
    });
};

/**
 * POST /news { nom, description, descriptionShort}
 */
exports.create = function (req, res) {
    Neww.create({
        name: req.body.name,
        description:req.body.description
    }, function (err, neww) {
        if (err) {
            return res.status(500).json({
                pathname: '/api/news',
                error: err
            });
        }
        return res.json(neww);
    });
};

/**
 * POST /news/:id {idCreator,date, nom, description, descriptionShort}
 */
exports.edit = function (req, res) {
    Neww.get(req.params.id, function (err, neww) {
        if (err) return res.status(404).json( {error:err});
        neww.patch(req.body, function (err) {
            if (err) {
                if (err instanceof errors.UnicityError||err instanceof errors.PropertyError) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    return res.status(500).json(err);
                }
            }
            return res.json(neww);
        });
    });
};


/**
 * DELETE /news/:id
 */
exports.del = function (req, res) {
    Neww.get(req.params.id, function (err, neww) {
        if (err) return res.status(404).json(err);
        neww.del(function (err) {
            if (err) return res.status(500).json(err);
            res.json({deleted:'ok', new: neww});
        });
    });
};

/**
 * GET /nextnews/:id
 */
exports.next = function (req, res) {
    Neww.getNext(req.params.id, function (err, news) {
        if (err)
        {
            return res.status(404).json({
                pathname: '/api/nextnews/:id',
                error: err
            });
        }
        res.json(news);
    });
};