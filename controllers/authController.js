const passport = require('passport');

module.exports = {
  whenGoogleLogin: (req, res, next) => {
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })(req, res, next);
  },
  
  whenGoogleCallbacks: (req, res, next) => {
    console.log('1')
    passport.authenticate('google', {
      failureRedirect: '/register'
    }, (err, user, info) => { 
      console.log('2')
      if (err) {
        console.log('3')
        return next(err); 
      }
      console.log('4')
      if (!user) {
        return res.redirect('/register'); 
      }
      console.log('5')
      console.log('Hii')
      req.session.currentUsername = user.username; 
      req.session.currentEmail = user.email; 
      req.session.userEmail = user.email; 
      req.session.loggedIn = true; 
      req.session.currentId = user._id ;
      return res.redirect('/account'); 
    })(req, res, next);
  }
};
