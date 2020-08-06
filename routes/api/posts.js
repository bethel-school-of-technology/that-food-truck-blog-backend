const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

//bring in middleware
const auth = require('../../middleware/auth');

// bring in models
const Post = require('../../models/Post');
const User = require('../../models/Users');
const { models } = require('mongoose');

// @route   POST api/posts
// @desc    create new blog post
//@access   Private
router.post(
  '/',
  [
    auth,
    [
      check('text', 'Text is required').not().isEmpty(),
      check('title', 'Title is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text: req.body.text,
        title: req.body.title,
        name: req.body.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.send(500).send('Server error');
    }
  }
);

// @route   GET api/posts
// @desc    GET all posts
//@access   Public

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.send(500).send('Server error');
  }
});

// @route   GET api/posts/:id
// @desc    GET posts by ID
//@access   Public

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(400).json({ msg: 'post not found' });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'post not found' });
    }
    res.send(500).send('Server error');
  }
});

// @route  put api/posts/:id
// @desc   update user's Blog
// @access   Private
router.put(
  '/:id',
  [
    auth,
    [
      check('text', 'Text is required').not().isEmpty(),
      check('title', 'Title is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { text, title, name, avatar, user } = req.body;
    const postFields = { text, title, name, avatar, user };

    try {
      let post = await Post.findOneAndUpdate(
        //filter
        { user: req.user.id },
        //update
        { $set: postFields },
        { new: true, upsert: true, returnNewDocument: true }
      );

      res.json(post);
    } catch (err) {
      // console.error(err.message);
      res.send(500).send('Server error');
    }
  }
);

// @route   DELETE api/posts/:id
// @desc    DELETE  post
//@access   Private!!

router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(400).json({ msg: 'post not found' });
    }

    //check user
    //post.user is NOT a string it is an object id || req.user is a string ||  .toString() turns post.user into a string.
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'user not authorized' });
    }

    await post.remove();

    res.json({ msg: 'post removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'post not found' });
    }
    res.send(500).send('Server error');
  }
});

module.exports = router;
