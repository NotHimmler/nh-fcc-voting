var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var UsersSchema = mongoose.Schema({
    local : {email: String, password: String},
    twitter: {id: String, token: String, username: String, displayName: String},
    facebook: {id: String, token: String, email: String, name: String},
    google: {id: String, token: String, email: String, name: String},
    polls: [String]
});

UsersSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UsersSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

var Users = mongoose.model("Users", UsersSchema);

module.exports = Users;