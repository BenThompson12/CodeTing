var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    email: String,
    username: String,
    encryptedPassword: String,
});

UserSchema.path('email').validate(function (value) {
    return value.length > 0;
}, 'Email cannot be blank');

UserSchema.path('username').validate(function (value) {
    return value.length > 0;
}, 'Name cannot be blank');

UserSchema.path('encryptedPassword').validate(function (value) {
    return value.length > 0;
}, 'Password cannot be blank');

UserSchema.methods.authenticate = function(plainPassword) {
    return plainPassword == this.encryptedPassword;
};

mongoose.model('User', UserSchema);