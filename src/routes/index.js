const express = require('express');
const db = require('../db');
const tables = require('../tables');

let router = express.Router();

router.get('/', (req, res, next) => {
  console.log('GET index');
  res.redirect('/example'); 
});

module.exports = router;
