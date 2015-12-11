var express = require('express');
var router = express.Router();

/* GET news listing. */
router.get('/', function(req, res, next) {
    res.send('ici news');
});

module.exports = router;