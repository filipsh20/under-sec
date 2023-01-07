const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userGoogleSchema = new mongoose.Schema({
    username: { type: String, unique: false, required: true },
    email: { type: String, unique: true, required: true },
    picture: { type: String, unique: false, required: true },
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
    userSchema: mongoose.model('users', userSchema),
    userGoogleSchema: mongoose.model('users-google', userGoogleSchema)
};