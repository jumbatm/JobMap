const express = require('express');
const router = express.Router();

// Map page.
router.get('/', function(req, res, next) {
  res.render('map', { address: req.query.address, keywords: req.query.keywords });
});

module.exports = router;
