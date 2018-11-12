const express = require('express');
const db = require('../db');

let router = express.Router();

function getMyChannels() {
  const sql = `
  SELECT * FROM JulezChannels;
  `;
  return db.any(sql);
}

router.get('/', (req, res, next) => {
  console.log('GET trending');
  getMyChannels()
    .then(channels => {
      res.render('myChannels', {
        channels: channels
      });
    });  
});

module.exports = router;
