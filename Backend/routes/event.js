var express = require('express');
var router = express.Router();

/* GET event listing. */
router.get('/', function(req, res, next) {
    res.send('ici event');
});

router.get('/tous',function(req,res,next){
    res.setHeader('Content-Type', 'application/json');
    //res.json({nom:"tournoi1",type:'simple'},{nom:'tournoi2',type:'double'});
    res.json({
        tou1:{nom:'tournoi1',type:'simple'},
        tou2:{nom:'tournoi2',type:'double'}
    });
})

module.exports = router;