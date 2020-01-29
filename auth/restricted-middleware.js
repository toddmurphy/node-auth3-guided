const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/secrets');

module.exports = (req, res, next) => {
  //grab the token from the headers
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, jwtSecret, (error, decodedToken) => {
      if (error) {
        // the token is not valid
        res.status(401).json({ message: 'Sorry, token not valid' });
      } else {
        next();
      }
    });
  } else {
    res.status(401).json({ message: 'You shall not pass!' });
  }
};
