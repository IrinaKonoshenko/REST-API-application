const express = require("express");
const { upload } = require("../../config/multer.js");
const router = express.Router();
const {
  current,
  login,
  logout,
  signup,
  avatars,
  verification,
  resendEmail,
} = require("../../controllers/users.js");
const guard = require("../../middleware/guard");

router.post("/signup", signup);

router.post("/login", login);

router.get("/logout", guard, logout);

router.get("/current", guard, current);

router.patch("/avatars", guard, upload.single("avatars"), avatars);

router.get("/verify/:verificationToken", verification);

router.post("/verify/", resendEmail);

module.exports = router;
