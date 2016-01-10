
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

app.get('/', routes.site.index);

app.get('/users', routes.users.list);
app.post('/users', routes.users.create);
app.get('/users/:id', routes.users.show);
app.post('/users/:id', routes.users.edit);
app.delete('/users/:id', routes.users.del);


app.get('/pieces',routes.pieces.list);
app.get('/pieces/:id',routes.pieces.show);
app.post('/pieces',routes.pieces.create);
app.post('/pieces/:id',routes.pieces.edit);
app.del('/pieces/:id',routes.pieces.del);

app.get('/events',routes.events.list);
app.get('/events/:id',routes.events.show);
app.post('/events',routes.events.create);
app.post('/events/:id',routes.events.edit);
app.del('/events/:id', routes.events.del);




http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening at: http://localhost:%d/', app.get('port'));
});
