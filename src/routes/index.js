const express = require("express");

let router = express.Router();

router.get("/", (req, res, next) => {
  res.redirect("/user");
});

module.exports = router;
