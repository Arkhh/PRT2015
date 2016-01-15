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
    },
    'totalVolee':{
        required: false,
        minLength: 1,
        maxLength: 8,
        pattern: /^[0-9]+$/,
        message: 'number'
    },
    'nbEvalVolee':{
        required: false,
        minLength: 1,
        maxLength: 8,
        pattern: /^[0-9]+$/,
        message: 'number'
    },
    'totalFrappe':{
        required: false,
        minLength: 1,
        maxLength: 8,
        pattern: /^[0-9]+$/,
        message: 'number'
    },
    'nbEvalFrappe':{
        required: false,
        minLength: 1,
        maxLength: 8,
        pattern: /^[0-9]+$/,
        message: 'number'
    },
    'totalEndurance':{
        required: false,
        minLength: 1,
        maxLength: 8,
        pattern: /^[0-9]+$/,
        message: 'number'
    },
    'nbEvalEndurance':{
        required: false,
        minLength: 1,
        maxLength: 8,
        pattern: /^[0-9]+$/,
        message: 'number'
    },
    'totalFond':{
        required: false,
        minLength: 1,
        maxLength: 8,
        pattern: /^[0-9]+$/,
        message: 'number'
    },
    'nbEvalFond':{
        required: false,
        minLength: 1,
        maxLength: 8,
        pattern: /^[0-9]+$/,
        message: 'number'
    },
    'totalTechnique':{
        required: false,
        minLength: 1,
        maxLength: 8,
        pattern: /^[0-9]+$/,
        message: 'number'
    },
    'nbEvalTechnique':{
        required: false,
        minLength: 1,
        maxLength: 8,
        pattern: /^[0-9]+$/,
        message: 'number'
    },
    'classement':{
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
Object.defineProperty(User.prototype, 'totalVolee', {
    get: function () { return this._node.properties['totalVolee']; }
});
Object.defineProperty(User.prototype, 'nbEvalVolee', {
    get: function () { return this._node.properties['nbEvalVolee']; }
});
Object.defineProperty(User.prototype, 'totalFrappe', {
    get: function () { return this._node.properties['totalFrappe']; }
});
Object.defineProperty(User.prototype, 'nbEvalFrappe', {
    get: function () { return this._node.properties['nbEvalFrappe']; }
});
Object.defineProperty(User.prototype, 'totalEndurance', {
    get: function () { return this._node.properties['totalEndurance']; }
});
Object.defineProperty(User.prototype, 'nbEvalEndurance', {
    get: function () { return this._node.properties['nbEvalEndurance']; }
});
Object.defineProperty(User.prototype, 'totalFond', {
    get: function () { return this._node.properties['totalFond']; }
});
Object.defineProperty(User.prototype, 'nbEvalFond', {
    get: function () { return this._node.properties['nbEvalFond']; }
});
Object.defineProperty(User.prototype, 'totalTechnique', {
    get: function () { return this._node.properties['totalTechnique']; }
});
Object.defineProperty(User.prototype, 'nbEvalTechnique', {
    get: function () { return this._node.properties['nbEvalTechnique']; }
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
User.prototype.createRelVolee = function (){

    var query = [
        "MATCH (u:User),(s:Skill) " +
        "WHERE id(u) = {id} AND s.nom = 'Volee' " +
        "CREATE (u)-[r:RelationEvaluation { moyenne: 0 }]->(s) " +
        "RETURN r"
    ].join('\n');

    var params = {
        id: this.id,
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

User.prototype.createRelFrappe = function (){

    var query = [
        "MATCH (u:User),(s:Skill) " +
        "WHERE id(u) = {id} AND s.nom = 'Frappe' " +
        "CREATE (u)-[r:RelationEvaluation { moyenne: 0 }]->(s) " +
        "RETURN r"
    ].join('\n');

    var params = {
        id: this.id,
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

User.prototype.createRelFond = function (){

    var query = [
        "MATCH (u:User),(s:Skill) " +
        "WHERE id(u) = {id} AND s.nom = 'Fond' " +
        "CREATE (u)-[r:RelationEvaluation { moyenne: 0 }]->(s) " +
        "RETURN r"
    ].join('\n');

    var params = {
        id: this.id,
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

User.prototype.createRelEndurance = function (){

    var query = [
        "MATCH (u:User),(s:Skill) " +
        "WHERE id(u) = {id} AND s.nom = 'Endurance' " +
        "CREATE (u)-[r:RelationEvaluation { moyenne: 0 }]->(s) " +
        "RETURN r"
    ].join('\n');

    var params = {
        id: this.id,
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

User.prototype.createRelTechnique = function (){

    var query = [
        "MATCH (u:User),(s:Skill) " +
        "WHERE id(u) = {id} AND s.nom = 'Technique' " +
        "CREATE (u)-[r:RelationEvaluation { moyenne: 0 }]->(s) " +
        "RETURN r"
    ].join('\n');

    var params = {
        id: this.id,
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

//EDIT
User.prototype.editRelVolee = function (note, callback){

    var noteInt = parseInt(note);
    var newTotalVolee = this.totalVolee + noteInt;
    var newNbEval = this.nbEvalVolee + 1;
    var newMoyenne = (newTotalVolee/newNbEval)

    var query = [
        "MATCH (u:User)-[r:RelationEvaluation]->(s:Skill) " +
        "WHERE id(u) = {id} AND s.nom = 'Volee' " +
        "SET r.moyenne = {newMoyenne}, u.nbEvalVolee = {newNbEvalVolee}, u.totalVolee = {newTotalVolee} " +
        "RETURN u"
    ].join('\n');

    var params = {
        id: this.id,
        newMoyenne: newMoyenne,
        newNbEvalVolee: newNbEval,
        newTotalVolee: newTotalVolee
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
        var user = new User(results[0]);
        callback(null, user);
    });
};

User.prototype.editRelFrappe = function (note, callback){

    var noteInt = parseInt(note);
    var newTotalFrappe = this.totalFrappe + noteInt;
    var newNbEval = this.nbEvalFrappe + 1;
    var newMoyenne = (newTotalFrappe/newNbEval)

    var query = [
        "MATCH (u:User)-[r:RelationEvaluation]->(s:Skill) " +
        "WHERE id(u) = {id} AND s.nom = 'Frappe' " +
        "SET r.moyenne = {newMoyenne}, u.nbEvalFrappe = {newNbEvalFrappe}, u.totalFrappe = {newTotalFrappe} " +
        "RETURN u"
    ].join('\n');

    var params = {
        id: this.id,
        newMoyenne: newMoyenne,
        newNbEvalFrappe: newNbEval,
        newTotalFrappe: newTotalFrappe
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
        var user = new User(results[0]);
        callback(null, user);
    });
};

User.prototype.editRelFond = function (note, callback){

    var noteInt = parseInt(note);
    var newTotalFond = this.totalFond + noteInt;
    var newNbEval = this.nbEvalFond + 1;
    var newMoyenne = (newTotalFond/newNbEval)

    var query = [
        "MATCH (u:User)-[r:RelationEvaluation]->(s:Skill) " +
        "WHERE id(u) = {id} AND s.nom = 'Fond' " +
        "SET r.moyenne = {newMoyenne}, u.nbEvalFond = {newNbEvalFond}, u.totalFond = {newTotalFond} " +
        "RETURN u"
    ].join('\n');

    var params = {
        id: this.id,
        newMoyenne: newMoyenne,
        newNbEvalFond: newNbEval,
        newTotalFond: newTotalFond
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
        var user = new User(results[0]);
        callback(null, user);
    });
};

User.prototype.editRelTechnique = function (note, callback){

    var noteInt = parseInt(note);
    var newTotalTechnique = this.totalTechnique + noteInt;
    var newNbEval = this.nbEvalTechnique + 1;
    var newMoyenne = (newTotalTechnique/newNbEval)

    var query = [
        "MATCH (u:User)-[r:RelationEvaluation]->(s:Skill) " +
        "WHERE id(u) = {id} AND s.nom = 'Technique' " +
        "SET r.moyenne = {newMoyenne}, u.nbEvalTechnique = {newNbEvalTechnique}, u.totalTechnique = {newTotalTechnique} " +
        "RETURN u"
    ].join('\n');

    var params = {
        id: this.id,
        newMoyenne: newMoyenne,
        newNbEvalTechnique: newNbEval,
        newTotalTechnique: newTotalTechnique
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
        var user = new User(results[0]);
        callback(null, user);
    });
};

User.prototype.editRelEndurance = function (note, callback){

    var noteInt = parseInt(note);
    var newTotalEndurance = this.totalEndurance + noteInt;
    var newNbEval = this.nbEvalEndurance + 1;
    var newMoyenne = (newTotalEndurance/newNbEval)

    var query = [
        "MATCH (u:User)-[r:RelationEvaluation]->(s:Skill) " +
        "WHERE id(u) = {id} AND s.nom = 'Endurance' " +
        "SET r.moyenne = {newMoyenne}, u.nbEvalEndurance = {newNbEvalEndurance}, u.totalEndurance = {newTotalEndurance} " +
        "RETURN u"
    ].join('\n');

    var params = {
        id: this.id,
        newMoyenne: newMoyenne,
        newNbEvalEndurance: newNbEval,
        newTotalEndurance: newTotalEndurance
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
        var user = new User(results[0]);
        callback(null, user);
    });
};

//FONCTION DE RECHERCHE DE JOUEURS CORRESPONDANT A LA MOYENNE VOULUE DANS UN SKILL CHOISI
User.prototype.searchSkillLevel = function(nomSkill, noteCherchee, callback) {

    var intNoteCherchee = parseInt(noteCherchee);

    if (intNoteCherchee > 5) {
        //si l'email est déjà pris
        err = new errors.UnicityError('La note ne peut dépasser 5 !!!');
        callback(err);
    }

    var query = [
        "MATCH (u:User),(s:Skill) " +
        "WHERE s.nom = {nomSkill} " +
        "AND " +
        "id(u)<{id} OR {id}<id(u) " +
        "WITH u,s " +
        "MATCH (u)-[r:RelationEvaluation]->(s) " +
        "WHERE round(r.moyenne) = {noteCherchee} " +
        "RETURN u"
    ].join('\n');

    var params = {
        nomSkill: nomSkill,
        noteCherchee: intNoteCherchee,
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

        var i=0;
        var tabReponse = [];
        while(i<results.length){
            //tabReponse.push(results[i].u.properties); pour juste les données des noeuds
            //tabReponse.push(results[i].u); Pour données des noeuds + id
            tabReponse.push(results[i].u._id); //Pour simplement les ids des noeuds correspondant
            i++;
        }
        callback(null, tabReponse);
    });
}