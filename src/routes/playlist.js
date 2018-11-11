const express = require('express');
const db = require('../db');

let router = express.Router();

function getPlaylist() {
  var sql = `SELECT * FROM Playlist_Creates`;
  return db.any(sql);
}

function getDataAndRender(res) {
  Promise.all([getPlaylist()])
    .then(([playlists]) => {
      res.render('playlist', {
        playlists: playlists,
      });
  });
}

router.get('/', (req, res, next) => {
  console.log('GET playlist');
  getDataAndRender(res);
});

router.post('/', (req, res, next) => {
  console.log('POST example');
  getDataAndRender(res);
});

module.exports = router;
