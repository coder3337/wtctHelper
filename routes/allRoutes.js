const express = require('express');
const secured = require('../middleware/securedMiddle');
// eslint-disable-next-line new-cap
const router = express.Router();
const mongoose = require('mongoose');
const Booking = mongoose.model('Booking');
const dt = require('../public/dates.js');
const runTasks = require('../getMatches.js');

// setInterval(() => {
const taskNotificationMsg = 'Task ran';

console.log('Date tomorrow', dt.dateTomorrow());
// find new unsent bookings, send, create events and log TODO->add log for calendar and prevent duplicate events on editing
runTasks.sendNewBookings();
runTasks.clientReminders();
runTasks.reminderOperators();
runTasks.remindGCGuides();
runTasks.sendCustomerFeedback();
// ////////////
// working on notificaiotns
// do this next https://wanago.io/2019/06/17/using-push-notifications-with-service-workers-and-node-js/
console.log(taskNotificationMsg);


// ////////////
/*  gm.eventChecker();
  // updateEventColCandidates

  // create calendar events
  const calEvents = require('./createCalendarEvents.js');
  calEvents.createEvent();
  console.log('Created Calendar event'); */

// / end trigger
// }, 60000); // task trigger time 10000 = 10 seconds // 60 Minutes = 3600000 Milliseconds
router.get('/', (req, res, next) => {
  // const {_raw, _json, ...userProfile} = req.user;
  res.render('/', {
    taskNotificationMsg: 'taskNotificationMsg ran',

  });
});
/* GET user profile. */
router.get('/user', secured(), (req, res, next) => {
  // const {_raw, _json, ...userProfile} = req.user;
  const userProfile = req.user;
  res.render('user', {
    viewTitle: 'User Profile',
    name: userProfile.displayName,
    loggedInEmail: userProfile.emails[0].value,

    // userProfile: JSON.stringify(userProfile, null, 2),
    /*     userProfile: req.user,
    token: res.locals.token, */
  });
});


//  console.log(typeof events);
router.get('/calendar', secured(), (req, res, next) => {
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
  // opCalendarLink = process.env.NODEMAILER_WTCT_PRODUCTION; // FOR TESTING PER OP CAL RENDERING
  // switch calendar link depending on OP logged in

  res.render('calendar', {
    viewTitle: 'Booking Calendar',
    eventList: events,
    opCalendarLink: opCalendarLink,
    userProfile: userProfile,
  });
});


/* events.map((event, i) => {
                   const start = event.start.dateTime || event.start.date;
                   console.log(`${start} - ${event.summary} - ${event.htmlLink}`);
                 }); */

/*  else {
           console.log('No upcoming events found.');
           router.get('/calendar', secured(), (req, res, next) => {
             res.render('calendar', {
               viewTitle: 'Booking Calendar',
               // eventList: events,
             });
           });
         } */
// console.log(events);
// console.log(events);

// });

router.get('/add', secured(), (req, res, next) => {
  // const {_raw, _json, ...userProfile} = req.user;
  res.render('add', {
    viewTitle: 'Add New Booking',
    booking: req.body,
  });
});
// //////
router.get('/list', secured(), (req, res) => {
  Booking.find((err, docs) => {
    if (!err) {
      res.render('bookingsList', {
        viewTitle: 'All Bookings',
        // booking: req.body,
        list: docs,
        // count: docs.length,
      });
      // console.log(docs);
    } else {
      console.log('Error in retrieving bookings list :' + err);
    }
  }).sort({tourDate: 'descending'});
});
// ///////
router.get('/dashboard', secured(), (req, res) => {
  // const {_raw, _json, ...userProfile} = req.user;

  // res.send('running node api');
  // const {_raw, _json, ...userProfile} = req.user;
  res.render('dashboard', {
    viewTitle: 'Dashboard',
    // userProfile: JSON.stringify(userProfile),
    // name: userProfile.displayName,
    // loggedInUser: userProfile.emails[0].value,
    // userProfile: userProfile,
  });
});
// ///////
router.get('/edit/:id', secured(), (req, res) => {
  Booking.findById(req.params.id, (err, doc) => {
    if (!err) {
      res.render('edit', {
        viewTitle: 'Edit Booking',
        booking: doc,
      });
    }
  });
});
// ////////
router.get('/delete/:id', secured(), (req, res) => {
  Booking.findByIdAndRemove(req.params.id, (err, doc) => {
    if (!err/*  && confirmDelete==true */) {
      res.redirect('/list');
    } else {
      console.log('Error in employee delete :' + err);
    }
  });
});
// //////
// ////////
/*
router.get('/list/batchDelete', secured()).delete(function(req, res) {
  Booking.deleteMany(
      {
        _id: {$in: req.body.ids},
        // _id: {$in: [req.params.ids]},
    },
      function(err, rowsToDelete) {
        if (!err) {
          //console.log('rowsToDelete: ', rowsToDelete);
          res.send(rowsToDelete);
          res.redirect('/list');
        } else {
          res.send(err);
          console.log('Error in batch delete :' + err);
        }
      },
  );
}); */


// //////
router.get('/search/:q', secured(), (req, res) => {
  // works // const q = req.params.q;
  const q = req.query.q;
  // q = res.send(q);
  // q = JSON.stringify(q);
  // let result = req.params.q;

  // console.log(q);
  // const searchQuery = q; /* {email: /^$`{q}`/} || {fullName: /^$`{q}`/} || {email: /^$`{q}`/} || {mobile: /^$`{q}`/} || {city: /^$`{q}`/} */
  // var query = ;
  const result = {$or: [{firstName: {$regex: q}}, {lastName: {$regex: q}}, {customerEmail: {$regex: q}}, {tourDate: {$regex: q}}, {pickupAddress: {$regex: q}}, {guidesName: {$regex: q}}, {guidesEmail: {$regex: q}}, {notes: {$regex: q}}, {phone: {$regex: q}}, {tourType: {$regex: q}}]};
  // const result = {$or: [{fullName: {$regex: q}}, {email: {$regex: q}}]};
  // works // const result = { $or: [{ fullName: { $regex: q } }, { email: { $regex: q }}]};
  // { fullName: { $in: [q, email('q')] } }
  console.log(result);
  Booking.find(result, /* searchQuery,  */(err, docs) => {
    console.log(result);
    // res.sendFile('/views/bookingsList');
    if (!err) {
      res.render('bookingsList', {
        viewTitle: 'Search Results',
        list: docs,

      });
      // res.redirect('/results');
      // console.log(result);
    } else {
      console.log('Error  finding record :' + err);
    }
  }).sort({tourDate: 'descending'});
});


module.exports = router;
