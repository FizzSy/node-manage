const express = require("express");
const router = express.Router();
const user = require("./user");
const profile = require("./profile");

router.get("/", (req, res) => {
  res.status(200).json({
    error: 0,
    msg: "hello world~~~"
  });
});

router.use("/user", user);
router.use("/profile", profile);

module.exports = router;
