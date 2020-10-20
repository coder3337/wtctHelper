const express = require('express');
const router = express.Router();
/* GET home page. */
router.get('/', /* secured, */(req, res, next) => {
  // const {_raw, _json, ...userProfile} = req.user;
  res.render('index', {
    viewTitle: 'Welcome to WINE BOOK HELPER',
    /*     userProfile: userProfile,
        loggedInEmail: userProfile.emails[0], */
    // test: test,

  });
});
module.exports = router;
