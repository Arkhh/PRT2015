var express = require('express');
var router = express.Router();
var $err=[];

//ajouter une news
//Inpout: user_id
router.post('/add',function(req,res){
    $err=[];
    if (typeof req.body['user_id']=== 'undefined'){
        $err.push('user_id manquant');
    }
    //test des autres infos
    if ($err.length>0){
        res.json({err:{message:$err}});
    }
    //requete pour savoir si l'utilisateur est admin
    var $db_res='true';
    //test si la requete renvoi un résultat
    if ($db_res.length === 0){
        $err.push('Inconu');
        res.json({err:{message:$err}});
    }
    if ($db_res==='true'){
        //l'utilisateur est un admin on ajoute la news sans modération
        res.json({err:{message:$err},
            data:{message:'Ajout'}
            });
    }
    else{
        //l'utilisateur n'est pas un admin on la modère
        res.json({err:{message:$err},
            data:{message:'Modération'}
            });
    }
});

//Modifier news
//Inpout: user_id, news_id
router.put('/add',function(req,res){
    $err=[];
    if (typeof req.body['user_id']=== 'undefined'){
        $err.push('user_id manquant');
    }
    if (typeof req.body['news_id']=== 'undefined'){
        $err.push('news_id manquant');
    }
    //test des autres infos
    if ($err.length>0){
        res.json({err:{message:$err}});
    }
    //requete pour savoir si l'utilisateur est admin
    var $db_res='true';
    //test si la requete renvoi un résultat
    if ($db_res.length === 0){
        $err.push('Inconu');
        res.json({err:{message:$err}});
    }
    if ($db_res==='true'){
        //l'utilisateur est un admin on modifie la news
        res.json({err:{message:$err},
            data:{message:'Modification'}
            });
    }
    else {
        $err.push('Non admin');
        res.json({err:{message:$err}});

    }
});

//Supprimer news
//Inpout:user_id,news_id
router.delete('/add',function(req,res){
    $err=[];
    if (typeof req.body['user_id']=== 'undefined'){
        $err.push('user_id manquant');
    }
    if (typeof req.body['news_id']=== 'undefined'){
        $err.push('news_id manquant');
    }
    //test des autres infos
    if ($err.length>0){
        res.json({err:{message:$err}});
    }
    //requete pour savoir si l'utilisateur est admin
    var $db_res='true';
    //test si la requete renvoi un résultat
    if ($db_res.length === 0){
        $err.push('Inconnu');
        res.json({err:{message:$err}});
    }
    if ($db_res==='true'){
        //l'utilisateur est un admin on supprime la news
        res.json({err:{message:$err},
            data:{message:'Supprimer'}
            });
    }
    else {
        $err.push('Non admin');
        res.json({err:{message:$err}});

    }
});

//Valider news
//Inpout:user_id,news_id,valid(true or false)
router.post('/validate',function(req,res){
    $err=[];
    if (typeof req.body['user_id']=== 'undefined'){
        $err.push('user_id manquant');
    }
    if (typeof req.body['news_id']=== 'undefined'){
        $err.push('news_id manquant');
    }
    if (typeof req.body['valid']==='undefined'){
        $err.push('valid manquant');
    }
    //test des autres infos
    if ($err.length>0){
        res.json({err:{message:$err}});
    }
    //requete pour savoir si l'utilisateur est admin
    var $db_res='false';
    //test si la requete renvoi un résultat
    if ($db_res.length === 0){
        $err.push('Inconnu');
        res.json({err:{message:$err}});
    }
    if ($db_res==='true'){
        //l'utilisateur est un admin on valide
        if (req.body['valid']==='true'){
            //traitement
            res.json({err:{message:$err},
                data:{message:'News validée'}
                });
        }

        else{
            //traitement
            res.json({err:{message:$err},
                data:{message:'News refusée'}
                });
        }

    }
    else {
        $err.push('Non admin');
        res.json({err:{message:$err}});

    }
});

//liste les news non validées par l'admin
router.get('/listUnvalidate',function(req,res){
    $err=[];
    if (typeof req.query['user_id']=== 'undefined'){
        $err.push('user_id manquant');
    }
    //test des autres infos
    if ($err.length>0){
        res.json({err:{message:$err}});
    }
    var $db_res='true';
    //test si la requete renvoi un résultat
    if ($db_res.length === 0){
        $err.push('Inconnu');
        res.json({err:{message:$err}});
    }
    if ($db_res==='true'){
        //l'utilisateur est un admin on liste

        //traitement
        res.json({err:{message:$err},
            data:{news1:{titre:'news1',contenu:'blablabla',photo:'lien1'},
                news2:{titre:'news2',contenu:'totototo',photo:'lien2'}}
        });
    }
    else {
        $err.push('Non admin');
        res.json({err:{message:$err}});

    }
});


//Lister les news validées
//Inpout: user_id
router.get('/list',function(req,res){
    $err=[];
   //pas de test pour l'affichage de la liste des news validées
    // traitement
    res.json({err:{message:$err},
        data:{news1:{titre:'news1',contenu:'blablabla',photo:'lien1'},
            news2:{titre:'news2',contenu:'totototo',photo:'lien2'}}
    });
});

//récupérer les infos d'une news en particulier
//Inpout: news_id
router.get('/info',function(req,res){
    $err=[];

    if (typeof req.query['news_id']=== 'undefined'){
        $err.push('news_id manquant');
    }

    //test des autres infos
    if ($err.length>0){
        res.json({err:{message:$err}});
    }

    //récupérer les infos de la news dans la bdd
    var $db_res='';
    //test si la requete renvoi un résultat
    if ($db_res.length === 0){
        $err.push('Inconnu');
        res.json({err:{message:$err}});
    }

    //renvoi des infos
    res.json({err:{message:$err},
        data:{titre:'news1',contenu:'blablabla',photo:'lien1'}
    });
});



module.exports = router;