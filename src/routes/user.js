const express = require('express');
const db = require('../db');

let router = express.Router();

function getUsers() {
  var getUsers = `SELECT * FROM TubeUser`;
  return db.any(getUsers);
}

function getDataAndRender(res) {
  Promise.all([getUsers()])
    .then(([users]) => {
      res.render('user', {
        users: users
      });
  });
}

router.get('/', (req, res, next) => {
  console.log('GET user');
  getDataAndRender(res);
});

router.post('/', (req, res, next) => {
  console.log('POST user');
  getDataAndRender(res);
});

module.exports = router;
