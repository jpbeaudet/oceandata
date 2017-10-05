// Author: Jean-Philippe Beaudet @ S3R3NITY Technology 
//
// Oceandata
// Version : 0.0.1
// copyrigths : OcenaData
// License: 
//
// =====================================================

var express = require('express');
var http = require('http');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//main config
var app = express();
config = require('./config.js');

var server = require('http').createServer(app);
app.set('port', process.env.PORT || config.node_web_server_port);
app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'jade');
app.set('view options', { layout: true });

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('express-session')({
    secret: '<your_secret>',
    resave: false,
    saveUninitialized: true,
  cookie: { secure: true }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
// to separate jquery files
app.use(express.static(path.join(__dirname, 'app')));

// routes
require('./routes/routes')(app);
console.log(("Express server listening on port " + app.get('port')));

//passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// mongoose
mongoose.connect('mongodb://'+config.node_web_server_host+ '/'+config.mongodb_database);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("AppTemplate db started on : "+ config.mongodb_database+ ": "+config.node_web_server_host);
});

//chatboot()
server.listen(config.node_web_server_port);

