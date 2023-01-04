const express = require('express');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const protection = require('./controllers/protection');
const path = require('path');

const app = express();
require('dotenv').config();
require('./database/connection')

//settings
app.set('port', process.env.PORT);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

//middlewars
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret: '12345678',
    saveUninitialized: true,
    resave: true
}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

//routes
app.get('/', protection.notAuthenticated ,(req, res, next) => {res.render('home')})
app.use('/auth',protection.Authenticated, require('./routes/auth'));

//starting server
app.listen(app.get('port'), () => console.log(`Server running on port ${app.get('port')}`));