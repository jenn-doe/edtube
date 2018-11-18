const express = require('express');
const db = require('../db');

let router = express.Router();

function getUsers() {
  let getUsers = `SELECT * FROM TubeUser;`;
  return db.any(getUsers);
}

function getVideos() {
  // Deliverable 5
  var getVideos = `
    SELECT *
    FROM   TubeUser u, Channel_Owns_BelongsTo c, Video_PostedAt_Contains v
    WHERE  u.uName = c.uName
    AND    c.cName = v.cName
    ;`;
  return db.any(getVideos);
}

function insertNewUser(uName, bio, name, email, address, postalCode) {
    // Deliverable 2
    let insertNewUser = `INSERT INTO TubeUser VALUES
    ('${uName}', '${bio}', '${name}', '${email}', '${address}', '${postalCode}');`;
    return db.any(insertNewUser);
}

function updateBiography(uName, bio) {
    // Deliverable 4
    let updateBiography = `UPDATE TubeUser SET biography = '${bio}' WHERE uName = '${uName}' returning uName;`;
    return db.oneOrNone(updateBiography);
}

function deleteUserVideos(uName) {
    // Deliverable 3
    let deleteUserVideos = `
    DELETE FROM Video_PostedAt_Contains
    WHERE cName
    IN (SELECT cName
        FROM Channel_Owns_BelongsTo
        WHERE uName= '${uName}')
    returning cName;`;

    return db.any(deleteUserVideos);
}

function getFollowers(uName) {
    // Deliverable 8
    let sql = `
    SELECT follower_uName
    FROM   Follows
    WHERE  followed_uName = '${uName}';`;
    return db.any(sql);
}

function getCreepyFollowers() {
    let sql = `
    SELECT DISTINCT(follower_uName) FROM Follows f
    WHERE NOT EXISTS (
        (SELECT tu.uName FROM TubeUser tu)
        EXCEPT
        (SELECT f2.Followed_uName FROM Follows f2
         WHERE f2.Follower_uName = f.Follower_uName)
    );`;
    return db.any(sql);
}

function getUserVideos(uName) {
    let sql = `
    SELECT *
    FROM   TubeUser u, Channel_Owns_BelongsTo c, Video_PostedAt_Contains v
    WHERE  u.uName = c.uName
    AND    c.cName = v.cName
    AND    u.uName = '${uName}'
    ;`;
    return db.any(sql);
}

router.get('/', (req, res, next) => {
  getUsers()
    .then(users => {
      res.render('user', {
        users: users,
        videos: null,
        followers: null,
        error: null
    });
  });
});

router.post('/', (req, res, next) => {
  let html_keys = Object.keys(req.body);
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
                res.render('user', {
                    users: null,
                    videos: null,
                    followers: null,
                    error: "There was an error creating a new user. Please ensure you have a unique username and a valid postal code."
                })});
    break;
    case "update-bio" : updateBiography(req.body["input-username"], req.body["input-bio"])
            .then(res => {
              console.log(res)
              if (res == null) {
                throw new Error
              }
            })
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
                  res.render('user', {
                      users: null,
                      videos: null,
                      followers: null,
                      error: "There was an error updating the bio. Please ensure you have the correct username."
                  })});
    break;
    case "delete-user-vids" : deleteUserVideos(req.body["input-username"])
        .then(res => {
          console.log(res)
          if (res < 1) {
            throw new Error
          }
        })
        .then(getVideos)
        .then(videos => {
          if (videos < 1) {
            res.render('user', {
                users: null,
                videos: null,
                followers: null,
                error: "There were no videos returned"
            })
          } else {
            res.render('user', {
                users: null,
                videos: videos,
                followers: null,
                error: null
            })
          }
          })
          .catch((err) => {
              res.render('user', {
                  users: null,
                  videos: null,
                  followers: null,
                  error: "There was an error deleting the users videos. Please ensure you have the correct username."
              })});
    break;
    case "get-videos-user" : getUserVideos(req.body["input-username"])
        .then(videos => {
          if (videos < 1) {
            res.render('user', {
                users: null,
                videos: null,
                followers: null,
                error: "This user has no videos. If you think this is in error, please ensure you have the correct username."
            })
          } else {
            res.render('user', {
              users: null,
              videos: videos,
              followers: null,
              error: null
            })
          }
        });
    break;
      case "get-followers" : getFollowers(req.body["input-username"])
          .then(followers => {
            if (followers < 1) {
              res.render('user', {
                  users: null,
                  videos: null,
                  followers: null,
                  error: "This user has no followers. If you think this is in error, please ensure you have the correct username."
              })
            } else {
              res.render('user', {
                  users: null,
                  videos: null,
                  followers: followers,
                  error: null
              })
            }
          });
      break;
      case "get-creepy-followers" : getCreepyFollowers()
          .then(followers => {
            if (followers < 1) {
              res.render('user', {
                  users: null,
                  videos: null,
                  followers: null,
                  error: "We couldn't find a user who follows all other users."
              })
            } else {
              res.render('user', {
                  users: null,
                  videos: null,
                  followers: followers,
                  error: null
              })
            }
      });
      break;
    }});

module.exports = router;
