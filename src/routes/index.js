const express = require('express');

let router = express.Router();

router.get('/', (req, res, next) => {
  console.log('GET index');
  res.redirect('/example'); 
});

module.exports = router;
