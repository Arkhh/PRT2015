//Require the Neo4J module
var neo4j = require('node-neo4j');

//Create a db object. We will using this object to work on the DB.
db = new neo4j('http://localhost:7474');

//Run raw cypher with params
db.cypherQuery(
    'CREATE (somebody:Company { name: {name}, from: {company}, age: {age} }) RETURN somebody',
    {
        name: 'Cercle Laique',
        company: 'LOL',
        age: 22
    }, function (err, result) {
        if (err) {
            return console.log(err);
        }
        console.log(result.data); // delivers an array of query results
        console.log(result.columns); // delivers an array of names of objects getting returned
    }
)

db.readNode(2, function(err, node){
    if (err) throw err;

    console.log("Je m'appelle " + node.name + ", j'ai " + node.age +"ans et je travaille chez " + node.company);
    //console.log(node.age);

    console.log(node._id);
})


db.updateNode(2, {name:'Tom', company:'TheMafraj', age:'21'}, function(err, node){
    if(err) throw err;

    if(node == true) {
        //node updated
    } else {
        // node not found, hence not update
    }
})
;