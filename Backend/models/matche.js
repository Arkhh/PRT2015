// matche.js
// Matche model logic.

var neo4j = require('neo4j');
var errors = require('./errors');
var _ =require('underscore');
var User = require('./user');

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

function createJson(res ){
    var resultat= {
        id:res.match._id
        ,date:res.match.properties.date
        ,idJ1:res.r._fromId
        ,gainJ1:res.r.properties.gain
        ,perteJ1:res.r.properties.perte
        ,resultat1:res.r.properties.resultat
        ,aNoter1:res.r.properties.aNoter
        ,idJ2:res.r2._fromId
        ,gainJ2:res.r2.properties.gain
        ,perteJ2:res.r2.properties.perte
        ,resultat2:res.r2.properties.resultat
        ,aNoter2:res.r2.properties.aNoter
        ,resultat:res.match.properties.resultat
    }
    return resultat
};

function getJson(res,res2){
    var resultat= {
        id:res.match._id
        ,date:res.match.properties.date
        ,idJ1:res.r._fromId
        ,gainJ1:res.r.properties.gain
        ,perteJ1:res.r.properties.perte
        ,resultat1:res.r.properties.resultat
        ,aNoter1:res.r.properties.aNote
        ,idJ2:res2.r._fromId
        ,gainJ2:res2.r.properties.gain
        ,perteJ2:res2.r.properties.perte
        ,resultat2:res2.r.properties.resultat
        ,aNoter2:res2.r.properties.aNoter
        ,resultat:res.match.properties.resultat
    }
    return resultat
};

function getUserJson(res){
    var resultat= {
        id:res.match._id
        ,date:res.match.properties.date
        ,idJ1:res.r._fromId
        ,gainJ1:res.r.properties.gain
        ,perteJ1:res.r.properties.perte
        ,resultat1:res.r.properties.resultat
        ,aNoter1:res.r.properties.aNoter
        ,idJ2:res.r2._fromId
        ,gainJ2:res.r2.properties.gain
        ,perteJ2:res.r2.properties.perte
        ,resultat2:res.r2.properties.resultat
        ,aNoter2:res.r2.properties.aNoter
        ,resultat:res.match.properties.resultat
    }
    return resultat
}

Matche.VALIDATION_INFO = {
    'date': {
        required: true,
        minLength: 1,
        maxLength: 20,
        pattern: /^[0-9]+$/,
        message: 'time stamp'
    },
    'idJ1': {
        required: true,
        minLength: 1,
        maxLength: 12,
        pattern: /^[0-9]+$/,
        message: 'number'
    },
    'idJ2': {
        required: true,
        minLength: 1,
        maxLength: 12,
        pattern: /^[0-9]+$/,
        message: 'number'
    },
    /*
     'resultat1': {
     required: false,
     minLength: 1,
     maxLength: 12,
     pattern: /^[0-9_]+$/,
     message: 'boolean'
     },
     'resultat2': {
     required: false,
     minLength: 1,
     maxLength: 12,
     pattern: /^[0-9_]+$/,
     message: 'boolean'
     },
     'resultat': {
     required: false,
     minLength: 1,
     maxLength: 12,
     pattern: /^[0-9_]+$/,
     message: 'number'
     },*/
    'gainJ1': {
        required: true,
        minLength: 1,
        maxLength: 12,
        pattern: /^[0-9]+$/,
        message: 'number'
    },
    'gainJ2': {
        required: true,
        minLength: 1,
        maxLength: 12,
        pattern: /^[0-9]+$/,
        message: 'number'
    },
    'perteJ1': {
        required: true,
        minLength: 1,
        maxLength: 12,
        pattern: /^[0-9]+$/,
        message: 'number'
    },
    'perteJ2': {
        required: true,
        minLength: 1,
        maxLength: 12,
        pattern: /^[0-9]+$/,
        message: 'number'
    },

};


Object.defineProperty(Matche.prototype, 'id', {
    get: function () {
        return this._node._id;
    }
});
Object.defineProperty(Matche.prototype, 'date', {
    get: function () { return this._node.properties['date']; }
});
Object.defineProperty(Matche.prototype, 'gainJ1', {
    get: function () { return this._node.properties['gainJ1']; }
});
Object.defineProperty(Matche.prototype, 'perteJ1', {
    get: function () { return this._node.properties['gainJ1']; }
});
Object.defineProperty(Matche.prototype, 'gainJ2', {
    get: function () { return this._node.properties['gainJ2']; }
});
Object.defineProperty(Matche.prototype, 'perteJ2', {
    get: function () { return this._node.properties['gainJ2']; }
});
Object.defineProperty(Matche.prototype, 'idJ1', {
    get: function () { return this._node.properties['idJ1']; }
});
Object.defineProperty(Matche.prototype, 'idJ2', {
    get: function () { return this._node.properties['idJ2']; }
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
        'MATCH (j1:User),(j2:User)',
        'WHERE id(j1) = {idJ1} AND id(j2) = {idJ2}',
        'CREATE (match:Match {props})',
        'CREATE (j1)-[r:JOUE{info1}]->(match)',
        'CREATE (j2)-[r2:JOUE{ info2}]->(match)',
        'RETURN r,r2,match'
    ].join('\n');

    validProps=validate(props,true);

    if(validProps.error){
        errorTab.push( new errors.PropertyError(validProps.error));
        return callback(errorTab);
    }

    var params = {
        idJ1:parseInt(validProps.idJ1),
        idJ2:parseInt(validProps.idJ2),
        props:{date:validProps.date,resultat:'',},
        info1:{gain:validProps.gainJ1,perte:validProps.perteJ1,resultat:'',aNoter:''},
        info2:{gain:validProps.gainJ2,perte:validProps.perteJ2,resultat:'',aNoter:''}
    };

    db.cypher({
        query: query,
        params: params
    }, function (err, results) {

        if (err) return callback(err);
        var matche=createJson(results[0]);
        callback(null, matche);
    });
};

