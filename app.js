// npm run dev
// npm run ui
// https://auth0.com/docs/quickstart/webapp/nodejs#create-the-user-profile-route
// https://auth0.com/docs/quickstart/webapp/nodejs/01-login
// when pushing to heroku leave all env vars as is, change only NODE_ENV and HOST=0.0.0.0 for production
require('./model/db');
require('dotenv').config();

env = process.env.NODE_ENV;
envString = env;
// GOOGLE_SHEET_ID = process.env['GOOGLE_SHEET_ID_' + envString];
console.log('Environment:', process.env.NODE_ENV);
console.log('Hostname:', process.env['HOST' + envString]);
const wake = require('./wakeUpDyno.js');
const DYNO_URL = process.env.DYNOURL;
wake(DYNO_URL);
const express = require('express');
const path = require('path');
// const bodyParser = require('body-parser');
const hostname = process.env['HOST' + envString]; // must be 0.0.0.0 on heroku
const session = require('express-session');
// Load Passport
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
// const port = process.env.PORT || '8000';
const port = process.env.PORT || '8000';

const userInViews = require('./middleware/allUsersMiddle');
const authRouter = require('./routes/auth');
const indexRouter = require('./routes/publicIndexRoute');
const securedRoutes = require('./routes/allRoutes');
// const calendarRouter = require('./routes/calendarRoute');
// config express-session
const sess = {
  // https://www.npmjs.com/package/express-session#secret
  secret: process.env.AUTH0_SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: false,
};

const postRoutes = require('./routes/bookingController');
// Configure Passport to use Auth0
const strategy = new Auth0Strategy(
    {
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      callbackURL:
      // use below when STAGING
      /* 'http://localhost:8000/callback' || process.env['AUTH0_CALLBACK_URL' + envString], */

      // use below when going live
        process.env['AUTH0_CALLBACK_URL' + envString],
    },
    function(accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
      return done(null, profile);
    },
);
passport.use(strategy);
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
// must come before passport.initialize and passport.session
app.use(session(sess));
app.use(passport.initialize());
app.use(passport.session());
/* app.use(bodyParser.urlencoded({
  extended: true,
})); */
if (app.get('env') === 'PRODUCTION') {
// change this to 'production' NB on pushing
  sess.cookie.secure = true; // serve secure cookies, requires https
  // Uncomment the line below if your application is behind a proxy (like on Heroku)
  // or if you're encountering the error message:
  // "Unable to verify authorization request state"
  app.set('trust proxy', 1);
} else {
  sess.cookie.secure = false;
  app.set('trust proxy', 0);
}

app.listen(port, hostname, () => {
  console.log(`Server started port http://localhost:${port}`);
});
// app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// sets content-type to json
// https://medium.com/@mmajdanski/express-body-parser-and-why-may-not-need-it-335803cd048c
// app.use(express); // Parse URL-encoded bodies
/* app.use(function(req, res, next) {
    next();
});
 */
// Creating custom middleware with Express
app.use(userInViews());
app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/', securedRoutes);
app.use('/', postRoutes);

/* const apiroutes = require('./routes/api_routes.js');
app.use('/', authRouter, apiroutes); */
// gm.findNewUnsent();

module.exports = app;
