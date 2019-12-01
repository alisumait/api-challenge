require("dotenv").config();
process.env.NODE_ENV = "test";

const expect = require("chai").expect;
const request = require("supertest");

const app = require("../../../src/app.js");
const conn = require("../../../src/db/index.js");

describe("DELETE /orgs/:org/comments", () => {
  before(done => {
    conn
      .connectTestDatabase()
      .then(() => {
        done();
      })
      .catch(err => done(err));
  });

  beforeEach(done => {
    conn
      .clearTestDatabase()
      .then(() => done())
      .catch(err => done(err));
  });

  after(done => {
    conn
      .closeTestDatabse()
      .then(() => done())
      .catch(err => done(err));
  });

  // delete comments from an invalid Github organization e.g. 000
  it("Delete comments from a non-existent organization", done => {
    request(app)
      .delete("/orgs/000/comments")
      .then(res => {
        const body = res.body;
        expect(body).to.have.property("error");
        done();
      })
      .catch(err => done(err));
  });

  // post a comment to an organization, delete comments, and expect success property
  it("Delete comments from an existing organization", done => {
    request(app)
      .post("/orgs/xendit/comments")
      .send({
        comment: "Looking to hire SE Asia's top dev talent!"
      })
      .then(() => {
        request(app)
          .delete("/orgs/xendit/comments")
          .then(res => {
            const body = res.body;
            expect(body).to.have.property("success");
            done();
          })
          .catch(err => done(err));
      });
  });
});
