const express = require('express');
const db = require('../db');

let router = express.Router();

function getChannels() {
  var sql = `SELECT * FROM Channel_Owns_BelongsTo`;
  return db.any(sql);
}

function getDataAndRender(res) {
  Promise.all([getChannels])
    .then(([channels]) => {
      res.render('trending', {
        channels: channels
      });
  });
}

router.get('/', (req, res, next) => {
  console.log('GET trending');
  getDataAndRender(res);
});

router.post('/', (req, res, next) => {
  console.log('POST trending');
  getDataAndRender(res);
});

module.exports = router;
