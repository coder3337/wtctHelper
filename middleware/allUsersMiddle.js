
module.exports = function() {
  return async function(req, res, next) {
    const Booking = require('../model/booking.model');
    let docs;
    try {
      docs = await Booking.find();
      const bookingsCount = docs.length;
      /*   app.locals = {
        count: bookingsCount,
      }; */
      // res.locals - An object that contains response local variables scoped to the request, and therefore available only to the view(s) rendered during that request / response cycle (if any).
      res.locals = {
        count: bookingsCount,
        infoMsg: 'Login sessions end automatically after 1 hour.',
        warnMsg: '', // add a msg here for all users warning msg

      };
      // console.log('locals:', res.locals);
      next();
    } catch (err) {
      console.log(err);
      return next(err);
    }; // });
  };
};
