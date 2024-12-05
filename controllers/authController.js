const passport = require('passport');

module.exports = {
  whenGoogleLogin: (req, res, next) => {
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })(req, res, next);
  },
  
  whenGoogleCallbacks: (req, res, next) => {
    passport.authenticate('google', {
      failureRedirect: '/register'
    }, (err, user, info) => { 
      if (err) {
        return next(err); 
      }
      if (!user) {
        return res.redirect('/register'); 
      }
      req.session.currentUsername = user.username; 
      req.session.currentEmail = user.email; 
      req.session.userEmail = user.email; 
      req.session.loggedIn = true; 
      req.session.currentId = user._id ;
      return res.redirect('/'); 
    })(req, res, next);
  }
};
