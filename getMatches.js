module.exports = {
  sendNewBookings() {
    const mongoose = require('mongoose');
    const Booking = mongoose.model('Booking');
    // const dt = require('./public/dates.js');
    const findObject = {bookingCreatedSent: false}; // find query object  '2019-12-14' works too

    Booking.find(findObject, /* rawSearchQuery,  */(err, docs) => {
      if (!err) {
        // count in collection
        // console.log(findObject);
        // console.log(docs);
        Booking.countDocuments(findObject, function(err, matchLength) {
          if (err) {
            return handleError(err);
          }
          if (matchLength != 0) {
            for (z = 0; z < matchLength; z++) {
              console.log('Found New Booking:', matchLength);

              const ops = require('./sendNewBookings.js');
              const calendar = require('./createCalendarEvents.js');
              const updates = require('./updateOPBookSent.js');
              // console.log('name:', docs[z].firstName); // prints each name
              // if (docs[z].clientReminderSent === false) {
              ops.sendNewBookingsToOperators(docs, z, envString);
              // create events
              calendar.createEvents(docs, z, envString);
              calendar.updateEventCreated(docs, z, envString);
              // update events column in db
              updates.updateBookingSentInDB(docs, z, envString);

              // };
            }
          } else {
            console.log('No New Bookings to send or update');
          }

          // and do some other fancy stuff
        });
      } else {
        console.log('Error in New Bookings Send :' + err);
      }
    });
  },
  // send client reminders
  clientReminders() {
    const mongoose = require('mongoose');
    const Booking = mongoose.model('Booking');
    const dt = require('./public/dates.js');

    const findObject = {tourDate: [dt.dateTomorrow()], clientReminderSent: false}; // find query object  '2019-12-14' works too

    Booking.find(findObject, /* rawSearchQuery,  */(err, docs) => {
      if (!err) {
        // count in collection
        // console.log(findObject);
        // console.log(docs);
        Booking.countDocuments(findObject, function(err, matchLength) {
          if (err) {
            return handleError(err);
          } // handle po ssible errors
          // console.log(findObject.toString());

          // console.log('len', matchLength);
          // console.log(docs[0].firstName);
          // console.log(docs.values);
          // remind clients
          if (matchLength != 0) {
            for (z = 0; z < matchLength; z++) {
              console.log('Found Clients to remind:', matchLength);

              // console.log('name:', docs[z].firstName); // prints each name
              // if (docs[z].clientReminderSent === false) {
              const clientRemind = require('./sendClientReminders.js');
              clientRemind.sendRemindClient(docs, z, envString);
              const updateReminders = require('./updateClientReminderSent.js');
              updateReminders.updateClientReminder(docs, z, envString);
              // };
            }
          } else {
            console.log('No client reminders to send or update');
          }

          // and do some other fancy stuff
        });
      } else {
        console.log('Error in reminders :' + err);
      }
    });
  },
  // op reminders
  reminderOperators() {
    const mongoose = require('mongoose');
    const Booking = mongoose.model('Booking');
    const dt = require('./public/dates.js');

    const findObject = {tourDate: [dt.dateTomorrow()], operatorName: {$ne: 'GC'}, remindOperators: false}; // find query object  '2019-12-14' works too

    Booking.find(findObject, /* rawSearchQuery,  */(err, docs) => {
      if (!err) {
        // count in collection
        // console.log(findObject);
        // console.log(docs);
        Booking.countDocuments(findObject, function(err, matchLength) {
          if (err) {
            return handleError(err);
          } // handle po ssible errors
          // console.log(findObject.toString());

          // console.log('len', matchLength);
          // console.log(docs[0].firstName);
          // console.log(docs.values);
          // remind clients
          if (matchLength != 0) {
            for (z = 0; z < matchLength; z++) {
              console.log('Found OPs to remind:', matchLength);

              // console.log('name:', docs[z].firstName); // prints each name
              // if (docs[z].clientReminderSent === false) {
              const remindOP = require('./sendOpReminders.js');
              remindOP.sendOperatorReminder(docs, z, envString);
              const updateOpRemind = require('./updateRemindOP.js');
              updateOpRemind.remindOperators(docs, z, envString);
              // };
            }
          } else {
            console.log('No OPs reminders to send or update');
          }

          // and do some other fancy stuff
        });
      } else {
        console.log('Error in OP reminders :' + err);
      }
    });
  },
  // guide reminders
  remindGCGuides() {
    const mongoose = require('mongoose');
    const Booking = mongoose.model('Booking');
    const dt = require('./public/dates.js');

    const findObject = {tourDate: [dt.dateTomorrow()], operatorName: 'GC', remindGoCapeGuides: false}; // find query object  '2019-12-14' works too

    Booking.find(findObject, /* rawSearchQuery,  */(err, docs) => {
      if (!err) {
        // count in collection
        // console.log(findObject);
        // console.log(docs);
        Booking.countDocuments(findObject, function(err, matchLength) {
          if (err) {
            return handleError(err);
          } // handle po ssible errors
          // console.log(findObject.toString());

          // console.log('len', matchLength);
          // console.log(docs[0].firstName);
          // console.log(docs.values);
          // remind clients
          if (matchLength != 0) {
            for (z = 0; z < matchLength; z++) {
              console.log('Found GC Tour Guides to remind:', matchLength);

              // console.log('name:', docs[z].firstName); // prints each name
              // if (docs[z].clientReminderSent === false) {
              const gcGuideRemind = require('./sendGCGuideReminders.js');
              gcGuideRemind.gcGuideSend(docs, z, envString);
              const updateGCGuideReminders = require('./updateGCGuideRemind.js');
              updateGCGuideReminders.updateGCGuideSent(docs, z, envString);
              // };
            }
          } else {
            console.log('No Tour GC Guides reminders to send or update');
          }

          // and do some other fancy stuff
        });
      } else {
        console.log('Error in reminders :' + err);
      }
    });
  },
  // request feedback
  sendCustomerFeedback() {
    const mongoose = require('mongoose');
    const Booking = mongoose.model('Booking');
    const dt = require('./public/dates.js');

    const findObject = {tourDate: [dt.dateYesterday()], feedbackSent: false}; // find query object  '2019-12-14' works too

    Booking.find(findObject, /* rawSearchQuery,  */(err, docs) => {
      if (!err) {
        // count in collection
        // console.log(findObject);
        // console.log(docs);
        Booking.countDocuments(findObject, function(err, matchLength) {
          if (err) {
            return handleError(err);
          } // handle po ssible errors
          // console.log(findObject.toString());

          // console.log('len', matchLength);
          // console.log(docs[0].firstName);
          // console.log(docs.values);
          // remind clients
          if (matchLength != 0) {
            for (z = 0; z < matchLength; z++) {
              console.log('Found Feedback to send:', matchLength);

              // console.log('name:', docs[z].firstName); // prints each name
              // if (docs[z].clientReminderSent === false) {
              const fbr = require('./sendClientFeedback.js');
              fbr.sendFeedbackRequests(docs, z, envString);
              const getFeedback = require('./updateFeedbackSent.js');
              getFeedback.updateSendFeedback(docs, z, envString);
              // };
            }
          } else {
            console.log('No feedback requests to send or update');
          }

          // and do some other fancy stuff
        });
      } else {
        console.log('Error in reminders :' + err);
      }
    });
  },
};

