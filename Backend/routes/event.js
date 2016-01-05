var express = require('express');
var router = express.Router();
var $err=[];


router.get('/tous',function(req,res,next){
    res.setHeader('Content-Type', 'application/json');

    res.json({
        tou1:{nom:'tournoi1',type:'simple'},
        tou2:{nom:'tournoi2',type:'double'}
    });
});

//lister tout les events
//inpout :user_id
router.get('/all', function (req,res) {
    $err=[];
    if (typeof req.query['user_id']=== 'undefined'){
        $err.push('user_id manquant');
    }
    //affichage erreur
    if ($err.length>0){
        res.json({err:{message:$err}});
    }

    var $db_res='true'; // renvoi oui/non

    //test si la requete renvoi un résultat
    if ($db_res.length === 0){
        $err.push('Inconu');
        res.json({err:{message:$err}});
    }
    // traitement
    res.json({err:{message:$err},
        data:{event1:{nom:'even1',image:'img1',lien:'lien1',desc:'tournoi simple'},
            event2:{titre:'even2',image:'img2',lien:'lien2',desc:'tournoi double'}}
    });

});

module.exports = router;