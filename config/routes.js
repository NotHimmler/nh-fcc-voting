var cors = require('cors');
var Votes = require('../models/votes.js');
var Users = require('../models/users.js');
var Poll = require('../models/polls.js');


module.exports = function(app, passport) {
app.get("/", function(req, res){
   if(req.user) {
    console.log(req.user);
    console.log(req.session);
   }
   res.render('index', {user: req.user}); 
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
    });
});

app.get('/auth/facebook', passport.authenticate('facebook', {scope:'email'}));

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: "/",
        failureRedirect: "/"
    })
);

app.get('/auth/google', passport.authenticate('google', {scope : ['profile', 'email']}));

app.get('/auth/google/callback',
    passport.authenticate('google', { scope: ['email','profile'],
        successRedirect: "/",
        failureRedirect: "/"
}));

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback', 
    passport.authenticate('twitter', {successRedirect: '/', failureRedirect: '/login'})
);

app.get("/createpoll", function(req, res){
    res.render('createPoll', {user: req.user});
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
            
            var author = "";
            
            if(req.user){
                author = req.user._id;
            }
            
            id = new Date().getTime();
            var newPoll = new Poll({
                id: id,
                title: poll.pollTitle,
                questions: questions,
                author: author,
            });
            
            newPoll.save(function(err){
            });
        }
    }
    
    return res.redirect(302,'/poll/'+id);
})

app.get("/login", function(req, res){
    res.render('login');
});

app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/mypolls',
    failureRedirect : '/login',
    failureFlash : true
}));

app.get('/logout', function(req,res){
    req.logout();
    res.redirect('/');
});

app.get('/mypolls', function(req, res){
    if(req.isAuthenticated()){
        Poll.find({author: req.user._id}, function(err, results){
            res.render('mypolls', {polls: results, user: req.user});
        })
    } else {
        res.redirect('/login');
    }
});

app.get('/poll/:pollid', function(req, res){
    var ip = req.ip;
    var pollNumber = req.params.pollid;
    Poll.findOne({id: pollNumber}, function(err, data){
        if (err) res.render('500', {error: "Database Error."});
        if (data && data.length !== 0){
            Votes.findOne({pollId: pollNumber}, function(err, data){
                if(err) res.render('500', {error: "Database Error."});
                if(data && data.length !== 0 && data.ipAddresses.indexOf(ip) !== -1){
                    res.render('pollResult', {number: pollNumber, user: req.user});
                } else {
                    res.render('poll', {number: pollNumber, user: req.user});
                }
            })
        } else {
            res.render('404', {error: "Poll does not exist.", user: req.user});
        }
    });
    
});

app.get('/signup', function(req, res){
    if(req.user){
        res.redirect('/');
    } else {
        res.render('signup');
    }
})

app.post('/signup', passport.authenticate('local-signup', {
    successfulRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true,
}));

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
}