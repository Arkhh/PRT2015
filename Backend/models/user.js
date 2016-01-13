// user.js
// User model logic.

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

var User = module.exports = function User(_node) {
    // All we'll really store is the node; the rest of our properties will be
    // derivable or just pass-through properties (see below).
    this._node = _node;
};

// Public constants:

User.VALIDATION_INFO = {
    'nom':{
        required: true,
        minLength: 2,
        maxLength: 12,
        pattern: /^[A-Za-z0-9_]+$/,
        message: 'string'
    },
    'prenom':{
        required: true,
        minLength: 2,
        maxLength: 12,
        pattern: /^[A-Za-z0-9_]+$/,
        message: 'string'
    },
    'email':{
        required: true,
        minLength: 1,
        maxLength: 30,
        pattern: /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i,
        message: 'string regex email chiffre lettre specChar'
    },
    'password':{
        required: true,
        minLength: 5,
        maxLength: 16,
        pattern: /^[A-Za-z0-9_]+$/,
        message: '2-16 characters; letters, numbers, and underscores only.'
    },
    'valide':{
        required: false,
        minLength: 4,
        maxLength: 5,
        pattern: /^[A-Za-z]+$/,
        message: 'boolean'
    },
    'type':{
        required: false,
        minLength: 1,
        maxLength: 2,
        pattern: /^[A-Za-z0-9_]+$/,
        message: 'String'
    },
    'mainForte':{
        required: false,
        minLength: 1,
        maxLength: 1,
        pattern: /^[A-Za-z0-9_]+$/,
        message: 'string'
    },
    'admin':{
        required: false,
        minLength: 1,
        maxLength: 14,
        pattern: /^[A-Za-z0-9_]+$/,
        message: 'string'
    },
    'naissance':{
        required: false,
        minLength: 1,
        maxLength: 14,
        pattern: /^[A-Za-z0-9_]+$/,
        message: 'string'
    },
    'sexe':{
        required: false,
        minLength: 1,
        maxLength: 1,
        pattern: /^[A-Z]+$/,
        message: 'string'
    }
};

// Public instance properties:

// The user's username, e.g. 'aseemk'.
Object.defineProperty(User.prototype, 'id', {
    get: function () {
        return this._node._id;
    }
});
Object.defineProperty(User.prototype, 'nom', {
    get: function () { return this._node.properties['nom']; }
});
Object.defineProperty(User.prototype, 'prenom', {
    get: function () { return this._node.properties['prenom']; }
});
Object.defineProperty(User.prototype, 'email', {
    get: function () { return this._node.properties['email']; }
});
Object.defineProperty(User.prototype, 'password', {
    get: function () { return this._node.properties['password']; }
});
Object.defineProperty(User.prototype, 'valide', {
    get: function () { return this._node.properties['valide']; }
});
Object.defineProperty(User.prototype, 'type', {
    get: function () { return this._node.properties['type']; }
});
Object.defineProperty(User.prototype, 'mainForte', {
    get: function () { return this._node.properties['mainForte']; }
});
Object.defineProperty(User.prototype, 'admin', {
    get: function () { return this._node.properties['admin']; }
});
Object.defineProperty(User.prototype, 'naissance', {
    get: function () { return this._node.properties['naissance']; }
});
Object.defineProperty(User.prototype, 'sexe', {
    get: function () { return this._node.properties['sexe']; }
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

// Validates the given property based on the validation info above.
// By default, ignores null/undefined/empty values, but you can pass `true` for
// the `required` param to enforce that any required properties are present.
function validateProp(prop, val, required) {
    var info = User.VALIDATION_INFO[prop];
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

User.prototype.isAdmin = function() {
    console.log("fonction isAdmin");
    if(this.admin){
        return true;
    }
    return false;
}

// Public instance methods:

// Atomically updates this user, both locally and remotely in the db, with the
// given property updates.
User.prototype.patch = function (props, callback) {

    var errorTab=[],validProps;



    props = _.extend(props,{
        email: this.email,
        password: this.password,
        nom: this.nom,
        prenom: this.prenom
    });

    validProps=validate(props,true);

    if(validProps.error){
        errorTab.push( new errors.PropertyError(validProps.error));
        return callback(errorTab);
    }

    var query = [
        'MATCH (user:User) WHERE id(user)= {id}',
        'SET user += {props}',
        'RETURN user',
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
        if (isConstraintViolation(err)) {
            //si l'email est déjà pris
            err = new errors.UnicityError('L\'email ‘' + props.email + '’ est déjà utilisé.');
        }
        if (err) return callback(err);

        if (!results.length) {
            err = new Error('L\'utilisateur avec l\'id: ' + this.id +'n\'existe pas dans la base');
            return callback(err);
        }
        // Met à jour le noeud avec les dernieres modifications
        self._node = results[0]['user'];

        callback(null);
    });
};

User.prototype.del = function (callback) {
// supprime l'utilisateurs ainsi que toute ses relations
    var query = [
        'MATCH (user:User)',
        'WHERE id(user) = {id}',
        'DETACH DELETE user'
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


// Crée l'utilisateur et l'insère dans la DB
User.create = function (props, callback) {

    var errorTab=[],validProps;
    var query = [
        'CREATE (user:User {props})',
        'RETURN user',
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
        if (isConstraintViolation(err)) {
            //si l'email est déjà pris
            err = new errors.UnicityError('L\'email ‘' + props.email + '’ est déjà utilisé.');
        }
        if (err) return callback(err);
        var user = new User(results[0]['user']);
        callback(null, user);
    });
};


User.get = function (id, callback) {

    var idInt=parseInt(id);


    var query = [
        'MATCH (user:User)',
        'WHERE id(user) = {id}',
        'RETURN user',
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
            var error=new errors.PropertyError('No such user with ID: ' + id);
            err.push(error);
            return callback(err);
        }
        var user = new User(results[0]['user']);
        callback(null, user);
    });
};


User.getAll = function (callback) {
    var query = [
        'MATCH (user:User)',
        'RETURN user',
    ].join('\n');

    db.cypher({
        query: query
    }, function (err, results) {
        if (err) return callback(err);
        var users = results.map(function (result) {
            return new User(result['user']);
        });
        callback(null, users);
    });
};

User.connect = function (props, callback){

    var safeProps = validate(props,false);
    var query = [
        'MATCH (user:User {email: {props}.email, password: {props}.password }) ' +
        'RETURN user',
    ].join('\n');

    var params = {
        id: this.id,
        props: safeProps
    };

    db.cypher({
        query:query,
        params: params
    }, function(err, results) {
        if (err) return callback(err);
        if (!results.length) {
            err = new errors.ConnectionError('Mauvaise combinaison e-mail, mot de passe.');
            return callback(err);
        }
        var user = new User(results[0]['user']);
        callback(null, user);
    });
};


// Initialisation des variables uniques pour l'user (email)
db.createConstraint({
    label: 'User',
    property: 'email'
}, function (err, constraint) {
    if (err) throw err;
    if (constraint) {
        console.log('(Contrainte d\'email unique enregistée)');
    }
});

