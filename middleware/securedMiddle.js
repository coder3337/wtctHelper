/* createQuote('eat your vegetables!', function(quote) {
  console.log(quote);
}); */

module.exports = function() {
  return async function secured(req, res, next) {
    if (req.user) {
      const Booking = require('../model/booking.model');
      let docs;

      try {
        docs = await Booking.find();
        const bookingsCount = docs.length;
        /* const userProfile = req.user;
        const operator_email = req.user.opmail; */

        console.log(req.user);
        res.locals = {
          count: bookingsCount,
          // userProfile: JSON.stringify(userProfile, null, 2),
          /* name: userProfile.displayName,
          loggedInEmail: userProfile.emails[0].value,
          // isAuthenticated: req.isAuthenticated(),
          profile: userProfile,
          pic: userProfile.picture,
          opmail: operator_email, */

          // opmail: user_metadata.operator_email,


        };

        return next();
      } catch (err) {
        console.log(err);
        return next(err);
      }
    }
  };
};

/* module.exports = function() {
  return async function secured(req, res, next) {
    if (req.user) {
      const mongoose = require('mongoose');
      const Booking = mongoose.model('Booking');
      await Booking.find((err, docs) => {
        bookingsCount = docs.length;
      });
      const userProfile = req.user;
      res.locals = {
        // count: count,
        // userProfile: userProfile,
        // email: req.emails,
        // user: req.user,
        userProfile: JSON.stringify(userProfile, null, 2), // works
        // userProfile: JSON.stringify(userProfile, null, 2),
        name: userProfile.displayName,
        loggedInEmail: userProfile.emails[0].value,
        isAuthenticated: req.isAuthenticated(),
        count: bookingsCount,
      };

      return next();
    }
    req.session.returnTo = req.originalUrl;
    res.redirect('/login');
  };
}; */


/* module.exports = function() {
return function secured(req, res, next) {
if (req.user) {
const mongoose = require('mongoose');
const Booking = mongoose.model('Booking');
Booking.find((err, docs) => {
  bookingsCount = docs.length;
});
const userProfile = req.user;
res.locals = {
  // count: count,
  // userProfile: userProfile,
  // email: req.emails,
  // user: req.user,
  count: bookingsCount,
  userProfile: JSON.stringify(userProfile, null, 2), // works
  // userProfile: JSON.stringify(userProfile, null, 2),
  name: userProfile.displayName,
  loggedInEmail: userProfile.emails[0].value,
  isAuthenticated: req.isAuthenticated(),

};

return next();
}
req.session.returnTo = req.originalUrl;
res.redirect('/login');
};
};

*/
