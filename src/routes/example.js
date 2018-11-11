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
    ('${postalcode}', '${city}', '${province}');`;
  return db.any(insertPostalCode);
}

function insertNewUser(uName, bio, name, email, address, postalCode) {
    var insertNewUser = `INSERT INTO TubeUser VALUES
    ('${uName}', '${bio}', '${name}', '${email}', '${address}', '${postalCode}');`;
    return db.any(insertNewUser);
}

function updateBiography(uName, bio) {
    var updateBiography = `UPDATE TubeUser SET biography = '${bio}' WHERE uName = '${uName}';`;
    return db.any(updateBiography);
}

function deleteUserVideos(uName) {
    var deleteUserVideos = `DELETE FROM Video_PostedAt_Contains WHERE uName = '${uName}';`;
    return db.any(deleteUserVideos);
}

router.post('/', (req, res, next) => {
  console.log(req.body);
  let html_keys = Object.keys(req.body);
  let operation = html_keys[html_keys.length - 1];
  console.log(operation);

  switch (operation) {
      case "insertPCode" : insertPostalCode(req.body.postalcode, req.body.city, req.body.province)
          .then(getDataAndRender(res))
          .catch((err) => console.log(err));
      break;
      case "insertUser" : insertNewUser(req.body.uName, req.body.bio, req.body.name, req.body.email,
          req.body.address, req.body.postalCode)
          .then(getDataAndRender(res))
          .catch((err) => console.log(err));
      break;
      case "updateBiography" : updateBiography(req.body.uName, req.body.bio)
          .then(getDataAndRender(res))
          .catch((err) => console.log(err));
      break;
      case "deleteUserAllVideos" : deleteUserVideos(req.body.uName)
          .then(getDataAndRender(res))
          .catch((err) => console.log(err));
      break;
  }

});

module.exports = router;
