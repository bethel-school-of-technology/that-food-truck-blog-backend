const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  // get token from header
  const token = req.header('x-auth-token');

  //check if no token
  if (!token) {
    console.log("no token")
    return res.status(401).json({ msg: 'Authorization denied' });
  }

  //verify token
  try {
    console.log("trying")
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    req.user = decoded.user;

    next();
  } catch (err) {
    console.log("error invalid token")
    res.status(401).json({ msg: 'token is not valid' });
  }
};
