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
        maxLength: 255,
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

function createJsonGetAll(res){
    var i = 0;
    var tabReponse = [];
    while (i<res.length){
        var tab= {
            id: res[i].user._id,
            nom: res[i].user.properties.nom,
            prenom: res[i].user.properties.prenom,
            mainForte: res[i].user.properties.mainForte,
            sexe: res[i].user.properties.sexe,
            points: parseInt(res[i].user.properties.points),
            admin: res[i].user.properties.admin
        }
        tabReponse.push(tab);
        i++;
    }
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
        sexe: res[0].u.properties.sexe,
        moyenneVolee: moyenneVolee,
        moyenneFrappe: moyenneFrappe,
        moyenneEndurance: moyenneEndurance,
        moyenneTechnique: moyenneTechnique,
        moyenneFond: moyenneFond,
        noteMoyenne: noteMoyenne
    }
    return tab;
};

function createJsonSearch(res){
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
            type: res[i].u.properties.type,
            points: res[i].u.properties.points,
            sexe: res[i].u.properties.sexe,
            moyenneVolee: moyenne1,
            moyenneFrappe: moyenne2,
            moyenneEndurance: moyenne3,
            moyenneTechnique: moyenne4,
            moyenneFond: moyenne5,
            noteMoyenne: noteMoyenne
        }
        tabReponse.push(tab);
        i++;
    }
    //console.log("tabReponse");
    //console.log(tabReponse);
    return tabReponse;
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

function createJsonVolee(res, borneInf, borneSup){

    /*console.log("jsonVolee");
    console.log(res);
    console.log("taille");
    console.log(res.length);*/
    /*console.log("borneInf");
    console.log(borneInf);
    console.log("borneSup");
    console.log(borneSup);*/
    //console.log(res[0].properties.moyenne);
    if(res.length != 0){
        var maVariable = 0;
        var monTableau = [];
        while (maVariable<res.length){
            var moyenneVolee = res[maVariable].r1.properties.moyenne;
            console.log("moyenneVolee");
            console.log(moyenneVolee);


            if((borneInf<moyenneVolee)&&(moyenneVolee<borneSup)){
                var tab = {
                    nomSkill: "Volee",
                    moyenne: moyenneVolee
                }
                monTableau.push(tab);
            }
            maVariable++;
            /*console.log("tab");
            console.log(tab);*/
        }
        console.log("MON TABLEAU VOLEE");
        var tchou = 0;
        while(tchou<monTableau.length){
            console.log(monTableau[tchou]);
            tchou++;
        }
        return monTableau;
    }
    //console.log("je passe ici");
    return res;
}

function createJsonFrappe(res, borneInf, borneSup){
    console.log("res.length");
    console.log(res.length);

    if(res.length != 0){
        var maVariable = 0;
        var monTableau = [];
        while (maVariable<res.length){
            var moyenneFrappe = res[maVariable].r2.properties.moyenne;
            if(borneInf < moyenneFrappe < borneSup){
                var tab = {
                    nomSkill: "Frappe",
                    moyenne: moyenneFrappe
                }
                monTableau.push(tab);
            }
            maVariable++;
        }
        //console.log("tab");
        //console.log(tab);
        return monTableau;
    }
    return res;
}

function createJsonTec(res, borneInf, borneSup){
    /*console.log("res.length");
    console.log(res.length);*/

    if(res.length != 0){
        var maVariable = 0;
        var monTableau = [];
        while (maVariable<res.length){
            var moyenneTec = res[maVariable].r3.properties.moyenne;
            if(borneInf < moyenneTec < borneSup){
                var tab = {
                    nomSkill: "Technique",
                    moyenne: moyenneTec
                }
                monTableau.push(tab);
            }
            maVariable++;
        }
        //console.log("tab");
        //console.log(tab);
        return monTableau;
    }
    return res;
}

