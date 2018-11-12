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
    var deleteUserVideos = `DELETE FROM Video_PostedAt_Contains 
    WHERE cName 
    IN (SELECT cName 
        FROM Channel_Owns_BelongsTo
        WHERE uName= '${uName}');`;

    return db.any(deleteUserVideos);
}

// function viewUserVideos(uName) {
//     var viewUserVideos = `CREATE OR REPLACE VIEW videos AS
//     SELECT * FROM Video_PostedAt_Contains
//     WHERE cName IN (SELECT cName FROM Channel_Owns_BelongsTo
//                     WHERE uName = '${uName}');`;
//     return db.any(viewUserVideos);
// }

function getDataAndRender(res) {
  Promise.all([getUsers()])
    .then(([users]) => {
      res.render('user', {
        users: users,
          videos: null
      });
  });
}

// function getDataAndRenderVideos(res) {
//     Promise.all([getVidoes()])
//         .then(([videos]) => {
//             res.render('videos', {
//                 users: videos
//             });
//         });
// }

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
            .then(getUsers)
            .then(users => {
                res.render('user', {
                    users: users,
                    videos: null
                })});
    break;
    case "update-bio" : updateBiography(req.body["input-username"], req.body["input-bio"])
            .then(getUsers)
            .then(users => {
                res.render('user', {
                    users: users,
                    videos: null
                })});
    break;
    case "delete-user-vids" : deleteUserVideos(req.body["input-username"])
        .then();
    break;
      // case "get-videos-user" : viewUserVideos(req.body["input-username"])
      //     .then(getDataAndRender(res))
      //     .catch((err) => console.log(err));
      // break;
  }
});

module.exports = router;
