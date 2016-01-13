// matche.js
// Matche model logic.

var neo4j = require('neo4j');
var errors = require('./errors');
var _ =require('underscore');

var db = new neo4j.GraphDatabase({
    // Support specifying database info via environment variables,
    // but assume Neo4j installation defaults.
    url: process.env['NEO4J_URL'] || process.env['GRAPHENEDB_URL'] ||
    'http://neo4j:mafraj2015@localhost:7474',
    auth: process.env['NEO4J_AUTH']
});

// Private constructor:

var Matche = module.exports = function Matche(_node) {
    // All we'll really store is the node; the rest of our properties will be
    // derivable or just pass-through properties (see below).
    this._node = _node;
};

Matche.VALIDATION_INFO = {
    'date': {
        required: true,
        minLength: 1,
        maxLength: 20,
        pattern: /^[0-9]+$/,
        message: 'time stamp'
    },
   /* 'idJ1': {
        required: true,
        minLength: 1,
        maxLength: 12,
        pattern: /^[0-9_]+$/,
        message: 'number'
    },
    'idJ2': {
        required: true,
        minLength: 1,
        maxLength: 12,
        pattern: /^[0-9_]+$/,
        message: 'number'
    },

    'Resultat1': {
        required: false,
        minLength: 1,
        maxLength: 12,
        pattern: /^[0-9_]+$/,
        message: 'boolean'
    },
    'Resultat2': {
        required: false,
        minLength: 1,
        maxLength: 12,
        pattern: /^[0-9_]+$/,
        message: 'boolean'
    },
    'Resultat': {
        required: false,
        minLength: 1,
        maxLength: 12,
        pattern: /^[0-9_]+$/,
        message: 'number'
    },
    'GainJ1': {
        required: true,
        minLength: 1,
        maxLength: 12,
        pattern: /^[0-9_]+$/,
        message: 'number'
    },
    'GainJ2': {
        required: true,
        minLength: 1,
        maxLength: 12,
        pattern: /^[0-9_]+$/,
        message: 'number'
    },
    'Perte1': {
        required: true,
        minLength: 1,
        maxLength: 12,
        pattern: /^[0-9_]+$/,
        message: 'number'
    },
    'PerteJ2': {
        required: true,
        minLength: 1,
        maxLength: 12,
        pattern: /^[0-9_]+$/,
        message: 'number'
    },*/

};


Object.defineProperty(Matche.prototype, 'id', {
    get: function () {
        return this._node._id;
    }
});
Object.defineProperty(Matche.prototype, 'date', {
    get: function () { return this._node.properties['date']; }
});

// Private helpers:

// Takes the given caller-provided properties, selects only known ones,
// validates them, and returns the known subset.
// By default, only validates properties that are present.
// (This allows `User.prototype.patch` to not require any.)
// You can pass `true` for `required` to validate that all required properties
// are present too. (Useful for `User.create`.)
function validate(props, required) {
    var safeProps = {};
    var TabErrors ={error:[]};
    var error= '';

    for (var prop in Matche.VALIDATION_INFO) {
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

// Validates the given property based on the validation info above.
// By default, ignores null/undefined/empty values, but you can pass `true` for
// the `required` param to enforce that any required properties are present.
function validateProp(prop, val, required) {
    var info = Matche.VALIDATION_INFO[prop];
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
Matche.prototype.patch = function (props, callback) {

    var errorTab=[],validProps;



    validProps=validate(props,true);

    if(validProps.error){
        errorTab.push( new errors.PropertyError(validProps.error));
        return callback(errorTab);
    }

    var query = [
        'MATCH (match:Match) WHERE id(match)= {id}',
        'SET match += {props}',
        'RETURN match',
    ].join('\n');


    var params = {
        id: this.id,
        props: validProps
    };

    var self = this;


    db.cypher({
        query: query,
        params: params
    }, function (err, results) {
      /*  if (isConstraintViolation(err)) {
            //si l'email est déjà pris
            err = new errors.UnicityError('L\'email ‘' + props.email + '’ est déjà utilisé.');
        }*/
        if (err) return callback(err);

        if (!results.length) {
            err = new Error('Le match avec l\'id: ' + this.id +'n\'existe pas dans la base');
            return callback(err);
        }
        // Met à jour le noeud avec les dernieres modifications
        self._node = results[0]['match'];

        callback(null);
    });
};


// supprime le match ainsi que toute ses relations
Matche.prototype.del = function (callback) {
// supprime l'utilisateurs ainsi que toute ses relations
    var query = [
        'MATCH (match:Match)',
        'WHERE id(match) = {id}',
        'DETACH DELETE match'
    ].join('\n');

    var params = {
        id: this.id
    };

    db.cypher({
        query: query,
        params: params
    }, function (err) {
        callback(err);
    });
};

// Crée le match et l'insère dans la DB
Matche.create = function (props, callback) {

    var errorTab=[],validProps;
    var query = [
        'CREATE (match:Match {props})',
        'RETURN match',
    ].join('\n');

    validProps=validate(props,true);

    if(validProps.error){
        errorTab.push( new errors.PropertyError(validProps.error));
        return callback(errorTab);
    }

    var params = {
        props: validProps
    };

    db.cypher({
        query: query,
        params: params
    }, function (err, results) {
       /* if (isConstraintViolation(err)) {
            //si l'email est déjà pris
            err = new errors.UnicityError('L\'email ‘' + props.email + '’ est déjà utilisé.');
        }*/
        if (err) return callback(err);
        var matche = new Matche(results[0]['match']);
        callback(null, matche);
    });
};

Matche.get = function (id, callback) {

    var idInt=parseInt(id);


    var query = [
        'MATCH (match:Match)',
        'WHERE id(match) = {id}',
        'RETURN match',
    ].join('\n');


    var params = {
        id: idInt
    };

    db.cypher({
        query: query,
        params: params
    }, function (err, results) {
        if (err) return callback(err);
        if (!results.length) {
            var err=[];
            var error=new errors.PropertyError('No such match with ID: ' + id);
            err.push(error);
            return callback(err);
        }
        var matche = new Matche(results[0]['match']);
        callback(null, matche);
    });
};

Matche.getAll = function (callback) {
    var query = [
        'MATCH (match:Match)',
        'RETURN match',
        'ORDER BY match.date desc',
        'LIMIT 10'
    ].join('\n');

    db.cypher({
        query: query
    }, function (err, results) {
        if (err) return callback(err);
        var matches = results.map(function (result) {
            return new Matche(result['match']);
        });
        callback(null, matches);
    });
};


