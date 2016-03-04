var express = require('express');
var app = express();

app.set('port', process.env['PORT'] || 8080);
app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res){
   res.sendFile('./public/index.html'); 
});

app.listen(app.get('port'), function(){
    console.log("Server listening at http://localhost:"+app.get('port')+" - Press Ctrl+C to terminate.");
});