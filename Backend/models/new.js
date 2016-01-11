// new.js
// New model logic.

var neo4j = require('neo4j');
var errors = require('./errors');

var db = new neo4j.GraphDatabase({
    // Support specifying database info via environment variables,
    // but assume Neo4j installation defaults.
    url: process.env['NEO4J_URL'] || process.env['GRAPHENEDB_URL'] ||
    'http://neo4j:Mafraj2015@localhost:7474',
    auth: process.env['NEO4J_AUTH']
});

// Private constructor:

var Neww = module.exports = function Neww(_node) {
    // All we'll really store is the node; the rest of our properties will be
    // derivable or just pass-through properties (see below).
    this._node = _node;
};

// Public constants:

Neww.VALIDATION_INFO = {
    'name': {
        required: true,
        minLength: 5,
        maxLength: 50,
        pattern: /^[A-Za-z0-9_\s]+$/,
        message: 'Entre 2 et 16 caractères'
    },
    'description':{
        required: true,
        minLength: 5,
        maxLength: 10000,
        pattern: /^[A-Za-z0-9_\s]+$/,
        message: 'Entre 5 et 10000 caractères'
    },
    'descriptionShort':{
        required: true,
        minLength: 5,
        maxLength: 50,
        pattern: /^[A-Za-z0-9_\s]+$/,
        message: 'Entre 5 et 50 caractères'
    },
  /*  'date':{
        required: true,
        minLength: 8,
        maxLength: 10,
        pattern: /^'(0?\d|[12]\d|3[01])-(0?\d|1[012])-((?:20)\d{2})'$/,
        message: 'Must be a date'
    }*/
};

// Public instance properties:

// The user's username, e.g. 'aseemk'.
Object.defineProperty(Neww.prototype, 'id', {
    get: function () { return this._node._id; }
});
Object.defineProperty(Neww.prototype, 'name', {
    get: function () { return this._node.properties['name']; }
});
Object.defineProperty(Neww.prototype, 'description', {
    get: function () { return this._node.properties['description']; }
});
Object.defineProperty(Neww.prototype, 'descriptionShort', {
    get: function () { return this._node.properties['descriptionShort']; }
});
Object.defineProperty(Neww.prototype, 'date', {
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
    var error= null;

    for (var prop in Neww.VALIDATION_INFO) {
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
};

function validateProp(prop, val, required) {
    required=true;
    var info = Neww.VALIDATION_INFO[prop];
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
        console.log(info.pattern+'      '+info.pattern.test(val));
        return('Invalid ' + prop + ' (format). Requirements: ' + message);
    }

};

function isConstraintViolation(err) {
    return err instanceof neo4j.ClientError &&
        err.neo4j.code === 'Neo.ClientError.Schema.ConstraintViolation';
};

// Public instance methods:

// Atomically updates this user, both locally and remotely in the db, with the
// given property updates.
Neww.prototype.patch = function (props, callback) {
    var safeProps = validate(props);

    var query = [
        'MATCH (new:New) WHERE id(new)= {id}',
        'SET new += {props}',
        'RETURN new',
    ].join('\n');

    var params = {
        id: this.id,
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
            err = new errors.UnicityError(
                'The name ‘' + props.name + '’ is taken.');
        }
        if (err) return callback(err);

        if (!results.length) {
            err = new Error('News has been deleted! Name: ' + self.name);
            return callback(err);
        }

        // Update our node with this updated+latest data from the server:
        self._node = results[0]['new'];

        callback(null);
    });
};

Neww.prototype.del = function (callback) {
    // Use a Cypher query to delete both this user and his/her following
    // relationships in one query and one network request:
    // (Note that this'll still fail if there are any relationships attached
    // of any other types, which is good because we don't expect any.)
    var query = [
        'MATCH (new:New)',
        'WHERE id(new) = {id}',
        'DETACH DELETE new'
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

// Creates the user and persists (saves) it to the db, incl. indexing it:
Neww.create = function (props, callback) {

    var propsDate={
        name:props.name,
        description:props.description,
        descriptionShort:props.descriptionShort,
        date:Date.create(new Date())
    }
    var errorTab=[],testProps, err;
    var query = [
        'CREATE (new:New {props})',
        'RETURN new',
    ].join('\n');


    testProps=validate(props);
    if(testProps.error){
        errorTab.push( new errors.PropertyError(testProps.error));
        return callback(errorTab);
    }

    var params = {
        props: validate(props)
    };

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
            err = new errors.UnicityError(
                'The name ‘' + props.name + '’ is taken.');
        }
        if (err) return callback(err);
        var neww = new Neww(results[0]['new']);
        callback(null, neww);
    });
};

Neww.get = function (id, callback) {

    var idInt=parseInt(id);


    var query = [
        'MATCH (new:New)',
        'WHERE id(new) = {id}',
        'RETURN new',
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
            var error=new errors.PropertyError('No such newsr with ID: ' + id)
            err.push(error);
            return callback(err);
        }
        var neww = new Neww(results[0]['new']);
        callback(null, neww);
    });
};

Neww.getAll = function (callback) {
    var query = [
        'MATCH (new:New)',
        'RETURN new',
    ].join('\n');

    db.cypher({
        query: query
    }, function (err, results) {
        if (err) return callback(err);
        var news = results.map(function (result) {
            return new User(result['new']);
        });
        callback(null, news);
    });
};

// Static initialization:

// Register our unique username constraint.
// TODO: This is done async'ly (fire and forget) here for simplicity,
// but this would be better as a formal schema migration script or similar.
db.createConstraint({
    label: 'New',
    property: 'name'
}, function (err, constraint) {
    if (err) throw err;     // Failing fast for now, by crash the application.
    if (constraint) {
        console.log('(Registered unique names constraint.)');
    } else {
        // Constraint already present; no need to log anything.
    }
});