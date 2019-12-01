const githubMembers = organizationParam => {
  return (
    "https://api.github.com/orgs/" +
    organizationParam +
    "/members?client_id=" +
    process.env.CLIENT_ID +
    "&client_secret=" +
    process.env.CLIENT_SECRET
  );
};

const githubFollowers = (loginId, page) => {
  return (
    "https://api.github.com/users/" +
    loginId +
    "/followers?page=" +
    page +
    "&per_page=" +
    100 +
    "&client_id=" +
    process.env.CLIENT_ID +
    "&client_secret=" +
    process.env.CLIENT_SECRET
  );
};

const githubFollowing = (loginId, page) => {
  return (
    "https://api.github.com/users/" +
    loginId +
    "/following?page=" +
    page +
    "&per_page=" +
    100 +
    "&client_id=" +
    process.env.CLIENT_ID +
    "&client_secret=" +
    process.env.CLIENT_SECRET
  );
};

module.exports = { githubMembers, githubFollowers, githubFollowing };