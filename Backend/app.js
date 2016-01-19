
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , cors = require('cors');


var app = express();

app.use(cors());


// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
// Add headers
app.use(cors());


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.locals({
    title: 'Node-Neo4j Template'    // default title
});

// Routes
var routeApi ='/api';


app.get(routeApi+'/users', routes.users.list);
app.post(routeApi+'/users', routes.users.create);
app.get(routeApi+'/users/:id', routes.users.show);
app.post(routeApi+'/users/:id', routes.users.edit);
app.delete(routeApi+'/users/:id', routes.users.del);
app.post(routeApi+'/auth/', routes.users.connect);
app.get(routeApi+'/adv/users/:id',routes.users.adv);
app.get(routeApi+'/totalenote/users/:id',routes.users.getNbNote);

app.post(routeApi+'/searchSkillLevel/:id', routes.users.searchSkillLvl);
app.post(routeApi+'/notation/:id', routes.users.notation);
app.get(routeApi+'/pub/users', routes.users.pubList);
app.get(routeApi+'/pub/users/:id', routes.users.pubListId);
app.get(routeApi+'/suggest/:id', routes.users.suggest);
app.get(routeApi+'/search/:str', routes.users.search);
app.post(routeApi+'/suggestAdvanced/:id', routes.users.suggestAdvanced);
app.post(routeApi+'/suggestSSMF/', routes.users.suggestSSMF);
app.get(routeApi+'/suggestMatch/:id', routes.users.suggestMatch);

app.get(routeApi+'/events',routes.events.list);
app.get(routeApi+'/events/:id',routes.events.show);
app.post(routeApi+'/events',routes.events.create);
app.post(routeApi+'/events/:id',routes.events.edit);
app.delete(routeApi+'/events/:id', routes.events.del);

app.get(routeApi+'/news',routes.news.list);
app.get(routeApi+'/news/:id',routes.news.show);
app.post(routeApi+'/news',routes.news.create);
app.post(routeApi+'/news/:id',routes.news.edit);
app.delete(routeApi+'/news/:id',routes.news.del);
app.get(routeApi+'/nextnews/:id',routes.news.next);

app.get(routeApi+'/matches',routes.matches.list);
app.get(routeApi+'/matches/:id',routes.matches.show);
app.post(routeApi+'/matches',routes.matches.create);
app.post(routeApi+'/matches/:id',routes.matches.edit);
app.delete(routeApi+'/matches/:id', routes.matches.del);
app.get(routeApi+'/histo/users/:id',routes.matches.getByUserValide);
app.post(routeApi+'/usersnext/histo',routes.matches.getByUserValideNext);
app.get(routeApi+'/unvalid/matches/users/:id',routes.matches.getByUserNonValide);
app.post(routeApi+'/unvalid/usersnext/matches',routes.matches.getByUserNonValideNext);
app.get(routeApi+'/all/unvalid/matches/users/:id',routes.matches.getByUserNonValideTot);
app.post(routeApi+'/betweenUser/matches',routes.matches.getBetween);
app.post(routeApi+'/result/matches',routes.matches.setResult);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening at: http://localhost:%d/', app.get('port'));
});
