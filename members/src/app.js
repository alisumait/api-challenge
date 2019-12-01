const express = require("express");
const bodyParser = require("body-parser");
const { getMembersArray, getSortedMembers } = require("./apiFunctions");

const app = express();
app.use(bodyParser.json());

app.get("/orgs/:org/members", async (req, res) => {
  let organizationParam = req.params.org;
  let response = await getMembersArray(organizationParam);

  if (response.hasOwnProperty("message") && response.message === "Not Found") {
    res.status(404).send({ error: "Organization does not exist on Github" });
  } else if (response.length === 0) {
    // return empty members array if no members are found
    res.status(200).send({ members: response });
  } else {
    let members = await getSortedMembers(response);
    res.status(200).send({ members: members });
  }
});

module.exports = app;
