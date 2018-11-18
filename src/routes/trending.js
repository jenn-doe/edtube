const express = require("express");
const db = require("../db");

let router = express.Router();

router.get("/", (req, res, next) => {
  getAllChannels().then(allchannels => {
    res.render("trending", {
      channels: null,
      topcat: null,
      allchannels: allchannels,
      error: null
    });
  });
});

function getChannelsFromPostalCode(postalCode) {
  const sql = `
    SELECT c.cName, c.description, u.uName
    FROM   TubeUser u, Channel_Owns_BelongsTo c
    WHERE  u.uName = c.uName
    AND    u.postalCode = '${postalCode}'
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
  `;
  return db.any(sql);
}

function getAllChannels() {
  const sql = `
  SELECT c.cName, c.description, u.uName
  FROM   TubeUser u, Channel_Owns_BelongsTo c
  WHERE  u.uName = c.uName;
  `;
  return db.any(sql);
}

router.post("/", (req, res, next) => {
  let html_keys = Object.keys(req.body);
  let operation = html_keys[html_keys.length - 1];

  switch (operation) {
    case "get-channels":
      getChannelsFromPostalCode(req.body["input-postalcode"])
      .then(channels => {
        if (channels < 1) {
          res.render('trending', {
              users: null,
              videos: null,
              followers: null,
              error: "There were no channels for this postalcode. If you think this is in error, please ensure the postalcode is valid."
          })
        } else {
          res.render("trending", {
            channels: channels,
            topcat: null,
            allchannels: null,
            error: null
          })}
      });
      break;
    case "get-category":
      getTopCategory()
        .then(topcat => {
          if (topcat < 1) {
            res.render('trending', {
                users: null,
                videos: null,
                followers: null,
                error: "There was no top category."
            })
          } else {
            res.render("trending", {
              channels: null,
              topcat: topcat,
              allchannels: null,
              error: null
            });
          }
        });
      break;
    case "get-all-channels":
      getAllChannels()
        .then(allchannels => {
          if (allchannels < 1) {
            res.render("trending", {
              channels: null,
              topcat: null,
              allchannels: allchannels,
              error: null
            })
          } else {
            res.render('trending', {
                users: null,
                videos: null,
                followers: null,
                error: "There are no channels to display."
            })
          }
      });
      break;
  }
});

module.exports = router;
