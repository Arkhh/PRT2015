var request = require("request");

var host = 'localhost';
 port = 7474;

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


;