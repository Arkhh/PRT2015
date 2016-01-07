var neo4j = require('node-neo4j');
var request = require('then-request');


var URL_API_BASE = "http://178.62.87.171:7474/db/data/cypher";
var METHOD =  "POST";
// Headers d'authenfication pour le serveur de DB neo4j
var AUTH =  { headers:
{
    'Authorization': 'Basic bmVvNGo6bWFmcmFqMjAxNQ==',
    'Content-Type': 'application/json'
}
};

exports.executeQuery=function(query) {
    var options = {
        headers: AUTH.headers,
        json:{query:query}
    };
    return request(METHOD,URL_API_BASE,options)
};

