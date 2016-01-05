var request = require("request");
var neo4j = require('node-neo4j');

var host = 'localhost';
 port = 7474;
var type;

db = new neo4j('http://localhost:7474');

var httpUrlForTransaction = 'http://' + host + ':' + port + '/db/data/transaction/commit';

function runCypherQuery(query, params, callback) {
    request.post({
            uri: httpUrlForTransaction,
            json: {statements: [{statement: query, parameters: params}]}
        },
        function (err, res, body) {
            callback(err, body);
        })
}

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

function lireTruc() {
    db.cypherQuery("MATCH (n:TypeDeJoueur)RETURN n", function (err, result) {
        if (err) throw err;

        console.log(result.data); // delivers an array of query results
        //console.log(result.columns); // delivers an array of names of objects getting returned
    });
}

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
}

function connexion(username,password){
    db.cypherQuery("MATCH (n:Personne) WHERE n.username = '" + username + "' AND n.password = '" + password + "' RETURN id(n)", function (err, resp) {
        if (err) throw err;
        console.log(resp.data);
        //console.log(JSON.stringify(resp, null, 2));
    //if (resp.data = '[]') return 0;
        //console.log(resp.data);
    })
}

function inscription(){
    db.cypherQuery("CREATE(n:Personne { mail: 'mail.test1@gmail.com', valid: '0', adresse: '14 rue bidon1', Naissance: '24/12/1995', simple : '0'," +
        "ville : 'Bruay', double : '1', photo : '', password:'PassBidon1', titre: 'membre', nom: 'Bouya', prenom: 'Chaka', username: " +
        "'userBidon1', description: 'description bidon1', sexe : 'H'}) RETURN n", function(err,resp){
    if (err) {
        console.log(err);
    } else {
        console.log(resp);
    }
})
}

//lireTrucType('Vole');
//connexion('Vince','MafrajVince');
//inscription();