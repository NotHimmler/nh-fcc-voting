var express = require('express');
var app = express();
var hbs = require('express-handlebars');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

app.set('port', process.env['PORT'] || 8080);
app.use(express.static(__dirname + '/public'));
app.engine('hbs', hbs({extname: '.hbs', defaultLayout: 'main.hbs'}));
app.set('view engine', 'hbs');
app.set('views', 'views')

app.use(require('cookie-parser')());
app.use(require('body-parser')());
app.use(require('express-session')({ secret: 'cool cats climbing crags'}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new FacebookStrategy({
    clientID: 868755973237380,
    clientSecret: 'facing falls feels funny',
    callbackURL: "http://nh-fcc-voting.herokuapp.com/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done){
      console.log(profile);
      done(null, user);
  }
))

app.get("/", function(req, res){
   res.render('index'); 
});

app.get("/login", function(req, res){
    res.render('login');
});

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get("/auth/facebook/callback", function(req, res){
    passport.authenticate('facebook', {successRedirect: '/', failureRedirect: '/login'});
});

app.listen(app.get('port'), function(){
    console.log("Server listening at http://localhost:"+app.get('port')+" - Press Ctrl+C to terminate.");
});