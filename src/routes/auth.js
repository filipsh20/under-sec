const express = require('express');
const passport = require('../controllers/passport');
const router = express.Router();

//google auth
router.get('/google', passport.authenticate('google', {scope: ['email', 'profile']}));
router.get('/google/callback', passport.authenticate('google', {
    successRedirect: '../../../',
    failureRedirect: '../../../signup'
}))

//traditional auth
router.get('/signup', (req, res, next) => res.render('signup'));
router.get('/signin', (req, res, next) => res.render('signin'));

module.exports = router