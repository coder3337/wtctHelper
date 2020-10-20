const mongoose = require('mongoose');
require('dotenv').config();
env = process.env.NODE_ENV;
envString = env;

/* const userProfile = req.user;
loggedInEmail = userProfile.emails[0].value,
console.log(loggedInEmail); */

// mongoDB connection string
const url = process.env['MONGO_DB_URL' + envString];
console.log(url);
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
    .then(() => {
      console.log('connected!', process.env.PORT || '8000');
    })
    .catch((err) => console.log(err));

// db.close();

require('./booking.model');
