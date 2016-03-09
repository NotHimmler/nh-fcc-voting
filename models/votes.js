var mongoose = require('mongoose');

var voteSchema = mongoose.Schema({
    pollId: String,
    ipAddresses: [String],
    userId: [String]
});

var Votes = mongoose.model("Votes", voteSchema);

module.exports = Votes;