function createJsonEnd(res, borneInf, borneSup){

    if(res.length != 0){
        var maVariable = 0;
        var monTableau = [];
        while (maVariable<res.length){
            var moyenneEnd = res[maVariable].r4.properties.moyenne;
            if(borneInf < moyenneEnd < borneSup){
                var tab = {
                    nomSkill: "Endurance",
                    moyenne: moyenneEnd
                }
                monTableau.push(tab);
            }
            maVariable++;
        }
        //console.log("tab");
        //console.log(tab);
        return monTableau;
    }
    return res;
}

function createJsonEndurance(res, borneInf, borneSup){

    if(res.length != 0){
        var maVariable = 0;
        var monTableau = [];
        while (maVariable<res.length){
            var moyenneFond = res[maVariable].r5.properties.moyenne;
            if(borneInf < moyenneFond < borneSup){
                var tab = {
                    nomSkill: "Fond",
                    moyenne: moyenneFond
                }
                monTableau.push(tab);
            }
            maVariable++;
        }
        //console.log("tab");
        //console.log(tab);
        return monTableau;
    }
    return res;
}

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
        points: 1000,
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
        console.log("user");
        console.log(user);
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
        console.log("results");
        console.log(results[0].user._id);
        var users = createJsonGetAll(results);
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

// FONCTION DE RECHERCHE DE JOUEURS CORRESPONDANT A LA MOYENNE VOULUE DANS UN SKILL CHOISI
User.searchSkillLevel = function(id, nomSkill, noteCherchee, callback) {

    console.log("id");
    console.log(id);
    console.log("NOM");
    console.log(nomSkill);
    console.log("note")
    console.log(noteCherchee)

    var intNoteCherchee = parseInt(noteCherchee);
    console.log("intNoteCherchee");
    console.log(intNoteCherchee);
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

   // console.log("Bonsoir");
    /*if (intNoteCherchee > 5) {
        //si l'email est déjà pris
        err = new errors.UnicityError('La note ne peut dépasser 5 !!!');
        return(err);
    }*/

    var query = [
        "MATCH (u:User),(s:Skill) " +
        "WHERE s.nom = {nomSkill} " +
        "AND " +
        "id(u) <> {id} " +
        "WITH u,s " +
        "MATCH (u)-[r:RelationEvaluation]->(s) " +
        "WHERE {noteInf} < r.moyenne < {noteSup} " +
        "RETURN u"
    ].join('\n');

    var params = {
        nomSkill: nomSkill,
        id: id,
        noteSup: noteSup,
        noteInf: noteInf
    };

    console.log ("CE QUE JE VEUX VOIR");
    console.log("query");
    console.log(query);
    console.log("params");
    console.log(params);
    console.log("nomSkill");
    console.log(nomSkill);
    //console.log("noteCherchee");
    //console.log(intNoteCherchee);
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
        "CREATE (u)-[r0:RelationEvaluation { moyenne: 5, nbEval: 1, total: 5 }]->(a) " +
        "CREATE (u)-[r1:RelationEvaluation { moyenne: 5, nbEval: 1, total: 5 }]->(b) " +
        "CREATE (u)-[r2:RelationEvaluation { moyenne: 5, nbEval: 1, total: 5 }]->(c) " +
        "CREATE (u)-[r3:RelationEvaluation { moyenne: 5, nbEval: 1, total: 5 }]->(d) " +
        "CREATE (u)-[r4:RelationEvaluation { moyenne: 5, nbEval: 1, total: 5 }]->(e) " +
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

    db.cypher({
        query: query,
        params: params
    }, function (err, results) {
        if (isConstraintViolation(err)) {
            err = new errors.UnicityError('Quelle erreur mettre ???');
        }
        if (err) return err;
       // console.log('results');
       // console.log(results);
        //return ('Okay');
        //callback(null, 'Rel Volee Creee');
        //var user = new User(results[0]['user']);
        //callback(null, user);

       return callback(null, results);

    });
};

