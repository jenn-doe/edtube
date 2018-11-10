const express = require('express');
const db = require('../db');

let router = express.Router();

function getUsers() {
  var getUsers = `SELECT * FROM TubeUser`;
  return db.any(getUsers);
}

function getPostalCodes() {
  var getPostalCodes = `SELECT * FROM PostalCode`;
  return db.any(getPostalCodes);
}

function getDataAndRender(res) {
  Promise.all([getUsers(), getPostalCodes()])
    .then(([users, postalcodes]) => {
      res.render('example', {
        users: users,
        postalcodes: postalcodes
      });
  });
}

router.get('/', (req, res, next) => {
  console.log('GET example');
  getDataAndRender(res);
});

function insertPostalCode(postalcode, city, province) {
  var insertPostalCode = `INSERT INTO PostalCode VALUES
    ('${postalcode}', '${city}', '${province}');`
  return db.any(insertPostalCode);
}

router.post('/', (req, res, next) => {
  console.log('POST example');
  insertPostalCode(req.body.postalcode, req.body.city, req.body.province)
    .then(getDataAndRender(res))
    .catch((err) => console.log(err));
});

module.exports = router;
