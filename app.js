var express = require('express');
var app = express();
var hbs = require('express-handlebars');
var mongoose = require('mongoose');
var Poll = require('./models/polls.js');
var credentials = require('./credentials.js');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var cors = require('cors');
var Votes = require('./models/votes.js');

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

app.get("/", function(req, res){
   res.render('index'); 
});

app.get("/createpoll", function(req, res){
    res.render('createPoll');
})

app.post("/createpoll", function(req, res){
    var poll = req.body;
    
    if(poll.title !== ""){
        if(poll.option.length !== 0){
            var questions = [];
            
            poll.option.forEach(function(option){
                if(option !== "") questions.push({question: option, count: 0});
            });
            
            var id = new Date().getTime();
            var newPoll = new Poll({
                id: id,
                title: poll.pollTitle,
                questions: questions
            });
            
            newPoll.save();
        }
    }
    
    return res.redirect(303,'/');
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
    Votes.findOne({pollId: pollNumber}, function(err, data){
        if(err) res.redirect(302, '/');
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
})

app.post('/vote', function(req, res){
    var ip = req.ip;
    
    Poll.findOne({id: req.body.pollNumber}, function(err,record){
        var updated = record;
        updated.questions[Number(req.body.answer)].count++;
        Poll.update(updated, function(err){
            if(err) return res.redirect(400, '400');
            Votes.find({pollId: req.body.pollNumber}, function(err, data){
                if(err) return res.redirect(302, "/");
                if(data && data.length !== 0){
                    var updatedVote = data.ipAddresses.push(ip);
                    Votes.update(updatedVote);
                } else {
                    var newVote = new Votes({
                        pollId: req.body.pollNumber,
                        ipAddresses: [ip]
                    });
                    newVote.save();
                }
                res.redirect(302, '/poll/'+req.body.pollNumber);
            });
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