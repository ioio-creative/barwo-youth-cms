const auth = require('./auth');
const { userRoles } = require('../models/User');
const { USER_DOES_NOT_HAVE_RIGHT } = require('../types/responses/auth');

// Make sure user's role is ADMIN.
// https://stackoverflow.com/questions/34468395/express-call-a-middleware-from-another-middleware
module.exports = function (req, res, next) {
  auth(req, res, _ => {
    if (req.user.role === userRoles.ADMIN && req.user.isEnabled !== false) {
      next();
    } else {
      // 403 forbidden
      res.status(403).json({ errors: [USER_DOES_NOT_HAVE_RIGHT] });
    }
  });
};
