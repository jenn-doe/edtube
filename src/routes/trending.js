const express = require('express');
const db = require('../db');

let router = express.Router();

router.get('/', (req, res, next) => {
  console.log('GET trending');
  res.render('trending', {
    channels: null,
    topcat: null
  });
});

function getChannelsFromPostalCode(postalCode) {
  const sql = `
    SELECT c.cName, c.description, u.uName
    FROM   PostalCode p, TubeUser u, Channel_Owns_BelongsTo c
    WHERE  p.postalCode = u.postalCode
    AND    u.uName = c.uName
    AND    p.postalCode = '${postalCode}'
    ;`;
  return db.any(sql);
}

function getTopCategory() {
  const sql = `
  CREATE OR REPLACE VIEW TopCategories AS 
  SELECT   cat.catName, cat.description, COUNT(*) AS COUNT
  FROM     Category cat, Classified cl, Video_PostedAt_Contains v
  WHERE    cat.catName = cl.catName
  AND      cl.vid = v.vid
  GROUP BY cat.catName, cat.description;

  SELECT *
  FROM   TopCategories tc
  WHERE  tc.count IN (
      SELECT MAX(COUNT) FROM TopCategories
  );
  `
  return db.any(sql);
}

router.post('/', (req, res, next) => {
  console.log('POST trending');
  let html_keys = Object.keys(req.body);
  let operation = html_keys[html_keys.length - 1];

  switch (operation) {
    case "get-channels" : 
      getChannelsFromPostalCode(req.body["input-postalcode"])
        .then(channels => {
          res.render('trending', {
            channels: channels,
            topcat: null
          })});
      break;
    case "get-category" :
      getTopCategory()
        .then(topcat => {
          res.render('trending', {
            channels: null,
            topcat: topcat
          });
        });
      break;
  }
});

module.exports = router;
