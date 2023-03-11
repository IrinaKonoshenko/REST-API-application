const express = require("express");
const { upload } = require("../../config/multer.js");
const router = express.Router();
const {
  current,
  login,
  logout,
  signup,
  avatars,
} = require("../../controllers/users.js");
const guard = require("../../middleware/guard");

router.post("/signup", signup);

router.post("/login", login);

router.get("/logout", guard, logout);

router.get("/current", guard, current);

router.patch("/avatars", guard, upload.single("avatars"), avatars);

module.exports = router;
