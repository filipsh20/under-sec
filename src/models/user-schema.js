const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userGoogleSchema = new mongoose.Schema({
    _id: {type: String, unique: true, required: true},
    username: { type: String, unique: false, required: true },
    email: { type: String, unique: true, required: true },
    picture: { type: String, unique: false, required: false}
});

const facebookSchema = new mongoose.Schema({
    _id: {type: String, unique: true, required: true},
    username: {type: String, unique: false, required: true},
    email: {type: String, unique: true, required: false}
});

const userSchema = new mongoose.Schema({
    username: { type: String, unique: false, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, unique: false, required: true }
});

userSchema.methods.hash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
};

userSchema.methods.compare = function (password){
    return bcrypt.compareSync(password, this.password)
}

module.exports = {
    userGoogleSchema: mongoose.model('google-users', userGoogleSchema),
    userFacebookSchema: mongoose.model('facebook-users', facebookSchema),
    userSchema: mongoose.model('users', userSchema),
};