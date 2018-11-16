const express = require("express");
const db = require("../db");

let router = express.Router();

function getPlaylist() {
  var sql = `SELECT * FROM Playlist_Creates;`;
  return db.any(sql);
}

function deletePlaylist(pName, uName) {
  var playlistToDelete = `DELETE FROM Playlist_Creates 
    WHERE pName = '${pName}' AND uName = '${uName}' 
    RETURNING uName;`;
  return db.oneOrNone(playlistToDelete);
}

function getVideosInPlaylist(pName, uName) {
  var playlistToGet = `SELECT Video_PostedAt_Contains.vID AS vID, Video_PostedAt_Contains.description, Video_PostedAt_Contains.playtime
    FROM Video_PostedAt_Contains
    INNER JOIN PartOf ON PartOf.vID=Video_PostedAt_Contains.vID
    WHERE PartOf.uName = '${uName}' AND PartOf.pName = '${pName}';`;
  return db.any(playlistToGet);
}

function getNumVideosPerChannel(pName, uName) {
  var playlistToGetChannelsFor = `SELECT Count(*), Video_PostedAt_Contains.cName
    FROM PartOf
    INNER JOIN Video_PostedAt_Contains ON PartOf.vID=Video_PostedAt_Contains.vID
    WHERE PartOf.pName = '${pName}' AND PartOf.uName = '${uName}'
    GROUP BY Video_PostedAt_Contains.cName;`;
  return db.any(playlistToGetChannelsFor);
}

router.get("/", (req, res, next) => {
  getPlaylist().then(allPlaylists => {
    res.render("playlist", {
      numPerChan: null,
      vidsInPlaylist: null,
      allPlaylists: allPlaylists,
      error: null
    });
  });
});

router.post("/", (req, res, next) => {
  let html_keys = Object.keys(req.body);
  let operation = html_keys[html_keys.length - 1];

  switch (operation) {
    case "get-num-vids-per-channel-in-playlist":
      getNumVideosPerChannel(req.body["input-pname"], req.body["input-uname"])
        .then(numperChan => {
          if (numperChan.length < 1) {
            throw new Error();
          } else {
            res.render("playlist", {
              numPerChan: numperChan,
              vidsInPlaylist: null,
              allPlaylists: null,
              error: null
            });
          }
        })
        .catch(err => {
          res.render("playlist", {
            users: null,
            videos: null,
            followers: null,
            error:
              "There are no videos in this playlist. If you think this is an error, please ensure you have the correct username and playlist."
          });
        });
      break;
    case "get-vids-from-playlist":
      getVideosInPlaylist(req.body["input-pname"], req.body["input-uname"])
        .then(vidsInPlaylist => {
          if (vidsInPlaylist.length < 1) {
            throw new Error();
          } else {
            res.render("playlist", {
              numPerChan: null,
              vidsInPlaylist: vidsInPlaylist,
              allPlaylists: null,
              error: null
            });
          }
        })
        .catch(err => {
          res.render("playlist", {
            users: null,
            videos: null,
            followers: null,
            error:
              "There was an error getting the videos. Please ensure you have the correct username and playlist."
          });
        });
      break;
    case "delete-playlist":
      deletePlaylist(req.body["input-pname"], req.body["input-uname"])
        .then(res => {
          if (res == null) {
            throw new Error();
          }
        })
        .then(getPlaylist)
        .then(allPlaylists => {
          res.render("playlist", {
            numPerChan: null,
            vidsInPlaylist: null,
            allPlaylists: allPlaylists,
            error: null
          });
        })
        .catch(err => {
          res.render("playlist", {
            users: null,
            videos: null,
            followers: null,
            error:
              "There was an error deleting the playlist. Please ensure you have the correct username and playlist."
          });
        });
      break;
  }
});

module.exports = router;
