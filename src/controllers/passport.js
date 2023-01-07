const passport = require('passport');
const googleStrategy = require('passport-google-oauth2').Strategy;
const localStrategy = require('passport-local').Strategy;
const {userSchema, userGoogleSchema} = require('../models/user-schema');

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (userID, done) {
    done(null, userID);
});

passport.use('google', new googleStrategy({
    clientID: '351591539699-lah37lch4s2limkia3r4vp579s7cej92.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: `${process.env.URL}/auth/google/callback`,
    passReqToCallback: true

}, async (request, accessToken, refreshToken, profile, done) => {
    //validations
    const verifyEmail = await userGoogleSchema.findOne({ email: profile.email });
    const userGoogleInfo = new userGoogleSchema({ username: profile.displayName, email: profile.email, picture: profile.picture });
    //save info
    if (!verifyEmail) await userGoogleInfo.save();
    return done(null, profile);
}));

passport.use('local-signup', new localStrategy({
    passReqToCallback: true

}, async (req, username, password, done) => {
    const { email } = req.body;
    //validations
    const validateEmail = /\S+@\S+/.test(email);
    const verifyEmail = await userSchema.findOne({ email: email });
    const verifyUsername = await userSchema.findOne({ username: username });
    if (!validateEmail || verifyEmail || verifyUsername) return done(null, false, req.flash('signupError', 'Username or email not available.'));
    //save info
    const userInfo = new userSchema({ username: username, email: email});
          userInfo.password = userInfo.hash(password);
    await userInfo.save();
    return done(null, false, req.flash('signupSuccess', 'We have send you a verification email.'))
}));

passport.use('local-signin', new localStrategy({
    passReqToCallback: true,
    usernameField: 'email'

}, async (req, email,password, done) => {
    //validations
    const validateEmail = /\S+@\S+/.test(email);
    const userInfo = await userSchema.findOne({ email: email });
    const verifyPassword = userInfo.compare(password);
    console.log(verifyPassword)
    if(!validateEmail || !userInfo || !verifyPassword) return done(null, false, req.flash('signinError', 'Wrong email or password'));
    return done(null, userInfo);
}))

module.exports = passport;

