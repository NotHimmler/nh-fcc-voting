var express = require('express');
var app = express();
var hbs = require('express-handlebars');
var mongoose = require('mongoose');
var credentials = require('./credentials.js');
var passport = require('passport');
var process = require('process');
var flash = require('connect-flash');

var mongOpts = {
    server: {
        socketOptions: {
            keepAlive: 1
        }
    }
}

mongoose.connect(credentials.db.connection, mongOpts);

app.set('port', process.env['PORT'] || 8080);
app.engine('hbs', hbs({extname: '.hbs', defaultLayout: 'main.hbs'}));
app.set('view engine', 'hbs');
app.set('views', 'views')
app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal'])

app.use(flash());
require('./config/passport.js')(app, passport);

app.use(require('cookie-parser')());
app.use(require('body-parser')());
app.use(require('express-session')({ secret: 'cool cats climbing crags', resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

require('./config/routes.js')(app,passport);

app.use(express.static(__dirname + '/public'));

app.use(function(req,res,next){
    res.status(404);
    res.render('404');
});

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function(){
    console.log("Server listening at http://localhost:"+app.get('port')+" - Press Ctrl+C to terminate.");
});