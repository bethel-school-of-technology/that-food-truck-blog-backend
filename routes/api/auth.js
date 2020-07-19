const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../../models/Users');

// // @route   GET api/auth
// // @desc    Test route
// //@access   Public

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server err');
  }
});

// @route   POST api/auth
// @desc    Authenticate user and get token (Login)
//@access   Public
router.post(
  '/',
  [
    check('email', 'Please provide a valid email').isEmail(),
    check('password', 'password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials ' }] });
      }

      //matching password to email
      const isMatch = await bcrypt.compare(password, user.password);
      //compare takes in plain text password(password) and encrypted(user.password) and make sure they are the same
      //also it will return a promise
      //checks to see if not a match will throw errors

      //security tip make sure that the error messages in line 48 === 61. if different will expose what the blackhat can target
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials ' }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      //console.error(err.message)
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
