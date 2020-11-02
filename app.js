require('dotenv').config();
require('./model/db');

env = process.env.NODE_ENV;
envString = env;
console.log('Environment:', process.env.NODE_ENV);
// console.log('Hostname:', process.env['HOST' + envString]);
const cookieSession = require('cookie-session');
const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
const hostname = process.env['HOST' + envString]; // must be 0.0.0.0 on heroku
const port = process.env.PORT || '8000';

// const userInViews = require('./middleware/allUsersMiddle');
const User = require('./model/userModel');
const userRoutes = require('./routes/userRoutes.js');
// const allRoutes = require('./routes/allRoutes');
const app = express();

app.set('trust proxy', 1); // trust first proxy

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2', 'key3', 'key4'],
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
}));
// app.set('trust proxy', 1); // trust first proxy
/* app.use(cookieSession({
  secret: 'thisismysecret',
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
})); */

// app.set('trust proxy', 0); // trust first proxy

/* app.use(session({
  name: 'tokenCheck',
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  // cookie: {secure: true},
})); */

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use(async (req, res, next) => {
  console.log(req.session.accessToken);
  if (req.session.accessToken) {
    try {
      const accessToken = req.session.accessToken;
      const {userId, exp} = await jwt.verify(accessToken, process.env.JWT_SECRET);
      console.log('Yaaayy!!! Token found!!');
      // If token has expired
      if (exp < Date.now().valueOf() / 1000) {
        return res.status(401).json({
          error: 'JWT token has expired, please login to obtain a new one',
        });
      }
      res.locals.loggedInUser = await User.findById(userId);
      // req.session.loggedInUser = loggedInUser;
      console.log('Time:', Date.now() + ' ' + res.locals.loggedInUser);
      next();
    } catch (error) {
      next(error);
    }
  } else {
    console.log('No token checked');
    next();
  }
});

app.use(userRoutes);
// app.use(userInViews());
// app.use('/', allRoutes);

app.listen(port, hostname, () => {
  console.log(`Server started port http://localhost:${port}`);
});
module.exports = app;
