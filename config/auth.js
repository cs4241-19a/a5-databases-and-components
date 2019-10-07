module.exports = {
  shallNotPass: (req, res, next) => {
    if (req.isAuthenticated()) return next()
    req.flash('error_message', 'Not logged in!');
    res.redirect('/users/login');
  },
  shallPass: (req, res, next) => {
    if (!req.isAuthenticated()) return next()
    res.redirect('/home');      
  }
};
