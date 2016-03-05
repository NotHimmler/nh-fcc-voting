var express = require('express');
var app = express();
var hbs = require('express-handlebars');
var mongoose = require('mongoose');
var Poll = require('./models/polls.js');
var credentials = require('./credentials.js');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var cors = require('cors');

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
               questions.push({question: option, count: 0});
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
    res.send(req.ip);
    //res.render('poll', {number: req.params.pollid});
})

app.post('/vote', function(req, res){
    Poll.findOne({id: req.body.pollNumber}, function(err,record){
        var updated = record;
        updated.questions[Number(req.body.answer)].count++;
        Poll.update(updated, function(err){
            if(err) res.redirect(400, '400');
            
        });
    });
    res.end();
})

app.listen(app.get('port'), function(){
    console.log("Server listening at http://localhost:"+app.get('port')+" - Press Ctrl+C to terminate.");
});