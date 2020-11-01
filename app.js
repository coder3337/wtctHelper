require('dotenv').config();
require('./model/db');

env = process.env.NODE_ENV;
envString = env;
console.log('Environment:', process.env.NODE_ENV);
console.log('Hostname:', process.env['HOST' + envString]);

const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const path = require('path');
const hostname = process.env['HOST' + envString]; // must be 0.0.0.0 on heroku
const port = process.env.PORT || '8000';

// const userInViews = require('./middleware/allUsersMiddle');
const User = require('./model/userModel');
const userRoutes = require('./routes/userRoutes.js');
// const allRoutes = require('./routes/allRoutes');
const app = express();

app.set('trust proxy', 0); // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  //cookie: {secure: true},
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(async (req, res, next) => {
  if (req.headers['x-access-token']) {
    try {
      const accessToken = req.headers['x-access-token'];
      const {userId, exp} = await jwt.verify(accessToken, process.env.JWT_SECRET);
      console.log('token check started');
      // If token has expired
      if (exp < Date.now().valueOf() / 1000) {
        return res.status(401).json({
          error: 'JWT token has expired, please login to obtain a new one',
        });
      }
      res.locals.loggedInUser = await User.findById(userId);
      // console.log('Time:', Date.now());
      next();
    } catch (error) {
      next(error);
    }
  } else {
    console.log('nothing to show');
    next();
  }
});

// Middleware from here
app.use('/', userRoutes);
// app.use(userInViews());
// app.use('/', allRoutes);

app.listen(port, hostname, () => {
  console.log(`Server started port http://localhost:${port}`);
});
module.exports = app;
