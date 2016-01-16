// event.js
// User model logic.

var neo4j = require('neo4j');
var errors = require('./errors');
var User = require('../models/user');

var db = new neo4j.GraphDatabase({
    // Support specifying database info via environment variables,
    // but assume Neo4j installation defaults.
    url: process.env['NEO4J_URL'] || process.env['GRAPHENEDB_URL'] ||
    'http://neo4j:mafraj2015@localhost:7474',
    auth: process.env['NEO4J_AUTH']
});

// Private constructor:

var Event = module.exports = function Event(_node) {
    // All we'll really store is the node; the rest of our properties will be
    // derivable or just pass-through properties (see below).
    this._node = _node;
}

// Public constants:

Event.VALIDATION_INFO = {
    'nom': {
        required: true,
        minLength: 2,
        maxLength: 20,
        pattern: /^[A-Za-z_ ]+$/,
        message: '2-16 characters; letters, spaces and underscores only.'
    },
    'lieu': {
        required: true,
        minLength: 5,
        maxLength: 30,
        pattern: /^[A-Za-z0-9_ ]+$/,
        message: '2-16 characters; letters, numbers, and underscores only.'
    },
    'prix': {
        required: true,
        minLength: 1,
        maxLength: 16,
        pattern: /^[A-Za-z0-9_ ]+$/,
        message: 'numbers only (price).'
    },
    'description': {
        required: false,
        minLength: 1,
        maxLength: 50,
        pattern: /^[A-Za-z0-9_ ]+$/,
        message: '2-50 characters; letters, numbers,spaces and underscores only.'
    },
    'capacite': {
        required: false,
        minLength: 1,
        maxLength: 50,
        pattern: /^[A-Za-z0-9_ ]+$/,
        message: 'numbers only.'
    },
    'valid': {
        required: false,
        minLength: 1,
        maxLength: 5,
        pattern: /^[A-Za-z0-9_]+$/,
        message: 'boolean'
    },
    'date': {
        required: true,
        minLength: 1,
        maxLength: 15,
        pattern: /^[A-Za-z0-9_ ]+$/,
        message: 'format date attendu'
    },
    'shortDescription': {
        required: false,
        minLength: 1,
        maxLength: 50,
        pattern: /^[A-Za-z0-9_ ]+$/,
        message: '2-30 characters; letters, numbers,spaces and underscores only.'
    }
};

// Public instance properties:

// The user's username, e.g. 'aseemk'.
Object.defineProperty(Event.prototype, 'id', {
    get: function () { return this._node._id; }
});
Object.defineProperty(Event.prototype, 'nom', {
    get: function () { return this._node.properties['nom']; }
});
Object.defineProperty(Event.prototype, 'lieu', {
    get: function () { return this._node.properties['lieu']; }
});
Object.defineProperty(Event.prototype, 'prix', {
    get: function () { return this._node.properties['prix']; }
});
Object.defineProperty(Event.prototype, 'description', {
    get: function () { return this._node.properties['description']; }
});
Object.defineProperty(Event.prototype, 'capacite', {
    get: function () { return this._node.properties['capacite']; }
});
Object.defineProperty(Event.prototype, 'valid', {
    get: function () { return this._node.properties['valid']; }
});
Object.defineProperty(Event.prototype, 'date', {
    get: function () { return this._node.properties['date']; }
});
Object.defineProperty(Event.prototype, 'shortDescription', {
    get: function () { return this._node.properties['shortDescription']; }
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

    for (var prop in Event.VALIDATION_INFO) {
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
    var info = Event.VALIDATION_INFO[prop];
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

function isConstraintViolation(err) {
    return err instanceof neo4j.ClientError &&
        err.neo4j.code === 'Neo.ClientError.Schema.ConstraintViolation';
}

Event.isAdmin = function(idCreateur){
    var idInt = parseInt(idCreateur);
    var query = [
        'MATCH (user:User)' +
        'WHERE id(user) = {id} ' +
        'RETURN user.admin',
    ].join('\n')

    var params = {
        id: idInt,
    };

    db.cypher({
        query: query,
        params: params,
    }, function (err, results) {
        if (err) return callback(err);
        if (!results.length) {
            err = new Error('No such user with id: ' + id);
            return callback(err);
        }
        var idUser = results;


        if(idUser == 1) return true;
        else if(idUser == 0) return false;
    });
}

Event.getAll = function (callback) {
    var query = [
        'MATCH (evenement:Event)',
        'RETURN evenement',
    ].join('\n');

    db.cypher({
        query: query
    }, function (err, results) {
        if (err) return callback(err);
        var events = results.map(function (result) {
            return new Event(result['evenement']);
        });
        callback(null, events);
    });
};

// Creates the user and persists (saves) it to the db, incl. indexing it:
Event.create = function (props, callback) {
    var errorTab=[],validProps,required;

    var query = [
        'CREATE (evenement:Event {props})',
        'RETURN evenement',
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
        /*if (isConstraintViolation(err)) {
            // TODO: This assumes username is the only relevant constraint.
            // We could parse the constraint property out of the error message,
            // but it'd be nicer if Neo4j returned this data semantically.
            // Alternately, we could tweak our query to explicitly check first
            // whether the username is taken or not.
            err = new errors.ValidationError(
                'The username ‘' + props.username + '’ is taken.');
        }*/
        if (err) return callback(err);
        var event = new Event(results[0]['evenement']);
        callback(null, event);
    });
};

Event.prototype.del = function (callback) {
    // Use a Cypher query to delete both this user and his/her following
    // relationships in one query and one network request:
    // (Note that this'll still fail if there are any relationships attached
    // of any other types, which is good because we don't expect any.)
    var query = [
        'MATCH (event:Event)' +
        'WHERE id(event) = {id}',
        'DETACH DELETE event'
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

Event.get = function (id, callback) {

    var idInt = parseInt(id);
    var query = [
        'MATCH (event:Event)' +
        'WHERE id(event) = {id} ' +
        'RETURN event'
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
            err = new Error('No such event with id: ' + id);
            return callback(err);
        }
        var event = new Event(results[0]['event']);
        callback(null, event);
    });
};

// Atomically updates this user, both locally and remotely in the db, with the
// given property updates.
Event.prototype.patch = function (props, callback) {
    if(!props.date){
        props=_.extend(props,{
            date: this.date});
    }
    if(!props.nom){
        props=_.extend(props,{
            nom: this.nom});
    }
    if(!props.lieu){
        props=_.extend(props,{
            lieu: this.lieu});
    }
    var safeProps = validate(props);
    var idInt = parseInt(this.id);
    var query = [
        'MATCH (event:Event) WHERE id(event)= {id}',
        'SET event += {props}',
        'RETURN event'
    ].join('\n');

    var params = {
        id: idInt,
        props: safeProps
    };

    var self = this;

    db.cypher({
        query: query,
        params: params
    }, function (err, results) {
        if (isConstraintViolation(err)) {
            // TODO: This assumes username is the only relevant constraint.
            // We could parse the constraint property out of the error message,
            // but it'd be nicer if Neo4j returned this data semantically.
            // Alternately, we could tweak our query to explicitly check first
            // whether the username is taken or not.
            err = new errors.ValidationError(
                'The event ‘' + props.id + '’ is taken.');
        }
        if (err) return callback(err);



        if (!results.length) {
            err = new Error('Event has been deleted! Event: ' + self.id);
            return callback(err);
        }

        // Update our node with this updated+latest data from the server:
        self._node = results[0]['event'];

        callback(null);
    });
};