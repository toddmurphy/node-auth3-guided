const router = require('express').Router();
const jwt = require('jsonwebtoken');
// const secret = require('../config/secrets');
const { jwtSecret } = require('../config/secrets');
const bcrypt = require('bcryptjs');

const Users = require('../users/users-model.js');

// for endpoints beginning with /api/auth
router.post('/register', (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        //create the token
        const token = signToken(user);

        // the server needs to return the token to the client
        res.status(200).json({
          message: `Welcome ${user.username}!, we have a token:${token}`
        });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

function signToken(user) {
  const payload = {
    userID: user.id,
    username: user.username
    //add any other data we want to store in token payload
  };

  const options = {
    expiresIn: '1d' //check documentation for other options available
  };

  // extract the secret away so it can be required and used where needed

  return jwt.sign(payload, jwtSecret, options);
}

module.exports = router;
