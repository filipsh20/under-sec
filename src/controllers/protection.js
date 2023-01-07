function Authenticated(req, res, next) {
  if (req.isAuthenticated() == false) {
    return next();
  }
  res.redirect('/');
};

function notAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/signin');
};


module.exports = { Authenticated, notAuthenticated };