const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const passport = require('passport');
const cookieSession = require('cookie-session')
require('./passport-setup');

var http = require('http');
var fs = require('fs');
var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/data.txt', {flags : 'w'});
var log_stdout = process.stdout;

printt = function(d) { 
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};

const Git = require('git-commands')
const git = new Git({ reps:__dirname + '/Test-Repo' })

function comments_ExtractToFile()
{
	printt(git.command('log --pretty="%s:%b"'));
}

comments_ExtractToFile()

app.use(cors())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

// For an actual app you should configure this with an experation time, better keys, proxy and secure
app.use(cookieSession({
    name: 'tuto-session',
    keys: ['key1', 'key2']
  }))

// Auth middleware that checks if the user is logged in
const isLoggedIn = (req, res, next) => {
    if (req.user) {
        res.redirect('./good');
    } else {
        res.redirect('./failed');
    }
}

// Initializes passport and passport sessions
app.use(passport.initialize());
app.use(passport.session());

// Example protected and unprotected routes

app.get('/failed', (req, res) => res.send('NOT logged in!'))

// In this route you can see that if the user is logged in u can acess his info in: req.user
app.get('/good', function(req, res)
	{ 
		res.redirect('/data.txt')
	})

app.get('/data.txt', function(req, res) {
    fs.readFile(__dirname + '/data.txt', function (err, data) {
        res.end(data);
    })
})

// Auth Routes
app.get('/', isLoggedIn, passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback', isLoggedIn, passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/good');
  }
);

app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})

app.listen(3000, () => console.log(`Example app listening on port ${3000}!`))
