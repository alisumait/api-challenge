require("dotenv").config();
process.env.NODE_ENV = "test";

const expect = require("chai").expect;
const request = require("supertest");

const app = require("../../../src/app.js");
const conn = require("../../../src/db/index.js");

describe("POST /orgs/:org/comments", () => {
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

  // post comment and check correct properties exist
  it("Post a comment to an organization", done => {
    request(app)
      .post("/orgs/xendit/comments")
      .send({
        comment: "Looking to hire SE Asia's top dev talent!"
      })
      .then(res => {
        const body = res.body;
        expect(body).to.have.nested.property("comment._id");
        expect(body).to.have.nested.property("comment.comment");
        expect(body).to.have.nested.property("comment.isDeleted");
        done();
      })
      .catch(err => done(err));
  });

  // organization doesn't exist on Github
  it("Post a comment to a non-existent organization", done => {
    request(app)
      .post("/orgs/000/comments")
      .send({
        comment: "Looking to hire SE Asia's top dev talent!"
      })
      .then(res => {
        const body = res.body;
        expect(body).to.have.property("error");
        done();
      })
      .catch(err => done(err));
  });

  // used property text instead of comment
  it("Post a comment with wrong property", done => {
    request(app)
      .post("/orgs/xendit/comments")
      .send({
        text: "Looking to hire SE Asia's top dev talent!"
      })
      .then(res => {
        const body = res.body;
        expect(body).to.have.property("error");
        done();
      })
      .catch(err => done(err));
  });
});
