const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

const {
  exchangeCodeForToken,
  getGithubUser,
  getGithubEmails,
} = require("../services/githubService");



const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

// GITHUB LOGIN
const githubLogin = (req, res) => {
  const state = crypto.randomBytes(32).toString("hex");

  const githubURL =
    "https://github.com/login/oauth/authorize" +
    `?client_id=${process.env.GITHUB_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(
      process.env.GITHUB_CALLBACK_URL
    )}` +
    `&scope=${encodeURIComponent("read:user user:email")}` +
    `&state=${state}`;

  res.redirect(githubURL);
};

//  GITHUB CALLBACK 

const githubCallback = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({
        message: "GitHub authorization code is missing",
      });
    }

    // Exchange code for access token
    const tokenData = await exchangeCodeForToken(code);

    const accessToken = tokenData.access_token;

    // Get GitHub profile
    const githubUser = await getGithubUser(accessToken);

    // Get GitHub emails
    const emails = await getGithubEmails(accessToken);

    const primaryEmail =
      emails.find((email) => email.primary && email.verified)?.email ||
      emails.find((email) => email.verified)?.email;

    if (!primaryEmail) {
      return res.status(400).json({
        message: "No verified GitHub email found",
      });
    }

    // Check existing user
    let user = await User.findOne({
      $or: [
        { githubId: githubUser.id.toString() },
        { email: primaryEmail },
      ],
    });

    if (user) {
      // Update GitHub information
      user.githubId = githubUser.id.toString();
      user.githubUsername = githubUser.login;
      user.githubAccessToken = accessToken;

      await user.save();
    } else {
      // Create new user
      const randomPassword = crypto.randomBytes(32).toString("hex");

      const hashedPassword = await bcrypt.hash(
        randomPassword,
        10
      );

      user = await User.create({
        name: githubUser.name || githubUser.login,
        email: primaryEmail,
        password: hashedPassword,
        githubId: githubUser.id.toString(),
        githubUsername: githubUser.login,
        githubAccessToken: accessToken,
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: "GitHub authentication successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        githubUsername: user.githubUsername,
      },
    });
  } catch (error) {
    console.error("GitHub OAuth Error:", error.message);

    res.status(500).json({
      message: "GitHub authentication failed",
      error: error.message,
    });
  }
};

module.exports = {
  githubLogin,
  githubCallback,
};