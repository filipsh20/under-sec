const express = require('express');
const router = express.Router();
const passport = require('../controllers/passport');

//google auth
router.get('/google', passport.authenticate('google'));
router.get('/google/callback', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/auth/signup'
}));

//facebook auth
router.get('/facebook', passport.authenticate('facebook'));
router.get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/auth/signup'
}));

//traditional auth
router.get('/signup', (req, res, next) => res.render('signup'));
router.get('/signin', (req, res, next) => res.render('signin'));

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/auth/signup',
    failureRedirect: '/auth/signup',
    passReqToCallback: true
}));

router.post('/signin', passport.authenticate('local-signin', {
    successRedirect: '/',
    failureRedirect: '/auth/signin',
    passReqToCallback: true
}));

module.exports = router;