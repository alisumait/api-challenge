require("dotenv").config();
process.env.NODE_ENV = "test";

const expect = require("chai").expect;
const request = require("supertest");

const app = require("../../../src/app.js");

describe("GET /orgs/:org/members", () => {
  it("Get members of a Github organization", done => {
    request(app)
      .get(
        "/orgs/xendit/members?client_id=" +
          process.env.CLIENT_ID +
          "&client_secret=" +
          process.env.CLIENT_SECRET
      )
      .then(res => {
        const body = res.body;
        expect(body).to.have.property("members");
        done();
      })
      .catch(err => done(err));
  });

  it("Get members of an invalid Github organization", done => {
    request(app)
      .get(
        "/orgs/000/members?client_id=" +
          process.env.CLIENT_ID +
          "&client_secret=" +
          process.env.CLIENT_SECRET
      )
      .then(res => {
        const body = res.body;
        expect(body).to.have.property("error");
        done();
      })
      .catch(err => done(err));
  });
});
