function notAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/auth/signin');
}
function Authenticated(req, res, next) {
    if (req.isAuthenticated() == false) {
      return next();
    }
    res.redirect('/');
}

module.exports = {Authenticated: Authenticated, notAuthenticated: notAuthenticated}