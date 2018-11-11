const express = require('express');
const db = require('../db');

let router = express.Router();

function getUsers() {
  var getUsers = `SELECT * FROM TubeUser`;
  return db.any(getUsers);
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
  let html_keys = Object.keys(req.body);
  console.log(html_keys);
  let operation = html_keys[html_keys.length - 1];

  switch (operation) {
    case "insert-user" : insertNewUser(req.body["input-username"], req.body["input-biography"], req.body["input-name"],
            req.body["input-email"], req.body["input-address"], req.body["input-postalcode"])
            .then(getDataAndRender(res))
            .catch((err) => console.log(err));
    break;
    case "update-bio" : updateBiography(req.body["input-username"], req.body["input-bio"])
            .then(getDataAndRender(res))
            .catch((err) => console.log(err));
    break;
    case "delete-user-vids" : deleteUserVideos(req.body["input-username"])
            .then(getDataAndRender(res))
            .catch((err) => console.log(err));
    break;
  }
});

module.exports = router;