//EDIT GENERALISE DE LA RELATION
User.notation = function (note, rel, callback){

    var noteInt = parseInt(note);

    if (noteInt > 10) {
        //si l'email est déjà pris
        err = new errors.UnicityError('La note ne peut dépasser 10 !!!');
        return callback(err, null);
    }

    var newTotal = rel[0].r.properties.total + noteInt;

    var newNbEval = rel[0].r.properties.nbEval + 1;

    var newMoyenne = (newTotal/newNbEval);



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
    };

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
                });
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
                        objetSoluce = {id: courant, nb: cnt};
                        tableauRep.push(objetSoluce);
                    }
                    var newTabRep = [];
                    newTabRep = tableauRep.sort(keysrt('nb'));
                    console.log("newTabRep");
                    console.log(newTabRep);
                    var lastTabRep = [];

                    lastTabRep = newTabRep.slice(newTabRep.length - 8,newTabRep.length);
                    console.log("lastTab");
                    var tabFinal = [];
                    for(j=0; j<lastTabRep.length; j++){
                        tabFinal.push(lastTabRep[j].id);
                    }
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
        var user = new User(results[0]['adv']);
        callback(null, user);
    });
};

//fonction permettant le tri du tableau
User.setPoint=function(id,point){

    console.log("point dans fonction");
    console.log(point);
    var query = [
        'MATCH (user:User)',
        'WHERE id(user)={id}',
        'set user+={points:user.points+{point}}',
        'RETURN user'
    ].join('\n');


    var params = {
        id: id,
        point:point
    };

    db.cypher({
        query: query,
        params: params
    }, function (err, results) {
       /* if (err) return callback(err);
        if (!results.length) {
            var err=[];
            var error=new errors.PropertyError('No such user with ID: ' + id);
            err.push(error);
            return callback(err);
        }
        var user = new User(results[0]['user']);
        callback(null, user);*/
    });
};

/*
 'MATCH (user:User)',
 'MATCH (user2:User)',
 'WHERE id(user)={idJ1}',
 'AND id(user2)={idJ2}',
 'set user+={points:user.points+{gain}}',
 'set user2+={points:user2.points-{perte}}',
 'RETURN user,user2'
 */


function keysrt(key) {
    return function(a,b){
        if (a[key] > b[key]) return 1;
        if (a[key] < b[key]) return -1;
        return 0;
    }
}

//someArrayOfObjects.sort(keysrt('text'));
//FONCTION DE RECHERCHE PAR STRING
User.search = function (str, callback) {

    var query = [
        "MATCH (u:User),(s1:Skill),(s2:Skill),(s3:Skill),(s4:Skill),(s5:Skill) " +
        "WHERE s1.nom = 'Volee' AND s2.nom = 'Frappe' AND s3.nom = 'Technique' AND s4.nom = 'Endurance' AND s5.nom = 'Fond' " +
        "WITH u,s1,s2,s3,s4,s5 " +
        "MATCH (u)-[r1:RelationEvaluation]->(s1) " +
        "MATCH (u)-[r2:RelationEvaluation]->(s2) " +
        "MATCH (u)-[r3:RelationEvaluation]->(s3) " +
        "MATCH (u)-[r4:RelationEvaluation]->(s4) " +
        "MATCH (u)-[r5:RelationEvaluation]->(s5) " +
        "WHERE u.nom =~ '(?i).*" + str + ".*' OR u.prenom =~ '(?i).*"+ str +".*' " +
        "RETURN u,r1,r2,r3,r4,r5"
    ].join('\n');


    console.log("query");
    console.log(query);
    db.cypher({
        query: query
    }, function (err, results) {
        if (err) return callback(err);
        if (!results.length) {
            var err=[];
            var error=new errors.PropertyError('No such user with ' + str + 'in his name/lastname');
            err.push(error);
            return callback(err);
        }
        console.log("results.length");
        console.log(results.length);
        /*if (results.length === 1){
         var user = new User(results[0]['user']);
         console.log("results[0]['user']");
         console.log(results[0].u);
         var tabReponse = createJsonSearch(results);
         console.log("tabReponse");
         console.log(tabReponse[0]);
         return callback(null, tabReponse[0]);
         }*/
        console.log("results[0]['user']");
        console.log(results[0]['user']);
        var i = 0;
        var tabReponse = createJsonSearch(results);
        /*while (i<tabReponse.length){
         tabReponse.push(results[i]['user']);
         i++;
         }*/
        return callback(null, tabReponse);
    });
};

