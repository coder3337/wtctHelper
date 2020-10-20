const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: 'This field is required',
  },
  lastName: {
    type: String,
    required: 'This field is required',
  },
  tourType: {
    type: String,
    required: 'This field is required',
  },
  dateBooked: {
    type: String,
    required: 'This field is required',
  },
  tourDate: {
    type: String,
    required: 'This field is required',
  },
  pax: {
    type: String,
    required: 'This field is required',
  },
  phone: {
    type: String,
    // required: 'This field is required',
  },
  customerEmail: {
    type: String,
    required: 'This field is required',
  },
  pickupAddress: {
    type: String,
    required: 'This field is required',
  },
  operatorName: {
    type: String,
    required: 'This field is required',
  },
  paidStatus: {
    type: String,
    // required: 'This field is required',
  },
  notes: {
    type: String,
  },
  guidesName: {
    type: String,
  },
  guidesEmail: {
    type: String,
  },
  bookingCreatedSent: {
    type: Boolean,
  },
  calendarEventCreated: {
    type: Boolean,
  },
  clientReminderSent: {
    type: Boolean,
  },
  remindOperators: {
    type: Boolean,
  },
  remindGoCapeGuides: {
    type: Boolean,
  },
  feedbackSent: {
    type: Boolean,
  },
  referrer: {
    type: String,
  },
});

// Custom validation for email
bookingSchema.path('customerEmail').validate((val) => {
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(val);
}, 'Invalid e-mail.');

module.exports = mongoose.model('Booking', bookingSchema);
