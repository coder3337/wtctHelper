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
        };

        return next();
      } catch (err) {
        console.log(err);
        return next(err);
      }
    }
  };
};