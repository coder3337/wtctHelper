module.exports = {
  async updateSendFeedback() {
    const mongoose = require('mongoose');
    const Booking = mongoose.model('Booking');
    udpateObject = {feedbackSent: false}; // find query object  '2019-12-14' works too
    update = {feedbackSent: true};

    await Booking.findOneAndUpdate(udpateObject, update, {new: true}, (err, doc) => {
      console.log(update);
      /*    if (!err) {
                // res.redirect('/list');
               } else {
                 if (err.name == 'ValidationError') {
                   handleValidationError(err, req.body);
                   res.render('edit', {
                     viewTitle: 'Update Booking',
                     booking: req.body,
                   });
                 } else {
                   console.log('Error during record update : ' + err);
                 }
               } */
    });
  },
};


