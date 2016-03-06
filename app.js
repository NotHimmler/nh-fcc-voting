var express = require('express');
var app = express();
var hbs = require('express-handlebars');
var mongoose = require('mongoose');
var Poll = require('./models/polls.js');
var credentials = require('./credentials.js');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var cors = require('cors');
var Votes = require('./models/votes.js');
var Users = require('./models/users.js');

var mongOpts = {
    server: {
        socketOptions: {
            keepAlive: 1
        }
    }
}

mongoose.connect(credentials.db.connection, mongOpts);

app.set('port', process.env['PORT'] || 8080);
app.use(express.static(__dirname + '/public'));
app.engine('hbs', hbs({extname: '.hbs', defaultLayout: 'main.hbs'}));
app.set('view engine', 'hbs');
app.set('views', 'views')
app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal'])

app.use(require('cookie-parser')());
app.use(require('body-parser')());
app.use(require('express-session')({ secret: 'cool cats climbing crags'}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new TwitterStrategy({
   consumerKey: "tVemD40OqPZS7V1crdZCuGsKU",
   consumerSecret: "FkOTBrZdm3aBr2UXIhmDhjFluFvgEjUgbLKlhQ3zPgOi68g6iC",
   callbackURL: "http://localhost:8080/auth/twitter/callback"
   },
   function(token, tokenSecret, profile, cb) {
       Users.findOrCreate({ twitterId: profile.id }, function(err, user){
           return cb(err, user);
       })
   })
)

app.get("/", function(req, res){
   res.render('index'); 
});

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback', 
    passport.authenticate('twitter', {failureRedirect: '/login'}),
    function(req, res){
        res.redirect(200, '/');
    }
)

app.get("/createpoll", function(req, res){
    res.render('createPoll');
})

app.post("/createpoll", function(req, res){
    var poll = req.body;
    var id;
    if(poll.title !== ""){
        if(poll.option.length !== 0){
            var questions = [];
            
            poll.option.forEach(function(option){
                if(option !== "") questions.push({question: option, count: 0});
            });
            
            id = new Date().getTime();
            var newPoll = new Poll({
                id: id,
                title: poll.pollTitle,
                questions: questions
            });
            
            newPoll.save();
        }
    }
    
    return res.redirect(302,'/poll/'+id);
})

app.get("/login", function(req, res){
    res.render('login');
});

app.get('/api/polls/all', cors(), function(req, res){
    Poll.find(function(err, results){
       if(err) return;
       res.send(JSON.stringify(results));
    });
})

app.get('/api/polls/:pollid', cors(), function(req,res){
    Poll.findOne({id: req.params.pollid}, function(err,data){
        res.send(data);
    })
})
app.get('/poll/:pollid', function(req, res){
    var ip = req.ip;
    var pollNumber = req.params.pollid;
    Poll.findOne({id: pollNumber}, function(err, data){
        if (err) res.render('500', {error: "Database Error."});
        if (data && data.length !== 0){
            Votes.findOne({pollId: pollNumber}, function(err, data){
                if(err) res.render('500', {error: "Database Error."});
                if(data && data.length !== 0){
                    if(data.ipAddresses.indexOf(ip) !== -1){
                        res.render('pollResult', {number: pollNumber});
                    } else {
                        res.render('poll', {number: pollNumber});    
                    }
                } else {
                    res.render('poll', {number: pollNumber});
                }
            })
        } else {
            res.render('404', {error: "Poll does not exist."});
        }
    })
    
})

app.post('/vote', function(req, res){
    var ip = req.ip;
    
    Poll.findOne({id: req.body.pollNumber}, function(err,record){
        if(err){
            res.status(500);
            res.end();
        }
        Votes.findOne({pollId: req.body.pollNumber}, function(err,vote){
           if(err) {
               res.status(500);
               res.end;
           }
           
           if(vote){
               if(vote.ipAddresses.indexOf(ip) === -1) {
                   var updatedVote = vote.ipAddresses.push(ip);
                   Votes.update({pollId: req.body.pollNumber}, updatedVote, function(err){
                       if(err) {
                           res.status(500);
                           res.end();
                       }
                       
                       var updatedPoll = record;
                       record.questions[Number(req.body.answer)].count++;
                       Poll.update({id: req.body.pollNumber}, updatedPoll, function(err){
                           if(err){
                               res.status(500);
                               res.end;
                           }
                           
                           res.status(200);
                           res.end();
                       })
                   })
               }
           } else {
               new Votes({
                   pollId: req.body.pollNumber,
                   ipAddresses: [ip]
               }).save(function(err){
                   if (err){
                       res.status(500);
                       res.end;
                   }
                   var updatedPoll = record;
                    record.questions[Number(req.body.answer)].count++;
                    Poll.update({id: req.body.pollNumber}, updatedPoll, function(err){
                        if(err){
                            res.status(500);
                            res.end;
                        }
                        
                        res.status(200);
                        res.end();
                    })
               });
               res.status(200);
               res.end();
           }
        });
    });
});

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