
/*
** Module dependencies.
*/

//const clientSessions = require("client-sessions");
const crypto = require('crypto');
var express = require('express');
var https = require('https');
var http = require('http');
var path = require('path');
var cors = require('cors');
//var passport = require('passport');
var fs = require('fs');
//var oauth2orize = require('oauth2orize');
//var privateKey = fs.readFileSync('privatekey.pem').toString();
//var certificate = fs.readFileSync('certificate.pem').toString();
//var credentials = crypto.createCredentials({key: privateKey, cert: certificate});
// var oauth2lib = require('oauth20-provider');
// var oauthserver = require('node-oauth2-server');

/*
** Routes methods.
*/

var routes = require('./routes');

/*
var publicGet = require('./routes/publicGet');
var top = require('./routes/top');
var get = require('./routes/get');
var search = require('./routes/search');
var event = require('./routes/event');
var user = require('./routes/user');
var live = require('./routes/live');
var stars = require('./routes/stars');
*/

/*
** Arguments processing.
*/

INIT_INDEXES = process.argv[2] ? process.argv[2] == 'true' : false;

var options = {
  //key: fs.readFileSync('./ssl/private.pem'), // privatekey.pem
  //cert: fs.readFileSync('./ssl/Certificats.pem') // certificate.pem
};

/*
** Init & configuration httpApp (public).
*/

var httpApp = express();
httpApp.set('port',  3000);
httpApp.use(express.json());
httpApp.use(express.urlencoded());
httpApp.use(express.cookieParser());
httpApp.use(cors());
httpApp.use(express.methodOverride());
httpApp.use(express.bodyParser());
httpApp.use(express.static(path.join(__dirname, 'public')));
httpApp.use(express.static(path.join(__dirname, 'bower_components')));

/*
var get_collection = require('./routes/get_collection');
var search = require('./routes/search');
var event = require('./routes/event');
var milestone = require('./routes/milestone');
var top = require('./routes/old/top');
*/

var get = require('./routes/get');

httpApp.get('/public/:collection?', get.get);
httpApp.get('/public/:collection/search?', get.search);
httpApp.get('/public/:collection/:eventId?', get.getByEventId);
httpApp.get('/public/:collection/:eventId/:milestoneId?', get.getByMilestoneId);

/*
httpApp.get('/top/:collection?', top.get);
httpApp.get('/public/:collection?', get_collection.get);
httpApp.get('/public/:collection/search?', search.get);
httpApp.get('/public/:collection/:eventId?', event.get);
httpApp.get('/public/:collection/:eventId/:milestoneId?', milestone.get);
*/

/*
httpApp.get('/public/:collection/search?', get.search);
httpApp.get('/public/:collection/:eventId?', get.getByEvent);
httpApp.get('/public/:collection/:eventId/:milestoneId?', get.getByMilestone);
httpApp.get('/public/milestone/:milestoneId/*', milestone.get);
httpApp.get('/images', routes.images);
httpApp.get('/top/:collection/*', top.get);
httpApp.get('/public/:collection/*', routes.public);
httpApp.get('/public/people/*', routes.people);
httpApp.get('/public/event/*', routes.event);
httpApp.all("*", function (req, res, next) {
    console.log("port 80");
    console.log(req.headers.host, req.path);
    res.redirect("https://" + req.headers.host + req.path);
});
*/


/*
** Init & configuration app (secured : require token).
*/

var app = express();
var query   = require('querystring');
var model = require(__dirname+'/model/model.js');

var site = require(__dirname+'/lib/site')
 , oauth2 = require(__dirname+'/lib/oauth2')
 , user = require(__dirname+'/lib/user')
 , client = require(__dirname+'/lib/client')
 , util = require('util');

app.configure(function() {
    app.set('port', process.env.PORT || 443);
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
    app.use(cors());
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.cookieParser());
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(express.session({
      secret: "Superdupersecret"
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.static(path.join(__dirname, 'bower_components')));
    if ('development' == app.get('env')) {
      app.use(express.errorHandler());
    }
    
});

require(__dirname + '/lib/auth');

app.get('/', site.index);

app.get('/crud/:collection/*', routes.crud);
app.put('/crud/:collection/*', routes.crud);
app.post('/crud/:collection/*', routes.crud);
app.delete('/crud/:collection/*', routes.crud);

app.get('/images', routes.images);
app.post('/images', routes.images);


/*
app.get('/views/directives/*', function(req, res){
    var requestedView = path.join(__dirname, req.url);
    console.log(requestedView);
    res.render(requestedView);
});

app.get('/login', routes.login);
app.get('/', routes.index);
app.get('/users', user.list);
app.get('/starsmedia', stars.getMedias);

app.post('/setup/event', routes.eventApi);
app.post('/setup/milestone',routes.milestone);
app.post('/setup/people',routes.people);

app.get('/*', routes.index);
*/

function isAuthorized(req, res, next) {
    console.log("isAuthorized", req.session);
    if (req.session.authorized) return next();
    console.log('unauthorized');
    res.redirect(401,'/login?' + query.stringify({backUrl: req.url}));
}

http.createServer(httpApp).listen(httpApp.get('port'), function() {
    console.log('Express HTTP server listening on port ' + httpApp.get('port'));
});

https.createServer(options,app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});