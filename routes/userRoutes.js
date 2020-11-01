const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const userController = require('../controllers/userController');


router.get('/signup', (req, res, next) => {
  res.render('signup', {
    viewTitle: 'SignUp for Awesomeness!',
  });
});

router.post('/signup', userController.signup);

router.get('/login', (req, res, next) => {
  res.render('login', {
    viewTitle: 'Login to Happiness',
  });
});

router.post('/login', userController.login );

router.get('/users', userController.allowIfLoggedin, userController.grantAccess('readAny', 'profile'), userController.getUsers);

router.get('/user/:userId', userController.allowIfLoggedin, userController.getUser);

router.put('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'profile'), userController.updateUser);

router.delete('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('deleteAny', 'profile'), userController.deleteUser);


const Booking = mongoose.model('Booking');
const dt = require('../public/dates.js');
const runTasks = require('../getMatches.js');

const taskNotificationMsg = 'Task ran';

console.log('Date tomorrow', dt.dateTomorrow());

runTasks.sendNewBookings();
runTasks.clientReminders();
runTasks.reminderOperators();
runTasks.remindGCGuides();
runTasks.sendCustomerFeedback();
// ////////////
// working on notificaiotns
// do this next https://wanago.io/2019/06/17/using-push-notifications-with-service-workers-and-node-js/
console.log(taskNotificationMsg);

router.get('/', (req, res, next) => {
  res.render('index', {
    viewTitle: 'Welcome to WINE BOOK HELPER',
    taskNotificationMsg: 'taskNotificationMsg ran',

  });
});

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

router.get('/list', (req, res) => {
  Booking.find((err, docs) => {
    if (!err) {
      res.render('bookingsList', {
        viewTitle: 'All Bookings',
        list: docs,
      });
    } else {
      console.log('Error in retrieving bookings list :' + err);
    }
  }).sort({tourDate: 'descending'});
});

router.get('/dashboard', (req, res) => {
  res.render('dashboard', {
    viewTitle: 'Dashboard',
  });
});

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
    console.log(result);
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

router.get('/calendar', (req, res, next) => {
  const fs = require('fs');
  const readline = require('readline');
  const {google} = require('googleapis');


  // If modifying these scopes, delete token.json.
  const SCOPES = ['https://www.googleapis.com/auth/calendar'];
  // The file token.json stores the user's access and refresh tokens, and is
  // created automatically when the authorization flow completes for the first
  // time.
  const TOKEN_PATH = 'token.json';

  // Load client secrets from a local file.
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Calendar API.
    authorize(JSON.parse(content), listEvents);
  });

  /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   * @param {Object} credentials The authorization client credentials.
   * @param {function} callback The callback to call with the authorized client.
   */
  function authorize(credentials, callback) {
    // eslint-disable-next-line camelcase
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getAccessToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  }

  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback for the authorized client.
   */
  function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();


      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
    });
  }

  const userProfile = req.user;
  if (userProfile.emails[0].value == process.env.GC_USER_EMAIL) {
    opCalendarLink = process.env.GOOGLE_CALENDAR_ID_GC;
  } else if (userProfile.emails[0].value == process.env.NODEMAILER_WTCT_PRODUCTION) {
    opCalendarLink = process.env.GOOGLE_CALENDAR_ID_GC + '&' + process.env.GOOGLE_CALENDAR_ID_AS + '&' + process.env.GOOGLE_CALENDAR_ID_AV + '&color=%23D6AE00&color=%3C995B08&color=%231F753C&showTitle=0';
    /*     opCalendarLink = process.env.GOOGLE_CALENDAR_ID_GC + '&' + process.env.GOOGLE_CALENDAR_ID_AS + '&' + process.env.GOOGLE_CALENDAR_ID_AV + '&color=%23D6AE00&color=%3C995B08&color=%231F753C&showTitle=0';
 */} else if (userProfile.emails[0].value == process.env.AS_USER_EMAIL) {
    opCalendarLink = process.env.GOOGLE_CALENDAR_ID_AS;
  } else if (userProfile.emails[0].value == process.env.AV_USER_EMAIL) {
    opCalendarLink = process.env.GOOGLE_CALENDAR_ID_AV;
  }// else (opCalendarLink = process.env.GOOGLE_CALENDAR_ID_WTCT);

  /**
   * Lists the next 10 events on the user's primary calendar.
   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
   */
  async function listEvents(auth) {
    const calendar = google.calendar({version: 'v3', auth});
    calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    }, (err, res) => {
      if (err) return console.log('The list 10 events calendar API returned an error: ' + err);
      events = res.data.items;
      if (events.length) {
        console.log('Upcoming 10 events:');
        events.map((event, i) => {
          const start = event.start.dateTime || event.start.date;
          console.log(`${start} - ${event.summary}`);
        });
      } else {
        console.log('No upcoming events found.');
      }
    });
  }
  // opCalendarLink = process.env.NODEMAILER_WTCT_PRODUCTION; // FOR STAGING PER OP CAL RENDERING
  // switch calendar link depending on OP logged in

  res.render('calendar', {
    viewTitle: 'Booking Calendar',
    eventList: events,
    opCalendarLink: opCalendarLink,
    userProfile: userProfile,
  });
});


module.exports = router;
