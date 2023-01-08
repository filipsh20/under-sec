const express = require('express');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {Authenticated, notAuthenticated} = require('./controllers/protection');
const flash = require('connect-flash');
const path = require('path');

const app = express();
require('dotenv').config();
require('./database/connection')

//settings
app.set('port', process.env.PORT);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')))

//middlewars
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: 'ef?EF$US//E-jh98f2',
    saveUninitialized: true,
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req, res, next) => {
    app.locals.signupSuccess = req.flash('signupSuccess');
    app.locals.signupError = req.flash('signupError');
    app.locals.signinError = req.flash('signinError');
    next();
  });

//routes
app.get('/', notAuthenticated, (req, res, next) => {res.render('dashboard')});
app.use('/account', notAuthenticated, require('./routes/account'));
app.use('/auth', Authenticated, require('./routes/auth'));

//starting server
app.listen(app.get('port'), () => console.log(`Server running on port ${app.get('port')}`));