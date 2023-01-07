const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {res.render('account')});

router.get('/logout', (req, res, next) => {
    req.logout((e) => {return next(e)});
    res.redirect('/auth/signin');
});


module.exports = router;