//SUGGESTION DE JOUEURS AVANCEE MOYENNE
User.prototype.suggestAdvanced = function (props,callback) {

    //////CLAUSE INITIALE
    var query = [
        "MATCH (u:User),(s1:Skill),(s2:Skill),(s3:Skill),(s4:Skill),(s5:Skill) " +
        "WHERE id(u) = {id} AND s1.nom = 'Volee' AND s2.nom = 'Frappe' AND s3.nom = 'Technique' AND s4.nom = 'Endurance' AND s5.nom = 'Fond' " +
        "WITH u,s1,s2,s3,s4,s5 "
        ]
    var queryFinale = query;
    //////CLAUSE MATCH
    if(props.skillVolee != null){

        var queryVolee = [
            "MATCH (User)-[r1:RelationEvaluation]->(s1) "
        ]
        queryFinale = queryFinale + queryVolee;
    }
    if(props.skillFrappe != null){
        var queryFrappe = [
            "MATCH (User)-[r2:RelationEvaluation]->(s2) "
        ]
        queryFinale = queryFinale + queryFrappe;
    }
    if(props.skillTechnique != null){
        var queryTechnique = [
            "MATCH (User)-[r3:RelationEvaluation]->(s3) "
        ]
        queryFinale = queryFinale + queryTechnique;
    }
    if(props.skillEndurance != null){
        var queryEndurance = [
            "MATCH (User)-[r4:RelationEvaluation]->(s4) "
        ]
        queryFinale = queryFinale + queryEndurance;
    }
    if(props.skillFond != null){
        var queryFond = [
            "MATCH (User)-[r5:RelationEvaluation]->(s5) "
        ]
        queryFinale = queryFinale + queryFond;
    }
    /////CLAUSE WHERE
    if(props.skillVolee != null){
        var intVoleeInf = Math.abs(parseInt(props.skillVolee) - 1);
        var intVoleeSup = Math.abs(parseInt(props.skillVolee) + 1);
        var queryVolee = [
            "WHERE " + intVoleeInf + " < r1.moyenne < " + intVoleeSup + " "
        ]
        queryFinale = queryFinale + queryVolee;
    }
    if(props.skillFrappe != null){
        var intFrappeInf = Math.abs(parseInt(props.skillFrappe) - 1);
        var intFrappeSup = Math.abs(parseInt(props.skillFrappe) + 1);
        if(props.skillVolee != null){
            var queryFrappe = [
                "OR " + intFrappeInf + " < r2.moyenne < " + intFrappeSup + " "
            ]
        }
        else {
            var queryFrappe = [
                "WHERE " + intFrappeInf + " < r2.moyenne < " + intFrappeSup + " "
            ]
        }
        queryFinale = queryFinale + queryFrappe;
    }
    if(props.skillTechnique != null){
        var intTechniqueInf = Math.abs(parseInt(props.skillTechnique) - 1);
        var intTechniqueSup = Math.abs(parseInt(props.skillTechnique) + 1);
        if(props.skillVolee != null || props.skillFrappe != null){
            var queryTechnique = [
                "OR " + intTechniqueInf + " < r3.moyenne < " + intTechniqueSup + " "
            ]
        }
        else {
            var queryTechnique = [
                "WHERE " + intTechniqueInf + " < r3.moyenne < " + intTechniqueSup + " "
            ]
        }
        queryFinale = queryFinale + queryTechnique;
    }
    if(props.skillEndurance != null){
        var intEnduranceInf = Math.abs(parseInt(props.skillEndurance) - 1);
        var intEnduranceSup = Math.abs(parseInt(props.skillEndurance) + 1);
        if(props.skillVolee != null || props.skillFrappe != null || props.skillTechnique != null){
            var queryEndurance = [
                "OR " + intEnduranceInf + " < r4.moyenne < " + intEnduranceSup + " "
            ]
        }
        var queryEndurance = [
            "WHERE " + intEnduranceInf + " < r4.moyenne < " + intEnduranceSup + " "
        ]
        queryFinale = queryFinale + queryEndurance;
    }
    if(props.skillFond != null){
        var intFondInf = Math.abs(parseInt(props.skillFond) - 1);
        var intFondSup = Math.abs(parseInt(props.skillFond) + 1);
        if(props.skillVolee != null || props.skillFrappe != null || props.skillTechnique != null || props.skillEndurance != null) {
            var queryFond = [
                "OR " + intFondInf + " < r4.moyenne < " + intFondSup + " "
            ]
        }
        var queryFond = [
                "WHERE " + intFondInf + " < r5.moyenne < " + intFondSup + " "
        ]
        queryFinale = queryFinale + queryFond;
    }
    /////CLAUSE FIN
    var queryFin = [
        "RETURN u"
    ]
    queryFinale = queryFinale + queryFin;

    if(props.skillVolee != null){
        var queryVoleeFin = [
            ",r1"
        ]
        queryFinale = queryFinale + queryVoleeFin;
    }
    if(props.skillFrappe != null){
        var queryFrappeFin = [
            ",r2"
        ]
        queryFinale = queryFinale + queryFrappeFin;
    }
    if(props.skillTechnique != null){
        var queryTechniqueFin = [
            ",r3"
        ]
        queryFinale = queryFinale + queryTechniqueFin;
    }
    if(props.skillEndurance != null){
        var queryVoleeFin = [
            ",r4"
        ]
        queryFinale = queryFinale + queryEnduranceFin;
    }
    if(props.skillFond != null){
        var queryFondFin = [
            ",r5"
        ]
        queryFinale = queryFinale + queryFondFin;
    }


    var params = {
        id: this.id,
        props: props
    }

    /*console.log("queryFinale");
    console.log(queryFinale);
    console.log("params");
    console.log(params);*/
   // console.log("params");
   // console.log(params);
    db.cypher({
        query: queryFinale,
        params: params
    }, function (err, results) {
        if (err) return callback(err);

        /*var o = 0;
        while (o<results.length){
            console.log("results[o]");
            console.log(results[o]);
            o++
        }*/

        var users = [];
      //  console.log("results");
       // console.log(results);
        if(props.skillVolee != null){
            users.push(createJsonVolee(results,intVoleeInf,intVoleeSup));
        }
        if(props.skillFrappe != null){
            users.push(createJsonFrappe(results,intFrappeInf,intFrappeSup));
        }
        if(props.skillTechnique != null){
            users.push(createJsonTec(results,intTechniqueInf,intTechniqueSup));
        }
        if(props.skillEndurance != null){
            users.push(createJsonEnd(results,intTechniqueInf,intTechniqueSup));
        }
        if(props.skillFond != null){
            users.push(createJsonFond(results,intFondInf,intFondSup));
        }

        //ON EN EST ICI
        var tabSkills = [];
        var taille = 0;
        /*console.log("TESTONS UN PEU");
        console.log(users[0][0]);*/
        // CA QUI BLOQUE CONNAIT PAS NOMSKILL
        while(taille<users.length){
            var taille2 = 0;
            while(taille2<users[taille].length){
                tabSkills.push(
                    users[taille][taille2]
                );
                taille2++;
            }
            taille++;
        }

        var z=0;
        while (z<tabSkills.length) {
            console.log(users[z]);
            z++;
        }

    /////si pas de resultat
        if(results.length === 0){
            var tabVide = [];
            return callback(null, tabVide);
        }
        ////////

        var idUser = results[0].u._id;

     //   console.log("idUser");
      //  console.log(idUser);
        var tabId = [];
        //tabId.push(tabSkills.forEach(User.searchSkillLevel(this.id, nomSkill, moyenne, callback)));

        var i = 0;
        var itemsProcessed =0;




        tabSkills.forEach (function (skill){
            User.searchSkillLevel(idUser, skill.nomSkill, skill.moyenne, function(err,result){
                        var controle = [];
                        //controle.push(result);
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
                                        //console.log(courant + ' est present --> ' + cnt + ' fois');
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
                                //console.log(courant + ' est present --> ' + cnt + ' fois');
                                objetSoluce = {id: courant, nb: cnt};
                                tableauRep.push(objetSoluce);
                            }
                            var newTabRep = [];
                            newTabRep = tableauRep.sort(keysrt('nb'));
                            var lastTabRep = [];
                            lastTabRep = newTabRep.slice(newTabRep.length - 8,newTabRep.length);
                            console.log("lastTab");
                            var tabFinal = [];
                            for(j=0; j<lastTabRep.length; j++){
                                tabFinal.push(lastTabRep[j].id);
                            }
                            return callback(null,tabFinal);
                        }
                    }
                )

            }
        )
    });
};

