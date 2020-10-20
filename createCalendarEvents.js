module.exports = {
  createEvents: function(docs, z ) {
    (function() {
      const fs = require('fs');
      const {google} = require('googleapis');
      // const mongoose = require('mongoose');
      // const Booking = mongoose.model('Booking');
      const TOKEN_PATH = 'token.json';

      //  const findObject = { bookingCreatedSent: false }; // find query object  '2019-12-14' works too
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

      fs.readFile('./credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Calendar API.
        authorize(JSON.parse(content), createCalendarEntries);
      });
      /*  */

      // const gm = require('./getMatches.js');
      //  gm.findNewUnsent();

      // grabbing filtered selection and defining new let vars to use in function
      const calFName = docs[z].firstName;
      const calLName = docs[z].lastName;
      const tourDate = docs[z].tourDate;
      const calPax = docs[z].pax;
      const calPhone = docs[z].phone;
      const calAdd = docs[z].pickupAddress;
      const operatorCode = docs[z].operatorName;
      const calPaidStatus = docs[z].paidStatus;
      const calNotes = docs[z].notes;
      //   let bookSent = docs[y][11];
      // switch booking to address based on operator
      // let attendeeOPemail = '';
      //   let gcalendarID = '';
      if (operatorCode == 'AS') {
        operatorsBkColor = 2;
        attendeeOPemail = process.env['NODEMAILER_AS_' + envString];
        gcalendarID = process.env['GOOGLE_CALENDAR_ID_AS'];
      } else if (operatorCode == 'GC') {
        operatorsBkColor = 5;
        attendeeOPemail = process.env['NODEMAILER_GC_' + envString];
        gcalendarID = process.env['GOOGLE_CALENDAR_ID_GC'];
      } else if (operatorCode == 'AV') {
        operatorsBkColor = 9;
        attendeeOPemail = process.env['NODEMAILER_AV_' + envString];
        gcalendarID = process.env['GOOGLE_CALENDAR_ID_AV'];
      } else {
        console.log('no event color selected');
      }
      console.log(attendeeOPemail);
      console.log(gcalendarID);
      function createCalendarEntries(auth) {
        const calendar = google.calendar({version: 'v3', auth});

        authorize(function(err) {
          // console.log(operatorCode);

          const event = {
            'summary': calFName + ' x ' + calPax + 'pax',
            // 'location': '800 Howard St., San Francisco, CA 94103',
            'description': '<p>Date: ' + tourDate + '</p><p>Pickup: ' + calAdd + '<br>Name: ' + calFName + ' ' + calLName + '<br>Number: ' + calPhone + '<br>Pax: ' + calPax + '</p><p>Paid Status: ' + calPaidStatus + '</p><p>Notes: ' + calNotes + '</p>',
            'start': {
              'date': tourDate,
              'timeZone': 'Africa/Johannesburg',
            },
            'end': {
              'date': tourDate,
              'timeZone': 'Africa/Johannesburg',
            },
            /* 'recurrence': [
                            'RRULE:FREQ=DAILY;COUNT=1'
                        ], */
            'colorId': operatorsBkColor, // 2

            'attendees': [
              {'email': attendeeOPemail}], // can turn on and test when ready

            /* 'reminders': {
                            'useDefault': false,
                            'overrides': [
                                { 'method': 'email', 'minutes': 24 * 60 },
                                { 'method': 'popup', 'minutes': 10 },
                            ],
                        }, */
          };
            //   console.log(event.summary);
            // console.log("this", gm.findNewUnsent());

          calendar.events.insert( {
            auth: auth,
            calendarId: gcalendarID,
            //   timeZone: 'Johannesburg/GMT',
            resource: event,
          }, function(err, event) {
            if (err) {
              console.log('There was an error contacting the Calendar service while creating events: ' + err);
              return;
            }
            console.log('Event created: %s', `${event.htmlLink}`);
            // console.log(event)
          });
        });

        function authorize(callback) {
          //   'https://www.googleapis.com/auth/drive'
          //   'https://www.googleapis.com/auth/drive.file'
          //   'https://www.googleapis.com/auth/spreadsheets'


          const auth = 'https://www.googleapis.com/auth/calendar';

          if (auth == null) {
            console.log('authentication failed');
            return;
          }
          callback(auth);
        }
      }

      fs.readFile('./credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Sheets API.
        authorize(JSON.parse(content), listEvents);
      });
      function listEvents(auth) {
        const calendar = google.calendar({version: 'v3', auth});
        calendar.events.list({
          calendarId: 'primary',
          timeMin: (new Date()).toISOString(),
          maxResults: 10,
          singleEvents: true,
          orderBy: 'startTime',
        }, (err, res) => {
          if (err) return console.log('The API returned an error: ' + err);
          const events = res.data.items;
          if (events.length) {
            console.log('Upcoming 10 events:');
            events.map((event, i) => {
              const start = event.start.dateTime || event.start.date;
              console.log(`${start} - ${event.summary} - ${event.htmlLink}`);
            });
          } else {
            console.log('No upcoming events found.');
          }
        });
      }
    })(z);
  },


  updateEventCreated() {
    const mongoose = require('mongoose');
    const Booking = mongoose.model('Booking');
    findObject = {calendarEventCreated: false}; // find query object  '2019-12-14' works too
    update = {calendarEventCreated: true};

    Booking.findOneAndUpdate(findObject, update, {new: true}, (err, doc) => {
      console.log('calendar updated in db');
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
