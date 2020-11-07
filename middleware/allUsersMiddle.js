
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
        title: 'My App',
        publicGlobalToken: '1234',
        infoMsg: 'Global info msg',
        warnMsg: 'Global warning msg',

      };
      // console.log('locals:', res.locals);
      next();
    } catch (err) {
      console.log(err);
      return next(err);
    }; // });
  };
};
