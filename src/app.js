const express = require('express');
const session = require('express-session');
const path = require('path');
const forumRouter = require('./routes/forumRouter');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

app.use('/', forumRouter);

module.exports = app;