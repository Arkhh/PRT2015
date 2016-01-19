// new.js
// New model logic.

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
        pattern: /^[A-Za-z0-9_'éèêùàô\s]+$/,
        message: 'Entre 5 et 50 caractères'
    },
    'description':{
        required: true,
        minLength: 5,
        maxLength: 10000,
        pattern: /^[A-Za-z0-9_'éèêùàô\s]+$/,
        message: 'Entre 5 et 10000 caractères'
    }

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
        return('Invalid ' + prop + ' (format). Requirements: ' + message);
    }

};
/*
function isConstraintViolation(err) {
    return err instanceof neo4j.ClientError &&
        err.neo4j.code === 'Neo.ClientError.Schema.ConstraintViolation';
};*/

function createJsonGetAll(res){
    var i = 0;
    var tabReponse = [];
    while (i<res.length){
        var tab= {
            id: res[i].new._id,
            description: res[i].new.properties.description,
            name: res[i].new.properties.name,
            date: res[i].new.properties.date
        }
        tabReponse.push(tab);
        i++;
    }
    return tabReponse;
};

// Public instance methods:
//Modifie la news en bdd
Neww.prototype.patch = function (props, callback) {

    var errorTab=[],validProps;

    if(!props.name){
        props=_.extend(props,{
            name: this.name});
    }
    if(!props.description){
        props=_.extend(props,{
            description: this.description});
    }

    validProps=validate(props,true);

    if(validProps.error){
        errorTab.push( new errors.PropertyError(validProps.error));
        return callback(errorTab);
    }

    var query = [
        'MATCH (new:New) WHERE id(new)= {id}',
        'SET new += {props}',
        'RETURN new',
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
       /* if (isConstraintViolation(err)) {
            //si l'email est déjà pris
            err = new errors.UnicityError('L\'email ‘' + props.email + '’ est déjà utilisé.');
        }*/
        if (err) return callback(err);

        if (!results.length) {
            err = new Error('La news avec l\'id: ' + this.id +'n\'existe pas dans la base');
            return callback(err);
        }
        // Met à jour le noeud avec les dernieres modifications
        self._node = results[0]['new'];

        callback(null);
    });
};

//supprime la news et toutes ses relations
Neww.prototype.del = function (callback) {
// supprime l'utilisateurs ainsi que toute ses relations
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

// Crée la news et l'ajoute dans la bdd
Neww.create = function (props, callback) {

    var errorTab=[],validProps;
    var query = [
        'CREATE (new:New {props})',
        'RETURN new',
    ].join('\n');

    validProps=validate(props,true);

    if(validProps.error){
        errorTab.push( new errors.PropertyError(validProps.error));
        return callback(errorTab);
    }
    var dateToday=new Date().getTime().toString()
    validProps=_.extend(props,{
        date: dateToday
    });
    var params = {
        props: validProps
    };

    console.log("requee")
    console.log(query);
    console.log("param")
    console.log(validProps);

    db.cypher({
        query: query,
        params: params
    }, function (err, results) {
      /*  if (isConstraintViolation(err)) {
            //si l'email est déjà pris
            err = new errors.UnicityError('L\'email ‘' + props.email + '’ est déjà utilisé.');
        }*/
        if (err) return callback(err);
        var neww = new Neww(results[0]['new']);
        callback(null, neww);
    });
};

//récupère la news grace à l'id
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
            var error=new errors.PropertyError('No such news with ID: ' + id);
            err.push(error);
            return callback(err);
        }
        var neww = new Neww(results[0]['new']);
        callback(null, neww);
    });
};

//récupère la liste des 5 news les plus récentes
Neww.getAll = function (callback) {
    var query = [
        'MATCH (new:New)',
        'RETURN new',
        'ORDER BY new.date desc',
        'LIMIT 5'
    ].join('\n');

    db.cypher({
        query: query
    }, function (err, results) {
        if (err) return callback(err);
        var news = createJsonGetAll(results);
        callback(null, news);
    });
};

Neww.getNext=function(id,callback){
    var idInt=parseInt(id);
    var query = [
        'MATCH (npre:New)',
        'WHERE id(npre)={id}',
        'MATCH (new:New)',
        'WHERE new.date<npre.date',
        'RETURN new',
        'ORDER BY new.date desc',
        'LIMIT 5'
    ].join('\n');
    var params = {
        id: idInt
    };
    db.cypher({
        query: query,
        params:params
    }, function (err, results) {
        if (err) return callback(err);
        var news = results.map(function (result) {
            return new Neww(result['new']);
        });
        callback(null, news);
    });
};

// Static initialization:

// Register our unique username constraint.
// TODO: This is done async'ly (fire and forget) here for simplicity,
// but this would be better as a formal schema migration script or similar.
/*
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
});*/