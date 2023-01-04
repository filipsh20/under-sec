const GoogleStrategy = require('passport-google-oauth2').Strategy;
const passport = require('passport');
const userGoogleSchema = require('../models/user-google-schema');
const userSchema = require('../models/user-schema');

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (userID, done) {
    done(null, userID);
});

passport.use('google', new GoogleStrategy({
    clientID: '351591539699-lah37lch4s2limkia3r4vp579s7cej92.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: `${process.env.URL}/auth/google/callback`,
    passReqToCallback: true

}, async function (request, accessToken, refreshToken, profile, done) {
    console.log(profile)
    const verifyEmail = await userGoogleSchema.findOne({ email: profile.email});
    const userGoogleInfo = await new userGoogleSchema({ username: profile.displayName, email: profile.email, picture: profile.picture});
    if(!verifyEmail) await userGoogleInfo.save();
    return done(null, profile);
}));

module.exports = passport;

