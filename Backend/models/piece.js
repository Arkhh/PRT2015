// user.js
// Piece model logic.

var neo4j = require('neo4j');
var errors = require('./errors');

var db = new neo4j.GraphDatabase({
    // Support specifying database info via environment variables,
    // but assume Neo4j installation defaults.
    url: process.env['NEO4J_URL'] || process.env['GRAPHENEDB_URL'] ||
   // 'http://neo4j:mafraj2015@178.62.87.171:7474',
    'http://neo4j:mafraj2015@localhost:7474',
    auth: process.env['NEO4J_AUTH']
});

// Private constructor:

var Piece = module.exports = function Piece(_node) {
    // All we'll really store is the node; the rest of our properties will be
    // derivable or just pass-through properties (see below).
    this._node = _node;
}


function isConstraintViolation(err) {
    return err instanceof neo4j.ClientError &&
        err.neo4j.code === 'Neo.ClientError.Schema.ConstraintViolation';
}


// Public constants:

Piece.VALIDATION_INFO = {
    'name': {
        required: true,
        minLength: 2,
        pattern: /^[A-Za-z_]+$/,
        message: '2 characters min; letters, numbers, and underscores only.'
    },
    'quantity':{
        required: true,
        pattern: /^[0-9_]+$/,
        message: ' numbers only.'
    },
    'limit':{
        required: true,
        pattern: /^[0-9_]+$/,
        message: ' numbers only.'
    }
};

// Atomically updates this user, both locally and remotely in the db, with the
// given property updates.
/*User.prototype.patch = function (props, callback) {
  //  var safeProps = validate(props);

    var query = [
        'MATCH (piece:Piece {id: {id}})',
        'SET user += {props}',
        'RETURN piece',
    ].join('\n');

    var params = {
        username: this.username,
        props: props,
    };

    var self = this;

    db.cypher({
        query: query,
        params: params,
    }, function (err, results) {
        if (isConstraintViolation(err)) {
            // TODO: This assumes username is the only relevant constraint.
            // We could parse the constraint property out of the error message,
            // but it'd be nicer if Neo4j returned this data semantically.
            // Alternately, we could tweak our query to explicitly check first
            // whether the username is taken or not.
            err = new errors.ValidationError(
                'The username ‘' + props.username + '’ is taken.');
        }
        if (err) return callback(err);

        if (!results.length) {
            err = new Error('User has been deleted! Username: ' + self.username);
            return callback(err);
        }

        // Update our node with this updated+latest data from the server:
        self._node = results[0]['user'];

        callback(null);
    });
};*/


// Static methods:

Piece.get = function (id, callback) {
    var query = [
        'MATCH (piece:Piece {id: {id}})',
        'RETURN piece',
    ].join('\n')

    var params = {
        id: parseInt(id)
    };
    console.log (params);
    db.cypher({
        query: query,
        params: params,
    }, function (err, results) {
        if (err) return callback(err);
       /* if (!results.length) {
            err = new Error('No such item with id: ' + id);
            return callback(err);
        }*/
        console.log (results);
        var piece = new Piece(results[0]['piece']);

       callback(null, piece);

    });
};

Piece.getAll = function (callback) {
    var query = [
        'MATCH (piece:Piece)',
        'RETURN piece',
    ].join('\n');
    db.cypher({
        query: query,
    }, function (err, results) {
        if (err) return callback(err);
        var pieces = results.map(function (result) {
            return new Piece(result['piece']);
        });
        callback(null, pieces);
    });
};

// Creates the user and persists (saves) it to the db, incl. indexing it:
Piece.create = function (props, callback) {
    var id=maxID(function(id){
        //console.log(id);

        var propId={
            id:id,
            name:props.name,
            quantity:props.quantity,
            limit:props.limit

        };
        var query = [
            'CREATE (piece:Piece {props})',
            'RETURN piece',
        ].join('\n');

        var params = {

            props: propId
            //props: validate(props)
        };

        db.cypher({
            query: query,
            params: params
        }, function (err, results) {
            /*
             if (isConstraintViolation(err)) {
             // TODO: This assumes username is the only relevant constraint.
             // We could parse the constraint property out of the error message,
             // but it'd be nicer if Neo4j returned this data semantically.
             // Alternately, we could tweak our query to explicitly check first
             // whether the username is taken or not.
             err = new errors.ValidationError(
             'The item name ‘' + props.name + '’ is taken.');
             }
             */
            if (err) return callback(err);
            var piece = new Piece(results[0]['piece']);
            callback(null, piece);
        });
    })

};


function maxID (callback){

    var query = [
        ' match (piece:Piece )',
        'return max(piece.id)'

    ].join('\n')

    db.cypher({
        query: query
    }, function (err, results) {

        if (err) return callback(err);

        if (results[0]['max(piece.id)']===null) {
            //  err = new Error('No such item with id: ' + id);

            callback(1) ;
            //return callback(1);
        }
        else{
            callback( results[0]['max(piece.id)']+1);
        }
        //var piece = new Piece(results[0]['piece']);


    });
};