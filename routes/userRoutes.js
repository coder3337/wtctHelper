const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// must export this / trigger these tasks either by timer job or manually?
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

router.get('/dashboard', userController.allowIfLoggedin, userController.grantAccess('readOwn', 'profile'), userController.getBookingsMadeToday);

router.get('/add', userController.allowIfLoggedin, userController.grantAccess('readAny', 'profile'),
    (req, res, next) => {
      res.render('add', {
        viewTitle: 'Add New Booking',
        booking: req.body,
      });
    });

router.post('/add', userController.allowIfLoggedin, userController.grantAccess('readAny', 'profile'), userController.addNewBooking);

router.get('/agenda', userController.allowIfLoggedin, userController.grantAccess('readAny', 'profile'));

router.get('/users', userController.allowIfLoggedin, userController.grantAccess('readAny', 'profile'), userController.getUsers);

router.get('/my-bookings', userController.allowIfLoggedin, userController.grantAccess('readOwn', 'profile'), userController.getMyBookings);

router.get('/my-agenda', userController.allowIfLoggedin, userController.grantAccess('readOwn', 'profile'), userController.getMyAgenda);

router.post('/edit', userController.allowIfLoggedin, userController.grantAccess('readOwn', 'profile'), userController.updateBooking);

router.get('/edit/:id', userController.allowIfLoggedin, userController.grantAccess('readOwn', 'profile'),
    (req, res, next) => {
      Booking.findById(req.params.id, (err, doc) => {
        if (!err) {
          res.render('edit', {
            viewTitle: 'Edit Booking',
            booking: doc,
          });
        }
      });
    },
);

router.get('/search/:q', userController.allowIfLoggedin, userController.grantAccess('readOwn', 'profile'), userController.getSearch);

router.get('/user/:userId', userController.allowIfLoggedin, userController.getUser);

router.put('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'profile'), userController.updateUser);

router.delete('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('deleteAny', 'profile'), userController.deleteUser);

router.post('/list/batchDelete', userController.allowIfLoggedin, userController.getBatchDelete);

router.get('/delete/:id', userController.allowIfLoggedin, userController.getDeleteOneBooking);

/* router.post('/search/:q', function(req, res) {
  const q = req.body.q;
  res.send(q);
  console.log(q);
}); */

module.exports = router;
