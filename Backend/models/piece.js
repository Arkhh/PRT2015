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

Object.defineProperty(Piece.prototype, 'id', {
    get: function () { return this._node._id; }
});
Object.defineProperty(Piece.prototype, 'name', {
    get: function () { return this._node.properties['name']; }
});
Object.defineProperty(Piece.prototype, 'quantity', {
    get: function () { return this._node.properties['quantity']; }
});
Object.defineProperty(Piece.prototype, 'limit', {
    get: function () { return this._node.properties['limit']; }
});


function isConstraintViolation(err) {
    return err instanceof neo4j.ClientError &&
        err.neo4j.code === 'Neo.ClientError.Schema.ConstraintViolation';
}

function validate(props, required) {
    var safeProps = {};

    for (var prop in Piece.VALIDATION_INFO) {
        var val = props[prop];
        validateProp(prop, val, required);
        safeProps[prop] = val;
    }

    return safeProps;
}
// Public constants:

Piece.VALIDATION_INFO = {
    'id':{
        required: true,
        minLength: 1,
        pattern: /^[0-9_]+$/,
        message: ' numbers only.'
    },
    'name': {
        required: true,
        minLength: 2,
        pattern: /^[A-Za-z_]+$/,
        message: '2 characters min; letters, numbers, and underscores only.'
    },
    'quantity':{
        required: true,
        minLength: 1,
        pattern: /^[0-9_]+$/,
        message: ' numbers only.'
    },
    'limit':{
        required: true,
        minLength: 1,
        pattern: /^[0-9_]+$/,
        message: ' numbers only.'
    }
};

function validate(props, required) {
    var safeProps = {};
    var TabErrors ={error:[]};
    var error= null;

    for (var prop in User.VALIDATION_INFO) {
        error=null;
        var val = props[prop];
        error=validateProp(prop, val, required);
        if(error){
            TabErrors.error.push(error);
        }else {
            safeProps[prop] = val;
        }

    }

    if(TabErrors.error.length>0){
        return TabErrors;
    }
    return safeProps;
}

function validateProp(prop, val, required) {
    required=true;
    var info = Piece.VALIDATION_INFO[prop];
    var message = info.message;

    if (!val) {
        if (info.required && required) {
            return('Missing ' + prop + ' (required).');
        } else {
            return;
        }
    }

    if (info.minLength && val.length < info.minLength) {
        return('Invalid ' + prop + ' (too short). Requirements: ' + message);
    }

    if (info.maxLength && val.length > info.maxLength) {
        return('Invalid ' + prop + ' (too long). Requirements: ' + message);
    }

    if (info.pattern && !info.pattern.test(val)) {
        return('Invalid ' + prop + ' (format). Requirements: ' + message);
    }

}

// Atomically updates this user, both locally and remotely in the db, with the
// given property updates.
Piece.prototype.patch = function (props, callback) {
    var safeProps = validate(props);

    var idInt = parseInt(this.id);
    var query = [
        'MATCH (piece:Piece) WHERE id(piece)= {id}',
        'SET piece += {props}',
        'RETURN piece'
    ].join('\n');

    var params = {
        id: idInt,
        props: safeProps,
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
            err = new errors.UnicityError(
                'The piece ‘' + props.name + '’ is taken.');
        }
        if (err) return callback(err);


        console.log("RESULTS");
        console.log(results);
        if (!results.length) {
            err = new Error('' +
                'piece has been deleted! Piece: ' + self.id);
            return callback(err);
        }

        // Update our node with this updated+latest data from the server:
        self._node = results[0]['piece'];

        callback(null);
    });
};



// Static methods:

Piece.get = function (id, callback) {
    var idInt=parseInt(id);
    var query = [
        'MATCH (piece:Piece )'+
        'WHERE id(piece)= {id}'+
        'RETURN piece',
    ].join('\n')

    var params = {
        id: idInt,
    };
    console.log (params);
    db.cypher({
        query: query,
        params: params,
    }, function (err, results) {
        if (err) return callback(err);
        if (!results.length) {
            err = new Error('No such item with id: ' + id);
            return callback(err);
        }
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

        //console.log(id);

        var query = [
            'CREATE (piece:Piece {props})',
            'RETURN piece',
        ].join('\n');

        var params = {

            props: props
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

};

Piece.prototype.del=function(callback){

    var query=[
        'MATCH (piece:Piece)'+
        'WHERE id(piece)={id}',
        'DETACH DELETE piece',
    ].join('\n')

    var params={
        id:this.id,
    };

    db.cypher({
        query: query,
        params: params,
    },function(err){
        callback(err);
    })
};

// Static initialization:

// Register our unique username constraint.
// TODO: This is done async'ly (fire and forget) here for simplicity,
// but this would be better as a formal schema migration script or similar.
db.createConstraint({
    label: 'Piece',
    property: 'name'
}, function (err, constraint) {
    if (err) throw err;     // Failing fast for now, by crash the application.
    if (constraint) {
        console.log('(Registered unique names constraint.)');
    } else {
        // Constraint already present; no need to log anything.
    }
});
