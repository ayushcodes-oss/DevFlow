const express = require("express");
const router = express.Router();
const {protect} = require("../middleware/authMiddleware");
const {getGithubData} = require("../controllers/githubController");

router.get("/:username",protect,getGithubData);
module.exports = router;