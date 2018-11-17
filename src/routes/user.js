const express = require('express');
const db = require('../db');

let router = express.Router();

function getUsers() {
  let getUsers = `SELECT * FROM TubeUser;`;
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
    let insertNewUser = `INSERT INTO TubeUser VALUES
    ('${uName}', '${bio}', '${name}', '${email}', '${address}', '${postalCode}');`;
    return db.any(insertNewUser);
}

function updateBiography(uName, bio) {
    let updateBiography = `UPDATE TubeUser SET biography = '${bio}' WHERE uName = '${uName}' returning uName;`;
    return db.oneOrNone(updateBiography);
}

function deleteUserVideos(uName) {
    let deleteUserVideos = `DELETE FROM Video_PostedAt_Contains
    WHERE cName
    IN (SELECT cName
        FROM Channel_Owns_BelongsTo
        WHERE uName= '${uName}')
        returning cName;`;

    return db.any(deleteUserVideos);
}

function getFollowers(uName) {
    let sql = `
    SELECT follower_uName
    FROM   Follows
    WHERE  followed_uName = '${uName}'
    ;`;
    return db.any(sql);
}

function getCreepyFollowers() {
    let sql = `
    SELECT follower_uName FROM Follows as f 
    WHERE NOT EXISTS ((
        SELECT tu.uName FROM TubeUser tu) 
        EXCEPT (
            SELECT f2.Followed_uName FROM Follows as f2 
            WHERE f2.Follower_uName = f.Follower_uName)) 
    GROUP BY follower_uName;`;
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
  console.log('GET user');
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
                console.log("there was an error", err);
                res.render('user', {
                    users: null,
                    videos: null,
                    followers: null,
                    error: "There was an error creating a new user. Please ensure you have a unique username and a valid postal code."
                })});
    break;
    case "update-bio" : updateBiography(req.body["input-username"], req.body["input-bio"])
            .then(res => {
              if (res = null) {
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
                  console.log("there was an error", err);
                  res.render('user', {
                      users: null,
                      videos: null,
                      followers: null,
                      error: "There was an error updating the bio. Please ensure you have the correct username."
                  })});
    break;
    case "delete-user-vids" : deleteUserVideos(req.body["input-username"])
        .then(res => {
          if (res = null) {
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
              console.log("there was an error", err);
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
              res.render('user', {
                  users: null,
                  videos: null,
                  followers: followers
              })
          });
      break;
      case "get-creepy-followers" : getCreepyFollowers()
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
                  followers: followers
              })
            }
      });
      break;
    }});

module.exports = router;
