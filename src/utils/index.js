export const getUserRepos = async (username) => {
  if (username) {
    const responce = await fetch(
      `https://api.github.com/users/${username}/repos`
    );
    const data = await responce.json();

    return data;
  }
};

export const getRepoDetails = async (username, repoName) => {
  if (username && repoName) {
    const responce = await fetchData(
      `https://api.github.com/users/${username}/repos`
    );
    const repoList = await responce.json();
    const repoDetails = (repoList || []).find((repo) => repo.name === repoName);
    console.log(repoList, repoDetails);
    return repoDetails;
  }
};

export const fetchData = async (url) => {
  const responce = await fetch(url);
  return responce;
};
