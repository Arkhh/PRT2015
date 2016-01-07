
var service=require('./../Service/db_connexion');

exports.login =function (username,password,res){
    //fonction bdd
    var query = "MATCH (n:Personne) WHERE n.username = '" + username + "' AND n.password = '" + password + "' RETURN id(n)";
   // console.log(query);
    service.prepareQuery(query);

};

