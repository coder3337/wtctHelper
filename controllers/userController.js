// server/controllers/userController.js

const Booking = require('../model/booking.model');
const User = require('../model/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {roles} = require('../roles');

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function validatePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}


// grant access depending on useraccess role
exports.grantAccess = function(action, resource) {
  return async (req, res, next) => {
    try {
      const permission = roles.can(req.user.role)[action](resource);
      if (!permission.granted) {
        return res.render('login', {
          error: 'You don\'t have enough permission to perform this action',
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

// allow actions if logged in
exports.allowIfLoggedin = async (req, res, next) => {
  try {
    const user = res.locals.loggedInUser;
    if (!user) {
      return res.render('login', {
        error: 'You need to be logged in to access this route',
      });
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

// sign up
exports.signup = async (req, res, next) => {
  try {
    const {role, email, password} = req.body;
    const hashedPassword = await hashPassword(password);
    const newUser = new User({email, password: hashedPassword, role: role || 'basic'});
    const accessToken = jwt.sign({userId: newUser._id}, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    newUser.accessToken = accessToken;
    await newUser.save();
    res.render('login', {
      // viewTitle: 'Thanks! WTCT | REGISTER ',
      data: newUser,
      msg: 'You signed up successfully! An admin will activate your account soon.',
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email});

    if (!user) return next(new Error('Email does not exist'));
    const validPassword = await validatePassword(password, user.password);

    if (!validPassword) return next(new Error('Password is not correct'));
    const accessToken = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    await User.findByIdAndUpdate(user._id, {accessToken});
    // res.header('authorization', 'Bearer ' + [accessToken]);
    req.session.id = user._id;
    req.session.email = user.email;
    req.session.role = user.role;
    req.session.accessToken = accessToken;
    req.session.loggedInFor = Math.floor(Date.now() / 60e3);


    res.redirect('/dashboard', 301, {
      data: {email: user.email, role: user.role},
    });
  } catch (error) {
    next(error);
  }
};

// get one user
exports.getUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) return next(new Error('User does not exist'));
    // console.log(req.params);
    res.status(200).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// get MY bookings - all users
exports.getMyBookings = async (req, res, next) => {
  const email = req.session.email;
  // console.log('email', email);
  if (email == process.env['NODEMAILER_GC_' + envString]) {
    const OPinDB = 'GC';
    query = {operatorName: OPinDB};
  } else if (email == process.env['NODEMAILER_AS_' + envString]) {
    const OPinDB = 'AS';
    query = {operatorName: OPinDB};
  } else if (email == process.env['NODEMAILER_AV_' + envString]) {
    const OPinDB = 'AV';
    query = {operatorName: OPinDB};
    // console.log('OPinDB', OPinDB);
  } else {
    query = {};
  }
  try {
    await Booking.find(query, (err, docs) => {
    // await Booking.find({operatorName: 'AS'}, (err, docs) => {

      if (docs.length == 0 ) {
        res.render('bookingsList', {
          viewTitle: 'My Bookings',
          list: docs,
          warnMsg: 'You haven\'t added any bookings yet!',
        });
      } else {
        res.render('bookingsList', {
          viewTitle: 'My Bookings',
          list: docs,
        });
      }
    }).sort({tourDate: 'descending'});
  } catch (error) {
    next(error);
  }
/*   const users = await User.find({});
  res.status(200).json({
    data: users,
  }); */
};
// get MY agenda - all users
exports.getMyAgenda = async (req, res, next) => {
  const email = req.session.email;
  // console.log('email', email);
  if (email == process.env['NODEMAILER_GC_' + envString]) {
    const OPinDB = 'GC';
    query = {operatorName: OPinDB};
  } else if (email == process.env['NODEMAILER_AS_' + envString]) {
    const OPinDB = 'AS';
    query = {operatorName: OPinDB};
  } else if (email == process.env['NODEMAILER_AV_' + envString]) {
    const OPinDB = 'AV';
    query = {operatorName: OPinDB};
    // console.log('OPinDB', OPinDB);
  } else {
    query = {};
  }
  try {
    await Booking.find(query, (err, docs) => {
      // await Booking.find({operatorName: 'AS'}, (err, docs) => {

      if (docs.length == 0) {
        res.render('bookingsList', {
          viewTitle: 'My Agenda',
          list: docs,
          warnMsg: 'You haven\'t added any bookings yet!',
        });
      } else {
        res.render('agenda', {
          viewTitle: 'My Agenda',
          list: docs,
        });
      }
    }).sort({tourDate: 'descending'});
  } catch (error) {
    next(error);
  }
};
// get MY bookings - all users
exports.getBookingsMadeToday = async (req, res, next) => {
  const dt = require('../public/dates');

  const email = req.session.email;
  // console.log('email', email);
  if (email == process.env['NODEMAILER_GC_' + envString]) {
    const OPinDB = 'GC';
    query = {$and: [{dateBooked: dt.today()}, {operatorName: OPinDB}]};
  } else if (email == process.env['NODEMAILER_AS_' + envString]) {
    const OPinDB = 'AS';
    query = {$and: [{dateBooked: dt.today()}, {operatorName: OPinDB}]};
  } else if (email == process.env['NODEMAILER_AV_' + envString]) {
    const OPinDB = 'AV';
    query = {$and: [{dateBooked: dt.today()}, {operatorName: OPinDB}]};
    // console.log('OPinDB', OPinDB);
  } else {
    query = {dateBooked: dt.today()};
  }
  // console.log(dt.today());
  try {
    await Booking.find(query, (err, docs) => {
      // await Booking.find({operatorName: 'AS'}, (err, docs) => {

      if (docs.length == 0) {
        res.render('agenda', {
          viewTitle: 'Todays New Bookings',
          list: docs,
          warnMsg: 'No New Bookings Made Today :disappointed:',
        });
      } else {
        res.render('agenda', {
          viewTitle: 'Todays New Bookings',
          list: docs,
        });
      }
    }).sort({tourDate: 'descending'});
  } catch (error) {
    next(error);
  }
};

// get all users
exports.getUsers = async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({
    data: users,
  });
};

// get batch delete
exports.getBatchDelete = async (req, res, next) => {
  const {ids} = req.body;
  await Booking.deleteMany(
      {
        _id: {$in: ids},
      },
      function(err, result) {
        if (err) {
          res.send(err);
        } else {
          return res.redirect('/my-bookings');
        }
      },
  );
};

// get batch delete
exports.getDeleteOneBooking = async (req, res, next) => {
  Booking.findByIdAndRemove(req.params.id, (err, doc) => {
    if (!err) {
      res.redirect('/my-bookings');
    } else {
      console.log('Error in employee delete :' + err);
    }
  });
};

// get search
exports.getSearch = async (req, res, next) => {
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
  })
      .sort({tourDate: 'descending'});
};

// add new booking
exports.addNewBooking = async (req, res, next) => {
  insertRecord(req, res);
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
};
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

// edit/update booking
exports.updateBooking = async (req, res, next) => {
  updateRecord(req, res);
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
};

// update one user
exports.updateUser = async (req, res, next) => {
  try {
    const update = req.body;
    const userId = req.params.userId;
    await User.findByIdAndUpdate(userId, update);
    const user = await User.findById(userId);
    res.status(200).json({
      data: user,
      message: 'User has been updated',
    });
  } catch (error) {
    next(error);
  }
};

// deleted one user
exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    await User.findByIdAndDelete(userId);
    res.status(200).json({
      data: null,
      message: 'User has been deleted',
    });
  } catch (error) {
    next(error);
  }
};

