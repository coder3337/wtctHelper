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

// get one user
exports.add = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) return next(new Error('User does not exist'));
    // console.log(req.params);
    res.send(200).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// get all users
exports.getAllBookings = async (req, res, next) => {
  try {
    await Booking.find((err, docs) => {
      // if (!allBookings) return next(new Error('Nothing Found..'));

      if (!err) {
        res.render('bookingsList', {
          viewTitle: 'All Bookings',
          list: docs,
        });
      } else {
        console.log('Error in retrieving bookings list :' + err);
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


// get all users
exports.getUsers = async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({
    data: users,
  });
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

