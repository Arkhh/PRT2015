// event.js
// User model logic.

var neo4j = require('neo4j');
var errors = require('./errors');

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
        maxLength: 16,
        pattern: /^[A-Za-z0-9_]+$/,
        message: '2-16 characters; letters, numbers, and underscores only.'
    },
    'lieu': {
        required: true,
        minLength: 2,
        maxLength: 16,
        pattern: /^[A-Za-z0-9_]+$/,
        message: '2-16 characters; letters, numbers, and underscores only.'
    },
    'prix': {
        required: true,
        minLength: 1,
        maxLength: 16,
        pattern: /^[A-Za-z0-9_]+$/,
        message: 'numbers only (price).'
    },
    'description': {
        required: true,
        minLength: 1,
        maxLength: 50,
        pattern: /^[A-Za-z0-9_ ]+$/,
        message: '2-50 characters; letters, numbers, and underscores only.'
    }
};

// Public instance properties:

// The user's username, e.g. 'aseemk'.
Object.defineProperty(Event.prototype, 'id', {
    get: function () { return this._node._id; }
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

    for (var prop in Event.VALIDATION_INFO) {
        var val = props[prop];
        validateProp(prop, val, required);
        safeProps[prop] = val;
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
            throw new errors.ValidationError(
                'Missing ' + prop + ' (required).');
        } else {
            return;
        }
    }

    if (info.minLength && val.length < info.minLength) {
        throw new errors.ValidationError(
            'Invalid ' + prop + ' (too short). Requirements: ' + message);
    }

    if (info.maxLength && val.length > info.maxLength) {
        throw new errors.ValidationError(
            'Invalid ' + prop + ' (too long). Requirements: ' + message);
    }

    if (info.pattern && !info.pattern.test(val)) {
        throw new errors.ValidationError(
            'Invalid ' + prop + ' (format). Requirements: ' + message);
    }
}

function isConstraintViolation(err) {
    return err instanceof neo4j.ClientError &&
        err.neo4j.code === 'Neo.ClientError.Schema.ConstraintViolation';
}

Event.getAll = function (callback) {
    var query = [
        'MATCH (evenement:Evenement)',
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

    var query = [
        'CREATE (evenement:Evenement {props})',
        'RETURN evenement',
    ].join('\n');

    console.log('Batard');

    var params = {
        props: validate(props)
    };

    console.log('Encules de params');

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
        'MATCH (event:Evenement)',
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
        'MATCH (event:Evenement)' +
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
    var safeProps = validate(props);

    var idInt = parseInt(this.id);
    var query = [
        'MATCH (event:Evenement) WHERE id(event)= {id}',
         'SET event += {props}',
         'RETURN event'
    ].join('\n');

    var params = {
        id: idInt,
        props: safeProps,
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


        console.log("RESULTS");
        console.log(results);
        if (!results.length) {
            err = new Error('Event has been deleted! Event: ' + self.id);
            return callback(err);
        }

        // Update our node with this updated+latest data from the server:
        self._node = results[0]['event'];

        callback(null);
    });
};