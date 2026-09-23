const {
  getRepositoryAnalytics,
} = require("../services/analyticsService");

const getAnalytics = async (req, res) => {
  try {
    if (!req.user.githubAccessToken) {
      return res.status(400).json({
        message: "GitHub account is not connected",
      });
    }

    const analytics = await getRepositoryAnalytics(
      req.user.githubAccessToken
    );

    res.status(200).json({
      message: "Repository analytics fetched successfully",
      analytics,
    });
  } catch (error) {
    console.error("Analytics Error:", error.message);

    res.status(500).json({
      message: "Failed to fetch repository analytics",
      error: error.message,
    });
  }
};

module.exports = {
  getAnalytics,
};