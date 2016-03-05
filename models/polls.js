var mongoose = require('mongoose');

var pollSchema = mongoose.Schema({
    id: String,
    title: String,
    questions: [{question: String, count: Number}],
});

var Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;