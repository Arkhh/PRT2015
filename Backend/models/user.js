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
    //this._rel = _rel;
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
    },
    'points':{
        required: false,
        minLength: 1,
        maxLength: 8,
        pattern: /^[0-9]+$/,
        message: 'number'
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
Object.defineProperty(User.prototype, 'points', {
    get: function () { return this._node.properties['points']; }
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

function createJson(res){
    var i = 0;
    var tabReponse = [];
    while (i<res.length){
        var moyenne1 = res[i].r1.properties.moyenne;
        var moyenne2 = res[i].r2.properties.moyenne;
        var moyenne3 = res[i].r3.properties.moyenne;
        var moyenne4 = res[i].r4.properties.moyenne;
        var moyenne5 = res[i].r5.properties.moyenne;
        var noteMoyenne = (moyenne1 + moyenne2 + moyenne3 + moyenne4 + moyenne5)/5;
        // while
        var tab= {
            id: res[i].u._id,
            nom: res[i].u.properties.nom,
            prenom: res[i].u.properties.prenom,
            mainForte: res[i].u.properties.mainForte,
            points: parseInt(res[i].u.properties.points),
            noteMoyenne: noteMoyenne
        }
        tabReponse.push(tab);
        i++;
    }
    /*console.log("Ici");
    console.log(res[0].r);
    console.log(res[1].r);
    console.log(res[2].r);
    console.log('moyenne');
    console.log(tab.noteMoyenne);*/
    return tabReponse;
};

function createJsonId(res){
    var moyenneVolee = res[0].r1.properties.moyenne;
    var moyenneFrappe = res[0].r2.properties.moyenne;
    var moyenneTechnique = res[0].r3.properties.moyenne;
    var moyenneEndurance = res[0].r4.properties.moyenne;
    var moyenneFond = res[0].r5.properties.moyenne;
    var noteMoyenne = (moyenneVolee + moyenneFrappe + moyenneTechnique + moyenneEndurance + moyenneFond)/5;
    // while
    var tab = {
        id: res[0].u._id,
        nom: res[0].u.properties.nom,
        prenom: res[0].u.properties.prenom,
        mainForte: res[0].u.properties.mainForte,
        type: res[0].u.properties.type,
        points: res[0].u.properties.points,
        moyenneVolee: moyenneVolee,
        moyenneFrappe: moyenneFrappe,
        moyenneEndurance: moyenneEndurance,
        moyenneTechnique: moyenneTechnique,
        moyenneFond: moyenneFond,
        noteMoyenne: noteMoyenne
    }
    return tab;
};

function createJsonMoy(res){
    var moyenneVolee = res[0].r1.properties.moyenne;
    var moyenneFrappe = res[0].r2.properties.moyenne;
    var moyenneTechnique = res[0].r3.properties.moyenne;
    var moyenneEndurance = res[0].r4.properties.moyenne;
    var moyenneFond = res[0].r5.properties.moyenne;
    // while
    var tab = {
        moyenneVolee: moyenneVolee,
        moyenneFrappe: moyenneFrappe,
        moyenneEndurance: moyenneEndurance,
        moyenneTechnique: moyenneTechnique,
        moyenneFond: moyenneFond
    }
    return tab;
};

//tabReponse.push(results[i].u.properties

User.prototype.isAdmin = function() {
    if(this.admin){
        return true;
    }
    return false;
};

// Public instance methods:

// Atomically updates this user, both locally and remotely in the db, with the
// given property updates.
User.prototype.patch = function (props, callback) {


    var errorTab=[],validProps;

    if(!props.email){
        props=_.extend(props,{
            email: this.email});
    }
    if(!props.password){
        props=_.extend(props,{
            password: this.password});
    }
    if(!props.nom){
        props=_.extend(props,{
            nom: this.nom});
    }
    if(!props.prenom){
        props=_.extend(props,{
            prenom: this.prenom});
    }


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

    props=_.extend(props,{
        admin: false,
        points: '1000',
        totalVolee: 5,
        totalFond: 5,
        totalFrappe: 5,
        totalEndurance: 5,
        totalTechnique: 5,
        nbEvalVolee: 1,
        nbEvalFond: 1,
        nbEvalFrappe: 1,
        nbEvalEndurance: 1,
        nbEvalTechnique: 1
    });

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

User.pubList = function(callback){
    var query = [
        "MATCH (u:User),(s1:Skill),(s2:Skill),(s3:Skill),(s4:Skill),(s5:Skill) " +
        "WHERE s1.nom = 'Volee'AND s2.nom = 'Frappe'AND s3.nom = 'Technique'AND s4.nom = 'Endurance'AND s5.nom = 'Fond' " +
        "WITH u,s1,s2,s3,s4,s5 " +
        "MATCH (u)-[r1:RelationEvaluation]->(s1) " +
        "MATCH (u)-[r2:RelationEvaluation]->(s2) " +
        "MATCH (u)-[r3:RelationEvaluation]->(s3) " +
        "MATCH (u)-[r4:RelationEvaluation]->(s4) " +
        "MATCH (u)-[r5:RelationEvaluation]->(s5) " +
        "RETURN u,r1,r2,r3,r4,r5"
    ].join('\n');

    db.cypher({
        query: query
    }, function (err, results) {
        if (err) return callback(err);
        console.log("results");
        console.log(results);
        var users = createJson(results);
       /* var users = results.map(function (result) {
            console.log("users");
            console.log(users);
            return createJson(result);
        });*/
        callback(null, users);
    });
};

User.prototype.pubListId = function(callback){
    var query = [
        "MATCH (u:User),(s1:Skill),(s2:Skill),(s3:Skill),(s4:Skill),(s5:Skill) " +
        "WHERE id(u) = {id} AND s1.nom = 'Volee' AND s2.nom = 'Frappe' AND s3.nom = 'Technique' AND s4.nom = 'Endurance' AND s5.nom = 'Fond' " +
        "WITH u,s1,s2,s3,s4,s5 " +
        "MATCH (u)-[r1:RelationEvaluation]->(s1) " +
        "MATCH (u)-[r2:RelationEvaluation]->(s2) " +
        "MATCH (u)-[r3:RelationEvaluation]->(s3) " +
        "MATCH (u)-[r4:RelationEvaluation]->(s4) " +
        "MATCH (u)-[r5:RelationEvaluation]->(s5) " +
        "RETURN u,r1,r2,r3,r4,r5"
    ].join('\n');

    var params = {
        id: this.id
    }
    db.cypher({
        query: query,
        params: params
    }, function (err, results) {
        if (err) return callback(err);
        //console.log("results");
        //console.log(results);
        var users = createJsonId(results);
        /* var users = results.map(function (result) {
         console.log("users");
         console.log(users);
         return createJson(result);
         });*/
        callback(null, users);
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
    if(this.admin){
        return true;
    }
    return false;
}

// Public instance methods:

// Atomically updates this user, both locally and remotely in the db, with the
// given property updates.
User.prototype.patch = function (props, callback) {

    var errorTab=[],validProps,required;

    if(!props.email){
        props=_.extend(props,{
            email: this.email});
    }
    if(!props.password){
        props=_.extend(props,{
            password: this.password});
    }
    if(!props.nom){
        props=_.extend(props,{
            nom: this.nom});
    }
    if(!props.prenom){
        props=_.extend(props,{
            prenom: this.prenom});
    }


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

User.getAdv = function (id, callback) {

    var idInt=parseInt(id);
    var query = [
        'MATCH (user:User)-[r:JOUE]',
        '-(m:Match)-[r2:JOUE]-(adv:User)',
        'WHERE id(user)={id}',
        'RETURN adv'
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
        var users = results.map(function (result) {
            return new User(result['adv']);
        });
        callback(null, users);
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

//GESTION DES SKILLS

//CREATION

// FONCTION DE RECHERCHE DE JOUEURS CORRESPONDANT A LA MOYENNE VOULUE DANS UN SKILL CHOISI
User.searchSkillLevel = function(id, nomSkill, noteCherchee, callback) {
/*
    console.log("id");
    console.log(id);
    console.log("NOM");
    console.log(nomSkill);
    console.log("note")
    console.log(noteCherchee)*/

    var intNoteCherchee = parseInt(noteCherchee);
    if (intNoteCherchee - 2 < 0){
        var noteInf = 0;

    }
    else {
        var noteInf = intNoteCherchee - 2;
    }
    if (intNoteCherchee + 2 > 10){
        var noteSup = 10;
    }
    else {
        var noteSup = intNoteCherchee + 2;
    }


    if (intNoteCherchee > 5) {
        //si l'email est déjà pris
        err = new errors.UnicityError('La note ne peut dépasser 5 !!!');
        return(err);
    }

    var query = [
        "MATCH (u:User),(s:Skill) " +
        "WHERE s.nom = {nomSkill} " +
        "AND " +
        "id(u) <> {id} " +
        "WITH u,s " +
        "MATCH (u)-[r:RelationEvaluation]->(s) " +
        "WHERE {noteInf} < {noteCherchee} < {noteSup} " +
        "RETURN u"
    ].join('\n');

    var params = {
        nomSkill: nomSkill,
        noteCherchee: intNoteCherchee,
        id: id,
        noteSup: noteSup,
        noteInf: noteInf
    };

    console.log("nomSkill");
    console.log(nomSkill);
    console.log("noteCherchee");
    console.log(intNoteCherchee);
    //console.log("roundNoteCherchee");
    //console.log(intNoteCherchee);

    db.cypher({
        query: query,
        params: params
    }, function (err, results) {
        if (isConstraintViolation(err)) {
            //si l'email est déjà pris
            err = new errors.UnicityError('Quelle erreur mettre ???');
        }
        if (err) return err;

        var i=0;
        var tabReponse = [];

        while(i<results.length){
            //tabReponse.push(results[i].u.properties); //pour juste les données des noeuds
            //tabReponse.push(results[i].u); //Pour données des noeuds + id
            tabReponse.push(results[i].u._id); //Pour simplement les ids des noeuds correspondant
            i++;
        }

        return callback(null, tabReponse);
    });
};

//FONCTION GENERALE POUR CREATION DE REL SKILL
User.prototype.createRel = function (){

    var query = [
        "MATCH (u:User),(a:Skill),(b:Skill),(c:Skill),(d:Skill),(e:Skill) " +
        "WHERE id(u) = {id} AND a.nom = 'Endurance' " +
        "AND b.nom = 'Frappe' AND c.nom = 'Volee' AND d.nom = 'Fond' AND e.nom = 'Technique' " +
        "CREATE (u)-[r0:RelationEvaluation { moyenne: 0, nbEval: 0, total: 0 }]->(a) " +
        "CREATE (u)-[r1:RelationEvaluation { moyenne: 0, nbEval: 0, total: 0 }]->(b) " +
        "CREATE (u)-[r2:RelationEvaluation { moyenne: 0, nbEval: 0, total: 0 }]->(c) " +
        "CREATE (u)-[r3:RelationEvaluation { moyenne: 0, nbEval: 0, total: 0 }]->(d) " +
        "CREATE (u)-[r4:RelationEvaluation { moyenne: 0, nbEval: 0, total: 0 }]->(e) " +
        "RETURN r0,r1,r2,r3,r4"
    ].join('\n');

    var params = {
        id: this.id
    };

    db.cypher({
        query: query,
        params: params
    }, function (err, results) {
        if (isConstraintViolation(err)) {
            //si l'email est déjà pris
            err = new errors.UnicityError('Quelle erreur mettre ???');
        }
        if (err) return err;
        return ('Okay');
        //callback(null, 'Rel Volee Creee');
        //var user = new User(results[0]['user']);
        //callback(null, user);
    });
};

//LIRE LA RELATION
User.prototype.readRel = function (nomSkill,callback){

    var query = [
        "MATCH (u:User)-[r:RelationEvaluation]->(s:Skill) " +
        "WHERE id(u) = {id} AND s.nom = {nomSkill} " +
        "RETURN r"
    ].join('\n');

    var params = {
        id: this.id,
        nomSkill: nomSkill
    };

    /*console.log("query");
    console.log(query);
    console.log("params");
    console.log(params);*/
    db.cypher({
        query: query,
        params: params
    }, function (err, results) {
        console.log(results);
        if (isConstraintViolation(err)) {
            //si l'email est déjà pris
            err = new errors.UnicityError('Quelle erreur mettre ???');
        }
        if (err) return err;
       // console.log('results');
       // console.log(results);
        callback(null, results);
        //return ('Okay');
        //callback(null, 'Rel Volee Creee');
        //var user = new User(results[0]['user']);
        //callback(null, user);
    });
};

//EDIT GENERALISE DE LA RELATION
User.notation = function (note, rel, callback){

    var noteInt = parseInt(note);
    console.log("noteInt");
    console.log(noteInt);

    if (noteInt > 5) {
        //si l'email est déjà pris
        err = new errors.UnicityError('La note ne peut dépasser 5 !!!');
        callback(err, null);
    }

    var newTotal = rel[0].r.properties.total + noteInt;
    console.log("total");
    console.log(newTotal);
    var newNbEval = rel[0].r.properties.nbEval + 1;
    console.log("newNbEval");
    console.log(newNbEval);
    var newMoyenne = (newTotal/newNbEval);
    console.log("newMoyenne");
    console.log(newMoyenne);


    var query = [
        "MATCH (u:User)-[r:RelationEvaluation]->(s:Skill) " +
        "WHERE id(r) = {id} " +
        "SET r.nbEval = {newNbEval}, r.total = {newTotal} " +
        "SET r.moyenne = {newMoyenne} " +
        "RETURN r"
    ].join('\n');

    var params = {
        id: rel[0].r._id,
        newMoyenne: newMoyenne,
        newNbEval: newNbEval,
        newTotal: newTotal
    };

    console.log("query");
    console.log(query);
    console.log("params");
    console.log(params);

    db.cypher({
        query: query,
        params: params
    }, function (err, results) {
        if (isConstraintViolation(err)) {
            //si l'email est déjà pris
            err = new errors.UnicityError('Quelle erreur mettre ???');
        }
        if (err) return err;
        //var user = new User(results[0]);
        callback(null, results);
    });
};

//SUGGESTION DE JOUEURS
User.prototype.suggest = function (callback) {



    var query = [
        "MATCH (u:User),(s1:Skill),(s2:Skill),(s3:Skill),(s4:Skill),(s5:Skill) " +
        "WHERE id(u) = {id} AND s1.nom = 'Volee' AND s2.nom = 'Frappe' AND s3.nom = 'Technique' AND s4.nom = 'Endurance' AND s5.nom = 'Fond' " +
        "WITH u,s1,s2,s3,s4,s5 " +
        "MATCH (u)-[r1:RelationEvaluation]->(s1) " +
        "MATCH (u)-[r2:RelationEvaluation]->(s2) " +
        "MATCH (u)-[r3:RelationEvaluation]->(s3) " +
        "MATCH (u)-[r4:RelationEvaluation]->(s4) " +
        "MATCH (u)-[r5:RelationEvaluation]->(s5) " +
        "RETURN u,r1,r2,r3,r4,r5"
    ].join('\n');

    var params = {
        id: this.id
    }

    db.cypher({
        query: query,
        params: params
    }, function (err, results) {
        if (err) return callback(err);

        var users = createJsonMoy(results);

        var tabSkills = [];
        tabSkills.push(
            {nomSkill: 'Volee', moyenne: users.moyenneVolee},
            {nomSkill: 'Frappe', moyenne: users.moyenneFrappe},
            {nomSkill: 'Fond', moyenne: users.moyenneFond},
            {nomSkill: 'Technique', moyenne: users.moyenneTechnique},
            {nomSkill: 'Endurance', moyenne: users.moyenneEndurance}
        );

        var idUser = results[0].u._id;

        var tabId = [];
        //tabId.push(tabSkills.forEach(User.searchSkillLevel(this.id, nomSkill, moyenne, callback)));

        var i = 0;


        var itemsProcessed =0;

        tabSkills.forEach (function (skill){
            User.searchSkillLevel(idUser, skill.nomSkill, skill.moyenne, function(err,result){
                var controle = [];
                controle.push(result);
                result.forEach(function(ids){
                    tabId.push(ids);
                })
                itemsProcessed++;
                if(itemsProcessed === tabSkills.length) {
                    //TODO trier tabID
                    tabId.sort();
                    var courant = null;
                    var cnt = 0;
                    var objetSoluce = {};
                    var tableauRep=[];
                    for (var i = 0; i < tabId.length; i++) {
                        if (tabId[i] != courant) {
                            if (cnt > 0) {
                                console.log(courant + ' est present --> ' + cnt + ' fois');
                                objetSoluce = {id: courant, nb: cnt};
                                tableauRep.push(objetSoluce);
                            }
                            courant = tabId[i];
                            cnt = 1;
                        } else {
                            cnt++;
                        }
                    }
                    if (cnt > 0) {
                        console.log(courant + ' est present --> ' + cnt + ' fois');
                        objetSoluce = {id: courant, nb: cnt};
                        tableauRep.push(objetSoluce);
                    }
                    var newTabRep = [];
                    newTabRep = tableauRep.sort(keysrt('nb'));
                    var lastTabRep = [];
                    lastTabRep = newTabRep.slice(0,8);
                    console.log("lastTab");
                    var tabFinal = [];
                    for(j=0; j<lastTabRep.length; j++){
                        tabFinal.push(lastTabRep[j].id);
                    }
                    console.log(tabFinal);
                    return callback(null, tabFinal);
                }
                }
            )

        }
        )



      //  tabSkills.forEach(function(skill) { console.log("hello"); tabId.push(User.searchSkillLevel(idUser, skill.nomSkill, skill.moyenne)) });
      //  console.log("hello2");


    });
};

function keysrt(key) {
    return function(a,b){
        if (a[key] > b[key]) return 1;
        if (a[key] < b[key]) return -1;
        return 0;
    }
}

//someArrayOfObjects.sort(keysrt('text'));
