var service=require('./../Service/db_connexion');

exports.login =function (username,password,res){
    var query = "MATCH (n:Personne)  RETURN id(n)";
   service.executeQuery(query)
           .then(function (bop) {
           var result = JSON.parse(bop.getBody('utf8'));
           console.log(result.data);
           res.json({err:{message:$err},
               data:result.data
           });
       });

};

