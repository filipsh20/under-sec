const { userSchema, userGoogleSchema, userFacebookSchema } = require('../models/user-schema');
const googleStrategy = require('passport-google-oauth2').Strategy;
const facebookStrategy = require('passport-facebook').Strategy;
const localStrategy = require('passport-local').Strategy;
const passport = require('passport');

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (userID, done) {
    done(null, userID);
});

//google auth
passport.use('google', new googleStrategy({
    clientID: process.env.GoogleClientID,
    clientSecret: process.env.GoogleClientSecret,
    callbackURL: `${process.env.URL}/auth/google/callback`,
    scope: ['email', 'profile'],

}, async (request, accessToken, refreshToken, profile, done) => {
    const verifyID = await userGoogleSchema.findOne({ _id: profile.id });
    const userGoogleInfo = new userGoogleSchema({ _id: profile.id, username: profile.displayName, email: profile.email, picture: profile.picture });
    if (!verifyID) await userGoogleInfo.save();
    return done(null, profile);
}));

//facebook auth
passport.use('facebook', new facebookStrategy({
    clientID: process.env.FacebookClientID,
    clientSecret: process.env.FacebookClientSecret,
    callbackURL: `${process.env.URL}/auth/facebook/callback`,
    scope: ['email']
}, async (request, accessToken, refreshToken, profile, done) => {
    const verifyID = userFacebookSchema.findOne({ _id: profile.id });
    const userFacebookInfo = new userFacebookSchema({_id: profile.id, username: profile.displayName, email: profile.email});
    if(!verifyID) await userFacebookInfo.save();
    return done(null, profile);
}));

//traditional auth
passport.use('local-signup', new localStrategy({
    passReqToCallback: true

}, async (req, username, password, done) => {
    const { email } = req.body;
    //validations
    const validateEmail = /\S+@\S+/.test(email);
    const verifyEmail = await userSchema.findOne({ email: email });
    const verifyUsername = await userSchema.findOne({ username: username });
    if (!validateEmail || verifyEmail || verifyUsername) return done(null, false, req.flash('signupError', 'Username or email is not available.'));
    //save info
    const userInfo = new userSchema({ username: username, email: email });
    userInfo.password = userInfo.hash(password);
    await userInfo.save();
    return done(null, false, req.flash('signupSuccess', 'We have send you a verification email.'))
}));

passport.use('local-signin', new localStrategy({
    passReqToCallback: true,
    usernameField: 'email'

}, async (req, email, password, done) => {
    //validations
    const validateEmail = /\S+@\S+/.test(email);
    const userInfo = await userSchema.findOne({ email: email });
    if (!validateEmail || !userInfo) return done(null, false, req.flash('signinError', 'Wrong email or password'));
    if(!userInfo.compare(password)) return done(null, false, req.flash('signinError', 'Wrong email or password'))
    return done(null, userInfo);
}));

module.exports = passport;

