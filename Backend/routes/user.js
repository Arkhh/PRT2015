var express = require('express');
var router = express.Router();
var controller=require('./../Controller/userController');
var $err=[];



//connexion
// Inpout :username; password
router.post('/login',function(req,res){
    $err=[];
    var username=req.body['username'];
    var password=req.body['password'];
    if ( username.length===0 ) {
        $err.push('Username manquant');
    }
    if (password.length===0){
        $err.push('Mot de passe manquant');
    }
    if ($err.length>0){
        res.json({err:{message:$err}});
        return;
    }

   // console.log(typeof username);
    //console.log(typeof password);
    if (typeof username !== 'string' ) {
        $err.push('Username must be string');
    }
    if (typeof password !== 'string'){
        $err.push('Mot de passe must be string');
    }
    if ($err.length>0){
        res.json({err:{message:$err}});
        return;
    }

   controller.login(username,password,res);
   /* res.json({err:{message:$err}
        //data:result.data
    });
*/
    /*
 */

    });





//modification des infos
router.put('/auth',function(req,res){
    $err=[];
    if (typeof req.body['user_id']=== 'undefined'){
        $err.push('user_id manquant');
    }
    //test pour chaque données
    if ($err.length>0){
        res.json({err:{message:$err}});
    }
    //traitement
    res.json({err:{message:$err}});

});

//s'inscrir sur le site
//Inpout : username, password, other info
router.post('/register',function(req,res){
    $err=[];
    if (typeof req.body['username'] === 'undefined' ) {
        $err.push('Username manquant');
    }
    if (typeof req.body['password']=== 'undefined'){
        $err.push('Mot de passe manquant');
    }
    //test sur les autres variables
    if ($err.length>0){
        res.json({err:{message:$err}});
    }
    //traitement
    res.json({err:{message:$err}});

});

//pour l'admin voir les demandes d'inscription
// input : user_id de l'utilisateur actuel
router.get('/validate',function(req,res){
    $err=[];
    if (typeof req.query['user_id']=== 'undefined'){
        $err.push('user_id manquant');
    }
    //test pour chaque données
    if ($err.length>0){
        res.json({err:{message:$err}});
    }

    //recherche du profil de l'utilisateur
    var $db_res='true'; // renvoi oui/non

    //test si la requete renvoi un résultat
    if ($db_res.length === 0){
        $err.push('Inconu');
        res.json({err:{message:$err}});
    }

    if ($db_res==='true'){
        //on affiche les demande
        //rqt bdd

        res.json({err:{message:$err},
            data:{
                dem1: {user_id: 1, nom: 'hache', prenom: 'vincent', mail: 'rerer'},
                dem2: {user_id: 1, nom: 'dominik', prenom: 'jordan', mail: 'qdqdqdq'}
            }});
    }
    else {
        $err.push('non admin');
        res.json({err:{message:$err}});
        //faire la création auto du json
    }

});

//pour l'admin valider une inscription
//Inpout: user_id de l'utilisateur, demande_id( correspond à l'user_id de la demande à valider)
//Inpout: valid pour valider la demande ou non
router.post('/validate',function(req,res){
    $err=[];
    if (typeof req.body['user_id']=== 'undefined'){
        $err.push('user_id manquant');
    }
    if (typeof req.body['demande_id']=== 'undefined'){
        $err.push('demande_id manquant');
    }
    if (typeof req.body['valid']=== 'undefined'){
        $err.push('valid manquant');
    }
    if ($err.length>0){
        res.json({err:{message:$err}});
    }
    //recherche du profil de l'utilisateur
    var $db_res='true'; // renvoi oui/non

    //test si la requete renvoi un résultat
    if ($db_res.length === 0){
        $err.push('Inconu');
        res.json({err:{message:$err}});
    }

    if ($db_res==='true'){
        if (req.body['valid']==='true'){
            res.json({err:{message:$err},
            data:{message:'Validation'}
            });
            //Traitement validation de l'user
        }
        else{
            res.json({err:{message:$err},
                data:{message:'Refus'}
                });
            //Traitement suppression de l'user
        }
    }
    else {
        $err.push('non admin');
        res.json({err:{message:$err}});

    }
});

// afficher les infos d'un profil
router.get('/profil',function(req,res,next){
    $err=[];
    if (typeof req.query['user_id']=== 'undefined'){
        $err.push('user_id manquant');
    }
    if ($err.length>0){
        res.json({err:{message:$err}});
    }
    //recherche des infos du joueur
    var $db_res=''; //appel bdd
    //si le résultat est null
    //on envoi un message d'erreur
    if ($db_res.length === 0){
        $err.push('Inconu');
        res.json({err:{message:$err}});
    }
    //faire la création auto du json
    res.json({err:{message:$err},
        data:{
            utilisateur: {user_id: 1, nom: 'hache', prenom: 'vincent', mail: 'rerer',
                adr:'rerterte',ville:'Lens',smash:1, frappe:2,autreNote:4},

        }});
});

//désinscrir tout les membres, utilisée en fin d'année pour indiqué que personne n'est officiellement rester dans le club
//uniquement pour l'admin
//Inpout: user_id
router.post('/deregisterAll',function(req,res){
    $err=[];
    if (typeof req.body['user_id']=== 'undefined'){
        $err.push('user_id manquant');
    }
    if ($err.length>0){
        res.json({err:{message:$err}});
    }
    //test si la requete renvoi un résultat
    var $db_res='true'; //appel bdd
    if ($db_res.length === 0){
        $err.push('Inconnu');
        res.json({err:{message:$err}});
    }

    if ($db_res==='true') {
        res.json({
            err: {message: $err},
            data: {message: 'Tous désinscrit'}
        });
    }
    else{
        $err.push('Non admin');
        res.json({err:{message:$err}});
    }
});


module.exports = router;
