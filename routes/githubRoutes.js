const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  getGithubData,
} = require("../controllers/githubController");

const {
  githubLogin,
  githubCallback,
} = require("../controllers/githubAuthController");

// GitHub OAuth
router.get("/login", githubLogin);

router.get("/callback", githubCallback);

// Existing GitHub data route
router.get("/:username", protect, getGithubData);

module.exports = router;