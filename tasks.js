module.exports = {

  sendNewBookings() {
    const mongoose = require('mongoose');
    const Booking = mongoose.model('Booking');
    // const dt = require('./public/dates.js');
    const findObject = {bookingCreatedSent: false}; // find query object  '2019-12-14' works too

    Booking.find(findObject, (err, docs) => {
      if (!err) {
        Booking.countDocuments(findObject, function(err, matchLength) {
          if (err) {
            return handleError(err);
          }
          if (matchLength != 0) {
            for (z = 0; z < matchLength; z++) {
              console.log('Found New Booking:', matchLength);

              const ops = require('./controllers/workers/sendNewBookings.js');
              const calendar = require('./controllers/workers/createCalendarEvents.js');
              const updates = require('./controllers/workers/updateOPBookSent.js');

              ops.sendNewBookingsToOperators(docs, z, envString);
              calendar.createEvents(docs, z, envString);
              calendar.updateEventCreated(docs, z, envString);
              updates.updateBookingSentInDB(docs, z, envString);
            }
          } else {
            console.log('No New Bookings to send or update');
          }
        });
      } else {
        console.log('Error in New Bookings Send :' + err);
      }
    });
  },


  clientReminders() {
    const mongoose = require('mongoose');
    const Booking = mongoose.model('Booking');
    const dt = require('./public/dates.js');

    const findObject = {tourDate: [dt.dateTomorrow()], clientReminderSent: false}; // find query object  '2019-12-14' works too

    Booking.find(findObject, (err, docs) => {
      if (!err) {
        Booking.countDocuments(findObject, function(err, matchLength) {
          if (err) {
            return handleError(err);
          }
          if (matchLength != 0) {
            for (z = 0; z < matchLength; z++) {
              console.log('Found Clients to remind:', matchLength);
              const clientRemind = require('./controllers/workers/sendClientReminders.js');
              clientRemind.sendRemindClient(docs, z, envString);
              const updateReminders = require('./controllers/workers/updateClientReminderSent.js');
              updateReminders.updateClientReminder(docs, z, envString);
            }
          } else {
            console.log('No client reminders to send or update');
          }
        });
      } else {
        console.log('Error in reminders :' + err);
      }
    });
  },


  reminderOperators() {
    const mongoose = require('mongoose');
    const Booking = mongoose.model('Booking');
    const dt = require('./public/dates.js');

    const findObject = {tourDate: [dt.dateTomorrow()], operatorName: {$ne: 'GC'}, remindOperators: false}; // find query object  '2019-12-14' works too

    Booking.find(findObject, (err, docs) => {
      if (!err) {
        Booking.countDocuments(findObject, function(err, matchLength) {
          if (err) {
            return handleError(err);
          }
          if (matchLength != 0) {
            for (z = 0; z < matchLength; z++) {
              console.log('Found OPs to remind:', matchLength);
              const remindOP = require('./controllers/workers/sendOpReminders.js');
              remindOP.sendOperatorReminder(docs, z, envString);
              const updateOpRemind = require('./controllers/workers/updateRemindOP.js');
              updateOpRemind.remindOperators(docs, z, envString);
              // };
            }
          } else {
            console.log('No OPs reminders to send or update');
          }
        });
      } else {
        console.log('Error in OP reminders :' + err);
      }
    });
  },


  remindGCGuides() {
    const mongoose = require('mongoose');
    const Booking = mongoose.model('Booking');
    const dt = require('./public/dates.js');

    const findObject = {tourDate: [dt.dateTomorrow()], operatorName: 'GC', remindGoCapeGuides: false}; // find query object  '2019-12-14' works too

    Booking.find(findObject, /* rawSearchQuery,  */(err, docs) => {
      if (!err) {
        Booking.countDocuments(findObject, function(err, matchLength) {
          if (err) {
            return handleError(err);
          }
          if (matchLength != 0) {
            for (z = 0; z < matchLength; z++) {
              console.log('Found GC Tour Guides to remind:', matchLength);
              const gcGuideRemind = require('./controllers/workers/sendGCGuideReminders.js');
              gcGuideRemind.gcGuideSend(docs, z, envString);
              const updateGCGuideReminders = require('./controllers/workers/updateGCGuideRemind.js');
              updateGCGuideReminders.updateGCGuideSent(docs, z, envString);
              // };
            }
          } else {
            console.log('No Tour GC Guides reminders to send or update');
          }
        });
      } else {
        console.log('Error in reminders :' + err);
      }
    });
  },


  sendCustomerFeedback() {
    const mongoose = require('mongoose');
    const Booking = mongoose.model('Booking');
    const dt = require('./public/dates.js');

    const findObject = {tourDate: [dt.dateYesterday()], feedbackSent: false};

    Booking.find(findObject, /* rawSearchQuery,  */(err, docs) => {
      if (!err) {
        Booking.countDocuments(findObject, function(err, matchLength) {
          if (err) {
            return handleError(err);
          }
          if (matchLength != 0) {
            for (z = 0; z < matchLength; z++) {
              console.log('Found Feedback to send:', matchLength);
              const fbr = require('./controllers/workers/sendClientFeedback.js');
              fbr.sendFeedbackRequests(docs, z, envString);
              const getFeedback = require('./controllers/workers/updateFeedbackSent.js');
              getFeedback.updateSendFeedback(docs, z, envString);
            }
          } else {
            console.log('No feedback requests to send or update');
          }
        });
      } else {
        console.log('Error in reminders :' + err);
      }
    });
  },
};
