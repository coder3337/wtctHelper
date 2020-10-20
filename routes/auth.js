const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const passport = require('passport');
const dotenv = require('dotenv');
const util = require('util');
const url = require('url');
const querystring = require('querystring');

dotenv.config();

// Perform the login, after login Auth0 will redirect to callback
router.get('/login',
    passport.authenticate('auth0', {
      scope: 'openid email profile',
    }),
    (req, res) => {
      res.redirect('/');
    },
);
// Perform the final stage of authentication and redirect to previously requested URL or '/user'
router.get('/callback', (req, res, next) => {
  passport.authenticate('auth0', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      const returnTo = req.session.returnTo;
      delete req.session.returnTo;
      res.redirect(returnTo || '/dashboard');
    });
  })(req, res, next);
});

// /////////
// Perform session logout and redirect to homepage
router.get('/logout', (req, res) => {
  let returnTo = req.protocol + '://' + req.hostname;
  const port = req.connection.localPort;
  if (port !== undefined && port !== 80 && port !== 443) {
    returnTo = process.env.NODE_ENV === 'production' ? `${returnTo}/` : `${returnTo}`;
  }
  req.logout();

  if (req.session) {
    req.session.destroy(function(err) {
      if (err) {
        console.log(err);
      }
      console.log('Destroyed the user session on Auth0 endpoint');

      const logoutURL = new url.URL(
          util.format('https://%s/v2/logout', process.env['AUTH0_DOMAIN' + envString]),
      );
      const searchString = querystring.stringify({
        client_id: process.env['AUTH0_CLIENT_ID' + envString],
        returnTo: returnTo,
      });
      logoutURL.search = searchString;

      res.redirect(logoutURL);

      /*       res.redirect(req.protocol + '://' + process.env.AUTH0_DOMAIN + '/v2/logout?client_id='+process.env.AUTH0_CLIENT_ID+'&returnTo=' + returnTo); */
    });
  }
});
// /////

/* router.get('/logout', (req, res) => {
  req.logOut();

  let returnTo = req.protocol + '://' + req.hostname;
  const port = req.connection.localPort;

  if (port !== undefined && port !== 80 && port !== 443) {
    returnTo = process.env.NODE_ENV === 'production' ? `${returnTo}/` : `${returnTo}:${port}/`;
  }


  const logoutURL = new url.URL(
      util.format('https://%s/v2/logout', process.env.AUTH0_DOMAIN),
  );
  const searchString = querystring.stringify({
    client_id: process.env.AUTH0_CLIENT_ID,
    returnTo: returnTo,
  });
  logoutURL.search = searchString;

  res.redirect(logoutURL);
}); */

module.exports = router;
