var request = require("request");
var neo4j = require('node-neo4j');
var URL_API_BASE = "http://178.62.87.171:7474/db/data/cypher";
var METHOD = {method: "POST"};
// Headers d'authenfication pour le serveur de DB neo4j
var AUTH =  { headers:
                {
                    'Authorization': 'Basic bmVvNGo6bWFmcmFqMjAxNQ==',
                    'Content-Type': 'application/json'
                }
};


function testCallback(error, response, body) {
    if (!error && response.statusCode == 200) {
        var info = JSON.parse(response.body);
        console.log(info.data[0][0].data.Type);
    }
    if(error){
        console.log(error);
    }
}

prepareQuery("MATCH (n:TypeDeJoueur)RETURN n",testCallback);





function zamel ( param1, param2, param3){

    var query = " SELECT BOP FROM ZAMEL WHERE COL1 ="+param1+"";

    prepareQuery(query,callbacKzamel);
}

function prepareQuery(query,callback) {


    var options = {
        url: URL_API_BASE,
        method: METHOD.method,
        headers: AUTH.headers,
        form:{query:query}
    };

    runCypherQuery(options,callback);

}

function runCypherQuery(options,callback) {
    request(options,callback);
}


function connexion(username, password){

    var query = "MATCH (n:Personne) WHERE n.username = '" + username + "' AND n.password = '" + password + "' RETURN id(n)";
    console.log(query);
    prepareQuery(query,callbackConnexion);
}

function callbackConnexion(error, response, body){
    if (!error && response.statusCode == 200) {
        //var info = JSON.parse(response.body);
        //console.log(response.body);
        var test = JSON.parse(response.body);
        console.log(test.data[0][0]);
    }
    if(error){
        console.log(error);
    }
}

/*db.cypherQuery("MATCH (n:TypeDeJoueur)RETURN n", function (err, result) {
 if (err) throw err;

 console.log(result.data); // delivers an array of query results
 //console.log(result.columns); // delivers an array of names of objects getting returned
 }); */


/*
function lireNoeud(){
    runCypherQuery(
        'MATCH (n:TypeDeJoueur)RETURN n',
        function (err, resp) {
            if (err) {
                console.log(err);
            } else {
                console.log(resp);
            }
        }
    )
}
*/


/*runCypherQuery(
    'CREATE (somebody:Person { name: {name}, from: {company}, age: {age} }) RETURN somebody', {
        name: 'Thomas',
        company: 'Mafraj',
        age: 22
    }, function (err, resp) {
        if (err) {
            console.log(err);
        } else {
            console.log(resp);
        }
    }
)*/
/*
function lireTrucType(type) {
    db.cypherQuery("MATCH (n:TypeDeJoueur) WHERE n.Type = '" + type + "' RETURN n", function(err, result) {
        if (err) throw err;
    if (result.data != '[]') {
        console.log(result.data); // delivers an array of query results
    }
        else {
        console.log("pas de type de ce genre");
    }//console.log(result.columns); // delivers an array of names of objects getting returned
    });
}*/



/*function inscription(){
    db.cypherQuery("CREATE(n:Personne { mail: 'mail.test1@gmail.com', valid: '0', adresse: '14 rue bidon1', Naissance: '24/12/1995', simple : '0'," +
        "ville : 'Bruay', double : '1', photo : '', password:'PassBidon1', titre: 'membre', nom: 'Bouya', prenom: 'Chaka', username: " +
        "'userBidon1', description: 'description bidon1', sexe : 'H'}) RETURN n", function(err,resp){
    if (err) {
        console.log(err);
    } else {
        console.log(resp);
    }
})
}*/

//fonction ne gérant pas la photo ni la gestion des doublons
/*
function inscription(mail, adresse, Naissance, simple, ville, double, password, nom, prenom, username, description, sexe){
    db.cypherQuery("CREATE(n:Personne { mail: '" + mail + "', valid: '0', adresse: '"+ adresse + "', Naissance: '" + Naissance +"', simple : '0'," +
        "ville : '"+ ville +"', double : '" + double +"', photo : '', password:'" + password + "', titre: 'membre', nom: '" + nom + "', prenom: '" + prenom + "', username: " +
        "'" + username +"', description: '" + description + "', sexe : '" + sexe +"'}) RETURN n", function(err,resp){
        if (err) {
            console.log(err);
        } else {
            console.log(resp);
        }
    })
}


lireTrucType('Volee');*/
//connexion('Vince','MafrajVince');
//inscription();
//inscription('jesus.christ@eglise.com','69 rue du Paradis','25/12/0000','1','Paradis','1','Allelouya','Christ','Jesus','Jeje','Oh my Gob','H');
/*
 function connexion(username,password){
 runCypherQuery(query,params,callback)
 db.cypherQuery("MATCH (n:Personne) WHERE n.username = '" + username + "' AND n.password = '" + password + "' RETURN id(n)", function (err, resp) {
 if (err) throw err;
 console.log(resp.data);
 //console.log(JSON.stringify(resp, null, 2));
 //if (resp.data = '[]') return 0;
 //console.log(resp.data);
 })
 }*/