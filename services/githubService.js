const axios = require("axios");

//  GITHUB USER 
const getGithubUser = async (accessToken) => {
  try {
    const response = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch GitHub user"
    );
  }
};

// GITHUB EMAIL 
const getGithubEmails = async (accessToken) => {
  try {
    const response = await axios.get(
      "https://api.github.com/user/emails",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch GitHub emails"
    );
  }
};

//EXCHANGE CODE 

const exchangeCodeForToken = async (code) => {
  try {
    const response = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GITHUB_CALLBACK_URL,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.data.access_token) {
      throw new Error(
        response.data.error_description || "Failed to get GitHub access token"
      );
    }

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error_description ||
        error.message ||
        "GitHub OAuth failed"
    );
  }
};

module.exports = {
  getGithubUser,
  getGithubEmails,
  exchangeCodeForToken,
};