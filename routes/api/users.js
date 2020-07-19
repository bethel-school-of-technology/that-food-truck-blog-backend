const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../../models/Users');

// @route   post api/users
// @desc    Register User
//@access   Public
router.post(
  '/',
  [
    check('name', 'Name is Required').not().isEmpty(),
    //  check takes in 2 params first is the field that we are looking for the 2nd is a custom msg
    // the rules are .not().isEmpty() this means we want the field to be there and not empty ie the
    // user must put in a value
    check('email', 'Please provide a valid email').isEmail(),
    // isEmail makes it a valid formatted email address @ and .com
    check(
      'password',
      'please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    // destructured req.body so we dont have to type it out each time

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }
      const avatar = gravatar.url(email, {
        s: '200', //size
        r: 'pg', //rating
        d: 'mm', // provides default img
      });

      //create instance of user
      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // bcrypt  hashing
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      // saves user to database
      await user.save();

      // JWT
      const payload = {
        user: {
          id: user.id,
          // mongodb for id uses _id but with mongoose they use extraction so we can do .id
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 3600 }, // token expires in 1hr this is optional
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
