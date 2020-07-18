const express = require('express');
const router = express.Router();

// @route   GET api/admin
// @desc    Test Route
// @access  Private
router.get('/', (req, res) => res.send('Admin Route'));

module.exports = router;
