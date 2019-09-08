const express = require('express');
const router = express.Router();

// Map page.
router.get('/', function(req, res, next) {
  res.render('map', { title: 'Results' });
});

module.exports = router;
