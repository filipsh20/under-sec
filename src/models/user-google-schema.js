const mongoose = require('mongoose');

const userGoogleSchema = new mongoose.Schema({
    username: {type: String, unique: false, required: true},
    email: {type: String, unique: true, required: true},
    picture: {type: String, unique: false, required: true},
});

module.exports = mongoose.model('users-google', userGoogleSchema);