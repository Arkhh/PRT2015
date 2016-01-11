
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

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

app.get(routeApi+'/pieces',routes.pieces.list);
app.get(routeApi+'/pieces/:id',routes.pieces.show);
app.post(routeApi+'/pieces',routes.pieces.create);
app.post(routeApi+'/pieces/:id',routes.pieces.edit);
app.del(routeApi+'/pieces/:id',routes.pieces.del);


app.get(routeApi+'/events',routes.events.list);
app.get(routeApi+'/events/:id',routes.events.show);
app.post(routeApi+'/events',routes.events.create);
app.post(routeApi+'/events/:id',routes.events.edit);
app.del(routeApi+'/events/:id', routes.events.del);



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening at: http://localhost:%d/', app.get('port'));
});
