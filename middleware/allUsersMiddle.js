module.exports = function() {
  return function(req, res, next) {
    // const userProfile = req.user;
    

    // res.locals.user = req.user;
    res.locals = {
      // count: count,
      // userProfile: userProfile,
      // email: req.emails,
      // userProfile: JSON.stringify(userProfile, null, 2),
      title: 'My App',
      publicGlobalToken: '1234',
      taskNotificationMsg: 'taskNotificationMsg ran',
      isAuthenticated: req.isAuthenticated(),

      // userProfile: req.user,
      // loggedInEmail: userProfile.emails[0].value,
      // userProfile: req.user,

      // loggedInEmail: '',
      // userProfile: req.user,
      // name: userProfile.displayName,
      // loggedInUser: userProfile.emails[0].value,
    };
    // console.log('locals:', res.locals);
    // res.locals.profile = JSON.stringify(userProfile, null, 2),
    next();
  }; // });
};
