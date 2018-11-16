const express = require('express');
const db = require('../db');

let router = express.Router();

function getUsers() {
  var getUsers = `SELECT * FROM TubeUser;`;
  return db.any(getUsers);
}

function getVideos() {
  var getVideos = `
    SELECT *
    FROM   TubeUser u, Channel_Owns_BelongsTo c, Video_PostedAt_Contains v
    WHERE  u.uName = c.uName
    AND    c.cName = v.cName
    ;`;
  return db.any(getVideos);
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

function getFolowers(uName) {
    var sql = `
    SELECT follower_uName
    FROM   Follows
    WHERE  followed_uName = '${uName}'
    ;`;
    return db.any(sql);
}

function getUserVideos(uName) {
    var sql = `
    SELECT *
    FROM   TubeUser u, Channel_Owns_BelongsTo c, Video_PostedAt_Contains v
    WHERE  u.uName = c.uName
    AND    c.cName = v.cName
    AND    u.uName = '${uName}'
    ;`;
    return db.any(sql);
}

router.get('/', (req, res, next) => {
  console.log('GET user');
  getUsers()
    .then(users => {
      res.render('user', {
        users: users,
        videos: null,
        followers: null
    });
  });
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
                    videos: null,
                    followers: null,
                    error: null
                })})
            .catch((err) => {
                console.log("there was an error", err)
                res.render('user', {
                    users: null,
                    videos: null,
                    followers: null,
                    error: "There was an error creating a new user. Please ensure you have a unique username and a valid postal code."
                })});
    break;
    case "update-bio" : updateBiography(req.body["input-username"], req.body["input-bio"])
            .then(getUsers)
            .then(users => {
                res.render('user', {
                    users: users,
                    videos: null,
                    followers: null,
                    error: null
                })
              })
              .catch((err) => {
                  console.log("there was an error", err)
                  res.render('user', {
                      users: null,
                      videos: null,
                      followers: null,
                      error: "There was an error updating the bio. Please ensure you have the correct username."
                  })});;
    break;
    case "delete-user-vids" : deleteUserVideos(req.body["input-username"])
        .then(getVideos)
        .then(videos => {
            res.render('user', {
                users: null,
                videos: videos,
                followers: null,
                error: null
            })
          })
          .catch((err) => {
              console.log("there was an error", err)
              res.render('user', {
                  users: null,
                  videos: null,
                  followers: null,
                  error: "There was an error deleting the users videos. Please ensure you have the correct username."
              })});;
    break;
    case "get-videos-user" : getUserVideos(req.body["input-username"])
        .then(videos => {
          res.render('user', {
            users: null,
            videos: videos,
            followers: null,
            error: null
          })
        })
        .catch((err) => {
            console.log("there was an error", err)
            res.render('user', {
                users: null,
                videos: null,
                followers: null,
                error: "There was an error getting the users videos. Please ensure you have the correct username."
            })});;
    break;
      case "get-followers" : getFolowers(req.body["input-username"])
          .then(followers => {
              res.render('user', {
                  users: null,
                  videos: null,
                  followers: followers
              })
          })
          .catch((err) => {
              console.log("there was an error", err)
              res.render('user', {
                  users: null,
                  videos: null,
                  followers: null,
                  error: "There was an error getting the users followers. Please ensure you have the correct username."
              })});

  }
});

module.exports = router;
