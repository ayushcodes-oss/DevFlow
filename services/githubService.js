const axios = require("axios");

const getGithubUser = async(username) =>{
  try{
    const response = await axios.get(
      `https://api.github.com/users/${username}`
    );
    return response.data;
  } catch(error){
    throw new Error(
      error.response?.data?.message || "Failed to fetch github user"
    );
  }
};

