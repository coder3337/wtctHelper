require('dotenv').config();
require('./model/db');

env = process.env.NODE_ENV;
envString = env;
console.log('Environment:', process.env.NODE_ENV);
// console.log('Hostname:', process.env['HOST' + envString]);
const cookieSession = require('cookie-session');
const express = require('express');
const jwt = require('jsonwebtoken');
const http = require('http');
const path = require('path');
const debug = require('debug')('wtcthelperapp:server');

// const hostname = process.env['HOST' + envString]; // must be 0.0.0.0 on heroku

// const port = process.env.PORT || '8000';

const User = require('./model/userModel');
const userRoutes = require('./routes/userRoutes.js');
const userInViews = require('./middleware/allUsersMiddle');
const app = express();

app.set('trust proxy', 1); // trust first proxy

app.use(cookieSession({
  name: 'session',
  keys: ['key0'],
  secure: false, // change later!
  httpOnly: true, // change later!
  maxAge: 1 * 60 * 60 * 1000, // 1 hours
  // maxAge: 24 *60 * 60 * 1000, // 24 hours
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(userInViews());

app.use(async (req, res, next) => {
  // console.log(req.session.accessToken);
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
      // console.log(res.locals.loggedInUser); // full object
      res.locals.id = req.session.id;
      res.locals.email = req.session.email;
      res.locals.role = req.session.role;
      res.locals.accessToken = req.session.accessToken;
      res.locals.loggedInFor = req.session.loggedInFor;
      console.log('Time:', Date.now() + ' ' + res.locals.loggedInUser);

      next();
    } catch (error) {
      next(error);
    }
  } else {
    console.log('No token found');
    next();
  }
});

app.use(userRoutes);


/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '8000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
console.log(`Server started port http://localhost:${port}`);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ?
    'Pipe ' + port :
    'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ?
    'pipe ' + addr :
    'port ' + addr.port;
  debug('Listening on ' + bind);
}

module.exports = app;
