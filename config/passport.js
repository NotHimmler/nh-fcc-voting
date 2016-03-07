var process = require('process');
var Users = require('../models/users.js');
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');


module.exports = function(app, passport){
    
    var baseUrl;

    switch(app.get('env')){
        case 'development':
            baseUrl = "http://localhost:8080";
            break;
        case 'production':
            baseUrl = "https://nh-fcc-voting.herokuapp.com";
            break;
        default:
            throw new Error('Unknown execution environment: ' + app.get('env'));
    }

    passport.serializeUser(function(user, done) {
            done(null, user.id);
        });

        // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        Users.findById(id, function(err, user) {
            done(err, user);
        });
    });
    
    passport.use(new GoogleStrategy({
        clientID: "756157555174-svo5ke9qoad340g52i10c640bdc9mnrq.apps.googleusercontent.com",
        clientSecret: "JumL32c1Ov3lueijRNUMTyYX",
        callbackURL: baseUrl+"/auth/google/callback"
        },
        function(token, refreshToken, profile, done) {
            process.nextTick(function(){
                Users.findOne({'google.id':profile.id}, function(err, user){
                    if(err) return done(err);
                    
                    if(user){
                        return done(null, user);
                    } else {
                        var newUser = new Users();
                        newUser.google.id = profile.id;
                        newUser.google.token = token;
                        newUser.google.name = profile.displayName;
                        newUser.google.email = profile.emails[0];
                    }
                })
            })
        }
    ));
    
    passport.use(new FacebookStrategy({
        clientID: "868755973237380",
        clientSecret: "19bac2f733cfa3cf376629d20d019cae",
        callbackURL: baseUrl+"/auth/facebook/callback"
        },
        function(token, refreshToken, profile, done) {
            process.nextTick(function(){
                Users.findOne({ 'facebook.id':profile.id}, function(err, user){
                    if(err) return done(err);
                    
                    if (user) {
                        return done(null, user);
                    } else {
                        console.log(profile);
                        var newUser = new Users();
                        newUser.facebook.id = profile.id;
                        newUser.facebook.token = token;
                        newUser.facebook.name = profile.displayName;
                        
                        newUser.save(function(err){
                            if (err) throw err;
                            
                            return done(null, newUser);
                        })
                    }
                    
                })
            })
        }
    ))

    passport.use(new TwitterStrategy({
        consumerKey: "tVemD40OqPZS7V1crdZCuGsKU",
        consumerSecret: "FkOTBrZdm3aBr2UXIhmDhjFluFvgEjUgbLKlhQ3zPgOi68g6iC",
        callbackURL: baseUrl+"/auth/twitter/callback"
        },
        function(token, tokenSecret, profile, cb) {
            process.nextTick(function(){
                Users.findOne({'twitter.id': profile.id}, function(err, user){
                    if(err) return cb(err);
                    
                    if(user) {
                        console.log(user);
                        return cb(null, user);
                    } else {
                        var newUser = new Users();
                        newUser.twitter.id = profile.id;
                        newUser.twitter.token = token;
                        newUser.twitter.username = profile.username;
                        newUser.twitter.displayName = profile.displayName;
                        
                        newUser.save(function(err){
                            if (err) throw err;
                            return cb(null, newUser);
                        })
                    }
                })
            })
        })
    );
    
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
        },
        function(req, email, password, done){
            process.nextTick(function(){
                Users.findOne({'local.email': email}, function(err, user){
                    if(err) return done(err);
                    
                    if(user) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {
                        var newUser = new Users();
                        newUser.local.email = email;
                        newUser.local.password = newUser.generateHash(password);
                        
                        newUser.save(function(err){
                            if (err) throw err;
                            return done(null, newUser);
                        });
                    }
                })
            })
        }
    ));
    
    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
        },
        function(req, email, password, done){
            Users.findOne({'local.email': email}, function(err, user){
                if(err) return done(err);
                
                if(!user) return done(null, false, req.flash('loginMessage', 'No user found.'));
                
                if(!user.validPassword(password)) return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                
                return done(null, user);
            })
        }
    ));
    
    
}