User.suggestSSMF = function (props, data, callback) {

    console.log("je suis la");
    tabId = [];
    var i = 0;
    while (i < data.length) {
        //console.log("");
        tabId.push(data[i].id);
        i++;
    }
    console.log("et ici");

    var loul = 0;
    console.log("tabId");
    while (loul<tabId.length){
        console.log(tabId[loul]);
        loul++;
    }
    if (props.mainForte != null && props.sexe != null) {
        var query = [
            "MATCH (u:User) " +
            "WHERE u.mainForte = {props}.mainForte AND u.sexe = {props}.sexe AND ("]
    }
    console.log("props.sexe");
    console.log(props.sexe);
    if (props.mainForte != null && props.sexe === undefined) {
        console.log("je passe par la");
        var query = [
            "MATCH (u:User) " +
            "WHERE u.mainForte = {props}.mainForte AND ("
        ].join('\n');
    }
    if (props.mainForte === undefined && props.sexe != null) {
        console.log("je passe par hahahahaha");
        var query = [
            "MATCH (u:User) " +
            "WHERE u.sexe = {props}.sexe AND ("
        ].join('\n');
    }

    if (props.mainForte === undefined && props.sexe === undefined) {
        var query = [
            "MATCH (u:User) WHERE ("
        ].join('\n');
    }
    var queryFinale = query;
    console.log("queryFinale");
    console.log(queryFinale);
    var j = 0;
    var jBis = 0;
    while (j < tabId.length) {
        if (j > 0) {
            var queryTransition = [
                "OR "
            ]
            queryFinale = queryFinale + queryTransition;
        }

        var queryMilieu = [
            "id(u) = " + tabId[j] + " "
        ]
        queryFinale = queryFinale + queryMilieu;
        j++;
        jBis++;
    }
    var queryReturn = [
        ") RETURN u"
    ].join('\n');
    queryFinale = queryFinale + queryReturn;
    console.log("props");
    console.log(props);
    var params = {
        props: props
    }

    console.log("LAFEMMEPIRATE");
    console.log(queryFinale);
    console.log("params");
    console.log(params);
    db.cypher({
        query: queryFinale,
        params: params
    }, function (err, results) {
        if (err) return callback(err);
        if (!results.length) {
            console.log("jentre ici");
            var err=[];
            var error=new errors.PropertyError('Pas de correspondance a la recherche voulue');
            err.push(error);
            return callback(err);
        }
        console.log("results");
        console.log(results[0].u.properties);
        var lastV = 0;
        var tabReponse = [];
        console.log("results.length");
        console.log(results.length);

        while (lastV<results.length){
            tabReponse.push(results[lastV].u);
            lastV++;
        }
        //var user = new User(results[0]['user']);
        return callback(null, tabReponse);
    })
};

User.prototype.suggestMatch = function (callback){
    var tabInter = [];
    var j=0;
    var idTest = this.id;

    var query = [
        "MATCH (u:User)-[j:JOUE*..8]-(u1:User) " +
        "WHERE id(u) = {id} AND id(u)<>id(u1) " +
        "RETURN u1"
    ].join('\n');

    var params = {
        id: idTest
    };

    db.cypher({
        query: query,
        params: params
    }, function (err, results) {
        if (err) return callback(err);
        if (!results.length) {
            console.log("results");
            console.log(results);
            return callback(null,[]);
        }
        var tabRes = [];
        var i = 0;
        while (i<results.length){
            tabRes.push(results[i].u1._id);
            i++;
        }

        return callback(null, tabRes);
    });
}
