
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

app.get('/api', routes.site.index);

app.get('/api/users', routes.users.list);
app.post('/api/users', routes.users.create);
app.get('/api/users/:id', routes.users.show);
app.post('/api/users/:id', routes.users.edit);
app.delete('/api/users/:id', routes.users.del);


app.get('/api/pieces',routes.pieces.list);
app.get('/api/pieces/:id',routes.pieces.show);
app.post('/api/pieces',routes.pieces.create);
app.post('/api/pieces/:id',routes.pieces.edit);
app.del('/api/pieces/:id',routes.pieces.del);

app.get('/api/events',routes.events.list);
app.get('/api/events/:id',routes.events.show);
app.post('/api/events',routes.events.create);
app.post('/api/events/:id',routes.events.edit);
app.del('/api/events/:id', routes.events.del);

app.get('/api/news',routes.news.list);
app.get('/api/news/:id',routes.news.show);
app.post('/api/news',routes.news.create);




http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening at: http://localhost:%d/', app.get('port'));
});
