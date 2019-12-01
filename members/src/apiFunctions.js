const fetch = require("node-fetch");
const Member = require("./models/member-model");
const { githubMembers, githubFollowers, githubFollowing } = require("./helpers");

// returns memebers' objects array
const getMembersArray = async organizationParam => {
  const response = await fetch(githubMembers(organizationParam))
    .then(res => res.json())
    .then(json => {
      return json;
    });
  return response;
};

// returns number of followers after going through all pages
async function getFollowers(login) {
  let response = 0;
  let followers = 0;
  let page = 1;
  let done = false;
  while (done === false) {
    response = await fetch(githubFollowers(login, page))
      .then(res => res.json())
      .then(json => {
        return json.length;
      });
    followers += response;
    response < 100 ? (done = true) : page++;
  }
  return followers;
}

// returns number of following after going through all pages
async function getFollowing(login) {
  let response = 0;
  let following = 0;
  let page = 1;
  let done = false;
  while (done === false) {
    response = await fetch(githubFollowing(login, page))
      .then(res => res.json())
      .then(json => {
        return json.length;
      });
    following += response;
    response < 100 ? done = true : page++;
  }
  return following;
}

const getMember = async githubMember => {
  let member = new Member();
  member.login = githubMember.login;
  member.avatar = githubMember.avatar_url;
  const [followers, following] = await Promise.all([
    getFollowers(githubMember.login),
    getFollowing(githubMember.login)
  ]);
  member.followers = followers;
  member.following = following;
  return member;
};

// returns array of members sorted by descending number of followers
const getSortedMembers = async response => {
  let members = [];
  for (let i = 0; i < response.length; i++) {
    members.push( await getMember(response[i]) );
  }
  members.sort((a, b) => b.followers - a.followers);
  return members;
};

module.exports = { getMembersArray, getSortedMembers };
