const express = require('express');
// const secured = require('../middleware/securedMiddle');
// eslint-disable-next-line new-cap
const router = express.Router();
const mongoose = require('mongoose');
const Booking = mongoose.model('Booking');

// const gm = require('../getMatches');
mongoose.set('debug', true);


/**
 * Routes Definitions
 */

/* const secured = (req, res, next) => {
  if (req.user) {
    return next();
  }
  req.session.returnTo = req.originalUrl;
  res.redirect('/login');
};
// /// */

// come back to this - https://stackoverflow.com/questions/28519480/validate-in-mongoose-without-saving
router.post('/add', /* secured(), */(req, res) => {
  // console.log(req.body._id);
  // console.log('insert', req.body);
  insertRecord(req, res);
/*   res.render('bookingsList', {
   // viewTitle: 'Add New Booking',
    //booking: req.body,
    saveSuccessful: 'Booking Saved',
    //docs: doc,
  }); */
});
function insertRecord(req, res) {
  const booking = new Booking();
  booking.firstName = req.body.firstName;
  booking.lastName = req.body.lastName;
  booking.customerEmail = req.body.customerEmail;
  booking.phone = req.body.phone;
  booking.pax = req.body.pax;
  booking.tourType = req.body.tourType;
  booking.operatorName = req.body.operatorName;
  booking.dateBooked = req.body.dateBooked;
  booking.tourDate = req.body.tourDate;
  booking.pickupAddress = req.body.pickupAddress;
  booking.notes = req.body.notes;
  booking.paidStatus = req.body.paidStatus;
  booking.guidesName = req.body.guidesName;
  booking.guidesEmail = req.body.guidesEmail;
  booking.clientReminderSent = req.body.clientReminderSent;
  booking.bookingCreatedSent = req.body.bookingCreatedSent;
  booking.calendarEventCreated = req.body.calendarEventCreated;
  booking.remindGoCapeGuides = req.body.remindGoCapeGuides;
  booking.remindOperators = req.body.remindOperators;
  booking.feedbackSent = req.body.feedbackSent;
  booking.referrer = req.body.referrer;
  booking.save((err, doc) => {
    if (!err) {
      // res.redirect('/list');
      res.render('add', {
        viewTitle: 'Add New Booking',
        booking: req.body,
        saveSuccessful: 'Booking Saved',
        docs: doc,
      });
      console.log(req.body);
      // console.log('add booking doc', doc);
      console.log('Saved!');
    } else {
      if (err.name == 'ValidationError') {
        handleValidationError(err, req.body);
        // render add view upon failure to save
        res.render('add', {
          viewTitle: 'Add New Booking',
          booking: req.body,
          saveUnsuccessful: 'Not Saved: ' + err + ' Error saving booking, please try again.',
          // docs: doc,
        });
      } else {
        console.log('Error during record insertion : ' + err);
      }
    }
    // console.log(doc);
  });
}
/* router.get('/edit', (req, res, next) => {
  res.render('edit', {
    viewTitle: 'Edit Booking',
    booking: req.body,
  });
}); */

/* Order.findOne({ _id: orderId, shop: shopId }, function (err, order) {
  order.status = 'foo';
  order.save(function (err, savedOrder) {
    // ERROR HERE
  })
})

Order.update(
  { _id: orderId, shop: shopId },
  { $set: { status: status }},
  { upsert: true, runValidators: true }, function(err) {
    console.log(err);
    callback(err);
} */

router.post('/edit', (req, res) => {
  console.log(req.body._id);
  // console.log('insert', req.body);
  updateRecord(req, res);
});

