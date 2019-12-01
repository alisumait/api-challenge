const fetch = require("node-fetch");

const existsOnGithub = async organizationParam => {
  const response = await fetch(
    "https://api.github.com/orgs/" +
      organizationParam +
      "/members?client_id=" +
      process.env.CLIENT_ID +
      "&client_secret=" +
      process.env.CLIENT_SECRET
  )
    .then(res => res.json())
    .then(json => {
      return json;
    });

  // return false if orgainzation doesn't exist on Github
  if (response.hasOwnProperty("message") && response.message === "Not Found") return false;
  return true;
};

module.exports = { existsOnGithub };
