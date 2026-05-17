const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getMe,
} = require("../controllers/authController");

const auth = require("../middleware/auth");

// PUBLIC
router.post("/register", register);
router.post("/login", login);

// PROTECTED
router.get("/me", auth, getMe);

module.exports = router;