function updateRecord(req, res) {
  const booking = new Booking();
  booking.firstName = req.body.firstName;
  booking.lastName = req.body.lastName;
  booking.customerEmail = req.body.customerEmail;
  booking.phone = req.body.phone;
  booking.pax = req.body.pax;
  booking.tourType = req.body.tourType;
  booking.operatorName = req.body.operatorName;
  booking.dateBooked = req.body.dateBooked;
  booking.tourDate = req.body.tourDate;
  booking.pickupAddress = req.body.pickupAddress;
  booking.notes = req.body.notes;
  booking.paidStatus = req.body.paidStatus;
  booking.guidesName = req.body.guidesName;
  booking.guidesEmail = req.body.guidesEmail;
  booking.clientReminderSent = req.body.clientReminderSent;
  booking.bookingCreatedSent = req.body.bookingCreatedSent;
  booking.calendarEventCreated = req.body.calendarEventCreated;
  booking.remindGoCapeGuides = req.body.remindGoCapeGuides;
  booking.remindOperators = req.body.remindOperators;
  booking.feedbackSent = req.body.feedbackSent;
  booking.referrer = req.body.referrer;

  Booking.findOneAndUpdate({_id: req.body._id}, req.body, {new: true}, (err, doc) => {
    if (!err) {
      // res.redirect('/list');
      res.render('edit', {
        viewTitle: 'Edit Booking',
        booking: req.body,
        saveSuccessful: 'Booking Updated',
        // docs: doc,
      });
      console.log(req.body._id);
    } else {
      if (err.name == 'ValidationError') {
        handleValidationError(err, req.body);
        res.render('edit', {
          viewTitle: 'Edit Booking',
          booking: req.body,
          saveUnsuccessful: 'Not Saved: Error saving booking, please try again.',
          // docs: doc,
        });
      } else {
        console.log('Error during record update : ' + err);
      }
    }
  });
}
function handleValidationError(err, body) {
  // eslint-disable-next-line guard-for-in
  for (field in err.errors) {
    switch (err.errors[field].path) {
      case 'firstName':
        body['firstNameError'] = err.errors[field].message;
        break;
      case 'lastName':
        body['lastNameError'] = err.errors[field].message;
        break;
      case 'tourType':
        body['tourTypeError'] = err.errors[field].message;
        break;
      case 'dateBooked':
        body['dateBookedError'] = err.errors[field].message;
        break;
      case 'tourDate':
        body['tourDateError'] = err.errors[field].message;
        break;
      case 'pax':
        body['paxError'] = err.errors[field].message;
        break;
      case 'phone':
        body['phoneError'] = err.errors[field].message;
        break;
      case 'customerEmail':
        body['customerEmailError'] = err.errors[field].message;
        break;
      case 'pickupAddress':
        body['pickupAddressError'] = err.errors[field].message;
        break;
      case 'operatorName':
        body['operatorNameError'] = err.errors[field].message;
        break;
      case 'paidStatus':
        body['paidStatusError'] = err.errors[field].message;
        break;
      case 'notes':
        body['paidStatusError'] = err.errors[field].message;
        break;
      /*       case 'guidesName':
      body['guidesNameError'] = err.errors[field].message;
      break;
    case 'guidesEmail':
      body['guidesEmailError'] = err.errors[field].message;
      break; */
      default:
        break;
    }
  }
}

/* router.post('/', (req, res, next) => {
  // console.log(req.body);
} ); */
//
router.post('/search/:q', function(req, res) {
  const q = req.body.q;
  res.send(q);
  // res.send(q);
  console.log(q);
});

router.post('/list/batchDelete', async (req, res) => {
  const {ids} = req.body;
  await Booking.deleteMany(
      {
        _id: {$in: ids},
      }, function(err, result) {
        if (err) {
          res.send(err);
        } else {
          //res.send(result);
          return res.redirect('/list');
        }
      });
      // res.send('record deleted');
});


/* router.post('/list/batchDelete', function(req, res) {
  console.log('body: ', req.body);
  // const ids = req.body.ids;
  res.send(req.body);
  // res.redirect('/list');
  // res.send(q);
  // console.log(ids);
}); */

// /////////

/* router.post('/batchDelete', function(req, res) {
  //req.params.ids;
  res.send(req.params.ids);
  // res.send(q);
  // console.log(req.params.ids);
}); */


module.exports = router;
