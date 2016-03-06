var mongoose = require('mongoose');

var UsersSchema = mongoose.Schema({
    username: String,
    password: String,
    twitterId: String,
    facebookId: String,
    googleId: String,
    polls: [String]
});

var Users = mongoose.model("Users", UsersSchema);

module.exports = Users;