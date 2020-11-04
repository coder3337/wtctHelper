
module.exports = function() {
  return async function(req, res, next) {
    const Booking = require('../model/booking.model');
    let docs;
    try {
      docs = await Booking.find();
      const bookingsCount = docs.length;
      // res.locals.user = req.user;
    /*   app.locals = {
        count: bookingsCount,
      }; */
      // res.locals - An object that contains response local variables scoped to the request, and therefore available only to the view(s) rendered during that request / response cycle (if any).
      res.locals = {
        count: bookingsCount,

        // count: count,
        // userProfile: userProfile,
        // email: req.emails,
        // userProfile: JSON.stringify(userProfile, null, 2),
        title: 'My App',
        publicGlobalToken: '1234',
        taskNotificationMsg: 'Im a global msg ',
        message: 'Im also a global msg',
        // email: data.email,
        // isAuthenticated: req.isAuthenticated(),

        // userProfile: req.user,
        // loggedInEmail: userProfile.emails[0].value,
        // userProfile: req.user,

        // loggedInEmail: '',
        // userProfile: req.user,
        // name: userProfile.displayName,
        // loggedInUser: userProfile.emails[0].value,
      };
      // console.log('locals:', res.locals);
      // res.locals.profile = JSON.stringify(userProfile, null, 2),
      next();
    } catch (err) {
      console.log(err);
      return next(err);
    }; // });
  };
};
