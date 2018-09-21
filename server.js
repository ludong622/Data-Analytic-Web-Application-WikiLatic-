/**
 * The file to start a server
 *
 */

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');

var landingRoutes=require('./app/routes/landing.server.routes')
var functionsRoutes = require('./app/routes/functions.server.routes');

var app = express();

app.locals.bots=[];
app.locals.admins=[];

app.set('views', path.join(__dirname,'/app/views'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use(express.static(path.join(__dirname, '/public')));
app.use(session({secret: 'ssshhhh', cookie: {maxAge: 600000}}));
app.use('/login', landingRoutes)
app.use('/',functionsRoutes);
app.listen(3000, function () {
	  console.log('Revision app listening on port 3000!')
	});
	
module.exports = app;