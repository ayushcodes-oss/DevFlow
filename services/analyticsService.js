const axios = require("axios");

const getRepositoryAnalytics = async (accessToken) => {
  try {
    const response = await axios.get(
      "https://api.github.com/user/repos",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
        },
        params: {
          per_page: 100,
          sort: "updated",
        },
      }
    );

    const repositories = response.data;

    const totalRepositories = repositories.length;

    const totalStars = repositories.reduce(
      (total, repo) => total + repo.stargazers_count,
      0
    );

    const totalForks = repositories.reduce(
      (total, repo) => total + repo.forks_count,
      0
    );

    const languages = {};

    repositories.forEach((repo) => {
      if (repo.language) {
        languages[repo.language] =
          (languages[repo.language] || 0) + 1;
      }
    });

    const mostStarredRepository =
      repositories.length > 0
        ? repositories.reduce((max, repo) =>
            repo.stargazers_count > max.stargazers_count
              ? repo
              : max
          )
        : null;

    const averageStars =
      totalRepositories > 0
        ? (totalStars / totalRepositories).toFixed(2)
        : 0;

    const recentlyUpdated = repositories
      .slice()
      .sort(
        (a, b) =>
          new Date(b.updated_at) -
          new Date(a.updated_at)
      )
      .slice(0, 5);

    return {
      totalRepositories,
      totalStars,
      totalForks,
      averageStars,
      languages,

      mostStarredRepository: mostStarredRepository
        ? {
            name: mostStarredRepository.name,
            stars: mostStarredRepository.stargazers_count,
            url: mostStarredRepository.html_url,
          }
        : null,

      recentlyUpdated: recentlyUpdated.map((repo) => ({
        name: repo.name,
        language: repo.language,
        stars: repo.stargazers_count,
        updatedAt: repo.updated_at,
        url: repo.html_url,
      })),
    };
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch repository analytics"
    );
  }
};

module.exports = {
  getRepositoryAnalytics,
};