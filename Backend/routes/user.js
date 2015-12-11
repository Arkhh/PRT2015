var express = require('express');
var router = express.Router();

/* GET user listing. */
router.get('/', function(req, res, next) {
  res.send('ici user');
});

router.get('/test',function(req,res,next){
    res.send('test');
});



router.get('/profil',function(req,res,next){
    res.setHeader('Content-Type', 'application/json');
    res.json({ nom: req.query.nom, prenom: req.query.prenom });
   // res.send('Bonjour '+req.query.nom +' '+req.query.prenom);

});


router.post('/inscription',function(req,res){

    console.log('Reçu');
    //console.log(req.body);
    console.log(JSON.stringify(req.body));
    console.log('req.body.nom', req.body['nom']);
    //commande pour test le post
    //curl -d '{"good_food":["pizza"]}' -H 'content-type:application/json'
    //"http://www.example.com/your_endpoint"
});
module.exports = router;