Matche.getCrud = function (id, callback) {

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
        var match = new Matche(results[0]['match']);
        callback(null, match);
    });
};

Matche.get = function (id, callback) {

    var idInt=parseInt(id);


    var query = [
        'MATCH (match:Match)',
        'MATCH (match)-[r:JOUE]-()',
        'WHERE id(match) = {id} ',
        'RETURN match,r'
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
        console.log(results);
        var matche = getJson(results[0],results[1]);
        callback(null, matche);
    });
};

Matche.getAll = function (callback) {
    var query = [
        'MATCH (match:Match)',
        'MATCH (match)-[r:JOUE]-(u1:User)',
        'MATCH (match)-[r2:JOUE]-(u2:User)',
        'WHERE  id(r)<>id(r2)',
        'AND id(u1)<>id(u2)',
        'RETURN DISTINCT match,r,r2',
        'ORDER BY match.date desc',
        'LIMIT 10'
    ].join('\n');

    db.cypher({
        query: query
    }, function (err, results) {
        if (err) return callback(err);
        var i=0;
        var matches = [];
        while (i < results.length) {
            matches.push(getJson(results[i]));
            i++;
        }

        callback(null, matches);
    });
};


Matche.getByUser = function (id, callback) {

    var idInt=parseInt(id);

    var query = [
        'MATCH (user:User)-[r:JOUE]',
        '-(match:Match)',
        '-[r2:JOUE]-(u:User)',
        'WHERE id(user)={id} AND id(u)<>{id}',
        'RETURN match,r,r2',
        'ORDER BY match.date desc',
        'LIMIT 10'
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
            var error=new errors.PropertyError('No such player with ID: ' + id);
            err.push(error);
            return callback(err);
        }
        var i=0;
        var matches = [];
        console.log(results);
        while (i < results.length) {
            matches.push(getUserJson(results[i]));
            i++;

        }

        callback(null, matches);
    });
};

Matche.getByUserNext = function (props, callback) {

    var idInt=parseInt(props.id);
    var idIntm=parseInt(props.idm);

    var query = [

        'MATCH (mpre:Match)',
        'MATCH (user:User)-[r:JOUE]',
        '-(match:Match)',
        '-[r2:JOUE]-(u:User)',
        'WHERE id(user)={id} AND id(u)<>{id}',
        'AND id(mpre)={idm}',
        'AND match.date<mpre.date',
        'RETURN match,r,r2',
        'ORDER BY match.date desc',
        'LIMIT 10'
    ].join('\n');


    var params = {
        id: idInt,
        idm:idIntm
    };

    db.cypher({
        query: query,
        params: params
    }, function (err, results) {
        if (err) return callback(err);
        if (!results.length) {
            var err=[];
            var error=new errors.PropertyError('No such player with ID: ' + id);
            err.push(error);
            return callback(err);
        }
        var i=0;
        var matches = [];
        while (i < results.length) {
            matches.push(getUserJson(results[i]));
            i++;
            //  console.log(matches);
        }
        console.log(matches);
        callback(null, matches);
    });
};

Matche.setResult = function (props, callback) {

    var idInt=parseInt(props.id);
    var idIntm=parseInt(props.idm);
    var resultat=parseInt(props.resultat);

    var query = [
        'MATCH (user:User)-[r:JOUE]-(match:Match)-[r2:JOUE]-(u2:User)',
        'WHERE id(user)={id}',
        'AND id(match)={idm}',
        'SET r+={resultat:{resultat}}',
        'RETURN match,r,r2'
    ].join('\n');


    var params = {
        id: idInt,
        idm:idIntm,
        resultat:resultat
    };

    db.cypher({
        query: query,
        params: params
    }, function (err, results) {
        if (err) return callback(err);
        if (!results.length) {
            var err=[];
            var error=new errors.PropertyError('Error set resultat uer');
            err.push(error);
            return callback(err);
        }

        var matche = getUserJson(results[0]);

        if (matche.resultat1===matche.resultat2){
            var query = [
                'MATCH (user:User)-[r:JOUE]-(match:Match)-[r2:JOUE]-(u2:User)',
                'WHERE id(user)={id}',
                'AND id(match)={idm}',
                'SET match+={resultat:{resultat}}',
                'RETURN match,r,r2'
            ].join('\n');

            var params = {
                id: idInt,
                idm:idIntm,
                resultat:resultat
            };
            db.cypher({
                query: query,
                params: params
            }, function (err2, results) {
                if (err2) return callback(err2);
                if (!results.length) {
                    var err2 = [];
                    var error2 = new errors.PropertyError('Error set resultat match');
                    err2.push(error2);
                    return callback(err2);
                }

                var matche2 = getUserJson(results[0]);
                if (matche2.resultat1===matche2.resultat) {

                    User.setPoint(matche2.idJ1,parseInt(matche2.gainJ1)) ;
                    User.setPoint(matche2.idJ2,parseInt(matche2.perteJ2*-1));
                }
                else{
                    User.setPoint(matche2.idJ1,parseInt(matche2.perteJ1*-1)) ;
                    User.setPoint(matche2.idJ2,parseInt(matche2.gainJ2));
                }

                callback(null, matche2);
            });
        }
        else callback(null, matche);
    });
};

