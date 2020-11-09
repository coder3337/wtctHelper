const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// must export this
const mongoose = require('mongoose');
const Booking = mongoose.model('Booking');
const dt = require('../public/dates.js');
const runTasks = require('../tasks.js');

console.log('Date tomorrow', dt.dateTomorrow());

runTasks.sendNewBookings();
runTasks.clientReminders();
runTasks.reminderOperators();
runTasks.remindGCGuides();
runTasks.sendCustomerFeedback();
// //

router.get('/', (req, res, next) => {
  res.render('login', {
    viewTitle: 'WINE BOOK HELPER',
  });
});

router.get('/signup', (req, res, next) => {
  res.render('signup', {
    viewTitle: 'WTCT | REGISTER ',
  });
});

router.post('/signup', userController.signup);

router.get('/login', (req, res, next) => {
  res.render('login', {
    viewTitle: 'WTCT | DASHBOARD',
  });
});

router.get('/logout', (req, res, next) => {
  req.session = null;
  // console.log('session deleted')
  res.redirect('/');
});

router.post('/login', userController.login );

router.get('/dashboard', userController.allowIfLoggedin, userController.grantAccess('readOwn', 'profile'), (req, res) => {
  res.render('dashboard', {
    viewTitle: 'Dashboard',

  });
});

router.get('/add', userController.allowIfLoggedin, userController.grantAccess('readAny', 'profile'));

router.get('/agenda', userController.allowIfLoggedin, userController.grantAccess('readAny', 'profile'));

/* router.get('/add', userController.allowIfLoggedin, userController.grantAccess('readAny', 'profile'));
 */
router.get('/users', userController.allowIfLoggedin, userController.grantAccess('readAny', 'profile'), userController.getUsers);

router.get('/list', userController.allowIfLoggedin, userController.grantAccess('readAny', 'profile'), userController.getAllBookings);

router.get('/my-bookings', userController.allowIfLoggedin, userController.grantAccess('readOwn', 'profile'), userController.getMyBookings);

router.get('/my-agenda', userController.allowIfLoggedin, userController.grantAccess('readOwn', 'profile'), userController.getMyAgenda);

router.get('/user/:userId', userController.allowIfLoggedin, userController.getUser);

router.put('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'profile'), userController.updateUser);

router.delete('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('deleteAny', 'profile'), userController.deleteUser);

router.get('/add', (req, res, next) => {
  res.render('add', {
    viewTitle: 'Add New Booking',
    booking: req.body,
  });
});

router.post('/add', (req, res) => {
  insertRecord(req, res);
},
);
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
          saveUnsuccessful:
            'Not Saved: ' + err + ' Error saving booking, please try again.',
          // docs: doc,
        });
      } else {
        console.log('Error during record insertion : ' + err);
      }
    }
    // console.log(doc);
  });
}

router.post('/edit', (req, res) => {
  console.log(req.body._id);
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

  Booking.findOneAndUpdate(
      {_id: req.body._id},
      req.body,
      {new: true},
      (err, doc) => {
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
              saveUnsuccessful:
              'Not Saved: Error saving booking, please try again.',
            // docs: doc,
            });
          } else {
            console.log('Error during record update : ' + err);
          }
        }
      },
  );
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

router.post('/search/:q', function(req, res) {
  const q = req.body.q;
  res.send(q);
  console.log(q);
});

router.post('/list/batchDelete', async (req, res) => {
  const {ids} = req.body;
  await Booking.deleteMany(
      {
        _id: {$in: ids},
      },
      function(err, result) {
        if (err) {
          res.send(err);
        } else {
          return res.redirect('/list');
        }
      },
  );
});

/* router.get('/list', (req, res) => {

}); */

/* router.get('/dashboard', (req, res) => {
  res.render('dashboard', {
    viewTitle: 'Dashboard',
  });
}); */

router.get('/edit/:id', (req, res) => {
  Booking.findById(req.params.id, (err, doc) => {
    if (!err) {
      res.render('edit', {
        viewTitle: 'Edit Booking',
        booking: doc,
      });
    }
  });
});

router.get('/delete/:id', (req, res) => {
  Booking.findByIdAndRemove(req.params.id, (err, doc) => {
    if (!err) {
      res.redirect('/list');
    } else {
      console.log('Error in employee delete :' + err);
    }
  });
});

router.get('/search/:q', (req, res) => {
  const q = req.query.q;

  const result = {$or: [{firstName: {$regex: q}}, {lastName: {$regex: q}}, {customerEmail: {$regex: q}}, {tourDate: {$regex: q}}, {pickupAddress: {$regex: q}}, {guidesName: {$regex: q}}, {guidesEmail: {$regex: q}}, {notes: {$regex: q}}, {phone: {$regex: q}}, {tourType: {$regex: q}}]};

  console.log(result);
  Booking.find(result, (err, docs) => {
    // console.log(result);
    if (!err) {
      res.render('bookingsList', {
        viewTitle: 'Search Results',
        list: docs,

      });
    } else {
      console.log('Error  finding record :' + err);
    }
  }).sort({tourDate: 'descending'});
});

router.get('/agenda', (req, res, next) => {
  // const result = {};
  const docs = Booking.find({/* result */}, (err, docs) => {
    if (!err) {
      res.render('agenda', {
        viewTitle: 'Agenda',
        list: docs,
      });
      // console.log(docs);
    } else {
      console.log('Error  finding record :' + err);
    }
  }).sort({tourDate: 'descending'});
  // console.log(result);
});


module.exports = router;
