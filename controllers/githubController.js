const {getGithubUser,getGithubRepositories,} = require("../services/githubService");

const getGithubData = async(req,res) =>{
  try{
    const{username} = req.parmas;
    if(!username){
      return res.status(400).json({
        message :"Github username is required",
      });
    }
    const user = await getGithubUser(username);
    const repositories = await getGithubRepositories(username);

    const totalStars = repositories.reduce((total,repo) => total + repo.stargazers_count,0);
    const languages = {};
    repositories.forEach((repo)=>{
      if(repo.language){
        languages[repo.language] =
        (languages[repo.languages] || 0) +1;
      }
    });
    res.status(200).json({
      user :{
        username : user.login,
        name : user.name,
        bio : user.bio,
        avatar : user.avatar_url,
        publicRepos :  user.public_repos,
        followers: user.followers,
        following: user.following,
        profileUrl: user.html_url,
      },
      statistics :{
        totalRepositories : repositories.length,
        totalStars,
        languages,
      },

      repositories : repositories.map((repo)=>({
        name: repo.name,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        url: repo.html_url,  
    })),
    });
  }catch(error){
    console.error(error.message);
      res.status(500).json({
      message: "Failed to fetch GitHub data",
      error: error.message,
    });
  }
}
module.exports = {
  getGithubData,
}