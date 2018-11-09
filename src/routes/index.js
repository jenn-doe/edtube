const express = require('express');
const db = require('./../db');

let router = express.Router();

function getUsers() {
  var getUsers = "SELECT * FROM tubeUser";
  return db.any(getUsers);
}

router.get('/', (req, res, next) => {
  console.log('GET index');
  getUsers().then((results) => {
    res.render('index', {
      results: results
    });
  });
});

module.exports = router;
