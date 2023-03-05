const express = require("express");
const router = express.Router();
const {
  current,
  login,
  logout,
  signup,
} = require("../../controllers/users.js");
const guard = require("../../middleware/guard");

router.post("/signup", signup);

router.post("/login", login);

router.get("/logout", guard, logout);

router.get("/current", guard, current);

module.exports = router;
